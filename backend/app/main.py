"""FastAPI application exposing the Jarvas Image Captioning AI inference pipeline.

Run with:

    uvicorn app.main:app --reload --port 8000

Then point the frontend at it with ``VITE_API_BASE_URL=http://127.0.0.1:8000``.
"""

from __future__ import annotations

import logging
import time
from contextlib import asynccontextmanager

from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .pipeline import CaptionPipeline, load_image
from .schemas import CaptionResponse, HealthResponse

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-7s %(name)s: %(message)s",
    datefmt="%H:%M:%S",
)
logger = logging.getLogger("jarvas-caption")

pipeline = CaptionPipeline(settings)


@asynccontextmanager
async def lifespan(_: FastAPI):
    """Warm the models on boot so the first user request is not slow."""
    if settings.lazy_load:
        logger.info("Lazy loading enabled - models load on first request.")
    else:
        logger.info("Eager loading models ...")
        pipeline.load()
    yield
    logger.info("Shutting down.")


app = FastAPI(
    title="Jarvas Image Captioning AI",
    version="1.0.0",
    description=(
        "Image captioning service: BLIP vision-language captioning plus a "
        "ResNet-50 classifier for object and scene analysis."
    ),
    lifespan=lifespan,
)

if settings.allow_unsafe_origins:
    # Convenient for local development. Lock this down to your deployed origin
    # in production by setting VC_ALLOW_ANY_ORIGIN=false and overriding it.
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=False,
        allow_methods=["GET", "POST"],
        allow_headers=["*"],
    )


@app.get("/api/health", response_model=HealthResponse, tags=["meta"])
def health() -> HealthResponse:
    """Readiness probe. Does not force a model load."""
    return HealthResponse(
        status="ok",
        device=pipeline.device,
        models_loaded=pipeline.models_loaded,
        caption_model=settings.caption_model_id,
        classifier_model=settings.classifier_model_id,
    )


@app.post("/api/caption", response_model=CaptionResponse, tags=["inference"])
async def create_caption(
    image: UploadFile = File(..., description="Image file (JPG, PNG or WEBP)."),
    variant: int = Form(0, description="Regeneration counter; changes decoding."),
) -> CaptionResponse:
    """Generate a caption and structured analysis for an uploaded image.

    Args:
        image: The uploaded image. Validated for type and size before decoding.
        variant: Non-zero on regeneration; varies the decoder so a repeated
            click does not return a byte-identical string.

    Raises:
        HTTPException: 400 for an invalid or oversized file, 413 for a payload
            that is too large, 503 if the models cannot be loaded, 500 if
            inference fails.
    """
    started = time.perf_counter()

    if image.content_type and image.content_type.lower() not in settings.allowed_content_types:
        raise HTTPException(
            status_code=400,
            detail=(
                f"Unsupported media type '{image.content_type}'. "
                f"Allowed: {', '.join(settings.allowed_content_types)}."
            ),
        )

    data = await image.read()
    if not data:
        raise HTTPException(status_code=400, detail="The uploaded file is empty.")

    if len(data) > settings.max_upload_bytes:
        limit_mb = settings.max_upload_bytes // (1024 * 1024)
        raise HTTPException(
            status_code=413,
            detail=f"The uploaded file exceeds the {limit_mb} MB limit.",
        )

    try:
        pil_image = load_image(data, settings.max_image_pixels)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    try:
        result = pipeline.run(pil_image, variant=max(0, variant))
    except HTTPException:
        raise
    except Exception as exc:  # noqa: BLE001 - model/runtime failures
        logger.exception("Inference failed")
        raise HTTPException(
            status_code=500, detail=f"Inference failed: {exc}"
        ) from exc

    logger.info(
        "captioned %s (%d bytes) in %d ms total",
        image.filename,
        len(data),
        int((time.perf_counter() - started) * 1000),
    )

    return CaptionResponse(
        caption=result["caption"],
        confidence=result["confidence"],
        objects=result["objects"],
        scene=result["scene"],
        latency_ms=result["latency_ms"],
        model=result["model"],
        source=result["source"],
    )
