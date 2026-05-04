# Open WebUI — Connect to Local NIM

## What this does
Connects the Open WebUI interface (running at http://localhost:3001) to the local
NVIDIA NIM inference server (running at http://localhost:8800), giving you a full
ChatGPT-style UI backed by a local GPU-accelerated model.

---

## Prerequisites
- NIM container is running and `/v1/models` is responding
- Open WebUI container is running at port 3001
- Test first: `powershell -ExecutionPolicy Bypass -File .\ops\local-ai\test-nim-chat.ps1`

---

## Connection Settings

### Base URL — from Windows host
```
http://localhost:8800/v1
```

### Base URL — from inside Docker / Open WebUI container
```
http://host.docker.internal:8800/v1
```
> Use `host.docker.internal` in Open WebUI settings since Open WebUI runs inside Docker.

### Model ID
```
nvidia/llama-3.1-nemotron-nano-8b-v1
```

### API Key
Leave blank or enter any placeholder (e.g. `local`). NIM does not require a key on localhost.

---

## Steps in Open WebUI

1. Open http://localhost:3001 in your browser
2. Go to **Settings → Connections** (or Admin Panel → Connections)
3. Click **+ Add Connection** or **OpenAI-compatible**
4. Set:
   - **Name:** Local NIM (Nemotron 8B)
   - **Base URL:** `http://host.docker.internal:8800/v1`
   - **API Key:** `local` (any value)
5. Click **Save / Verify**
6. In a new chat, select model: `nvidia/llama-3.1-nemotron-nano-8b-v1`

---

## Verify from command line

```powershell
# Models list
Invoke-WebRequest http://localhost:8800/v1/models -UseBasicParsing | ConvertFrom-Json | Select-Object -ExpandProperty data | Select-Object id

# Chat test
powershell -ExecutionPolicy Bypass -File .\ops\local-ai\test-nim-chat.ps1
```

---

## Notes
- NIM exposes a fully OpenAI-compatible API (`/v1/chat/completions`, `/v1/models`, etc.)
- Max context: 16,384 tokens (configured via `NIM_MAX_MODEL_LEN=16384`)
- GPU: NVIDIA RTX 5090 Laptop, ~9-10 GB VRAM for inference
- Port 8800 maps to container port 8000
