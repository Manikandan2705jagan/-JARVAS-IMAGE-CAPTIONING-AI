# Jarvas Image Captioning AI — Inference Service

A real FastAPI backend for the Jarvas Image Captioning AI frontend. It runs two
pretrained models and returns a caption, a structured object list, a coarse
scene label, and an honest confidence value.

Nothing here is mocked. Every field in the response is either a direct model
output or a documented deterministic transform of one.

---

## What the models actually do

| Field | Source | How |
| --- | --- | --- |
| `caption` | `Salesforce/blip-image-captioning-base` | ViT vision encoder → text decoder, beam search |
| `objects` | `microsoft/resnet-50` (ImageNet-1k) | Top-k softmax probabilities above a threshold |
| `scene` | derived | Keyword lookup over the predicted object labels |
| `confidence` | captioner | Mean per-token probability of the generated caption |
| `latency_ms` | service | Wall-clock inference time |

BLIP is a genuine vision-encoder / language-decoder model, which is the exact
architecture the frontend's "How It Works" section describes. ResNet-50 is the
encoder referenced throughout the UI.

---

## Setup

```bash
cd backend
python -m venv .venv

# Windows
.venv\Scripts\python.exe -m pip install -r requirements.txt

# macOS / Linux
.venv/bin/pip install -r requirements.txt
```

Verified on Python 3.14.7. `torch` and `torchvision` must stay on a matched
pair (2.14.x ↔ 0.29.x).

> **Note** — `AutoImageProcessor` requires torchvision even though this project
> never calls torchvision directly. It is a hard dependency of the Transformers
> image-processor path.

### First run downloads weights

The first request pulls roughly 1.5 GB into the Hugging Face cache:

```
~/.cache/huggingface/hub/models--Salesforce--blip-image-captioning-base
~/.cache/huggingface/hub/models--microsoft--resnet-50
```

Expect 40-90 s on a cold cache. Subsequent requests take ~2-5 s on CPU. Set
`VC_LAZY_LOAD=false` to pay this cost at startup instead of on first request.

---

## Run

```bash
.venv\Scripts\python.exe -m uvicorn app.main:app --port 8000
```

Then point the frontend at it (already the default in this repo):

```bash
# .env  (project root)
VITE_DEMO_MODE=false
VITE_PROXY_TARGET=http://127.0.0.1:8000
```

`npm run dev` proxies `/api` → `http://127.0.0.1:8000`, so no CORS
configuration is required.

### Smoke test the service on its own

```bash
curl -X POST -F "image=@sample/dog-park.jpg" http://127.0.0.1:8000/api/caption
```

```json
{
  "caption": "a dog running through a field of tall grass",
  "confidence": 0.4551,
  "objects": ["Golden retriever", "Labrador retriever", "White wolf"],
  "scene": "Animal / Wildlife",
  "latency_ms": 2941,
  "model": "Salesforce/blip-image-captioning-base",
  "source": "model"
}
```

Or exercise the pipeline without the web server:

```bash
.venv\Scripts\python.exe scripts\warmup.py
```

---

## Endpoints

### `POST /api/caption`

`multipart/form-data`

| Field | Type | Default | Notes |
| --- | --- | --- | --- |
| `image` | file | — | Required. JPG, PNG or WEBP. |
| `variant` | int | `0` | Sent on regenerate; non-zero switches the decoder to nucleus sampling with a deterministic seed so repeat clicks return something new. |

Validation order: content type → non-empty → size → decodable.

### `GET /api/health`

Readiness probe. Does **not** force a model load.

```json
{
  "status": "ok",
  "device": "cpu",
  "models_loaded": true,
  "caption_model": "Salesforce/blip-image-captioning-base",
  "classifier_model": "microsoft/resnet-50"
}
```

---

## Honesty notes

These are the places where a naive implementation would quietly lie. This one
does not.

**`confidence` is a real probability.** Beam-search scores are length-normalised
log-probabilities and cannot be shown on a 0–1 scale. Instead the finished
caption is re-scored in one teacher-forced forward pass, and the geometric mean
of the per-token probabilities is reported — a genuine quantity in `[0, 1]`.
Structural tokens (`[DEC]`, `[EOS]`, padding) are excluded because they are not
predictions about image content. If scoring fails the field is `null` and the
UI hides it; it is never faked.

**`scene` is derived, and the code says so.** The captioner emits text only, so
`app/scenes.py` buckets the ImageNet labels into coarse categories with an
explicit, readable keyword table. It is a documented lookup, not a learned
classifier, and it is a separate module precisely so the distinction is
auditable.

**`objects` are genuine ImageNet predictions.** They inherit the limitations of
ImageNet-1k: a market hall may classify as "Scoreboard" and "Library". The
service reports what the model actually predicted rather than curating a
prettier answer. Raise `VC_OBJECT_THRESHOLD` to be stricter, or lower
`VC_MAX_OBJECTS` for a shorter list.

**Missing data stays missing.** `objects`, `scene` and `confidence` are all
nullable, and the frontend hides fields that are absent rather than
substituting placeholders.

---

## Configuration

All settings are environment variables read in `app/config.py`.

| Variable | Default | Purpose |
| --- | --- | --- |
| `VC_CAPTION_MODEL` | `Salesforce/blip-image-captioning-base` | Captioner |
| `VC_CLASSIFIER_MODEL` | `microsoft/resnet-50` | Classifier |
| `VC_MAX_NEW_TOKENS` | `40` | Decoder length cap |
| `VC_NUM_BEAMS` | `5` | Beam width for `variant=0` |
| `VC_REPETITION_PENALTY` | `1.15` | Discourages token loops |
| `VC_LENGTH_PENALTY` | `1.0` | Beam length normalisation |
| `VC_OBJECT_THRESHOLD` | `0.08` | Min probability to report an object |
| `VC_MAX_OBJECTS` | `3` | Max object chips |
| `VC_MAX_UPLOAD_MB` | `10` | Upload size cap |
| `VC_ALLOWED_TYPES` | `image/jpeg,image/jpg,image/png,image/webp` | Accepted MIME types |
| `VC_MAX_IMAGE_PIXELS` | `40000000` | Decompression-bomb guard |
| `VC_LAZY_LOAD` | `true` | Load models on first request instead of at boot |
| `VC_ALLOW_ANY_ORIGIN` | `true` | Permissive CORS — **set false in production** |
| `VC_RANDOMISE_ON_VARIANT` | `true` | Vary decoding on regenerate |

---

## Layout

```
backend/
├── app/
│   ├── main.py         FastAPI routes, validation, CORS
│   ├── pipeline.py     Model loading, inference, confidence scoring
│   ├── config.py       Environment-driven settings
│   ├── scenes.py       Scene keyword table (documented as derived)
│   └── schemas.py      Pydantic response contracts
├── scripts/
│   └── warmup.py       Load models and run one inference, no server
├── sample/             Test fixtures (public-domain Wikimedia images)
├── requirements.txt
└── .gitignore
```

---

## Production notes

- Run behind multiple Uvicorn workers, or set `VC_LAZY_LOAD=false` so model
  load does not block the first request in each worker.
- Inference is serialised by a lock (`CaptionPipeline._lock`) because the
  models are shared and PyTorch forward passes are not guaranteed thread-safe.
  For real concurrency, give each worker its own process and rely on the GIL-free
  BLAS release.
- Set `VC_ALLOW_ANY_ORIGIN=false` and allow only your deployed origin.
- Caching model weights in a container image avoids the 1.5 GB cold start.

## License

Model weights are loaded at runtime from Hugging Face and inherit their own
licenses: `Salesforce/blip-image-captioning-base` is BSD-3-Clause;
`microsoft/resnet-50` is Apache-2.0.
