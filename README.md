# DevOps Microservices Platform

A production-grade DevOps project showcasing end-to-end implementation of a microservices-based 3-tier application using modern DevOps practices.

## 🚀 Tech Stack
- Frontend: React
- Backend: Node.js (REST), Python (gRPC)
- Database: PostgreSQL
- Containerization: Docker, Docker Compose
- Orchestration: Kubernetes
- CI/CD: GitHub Actions
- Infrastructure: Terraform (GCP)
- GitOps: ArgoCD
- Observability: Prometheus, Grafana

## 🧱 Architecture Overview
- API Gateway (REST)
- User Service (REST)
- Task Service (gRPC)
- Notification Service (gRPC)
- PostgreSQL (separate schemas)

## 📂 Repository Structure
```
├── docs
├── frontend
├── infra
│   ├── compose
│   ├── docker
│   └── scripts
├── Makefile
├── proto
├── README.md
└── services
    ├── api-gateway
    ├── notification-service
    ├── task-service
    └── user-service
```

## 📌 Goals
- Production-grade system design
- Scalability & resilience
- Secure-by-default architecture
- Observability-first approach

## 📖 Documentation
Detailed architecture and setup instructions available in `/docs`.

---