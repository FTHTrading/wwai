# FIFA Troptions — Local AI Control Plane Runbook

## What is the local AI control plane?

The local AI control plane provides GPU-backed inference directly on the developer machine.
It replaces external AI APIs with sovereign, local processing.

- **Primary**: NVIDIA NIM — runs in Docker, uses TensorRT-LLM on the RTX 5090 Laptop GPU
- **Fallback**: Ollama — runs on Windows host, activates only when NIM is offline
- **OpenAI-compatible**: both endpoints speak the OpenAI chat completions format

No data leaves the machine. No cloud AI keys are required for inference.

---

## Endpoints

| Service       | Endpoint                        | Notes                                    |
|---------------|---------------------------------|------------------------------------------|
| NIM (primary) | `http://localhost:8800/v1`      | Docker container `nvidia-assistant-llm`  |
| Ollama        | `http://localhost:11434`        | Windows host process                     |
| Open WebUI    | `http://localhost:3001`         | Docker container `open-webui`            |
| App API health| `http://localhost:3000/api/ai/health` | Next.js route, server-side proxy   |
| App API chat  | `http://localhost:3000/api/ai/chat`   | Next.js route, POST only           |

---

## App routes

| Route                    | Description                                           |
|--------------------------|-------------------------------------------------------|
| `/infrastructure/ai`     | AI Infrastructure dashboard (provider status, test)   |
| `/infrastructure`        | Platform infrastructure overview (links to AI dash)   |
| `/dashboard`             | Operations dashboard (AI quick-link banner)           |

---

## NIM model

```
nvidia/llama-3.1-nemotron-nano-8b-v1
TensorRT-LLM BF16 | TP1 PP1 | trtllm_buildable profile
NIM_MAX_MODEL_LEN=16384   <- must stay set to prevent OOM during TRT build
```

---

## Startup order

Start services in this order to avoid VRAM contention:

1. **Start NIM first** (claims GPU VRAM for TRT engine):
   ```powershell
   docker start nvidia-assistant-llm
   ```
2. **Wait for NIM to finish building** — watch for:
   ```
   Uvicorn running on http://0.0.0.0:8000
   ```
   Check with: `docker logs -f nvidia-assistant-llm`

3. **Ollama starts automatically** on Windows login (auto-restart service).
   Keep it idle (no model loaded) while NIM is building.

4. **Start the Next.js app**:
   ```powershell
   npm run dev
   ```

---

## Safe commands (run any time)

```powershell
# Full stack health check
npm run ai:health

# Docker read-only snapshot
npm run docker:safe-status

# Test NIM directly (requires NIM to be live)
npm run ai:test:nim

# Test app API routes (requires npm run dev)
npm run ai:test:app

# Check NIM container logs
docker logs --tail 50 nvidia-assistant-llm

# Check NIM container status
docker ps --filter name=nvidia-assistant-llm

# Check GPU VRAM
nvidia-smi --query-gpu=memory.used,memory.free --format=csv,noheader
```

---

## Commands NOT to run while NIM is building

Do not run these until `docker logs nvidia-assistant-llm` shows `Uvicorn running`:

```
docker stop nvidia-assistant-llm      # aborts TRT build, loses progress
docker restart nvidia-assistant-llm  # same as stop/start
docker system prune                   # would wipe nim_cache volume
docker volume rm nim_cache            # destroys cached TRT engine
ollama run <large-model>              # contends for VRAM during build
```

---

## How to verify NIM is ready

```powershell
# Should return HTTP 200 with model list
Invoke-WebRequest http://localhost:8800/v1/models -UseBasicParsing

# Or via the app health route (requires dev server)
Invoke-WebRequest http://localhost:3000/api/ai/health -UseBasicParsing | Select-Object -ExpandProperty Content | ConvertFrom-Json
```

When ready, `recommendedProvider` will be `"nim"`.

---

## How to verify success end-to-end

```powershell
cd "C:\Users\Kevan\fifa troptions"

# 1. Build passes
npm run build

# 2. Stack health
npm run ai:health

# 3. App route smoke test (with dev server running)
npm run dev  # separate terminal
npm run ai:test:app
```

Expected output from `ai:test:app`:
```
OK  Dev server responding
OK  NIM LIVE -- latency <N>ms | model: nvidia/llama-3.1-nemotron-nano-8b-v1
OK  Chat OK -- provider: nim | latency: <N>ms
```

---

## Recovery: NIM OOM killed

Symptom: `docker ps` shows container restarting/exited; logs show OOM kill.

Cause: KV cache allocated too much VRAM (default `max_seq_len=131072` requires ~22 GB).

Fix:
```powershell
# Stop and remove the crashed container
docker stop nvidia-assistant-llm
docker rm nvidia-assistant-llm

# Restart with NIM_MAX_MODEL_LEN=16384 (limits KV cache to ~2 GB)
# Replace <YOUR_NGC_API_KEY> with the value from $env:NGC_API_KEY
docker run -d `
  --name nvidia-assistant-llm `
  --gpus all `
  -e "NGC_API_KEY=$env:NGC_API_KEY" `
  -e "NIM_MAX_MODEL_LEN=16384" `
  -p 8800:8000 `
  -v nim_cache:/root/.cache/nim `
  --shm-size=16g `
  --restart unless-stopped `
  nvcr.io/nim/nvidia/llama-3.1-nemotron-nano-8b-v1:latest
```

The `nim_cache` volume preserves the downloaded model weights — TRT will re-use cached layers and build faster on subsequent starts.

---

## Open WebUI connection to NIM

From inside the Open WebUI Docker container, NIM is reached at:
```
http://host.docker.internal:8800/v1
```

In Open WebUI settings:
- API base URL: `http://host.docker.internal:8800/v1`
- API key: any non-empty string (NIM does not validate keys in local mode)
- Model: `nvidia/llama-3.1-nemotron-nano-8b-v1`

---

## Environment variables

See `.env.example` for the full reference. Minimum required for AI routes:

```env
NIM_BASE_URL=http://localhost:8800/v1
NIM_MODEL=nvidia/llama-3.1-nemotron-nano-8b-v1
OLLAMA_BASE_URL=http://localhost:11434
```

These all have safe defaults in `src/lib/ai.ts` — no `.env.local` entry required for local dev.

---

## Architecture

```
Browser → /infrastructure/ai (Next.js page)
               |
               v
     /api/ai/health  GET   → checkNimHealth() + checkOllamaHealth()
     /api/ai/chat    POST  → localAiChat(messages)
                                |
                     NIM :8800/v1/chat/completions (primary)
                                |  (if offline)
                     Ollama :11434/api/generate (fallback)
```

All fetch calls have timeouts (8s health, 60s chat). No secrets reach the browser.
