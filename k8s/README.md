# Kubernetes Deployment (Local)

The platform is deployed to a local Kubernetes cluster using **Docker Desktop Kubernetes** and **Kustomize**.

## Namespace

All workloads run inside a dedicated namespace.

```
devops-platform
```

Deployment is managed through Kustomize overlays.

```bash
kubectl apply -k k8s/overlays/local
```

---

# Kubernetes Architecture

```
                           ┌────────────────────────┐
                           │      Web Browser       │
                           └────────────┬───────────┘
                                        │
                              http://localhost
                                        │
                                        ▼
                        Envoy Gateway (Gateway API)
                                        │
                                   HTTPRoute
                                        │
                                        ▼
                               API Gateway Service
                                        │
               ┌────────────────────────┼────────────────────────┐
               ▼                        ▼                        ▼
        User Service              Task Service         Notification Service
          (REST)                    (gRPC)                  (gRPC)
                                        │
                                        ▼
                                   PostgreSQL
```

---

# Gateway API

Instead of using a traditional Kubernetes Ingress, this project uses the **Gateway API** with **Envoy Gateway**.

## Why Gateway API?

Gateway API is the next-generation Kubernetes networking API and provides:

- Better separation of infrastructure and application routing
- Role-oriented networking resources
- Improved extensibility
- Standardized traffic management
- Cloud portability

The platform exposes only a single entry point:

```
Browser
      │
      ▼
Gateway
      │
HTTPRoute
      │
API Gateway
```

Internal microservices remain private inside the cluster.

---

# Envoy Gateway

The project uses **Envoy Gateway** as the Gateway API implementation.

Installed using Helm:

```bash
helm install eg oci://docker.io/envoyproxy/gateway-helm \
  --version v1.9.1 \
  -n envoy-gateway-system \
  --create-namespace
```

GatewayClass:

```
eg
```

---

# Local Access

Docker Desktop automatically exposes the Envoy LoadBalancer.

Application can be accessed at:

```
http://localhost
```

API examples:

```
POST /api/users/register
POST /api/users/login
POST /api/tasks
GET  /health
```

---

# Health Checks

Every workload exposes Kubernetes health endpoints.

| Service | Health Check |
|----------|--------------|
| API Gateway | `/health` |
| User Service | `/health` |
| Task Service | gRPC Health |
| Notification Service | gRPC Health |
| Frontend | `/` |

Kubernetes uses Startup, Readiness and Liveness probes.

---

# Configuration

Configuration is externalized using Kubernetes ConfigMaps and Secrets.

Examples:

- USER_SERVICE_URL
- TASK_SERVICE_HOST
- TASK_SERVICE_PORT
- JWT_SECRET
- Database credentials

No application configuration is hardcoded.

---

# Kustomize Structure

```
k8s/
├── base/
│   ├── api-gateway/
│   ├── frontend/
│   ├── gateway/
│   ├── user-service/
│   ├── task-service/
│   ├── notification-service/
│   ├── config/
│   └── namespaces/
│
└── overlays/
    └── local/
```

The base directory contains reusable manifests while overlays provide environment-specific customization.

---

# Current Features

- Kubernetes Deployments
- Services
- ConfigMaps
- Secrets
- Startup/Readiness/Liveness Probes
- Gateway API
- HTTPRoute
- Envoy Gateway
- Kustomize
- REST + gRPC Microservices
- Docker Images hosted on GitHub Container Registry (GHCR)

---

# Next Steps

The platform will continue to evolve with:

- Prometheus
- Grafana
- Metrics Exporters
- Horizontal Pod Autoscaler (HPA)
- ArgoCD GitOps
- Network Policies
- Progressive Delivery (Canary / Blue-Green)