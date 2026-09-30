# Jarvas Image Captioning AI

**Turn Images Into Intelligent Stories**

A production-style AI web application that combines **computer vision** and **natural language processing** to understand an uploaded image and generate a human-like caption. Built as a portfolio-grade AI/ML project — premium dark UI, real drag-and-drop functionality, and a clean API boundary that connects to a Python/FastAPI model service.

> **Demo disclosure:** this repository ships the complete frontend. Out of the box it runs in
> **Demo Mode**, which returns clearly-labelled sample captions. The accuracy figures shown in the
> Metrics section are **illustrative placeholders**, not measured model results. Connect a trained
> model to replace both.

---

## Highlights

- **Premium dark UI** — deep-space navy base, blue→violet gradients, glassmorphism, and subtle ambient glows
- **Real functionality** — drag-and-drop upload, browser-side validation, preview, live pipeline animation, copy / regenerate / download
- **Backend-ready** — one service module (`src/services/captionService.js`) is the only place that talks to the model service. No model logic lives in React
- **Graceful degradation** — if the backend is unreachable the UI falls back to Demo Mode *and tells the user why*
- **Accessible & responsive** — semantic landmarks, labelled controls, live regions, keyboard support, zero horizontal overflow from 390px upward
- **Motion-aware** — every animation respects `prefers-reduced-motion`

---

## Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | React 19 + Vite |
| Styling | Tailwind CSS v4 (CSS-first `@theme`) |
| Animation | Framer Motion |
| Icons | Lucide React (brand marks via React Icons) |
| Linting | oxlint |
| Model serving *(external)* | Python FastAPI → ResNet-50 → Transformer decoder |

---

## Quick Start

The real inference service lives in [`backend/`](./backend). Two terminals:

```bash
# 1. Backend - http://127.0.0.1:8000
cd backend
python -m venv .venv
.venv\Scripts\python.exe -m pip install -r requirements.txt
.venv\Scripts\python.exe -m uvicorn app.main:app --port 8000

# 2. Frontend - http://localhost:5173
npm install
npm run dev
```

Then open **http://localhost:5173** and drop in an image. The first request
downloads roughly 1.5 GB of model weights into the Hugging Face cache, so give
it a minute. Requests after that take ~2-5 s on CPU.

The repo is already configured for this setup: `.env` sets
`VITE_DEMO_MODE=false` and the Vite dev server proxies `/api` to
`http://127.0.0.1:8000`, so there is no CORS setup and no rebuild needed.

| Script | Purpose |
| --- | --- |
| `npm run dev` | Dev server with HMR and a `/api` proxy |
| `npm run build` | Production bundle into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run oxlint |

---

## The Model Backend

`backend/` is a real FastAPI service, not a mock. See
[`backend/README.md`](./backend/README.md) for full detail.

| Component | Model | Produces |
| --- | --- | --- |
| Captioner | `Salesforce/blip-image-captioning-base` (ViT encoder → text decoder) | `caption` |
| Classifier | `microsoft/resnet-50` (ImageNet-1k) | `objects` |
| Scene bucket | keyword lookup over the predicted labels | `scene` |
| Confidence | mean per-token probability of the generated caption | `confidence` |

### Request

```http
POST /api/caption
Content-Type: multipart/form-data

image: <file>
variant: 1        # optional — sent on regenerate so the server can resample
```

### Response

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

`objects`, `scene` and `confidence` are nullable. When a field is genuinely
unavailable the service returns `null` and the UI hides it rather than
displaying an invented value. `confidence` accepts `0–1` or `0–100`.

### Errors

| Status | Cause |
| --- | --- |
| `400` | Unsupported media type, undecodable image, or empty file |
| `413` | Upload exceeds the size limit |
| `422` | Missing the `image` field |
| `500` | Inference failure |

### Running without the backend

Unset the API and the UI falls back to its labelled sample responses:

```bash
# .env.local
VITE_API_BASE_URL=
```

`VITE_DEMO_MODE` is the authoritative switch; it defaults to `true` whenever
`VITE_API_BASE_URL` is empty.

---

## Environment Variables

Copy `.env.example` to `.env`. All values are read through `src/config/env.js` — no magic strings in components.

| Variable | Default | Purpose |
| --- | --- | --- |
| `VITE_API_BASE_URL` | *(empty)* | API origin. Empty ⇒ Demo Mode |
| `VITE_API_CAPTION_PATH` | `/api/caption` | Caption endpoint |
| `VITE_DEMO_MODE` | auto | Force Demo Mode on/off |
| `VITE_API_TIMEOUT_MS` | `30000` | Abort the request after this long |
| `VITE_MAX_FILE_SIZE_MB` | `10` | Uploader limit |
| `VITE_DEV_PORT` | `5173` | Dev server port |
| `VITE_PROXY_TARGET` | `http://127.0.0.1:8000` | Dev proxy target |
| `VITE_GITHUB_URL` | placeholder | Replace with your repo |
| `VITE_LINKEDIN_URL` | placeholder | Replace with your profile |
| `VITE_APP_VERSION` | `1.0.0` | Shown in the footer |

---

## Project Structure

```
src/
├── components/
│   ├── art/          SceneArt — dependency-free vector demo imagery
│   ├── caption/      ImageUploader · ImagePreview · ProcessingSteps
│   │                 AnalysisPanel · CaptionResult · CaptionWorkspace
│   ├── hero/         Hero
│   ├── layout/       Navbar · Footer · Background
│   ├── sections/     HowItWorks · Technology · Architecture · Features
│   │                 DemoGallery · Metrics · About · Developer · CtaSection
│   └── ui/           Button · Section · Reveal · Logo · DemoNotice
├── config/           env.js (runtime config) · site.js (all page copy)
├── hooks/            useCaptionGenerator · useScrollSpy · useCountUp
│                     useClipboard · useLockBodyScroll
├── lib/              validation.js · download.js
├── pages/            Home.jsx
└── services/         apiClient.js · captionService.js · demoCaptions.js
```

### Where the model boundary is

```
React UI
  └─ useCaptionGenerator (state machine + progress stages)
       └─ captionService  ← the ONLY module that knows about the API
            ├─ apiClient  (base URL, timeout, normalised errors)
            └─ demoCaptions (labelled sample fallback)
```

To swap the model, edit `src/services/captionService.js`. No component changes required.

---

## Error Handling

| Situation | Behaviour |
| --- | --- |
| Wrong file type | Inline error, uploader stays ready |
| File over the size limit | Inline error with actual vs. allowed size |
| Backend timeout | Normalised `TIMEOUT` error, retry offered |
| Backend 4xx | Message surfaced verbatim, no silent fallback |
| Backend unreachable / 5xx | Falls back to Demo Mode **and** shows why |
| Clipboard blocked | Explicit "Copy blocked" state, not a false success |
| Malformed API payload | Treated as an error rather than rendered as-is |

---

## Privacy

Uploaded images are held in memory as an object URL and released when replaced or removed. The frontend writes nothing to storage or a database. When a backend is connected, images are streamed as multipart form data to that endpoint only.

---

## Author

**Manikandan J.** — Backend Web Developer | AI/ML Enthusiast

Skills: Python · Node.js · Express.js · REST APIs · SQL · MongoDB · Redis · Docker · Git/GitHub · AI/ML

---

© 2026 Jarvas Image Captioning AI. Built by Manikandan J.
