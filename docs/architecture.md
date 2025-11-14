# 🏗️ System Architecture — Job Importer

This document describes the architecture, components, design decisions, and data flow of the **Job Importer System** built using:

- Node.js (Express)
- Redis + BullMQ (Queue)
- Worker service
- MongoDB (Job & Import Logs)
- Cron Scheduler
- Socket.IO (Real-time updates)
- React + Tailwind frontend

---

# 📘 1. High-Level Overview

The goal of the system:

- Fetch job RSS/XML feeds
- Parse & normalize them
- Push import jobs into a queue
- Process them in a background worker
- Save & update jobs in MongoDB
- Generate import logs
- Publish real-time updates to the frontend using Socket.IO
- Auto-run via Cron every minute

---

# 🖼️ 2. Architecture Diagram (Mermaid)

GitHub renders Mermaid automatically.

```mermaid
flowchart TD

A[React Frontend\nWeb UI] <--> B(Socket.IO\nWebsocket Channel)

B ---> C[Express API Server\nREST Endpoints]

C --> D[Redis Queue\nBullMQ Jobs]

D --> E[Worker Process\nConsumes Jobs]

E --> F[MongoDB\njobs + import logs]

E --> G[(Redis Pub/Sub)\npublishes "new-import-log"]

G --> B
C --> H[Cron Job\nTriggers import every 1 min]
