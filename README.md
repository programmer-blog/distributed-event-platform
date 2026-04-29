# 🚀 Event-Driven User Service

A production-style backend service built with **NestJS**, demonstrating clean architecture, event-driven design, caching, and a fully Dockerized multi-service setup deployed on AWS.

This project simulates a real-world backend system with **scalability, async processing, and distributed system patterns**.

---

# 🏗️ Tech Stack

* Node.js / TypeScript
* NestJS
* PostgreSQL (Primary DB)
* Redis (Caching Layer)
* RabbitMQ (Event Broker)
* TypeORM
* Docker & Docker Compose
* AWS EC2 (Deployment)

---

# 📦 Features

* Modular architecture (User module as service boundary)
* REST APIs for user management
* DTO validation using `class-validator`
* PostgreSQL integration via TypeORM
* Redis caching using cache-aside pattern
* RabbitMQ-based event-driven architecture
* Background consumers for async processing
* Retry mechanism for fault tolerance
* Structured logging for observability
* Fully Dockerized multi-service environment

---

# 🏗️ Project Structure

```
src/
 ├── modules/
 │    └── user/
 │         ├── user.module.ts
 │         ├── user.controller.ts
 │         ├── user.service.ts
 │         ├── dto/
 │         └── entities/
 │
 ├── messaging/
 │    ├── rabbitmq.service.ts
 │    └── user.consumer.ts
 │
 ├── database/
 │    └── database.module.ts
 │
 ├── config/
 │
 ├── logger/
 │
 ├── app.module.ts
 └── main.ts
```

---

# ⚙️ Running the Application (Docker - Recommended)

## 1. Build and start services

```bash
docker-compose up --build
```

---

## 2. Access the API

```
http://localhost:3000
```

---

## 3. Stop services

```bash
docker-compose down
```

---

# 🐳 Services

## App

* NestJS backend service
* Port: `3000`

## PostgreSQL

* Persistent database container
* Port: `5432`

## Redis

* In-memory caching layer
* Port: `6379`

## RabbitMQ

* Event broker for async processing
* UI: `http://localhost:15672`

---

# 🔐 Environment Configuration

```env
DB_HOST=postgres
DB_PORT=5432
DB_USER=postgres
DB_PASS=postgres
DB_NAME=user_service

REDIS_HOST=redis
REDIS_PORT=6379
```

---

# 📡 API Endpoints

## Create User

`POST /users`

## Get All Users

`GET /users`

## Get User by ID

`GET /users/:id`

## Update User

`PATCH /users/:id`

---

# 🧠 Key Concepts Implemented

* Modular backend design using NestJS
* Separation of concerns (Controller / Service / DTO / Entity)
* Repository pattern via TypeORM
* Input validation and error handling
* Dockerized infrastructure
* Multi-container orchestration
* Cache-aside pattern with Redis
* Event-driven architecture with RabbitMQ
* Async background processing
* Retry and failure handling
* Structured logging system

---

# ⚡ Caching (Redis)

## Strategy: Cache Aside Pattern

Frequently accessed data is cached to reduce database load.

---

### Flow

1. Check Redis cache
2. If exists → return cached data
3. If not → fetch from DB
4. Store result in cache
5. Return response

---

### Cache Key Example

```
users_all
```

---

### Cache Invalidation

Cache is cleared when:

* User is created
* User is updated

Ensures consistency between cache and database.

---

# 📩 Event-Driven Architecture (RabbitMQ)

The system uses RabbitMQ to implement asynchronous, event-driven communication between components.

---

## 🧠 Why Event-Driven?

Instead of synchronous execution, the system emits events that are processed independently.

Benefits:

* Scalability
* Loose coupling
* Fault isolation
* Better performance under load

---

## ⚙️ Implementation

* RabbitMQ runs via Docker
* Events published using `amqplib`
* Messaging logic inside `src/messaging`

---

## 📤 Event Example

```json
{
  "userId": 1,
  "email": "user@example.com"
}
```

Queue:

```
user_created
```

---

## 🔄 Flow

1. User created via API
2. Event published to RabbitMQ
3. Consumer processes event asynchronously

---

# 🔄 Event Consumers (Async Processing)

Background workers consume RabbitMQ events independently of API flow.

---

## 🧠 Purpose

* Decouple business logic
* Handle async tasks
* Improve system scalability

---

## 📌 Use Cases

* Email notifications
* Logging & analytics
* External integrations
* Heavy background jobs

---

## 🧪 Example Log Output

```
User Created Event Received: { userId: 1, email: "user@example.com" }
Processing user: user@example.com
```

---

# 🛡️ Reliability & Error Handling

## Retry Mechanism

* Messages retried up to 3 times
* Retry count tracked via headers
* Failed messages reprocessed automatically

---

## Failure Handling

If processing fails:

* Message is retried
* After max retries → message dropped or moved to DLQ (future enhancement)

---

## Concept

Implements **at-least-once delivery** ensuring no message loss during transient failures.

---

# 📊 Observability & Logging

Structured logging using Winston improves traceability in distributed systems.

---

## Why Logging?

* Debug distributed flows
* Trace requests across services
* Monitor failures and events

---

## Logging Coverage

* API requests (controllers)
* Business logic (services)
* Event publishing (producer)
* Event consumption (worker)

---

## Example Logs

```
GET /users called
User created: 1
Event published: user_created
Event received: user_created
Processing user: user@example.com
```

---

# ☁️ Deployment (AWS EC2)

## Setup

* Hosted on AWS EC2 (Ubuntu)
* Dockerized full-stack deployment
* All services run via Docker Compose

---

## Production Issue Resolved

### Problem:

RabbitMQ startup delay caused app crash.

### Fix:

Added Docker restart policy:

```yaml
restart: always
```

### Result:

* Automatic recovery on failure
* Improved system resilience

---

# 📌 Notes

This project simulates a real-world backend system evolving into a distributed microservices architecture with:

* Event-driven communication
* Caching layer
* Background workers
* Cloud deployment

---

# 📘 NestJS Module Concept

A module defines a logical boundary of a feature. In microservice design, each module can evolve into an independent service boundary.
