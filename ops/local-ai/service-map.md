# Local AI & Infrastructure Service Map

> Last audited: 2026-05-04

## AI / Inference

| Service | Host | Port | Purpose | Health Check | Restart (if safe) |
|---|---|---|---|---|---|
| **NIM — Nemotron Nano 8B** | localhost | 8800 | Local GPU LLM, OpenAI-compatible API | `Invoke-WebRequest http://localhost:8800/v1/models` | `docker start nvidia-assistant-llm` |
| **Ollama** | localhost | 11434 | Local model runner (idle unless NIM down) | `Invoke-WebRequest http://localhost:11434/api/tags` | `Start-Process ollama` |

## Web UIs

| Service | Host | Port | Purpose | Health Check | Restart |
|---|---|---|---|---|---|
| **Open WebUI** | localhost | 3001 | Chat UI for local models | `Invoke-WebRequest http://localhost:3001` | `docker start open-webui` |
| **NeedAI** | localhost | 3000 | Ada sovereign AI platform | `Invoke-WebRequest http://localhost:3000` | `pm2 restart needai-web` |

## Backend APIs

| Service | Host | Port | Purpose | Health Check | Restart |
|---|---|---|---|---|---|
| **Infra Backend API** | localhost | 8010 | Core infra REST API | `Invoke-WebRequest http://localhost:8010/health` | `docker restart infra-backend-api-1` |
| **Infra LLM Service** | localhost | 8011 | LLM orchestration layer | `Invoke-WebRequest http://localhost:8011` | `docker restart infra-llm-service-1` |
| **Apostle Chain** | localhost | 7332 | Rust/Axum blockchain node, chain_id 7332 | `Invoke-WebRequest http://localhost:7332/health` | Check PM2 or EC2 |

## ClawdBot / Kalshi-OS Stack

| Service | Host | Port | Purpose | Health Check | Restart |
|---|---|---|---|---|---|
| **ClawdBot Runner** | localhost | 8089 | Primary ClawdBot agent runner | `Invoke-WebRequest http://localhost:8089` | `docker restart kalshi-os-clawdbot-runner-1` |
| **MCP Control** | localhost | 8110 | MCP control plane | `Invoke-WebRequest http://localhost:8110` | `docker restart kalshi-os-mcp-control-1` |
| **Clawd Control MCP** | localhost | 8111 | ClawdBot MCP interface | `Invoke-WebRequest http://localhost:8111` | `docker restart kalshi-os-clawd-control-mcp-1` |
| **Marketing Executor** | localhost | 8112 | Marketing agent executor | `Invoke-WebRequest http://localhost:8112` | `docker restart kalshi-os-clawdbot-marketing-executor-1` |
| **Coding Executor** | localhost | 8113 | Coding agent executor | `Invoke-WebRequest http://localhost:8113` | `docker restart kalshi-os-clawdbot-coding-executor-1` |
| **DevOps Executor** | localhost | 8114 | DevOps agent executor | `Invoke-WebRequest http://localhost:8114` | `docker restart kalshi-os-clawdbot-devops-executor-1` |
| **ClawdHub Registry** | localhost | 8199 | Agent registry hub | `Invoke-WebRequest http://localhost:8199` | `docker restart kalshi-os-clawdhub-registry-1` |
| **NemoClaw** | localhost | 8300 | NemoClaw agent (PM2) | `Invoke-WebRequest http://localhost:8300` | `pm2 restart nemoclaw` |

## Databases

| Service | Host | Port | Purpose | Health Check | Restart |
|---|---|---|---|---|---|
| **Infra Postgres** (pgvector) | localhost | 5433 | Infra stack DB | `docker exec infra-postgres-1 pg_isready` | `docker start infra-postgres-1` |
| **Infra Redis** | localhost | 6381 | Infra stack cache | `docker exec infra-redis-1 redis-cli ping` | `docker start infra-redis-1` |
| **Wilkins Postgres** (pgvector) | localhost | 5455 | Wilkins stack DB | `docker exec wilkins_postgres pg_isready` | `docker start wilkins_postgres` |
| **Wilkins Redis** | localhost | 6380 | Wilkins stack cache | `docker exec wilkins_redis redis-cli ping` | `docker start wilkins_redis` |

## PM2 Processes (Windows Host)

| ID | Name | Purpose | Status | Check |
|---|---|---|---|---|
| 6 | `needai-web` | NeedAI Next.js (Ada UI) | Online | `pm2 status needai-web` |
| 1 | `ada-scheduler` | Autonomous task executor | Online | `pm2 status ada-scheduler` |
| 2 | `clawdbot` | ClawdBot (PM2-managed) | Online | `pm2 status clawdbot` |
| 3 | `nemoclaw` | NemoClaw agent | Online | `pm2 status nemoclaw` |
| 4 | `ops-training-watcher` | Training trace watcher | Online | `pm2 status ops-training-watcher` |
| 5 | `ops-ingest` | Ops data ingest | Online | `pm2 status ops-ingest` |
| 0 | `voice-ada` | Ada voice (TTS/STT) | Online | `pm2 status voice-ada` |
| 7 | `ada-rag-indexer` | RAG chunk indexer (cron) | **Stopped** | `.\ops\local-ai\pm2-recovery.ps1` |

## FIFA Troptions Next.js App

| | |
|---|---|
| **Path** | `C:\Users\Kevan\fifa troptions` |
| **Framework** | Next.js 16.2.4, React 19, TypeScript, Tailwind v4 |
| **DB** | Prisma + libSQL (SQLite/Turso) |
| **Dev server** | `npm run dev` → :3000 (conflicts with NeedAI if both run) |
| **Build** | `npm run build` — last verified green |
| **AI integration** | Not yet wired — see README Next Build Targets |
