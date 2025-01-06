# Task Queue System: Design Document

## 1. Introduction
This document outlines the design decisions for a **Task Queue System** built with Node.js and Express. The primary goal of this system is to accept tasks via an API, process them asynchronously using a worker, and maintain a dead-letter queue (DLQ) for tasks that fail beyond a configured retry limit.

---

## 2. Architecture Overview
1. **API**  
   - Receives incoming requests (tasks) and exposes endpoints for:
     - Adding tasks to the queue
     - Viewing and clearing the DLQ

2. **Worker**  
   - Continuously retrieves tasks from the queue, processes them, and implements retry logic with exponential backoff. If a task exceeds the retry limit, it is sent to the DLQ.

3. **Dead-Letter Queue (DLQ)**  
   - A separate in-memory queue that stores permanently failed tasks for further inspection or manual processing.

4. **Queue Store**  
   - An in-memory array storing tasks. This is sufficient for small-scale or demonstration purposes, but in production scenarios, it would likely be replaced or supplemented with a robust message broker (e.g., Redis, RabbitMQ).

---

## 3. Key Design Decisions

### 3.1 In-Memory vs. Persistent Queue
- **Decision**: Use an **in-memory** queue for simplicity and demonstration.  
- **Rationale**: Easy to implement, no external dependencies, and quick to set up for a coding exercise or small-scale system.  
- **Future Considerations**: For production, replace with a persistent queue (e.g., Redis, RabbitMQ) to handle larger volumes and ensure reliability.

### 3.2 Separation of Concerns
- **Decision**: Separate **controllers** (handling request/response logic) from **routes** (defining endpoints) and **services** (business logic).  
- **Rationale**: Improves maintainability and testability by isolating each layer. Controllers focus on translating HTTP data into function calls, services handle application logic, and routes simply connect the two.

### 3.3 Worker Model
- **Decision**: Run the worker in the same process for simplicity.  
- **Rationale**: Demonstrates asynchronous processing without additional infrastructure.  
- **Future Considerations**: For high availability or large volume of tasks, run multiple worker instances or separate them into microservices/containers that can scale independently from the API.

### 3.4 Retry Logic with Exponential Backoff
- **Decision**: Implement exponential backoff by delaying task visibility times each time a task fails.  
- **Rationale**: Reduces load on the system by spacing out retries when tasks fail repeatedly.  
- **Future Considerations**: Make the number of retries and backoff factor easily configurable (e.g., via environment variables). Add backoff jitter to avoid synchronized retries in large clusters.

### 3.5 Dead-Letter Queue (DLQ)
- **Decision**: Move tasks to a DLQ after the maximum number of retries is reached.  
- **Rationale**: Prevents endless retries of unprocessable tasks, and enables developers or operators to inspect these tasks.  
- **Future Considerations**: Provide additional APIs or a GUI to re-queue, delete, or analyze DLQ tasks.


## 4. Workflow Overview

1. **Add Task**  
   - A `POST /tasks` request creates a task with a unique UUID and optional delayed visibility time, then queues it.

2. **Worker Processing**  
   - The worker continuously polls for the next visible task, processes it, and handles failures with retries.  
   - On exceeding the max retry limit, tasks are moved to the DLQ.

3. **Dead-Letter Queue**  
   - A separate queue that stores tasks that have permanently failed.  
   - Accessible via `GET /dlq` to list failed tasks and `DELETE /dlq` to clear them.
