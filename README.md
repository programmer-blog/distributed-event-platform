# Event-Driven User Service

A production-style backend service built with NestJS, demonstrating clean architecture, PostgreSQL integration, and a fully Dockerized setup.

---

## 🚀 Tech Stack

* Node.js / TypeScript
* NestJS
* PostgreSQL
* TypeORM
* Docker & Docker Compose

---

## 📦 Features

* Modular architecture (User module as service boundary)
* REST APIs for user management
* DTO validation using class-validator
* Database integration with TypeORM
* Fully Dockerized application (App + Database)
* Environment-based configuration

---

## 🏗️ Project Structure

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
 ├── database/
 │    └── database.module.ts
 │
 ├── config/
 │
 ├── app.module.ts
 └── main.ts
```

---

## ⚙️ Running the Application (Docker - Recommended)

### 1. Build and start services

```
docker-compose up --build
```

---

### 2. Access the API

```
http://localhost:3000
```

---

### 3. Stop services

```
docker-compose down
```

---

## 🐳 Services

### App

* Runs NestJS application
* Exposed on port `3000`

### PostgreSQL

* Runs in container
* Port `5432`
* Persistent storage via Docker volume

---

## 🔐 Environment Configuration

Environment variables are provided via `docker-compose.yml`:

```
DB_HOST=postgres
DB_PORT=5432
DB_USER=postgres
DB_PASS=postgres
DB_NAME=user_service
```

---

## 📡 API Endpoints

### Create User

POST `/users`

### Get All Users

GET `/users`

### Get User by ID

GET `/users/:id`

### Update User

PATCH `/users/:id`

---

## 🧠 Key Concepts Implemented

* Modular backend design using NestJS
* Separation of concerns (Controller / Service / DTO / Entity)
* Repository pattern via TypeORM
* Input validation and error handling
* Containerized infrastructure using Docker
* Multi-container orchestration with Docker Compose

---

## ⚡ Caching (Redis)

The application uses Redis as a caching layer to improve performance and reduce database load.

### Strategy Used

* Cache Aside Pattern
* Frequently accessed data (e.g., user list) is cached
* Cache is invalidated on data updates

### Example

* `GET /users` → cached for 60 seconds
* Cache key: `users_all`

### Flow

1. Check Redis cache
2. If data exists → return cached response
3. If not → fetch from database
4. Store result in cache
5. Return response

### Cache Invalidation

Cache is cleared when:

* A new user is created
* A user is updated

This ensures data consistency between cache and database.

---

## 📩 Event-Driven Architecture (RabbitMQ)

The service publishes domain events using RabbitMQ to enable asynchronous processing and loose coupling between components.

---

### 🧠 Why Event-Driven?

Instead of handling all logic synchronously, the system emits events that other services or workers can consume independently.

This improves:

* Scalability
* Decoupling
* System reliability

---

### ⚙️ Implementation

* RabbitMQ runs as a Docker service
* Events are published using `amqplib`
* Messaging layer implemented under `src/messaging`

---

### 📤 Event Example

When a user is created:

```json
{
  "userId": 1,
  "email": "user@example.com"
}
```

Event is published to queue:

```id="queue_name"
user_created
```

---

### 🔄 Flow

1. User is created via API
2. Service publishes `user_created` event
3. Other services (or future workers) can consume this event

---

### 🐳 RabbitMQ Access

* Management UI: http://localhost:15672
* Username: `guest`
* Password: `guest`

---

## 🔜 Next Steps

* Implement background jobs
* Add authentication (JWT)
* Deploy to AWS

---

## 📌 Notes

This project is designed to simulate a real-world backend service and will evolve into a distributed microservices system.


## What is a module in NestJS?

A module defines a logical boundary of a feature or service, grouping controllers, services, and dependencies. In microservices architecture, each module can evolve into an independent service.

##  Containerized NestJS service with PostgreSQL

Containerized a NestJS service with PostgreSQL using Docker Compose and handled environment-based configuration between local and container environments.”
