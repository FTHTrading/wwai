# Kevan Local AI Control Plane

Local AI orchestration layer for Kevan's Windows 11 sovereign infrastructure.
Runs on RTX 5090 Laptop (24 GB VRAM) with Docker, PM2, and NVIDIA NIM.

---

## 1. Purpose

This folder (`ops/local-ai/`) provides:
- Health check scripts for all running services
- NIM API test scripts
- Open WebUI connection docs
- Service map and port reference
- PM2 recovery scripts
- App integration targets for FIFA Troptions and NeedAI

---

## 2. Current Services

| Service | Port | Status |
|---|---|---|
| NVIDIA NIM (Nemotron Nano 8B) | 8800 | GPU — first-time TRT build on startup |
| Open WebUI | 3001 | Healthy |
| NeedAI (Ada) | 3000 | Online (PM2) |
| ClawdBot Runner | 8089 | Online |
| Infra Backend API | 8010 | Online |
| Infra LLM Service | 8011 | Online |
| Apostle Chain | 7332 | Online |
| Wilkins + Infra Postgres/Redis | 5433,5455,6380,6381 | Online |
| FIFA Troptions Next.js | — | Dev/build only |

Full details: [service-map.md](service-map.md)

---

## 3. Health Check

```powershell
powershell -ExecutionPolicy Bypass -File .\ops\local-ai\health-check.ps1
```

Checks: Docker, GPU, NIM API, Open WebUI, Ollama, PM2 processes, key ports.
Read-only — no changes made.

---

## 4. NIM Test

```powershell
powershell -ExecutionPolicy Bypass -File .\ops\local-ai\test-nim-chat.ps1
```

Sends a test chat completion to `http://localhost:8800/v1/chat/completions`.
Prints: HTTP status, model name, response content, latency in ms.

Prerequisite: NIM must be ready (`/v1/models` responding).

---

## 5. Open WebUI Connection

Full guide: [openwebui-connect.md](openwebui-connect.md)

**Short version:**
1. Open http://localhost:3001
2. Settings → Connections → Add OpenAI-compatible
3. Base URL: `http://host.docker.internal:8800/v1`
4. API Key: `local` (any value)
5. Model: `nvidia/llama-3.1-nemotron-nano-8b-v1`

---

## 6. Docker Safe Status

```powershell
powershell -ExecutionPolicy Bypass -File .\ops\local-ai\docker-safe-status.ps1
```

Read-only Docker snapshot: running containers, resource usage, volumes, networks.
Will NOT run stop/rm/prune/down.

---

## 7. PM2 Recovery

```powershell
powershell -ExecutionPolicy Bypass -File .\ops\local-ai\pm2-recovery.ps1
```

Restarts `ada-rag-indexer` if it is stopped. Saves PM2 list after recovery.

---

## 8. Safety Rules

- **Do not** restart `nvidia-assistant-llm` unless health check confirms it is dead
- **Do not** run `docker system prune` while NIM TRT build is in progress
- **Do not** start Ollama models while NIM is building (VRAM contention causes OOM kill)
- **Do not** commit real API keys or `.env` files to git
- NIM `--restart unless-stopped` will auto-recover from crashes — check health first before manual restarts
- The `nim_cache` volume holds the compiled TRT engine — do not delete it

### NIM OOM Kill — Prevention
NIM is configured with `NIM_MAX_MODEL_LEN=16384` to cap KV cache allocation.
If Ollama loads a large model simultaneously, VRAM contention may still cause OOM.
Keep Ollama idle (no model loaded) while NIM is running.

---

## 9. Next Build Targets

### FIFA Troptions (`src/app/api/`)
| Target | File to Create | Notes |
|---|---|---|
| `/api/ai/health` | `src/app/api/ai/health/route.ts` | Proxy-checks NIM `/v1/models`, returns status JSON |
| `/api/ai/chat` | `src/app/api/ai/chat/route.ts` | Server-side POST to NIM chat completions |
| AI status page | `src/app/infrastructure/ai/page.tsx` | Shows GPU, NIM status, model info |
| Dashboard AI card | `src/app/dashboard/page.tsx` (modify) | Add AI health widget |
| Local model router | `src/lib/ai.ts` | NIM primary → Ollama fallback |

### NeedAI
- Wire Ada's `nim` inference mode to `http://localhost:8800/v1` instead of NIM cloud API
- Add NIM to Ada's model routing in `needai/app/api/ops/ada/route.ts`

### Platform-wide
- GPU utilization card (pulls from `/api/ai/health`)
- Logs viewer for NIM container logs
- Admin-only AI status page with model list + VRAM stats
- `/api/ai/health` shared across FIFA Troptions + NeedAI via shared lib
