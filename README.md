# DevOps Microservices Platform

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![gRPC](https://img.shields.io/badge/gRPC-1E90FF?style=for-the-badge&logo=grpc&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Kubernetes](https://img.shields.io/badge/Kubernetes-326CE5?style=for-the-badge&logo=kubernetes&logoColor=white)
![ArgoCD](https://img.shields.io/badge/ArgoCD-EF7B4D?style=for-the-badge&logo=argo&logoColor=white)
![Prometheus](https://img.shields.io/badge/Prometheus-E6522C?style=for-the-badge&logo=prometheus&logoColor=white)
![Grafana](https://img.shields.io/badge/Grafana-F46800?style=for-the-badge&logo=grafana&logoColor=white)
![Terraform](https://img.shields.io/badge/Terraform-7B42BC?style=for-the-badge&logo=terraform&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white)

A modern DevOps microservices platform that demonstrates containerization, service orchestration, API gateway patterns, gRPC-based internal communication, GitOps delivery, and observability in a realistic multi-service setup.

---

## 🚀 Project Overview

This repository implements a full-stack platform with:

- Frontend application built with React + Vite
- API Gateway built with Node.js and Express
- User service using REST APIs
- Task service using gRPC
- Notification service using gRPC
- Shared Protocol Buffers for service contracts
- Dockerized deployment for local and cloud flows
- Kubernetes manifests with overlays
- GitOps-based deployment using ArgoCD
- Monitoring with Prometheus and Grafana

The project showcases multi-protocol communication using REST for external traffic and gRPC for internal service-to-service calls.

---

## 🏗️ Architecture

```text
Client / Browser
       │
       ▼
   Frontend (React + Vite)
       │
       ▼
   API Gateway (Node.js)
       ├──────────────► User Service (REST)
       └──────────────► Task Service (gRPC)
                             │
                             ▼
                     Notification Service (gRPC)
```

### Service interactions

- API Gateway → User Service: REST
- API Gateway → Task Service: gRPC
- Task Service → Notification Service: gRPC
- Shared contracts are defined under the `proto/` directory

---

## 🧩 Repository Structure

```text
devops-microservices-platform/
├── .github/workflows/       # CI/CD and GHCR publishing
├── argocd/                  # ArgoCD application and appset configs
├── docs/                    # Project documentation
├── frontend/                # React frontend
├── infra/                   # Docker Compose and infrastructure helpers
├── k8s/                     # Kubernetes manifests and overlays
├── proto/                   # Shared .proto contract definitions
├── services/
│   ├── api-gateway/         # Node.js gateway
│   ├── user-service/        # Node.js REST service
│   ├── task-service/        # Python gRPC service
│   └── notification-service/# Python gRPC service
├── terraform/               # Terraform modules
├── tests/                   # Load / validation tests
├── Makefile                 # Local orchestration commands
├── README.md                # Project overview
├── .gitignore
└── ...
```

---

## 🛠️ Tech Stack

| Area | Technology |
| --- | --- |
| Frontend | React, Vite |
| API Gateway | Node.js, Express |
| User Service | Node.js |
| Task Services | Python, gRPC |
| Contracts | Protocol Buffers |
| Containers | Docker |
| Orchestration | Kubernetes, Kustomize |
| GitOps | ArgoCD |
| Monitoring | Prometheus, Grafana |
| Infra as Code | Terraform |
| CI/CD | GitHub Actions |
| Local Compose | Docker Compose |

---

## 🔐 Current Features

- JWT-based authentication flow
- REST endpoint exposure through the API gateway
- gRPC service-to-service communication
- Health-check based service interaction
- Containerized services for local and cloud deployment
- GitOps delivery pipelines with ArgoCD
- Metrics and dashboard observability
- Multi-environment Kubernetes overlays

---

## 🔄 Example Flow

### Create a task

1. User logs in and receives a JWT.
2. Client sends the token through the API Gateway.
3. Gateway validates the token.
4. Task is created through the task service over gRPC.
5. Task service triggers a notification via gRPC.
6. Notification service handles the event or message delivery.

---

## 📡 API Endpoints

### User service routes

- `POST /api/users/register`
- `POST /api/users/login`
- `GET /api/users/profile` (protected)

### Task service routes

- `POST /api/tasks` (protected)
- `GET /api/tasks` (protected)
- `GET /health`

---

## 🧪 Run Locally

### Docker Compose

```bash
make up
```

Then access:

- Frontend: `http://localhost:8080`
- API Gateway: `http://localhost:3000`

### Kubernetes

```bash
kubectl apply -k k8s/overlays/local
```

### Manual service startup

```bash
# User service
cd services/user-service
node src/index.js

# Task service
cd services/task-service
python -m src.server

# Notification service
cd services/notification-service
python -m src.server

# API gateway
cd services/api-gateway
node src/index.js
```

---

## 🧪 Example API Calls

### Register user

```bash
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456"}'
```

### Login user

```bash
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456"}'
```

### Create task

```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"title":"Learn microservices"}'
```

---

## 🚦 Project Status

### ✅ Completed

- Frontend application
- API gateway
- User service
- Task service
- Notification service
- Dockerized services
- GitHub Actions workflow
- Kubernetes overlays
- ArgoCD app set
- Prometheus and Grafana setup
- Terraform modules

### 🚧 Planned

- HPA and autoscaling policies
- Network policies
- Stronger RBAC and pod security

---

## 🧠 Design Decisions

- REST is used for public-facing APIs for simplicity.
- gRPC is used internally for high-performance service communication.
- Shared `.proto` files ensure contract-driven development.
- A monorepo layout keeps service ownership and deployment simple.
- GitOps through ArgoCD keeps the platform easy to manage across environments.

---

## 👨‍💻 Author

Abhishek Kumar || Senior DevOps Engineer

