"""Warm the models and run one real inference, outside of the web server.

Run from the `backend` directory:
    .venv\\Scripts\\python.exe scripts\\warmup.py
"""

import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from PIL import Image  # noqa: E402

from app.config import settings  # noqa: E402
from app.pipeline import CaptionPipeline, load_image  # noqa: E402

FIXTURE = Path(__file__).resolve().parents[1] / "sample" / "dog-park.jpg"


def main() -> int:
    pipeline = CaptionPipeline(settings)
    print(f"device: {pipeline.device}")

    started = time.perf_counter()
    pipeline.load()
    print(f"models loaded in {time.perf_counter() - started:.1f}s")

    image = load_image(FIXTURE.read_bytes(), settings.max_image_pixels)
    print(f"fixture: {FIXTURE.name} {image.size} {image.mode}")

    result = pipeline.run(image, variant=0)
    print("\n--- result ---")
    for key in ("caption", "confidence", "objects", "scene", "latency_ms", "model"):
        print(f"{key:>12}: {result[key]}")
    print(f"{'detections':>12}: {result['detections']}")

    variant_result = pipeline.run(image, variant=1)
    print(f"\nvariant=1 caption: {variant_result['caption']}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
