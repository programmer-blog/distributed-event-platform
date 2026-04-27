# Event-Driven User Service

A production-style backend service built with NestJS, demonstrating clean architecture, PostgreSQL integration, and microservice-ready design.

---

## 🚀 Tech Stack

* Node.js / TypeScript
* NestJS
* PostgreSQL
* TypeORM
* Docker

---

## 📦 Features

* Modular architecture (User module as service boundary)
* REST APIs for user management
* DTO validation using class-validator
* Database integration using TypeORM
* Dockerized PostgreSQL setup
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

## ⚙️ Setup Instructions

### 1. Clone the repository

```
git clone <repo-url>
cd event-driven-user-service
```

---

### 2. Install dependencies

```
npm install
```

---

### 3. Setup environment variables

Create a `.env` file:

```
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=postgres
DB_NAME=user_service
```

---

### 4. Start PostgreSQL using Docker

```
docker-compose up -d
```

---

### 5. Run the application

```
npm run start:dev
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

* Modular backend design (NestJS modules)
* Separation of concerns (controller, service, DTO, entity)
* Repository pattern using TypeORM
* Validation and error handling
* Environment-based configuration
* Dockerized database setup

---

## 🐳 Docker

PostgreSQL runs in a Docker container via `docker-compose.yml`.

---

## 🔜 Next Steps

* Dockerize NestJS application
* Add message queue (Kafka / RabbitMQ)
* Implement microservices communication
* Add caching (Redis)
* Add authentication (JWT)

---

## 📌 Notes

This project is designed to simulate a real-world backend service and will evolve into a distributed microservices system.


## What is a module in NestJS?

A module defines a logical boundary of a feature or service, grouping controllers, services, and dependencies. In microservices architecture, each module can evolve into an independent service.

##  Containerized NestJS service with PostgreSQL

Containerized a NestJS service with PostgreSQL using Docker Compose and handled environment-based configuration between local and container environments.”
