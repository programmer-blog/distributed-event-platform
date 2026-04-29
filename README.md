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

---

# 🔄 CI/CD (GitHub Actions → AWS EC2)

This project includes a simple CI/CD pipeline using **GitHub Actions** to automatically deploy updates to AWS EC2.

---

## ⚙️ How it Works

1. Code is pushed to `main` branch
2. GitHub Actions workflow is triggered
3. Workflow connects to EC2 via SSH
4. Latest code is pulled
5. Docker containers are rebuilt and restarted

---

## 📁 Workflow Location

```
.github/workflows/deploy.yml
```

---

## 🔐 Required Secrets (GitHub)

The following secrets must be configured in:

**Settings → Secrets → Actions**

* `EC2_HOST` → Public IP of EC2
* `EC2_USER` → SSH user (e.g., ubuntu)
* `EC2_KEY` → Private SSH key (id_rsa)

---

## 🚀 Deployment Flow

```plaintext
git push → GitHub Actions → SSH → EC2 → docker-compose restart
```
---

 ## 🚀 CI/CD Success

- Implemented GitHub Actions pipeline
- Automated deployment to AWS EC2
- Docker-based container restart on push
- Fixed production issue: container crash due to dependency startup timing
  
---

CI/CD Pipeline
GitHub Actions workflow triggers on push to main
SSH-based deployment to AWS EC2
Docker containers rebuilt and restarted automatically
Ensures consistent and reproducible deployments

--- 

### Architecture Flow

 GitHub → GitHub Actions → SSH → EC2 → Docker Compose → Running Services
------

# 🌐 Nginx Reverse Proxy (Production Layer)

This project uses **Nginx as a reverse proxy** in front of the NestJS application to simulate a production-grade backend setup.

---

## ⚙️ Architecture

```plaintext id="arch1"
Client → Nginx (Port 80) → NestJS (Port 3000)
```

---

## 🚀 Why Nginx?

* Hides internal application port
* Acts as reverse proxy layer
* Improves production readiness
* Foundation for SSL and load balancing

---

## 🔧 Configuration

Nginx is configured to forward all requests to the NestJS backend:

```nginx id="conf1"
location / {
    proxy_pass http://localhost:3000;
}
```

---

## 🌍 Access

After setup:

```
http://<EC2_PUBLIC_IP>/
```

Now routes through Nginx instead of directly exposing Node.js port.

---

  sudo apt update && sudo apt upgrade -y

  sudo apt install nginx -y

  sudo systemctl start nginx
  sudo systemctl enable nginx

  sudo systemctl status nginx

  sudo ufw allow 'Nginx Full'
  sudo ufw allow OpenSSH
  sudo ufw enable

  curl http://localhost

  sudo nano /etc/nginx/sites-available/default

  sudo nginx -t
  sudo systemctl restart nginx

## 🧠 Key Learning

* Reverse proxy setup in real cloud environments
* Separation between web server (Nginx) and application server (NestJS)
* Production deployment pattern used in real systems

----

# 📌 Notes

This project simulates a real-world backend system evolving into a distributed microservices architecture with:

* Event-driven communication
* Caching layer
* Background workers
* Cloud deployment

----

An event-driven backend system was developed using NestJS running on AWS EC2.
The system exposes REST APIs for user management, uses PostgreSQL for persistence, Redis for caching, and RabbitMQ for asynchronous event processing.
The entire application is containerized using Docker and deployed via GitHub Actions CI/CD pipeline. Nginx is used as a reverse proxy in front of the Node.js service.”

🧭 ARCHITECTURE

  Client
    ↓
  Nginx (Port 80)
    ↓
  NestJS API (Docker)
    ↓
  PostgreSQL (data)
  Redis (cache)
  RabbitMQ (events)

CI/CD:
  GitHub Push → GitHub Actions → SSH EC2 → Docker restart