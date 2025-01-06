# Task Queue System (Node.js + Express)

A simple demonstration of a task queue system using in-memory storage.  
Features include:

1. **Add Task** to queue (with optional delayed visibility).
2. **Worker** that processes tasks asynchronously, with a retry mechanism.
3. **Dead-letter queue (DLQ)** for failed tasks.
4. **API endpoints** to view and clear the DLQ.

## Quick Start

1. **Clone** or download this repository.
2. Run `npm install` to install dependencies.
3. Start the server:
   ```bash
   npm run dev