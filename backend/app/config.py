"""Runtime configuration for the Jarvas Image Captioning AI captioning service.

Every value can be overridden with an environment variable so the same image
runs on a laptop (CPU) and a GPU box without code changes.
"""

import os
from dataclasses import dataclass, field


def _env_bool(name: str, default: bool) -> bool:
    raw = os.getenv(name)
    if raw is None:
        return default
    return raw.strip().lower() in {"1", "true", "yes", "on"}


def _env_int(name: str, default: int) -> int:
    try:
        return int(os.getenv(name, default))
    except (TypeError, ValueError):
        return default


def _env_float(name: str, default: float) -> float:
    try:
        return float(os.getenv(name, default))
    except (TypeError, ValueError):
        return default


@dataclass(frozen=True)
class Settings:
    """Immutable service settings."""

    # --- models ---------------------------------------------------------
    # Vision-language captioner: a ViT encoder + text decoder, which is exactly
    # the "vision encoder -> language decoder" architecture the UI describes.
    caption_model_id: str = os.getenv(
        "VC_CAPTION_MODEL", "Salesforce/blip-image-captioning-base"
    )
    # ImageNet classifier used to produce the structured "Object Detection" list.
    classifier_model_id: str = os.getenv("VC_CLASSIFIER_MODEL", "microsoft/resnet-50")

    # --- generation -----------------------------------------------------
    max_new_tokens: int = _env_int("VC_MAX_NEW_TOKENS", 40)
    num_beams: int = _env_int("VC_NUM_BEAMS", 5)
    repetition_penalty: float = _env_float("VC_REPETITION_PENALTY", 1.15)
    length_penalty: float = _env_float("VC_LENGTH_PENALTY", 1.0)

    # --- analysis thresholds --------------------------------------------
    # A classification only becomes a reported "object" above this probability.
    object_probability_threshold: float = _env_float("VC_OBJECT_THRESHOLD", 0.08)
    max_objects: int = _env_int("VC_MAX_OBJECTS", 3)

    # --- request limits -------------------------------------------------
    max_upload_bytes: int = _env_int("VC_MAX_UPLOAD_MB", 10) * 1024 * 1024
    allowed_content_types: tuple[str, ...] = field(
        default_factory=lambda: tuple(
            item.strip()
            for item in os.getenv(
                "VC_ALLOWED_TYPES", "image/jpeg,image/jpg,image/png,image/webp"
            ).split(",")
            if item.strip()
        )
    )
    # Guard against decompression bombs before decoding untrusted uploads.
    max_image_pixels: int = _env_int("VC_MAX_IMAGE_PIXELS", 40_000_000)

    # --- behaviour ------------------------------------------------------
    allow_unsafe_origins: bool = _env_bool("VC_ALLOW_ANY_ORIGIN", True)
    lazy_load: bool = _env_bool("VC_LAZY_LOAD", True)
    # Deterministic decoding. The frontend sends `variant` on regenerate; we use
    # it to vary beam sampling instead of returning an identical string.
    randomise_on_variant: bool = _env_bool("VC_RANDOMISE_ON_VARIANT", True)


settings = Settings()
