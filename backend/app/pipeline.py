"""The captioning pipeline: BLIP captioner + ResNet-50 classifier.

This is the only module that knows about PyTorch or model internals. It is
deliberately free of any web framework concerns so it can be unit-tested or
reused from a CLI.

Pipeline
--------
1. Decode + normalise the uploaded image (EXIF-aware, RGB, size-capped).
2. Captioner  : ViT vision encoder -> text decoder, beam search.
3. Classifier : ResNet-50 / ImageNet-1k -> top-k object labels + probabilities.
4. Scene      : bucket the predicted labels into a coarse scene name.
"""

from __future__ import annotations

import logging
import threading
import time
from io import BytesIO
from typing import Any

import torch
from PIL import Image, ImageOps
from transformers import (
    AutoImageProcessor,
    BlipForConditionalGeneration,
    BlipProcessor,
    ResNetForImageClassification,
)

from .config import Settings
from .scenes import infer_scene

logger = logging.getLogger(__name__)

# Resize cap applied before inference - keeps CPU latency predictable without
# meaningfully changing caption quality.
_INFERENCE_MAX_SIDE = 768


def load_image(data: bytes, max_pixels: int) -> Image.Image:
    """Decode raw upload bytes into a safe RGB image.

    Raises:
        ValueError: if the bytes cannot be decoded as an image.
    """
    Image.MAX_IMAGE_PIXELS = max_pixels

    try:
        image = Image.open(BytesIO(data))
        image.load()
    except Exception as exc:  # noqa: BLE001 - surfaced as a 400 by the caller
        raise ValueError("The uploaded file is not a readable image.") from exc

    # Honour EXIF orientation, then drop alpha / convert palette images.
    image = ImageOps.exif_transpose(image)
    if image.mode != "RGB":
        image = image.convert("RGB")

    if max(image.size) > _INFERENCE_MAX_SIDE:
        image.thumbnail((_INFERENCE_MAX_SIDE, _INFERENCE_MAX_SIDE), Image.LANCZOS)

    return image


class CaptionPipeline:
    """Thread-safe holder for the loaded models.

    Models are loaded once and shared. A lock serialises inference because
    PyTorch modules are not guaranteed to be safe under concurrent forward
    passes on every backend, and this keeps peak memory predictable.
    """

    def __init__(self, settings: Settings) -> None:
        self.settings = settings
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self._lock = threading.Lock()
        self._loaded = False

        self.caption_processor: BlipProcessor | None = None
        self.caption_model: BlipForConditionalGeneration | None = None
        self.classifier_processor: Any = None
        self.classifier_model: ResNetForImageClassification | None = None

    # -- lifecycle ---------------------------------------------------------

    @property
    def models_loaded(self) -> bool:
        return self._loaded

    def load(self) -> None:
        """Download (if needed) and initialise both models. Idempotent."""
        if self._loaded:
            return

        with self._lock:
            if self._loaded:
                return

            started = time.perf_counter()
            logger.info("Loading models on %s ...", self.device)

            self.caption_processor = BlipProcessor.from_pretrained(
                self.settings.caption_model_id
            )
            self.caption_model = BlipForConditionalGeneration.from_pretrained(
                self.settings.caption_model_id, dtype=torch.float32
            ).to(self.device)
            self.caption_model.eval()

            self.classifier_processor = AutoImageProcessor.from_pretrained(
                self.settings.classifier_model_id
            )
            self.classifier_model = ResNetForImageClassification.from_pretrained(
                self.settings.classifier_model_id, dtype=torch.float32
            ).to(self.device)
            self.classifier_model.eval()

            self._loaded = True
            logger.info(
                "Models ready in %.1fs (%s)", time.perf_counter() - started, self.device
            )

    # -- inference ---------------------------------------------------------

    def _generate_caption(self, image: Image.Image, variant: int) -> tuple[str, float | None]:
        """Return (caption, confidence) from the vision-language model."""
        assert self.caption_processor is not None and self.caption_model is not None

        inputs = self.caption_processor(images=image, return_tensors="pt").to(self.device)

        # Vary decoding on regeneration so repeat clicks are not no-ops, while
        # staying deterministic for a given variant.
        do_sample = self.settings.randomise_on_variant and variant > 0
        if do_sample:
            torch.manual_seed(variant * 7919 + 13)

        generate_kwargs: dict[str, Any] = {
            "max_new_tokens": self.settings.max_new_tokens,
            "repetition_penalty": self.settings.repetition_penalty,
        }
        if do_sample:
            generate_kwargs.update(
                do_sample=True, top_p=0.9, temperature=1.0, num_beams=1
            )
        else:
            generate_kwargs.update(
                num_beams=self.settings.num_beams,
                length_penalty=self.settings.length_penalty,
            )

        with torch.inference_mode():
            output = self.caption_model.generate(**inputs, **generate_kwargs)

        caption = self.caption_processor.decode(
            output[0], skip_special_tokens=True
        ).strip()

        return caption, self._score_caption(image, caption)

    def _score_caption(self, image: Image.Image, caption: str) -> float | None:
        """Mean per-token probability of `caption` given `image`.

        Beam scores are length-normalised log-probabilities, not probabilities,
        so they cannot be shown on a 0-1 scale honestly. Instead we re-score the
        finished caption in a single teacher-forced pass and report the
        geometric-mean token probability - a real quantity in [0, 1] meaning
        "on average, how likely was the model to emit each of these words given
        the image".

        Returns ``None`` if scoring fails, so the UI hides the field rather than
        displaying a made-up number.
        """
        assert self.caption_processor is not None and self.caption_model is not None

        try:
            encoding = self.caption_processor(
                images=image, text=caption, return_tensors="pt"
            ).to(self.device)
            labels = encoding["input_ids"]

            with torch.inference_mode():
                logits = self.caption_model(**encoding).logits

            # Align each prediction with its next-token target.
            log_probs = torch.log_softmax(logits[:, :-1, :].float(), dim=-1)
            targets = labels[:, 1:]
            gathered = log_probs.gather(2, targets.unsqueeze(2)).squeeze(2)[0]

            # Drop structural tokens ([DEC], [EOS], padding) - these are not
            # predictions about image content. BLIP nests them on text_config.
            text_config = getattr(
                self.caption_model.config, "text_config", self.caption_model.config
            )
            skip_names = (
                "decoder_start_token_id",
                "sep_token_id",
                "pad_token_id",
                "eos_token_id",
                "bos_token_id",
            )
            skip_ids = {
                token_id
                for token_id in (getattr(text_config, name, None) for name in skip_names)
                if token_id is not None
            }
            if not skip_ids:
                tokenizer = self.caption_processor.tokenizer
                skip_ids = {
                    token_id
                    for token_id in tokenizer.all_special_ids
                    if isinstance(token_id, int)
                }
            keep = torch.tensor(
                [int(token) not in skip_ids for token in targets[0]],
                device=gathered.device,
            )
            gathered = gathered[keep]

            if gathered.numel() == 0:
                return None

            mean_log_prob = gathered.mean()
            if not torch.isfinite(mean_log_prob):
                return None
            return round(float(mean_log_prob.exp()), 4)
        except Exception as exc:  # noqa: BLE001 - scoring is best-effort
            logger.warning("Could not score caption: %s", exc)
            return None

    def _classify(self, image: Image.Image) -> list[tuple[str, float]]:
        """Return top (label, probability) pairs above the confidence floor."""
        assert self.classifier_processor is not None and self.classifier_model is not None

        inputs = self.classifier_processor(images=image, return_tensors="pt").to(
            self.device
        )
        with torch.inference_mode():
            logits = self.classifier_model(**inputs).logits

        probabilities = torch.softmax(logits, dim=-1)[0]
        count = min(12, probabilities.shape[-1])
        top_probabilities, top_indices = torch.topk(probabilities, count)

        id2label = self.classifier_model.config.id2label
        results: list[tuple[str, float]] = []
        for probability, index in zip(top_probabilities.tolist(), top_indices.tolist()):
            if probability < self.settings.object_probability_threshold:
                break
            results.append((_clean_label(id2label[index]), probability))
            if len(results) >= self.settings.max_objects:
                break
        return results

    def run(self, image: Image.Image, variant: int = 0) -> dict[str, Any]:
        """Run the full pipeline and return the frontend response payload."""
        self.load()
        started = time.perf_counter()

        with self._lock:
            caption, confidence = self._generate_caption(image, variant)
            detections = self._classify(image)

        labels = [label for label, _ in detections]
        scene = infer_scene(labels, caption)

        return {
            "caption": caption,
            "confidence": confidence,
            "objects": labels,
            "scene": scene,
            "latency_ms": int((time.perf_counter() - started) * 1000),
            "model": self.settings.caption_model_id,
            "source": "model",
            # Not part of the public contract - useful when tuning thresholds.
            "detections": [
                {"label": label, "probability": round(probability, 4)}
                for label, probability in detections
            ],
        }


# --- helpers ---------------------------------------------------------------


def _clean_label(label: str) -> str:
    """Tidy an ImageNet class name for display ('rapeseed, Brassica napus')."""
    cleaned = label.split(",")[0].strip()
    return cleaned[:1].upper() + cleaned[1:] if cleaned else cleaned


__all__ = ["CaptionPipeline", "load_image"]
