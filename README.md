# DevOps Microservices Platform

A production-grade DevOps project demonstrating end-to-end implementation of a microservices-based 3-tier architecture using modern DevOps practices.

---

## 🚀 Project Overview

This project simulates a real-world microservices system with:

* API Gateway (REST)
* User Service (REST)
* Task Service (gRPC)
* Notification Service (gRPC)
* Shared contract using Protocol Buffers

The system demonstrates **multi-protocol communication (REST + gRPC)**, service-to-service interaction, and clean architectural separation.

---

## 🧱 Architecture

### High-Level Flow

Frontend → API Gateway → Backend Services

* External communication: REST
* Internal communication: gRPC

### Service Interaction

* API Gateway → User Service (REST)
* API Gateway → Task Service (gRPC)
* Task Service → Notification Service (gRPC)

---

## 📂 Repository Structure

```
devops-microservices-platform/
│
├── services/
│   ├── api-gateway/
│   ├── user-service/
│   ├── task-service/
│   └── notification-service/
│
├── proto/                 # Shared gRPC contracts
├── frontend/              # (To be implemented)
├── infra/                 # Terraform, Docker (later phases)
├── docs/                  # Architecture & design docs
│
├── README.md
├── .env.example
└── Makefile
```

---

## ⚙️ Tech Stack

| Layer                | Technology        |
| -------------------- | ----------------- |
| API Gateway          | Node.js (Express) |
| User Service         | Node.js           |
| Task Service         | Python (gRPC)     |
| Notification Service | Python (gRPC)     |
| Communication        | REST + gRPC       |
| Contracts            | Protocol Buffers  |

---

## 🔌 API Endpoints

### User Service (via API Gateway)

* `POST /api/users/register`
* `POST /api/users/login`

---

### Task Service (via API Gateway)

* `POST /api/tasks` (Protected)
* `GET /api/tasks` (Protected)

---

## 🔐 Authentication

* JWT-based authentication
* Token issued by User Service
* Verified at API Gateway

---

## 🔄 Example Flow

### Create Task

1. User logs in → receives JWT
2. Client calls API Gateway with token
3. API Gateway validates JWT
4. Gateway calls Task Service via gRPC
5. Task Service:

   * Creates task (status = PENDING)
   * Calls Notification Service (gRPC)
6. Notification Service logs message

---

## 🧠 Key Concepts Demonstrated

* Microservices architecture
* API Gateway pattern
* REST ↔ gRPC bridging
* Service-to-service communication
* Contract-first design using `.proto`
* Layered service structure (controller, service, handler)

---

## ⚠️ Current Limitations (Intentional)

* In-memory data storage (no persistence yet)
* No retries or circuit breaking
* No async messaging (planned)
* No containerization yet

---

## 🗺️ Roadmap

### ✅ Phase 1: Microservices Design & Implementation (Completed)

### ✅ Phase 2: Containerization (Completed)

* Dockerize all services
* Docker Compose setup

### 🔜 Phase 3: CI/CD

* GitHub Actions pipelines

### 🔜 Phase 4: Infrastructure as Code

* Terraform (GCP)

### 🔜 Phase 5: Kubernetes Deployment

* Deploy on GKE

### 🔜 Phase 6: Observability

* Prometheus + Grafana

### 🔜 Phase 7: Load Testing

* k6 integration

### 🔜 Phase 8: GitOps

* ArgoCD

---

## 🧠 Design Decisions

* gRPC used for internal communication (performance + contracts)
* REST used for external APIs (simplicity)
* Shared proto contracts at root for consistency
* Monorepo for faster development iteration

---

## 🧪 How to Run (Phase 1)

### Start Services

```bash
# Terminal 1
cd services/user-service
node src/index.js

# Terminal 2
cd services/task-service
python -m src.server

# Terminal 3
cd services/notification-service
python -m src.server

# Terminal 4
cd services/api-gateway
node src/index.js
```

---

### Test APIs

#### Register

```bash
curl -X POST http://localhost:3000/api/users/register \
-H "Content-Type: application/json" \
-d '{"email":"test@test.com","password":"123456"}'
```

#### Login

```bash
curl -X POST http://localhost:3000/api/users/login \
-H "Content-Type: application/json" \
-d '{"email":"test@test.com","password":"123456"}'
```

#### Create Task

```bash
curl -X POST http://localhost:3000/api/tasks \
-H "Authorization: Bearer <TOKEN>" \
-H "Content-Type: application/json" \
-d '{"title":"Learn microservices"}'
```

---

## 👨‍💻 Author

Abhishek Kumar || DevOps Engineer

---
