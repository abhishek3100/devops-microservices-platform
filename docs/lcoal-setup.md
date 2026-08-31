# Local Development Setup

This guide explains how to run the DevOps Microservices Platform locally using Docker Desktop Kubernetes, Docker Compose, and the repo's Kustomize/Helm automation.

---

# Prerequisites

- Docker Desktop
- Kubernetes enabled in Docker Desktop
- kubectl
- Helm
- Node.js 22+
- Python 3.11+
- Make

Verify:

```bash
docker --version
kubectl version
helm version
node -v
python --version
```

The repo also includes a few helper commands in the root Makefile:

```bash
make up
make down
make k8s-up
make k8s-down
make prometheus-install
make gateway-install
```
---

# Clone Repository

```bash
git clone <repo-url>

cd devops-microservices-platform
```

---

# Build Docker Images

Build all services locally.

```bash
docker build -f services/api-gateway/Dockerfile -t api-gateway:latest .
docker build -f services/user-service/Dockerfile -t user-service:latest .
docker build -f services/task-service/Dockerfile -t task-service:latest .
docker build -f services/notification-service/Dockerfile -t notification-service:latest .
docker build -f frontend/Dockerfile -t frontend:latest .
```

---

# Create Kubernetes Cluster

Enable Kubernetes from Docker Desktop.

Verify:

```bash
kubectl get nodes
```

Expected:

```
control-plane
worker
```

---

# Install Metrics Server

```bash
helm repo add metrics-server https://kubernetes-sigs.github.io/metrics-server

helm repo update

helm install metrics-server metrics-server/metrics-server \
  --namespace kube-system \
  --set args="{--kubelet-insecure-tls}"
```

Verify:

```bash
kubectl top nodes
```

---

# Install Envoy Gateway

Install Gateway API implementation.

```bash
helm install eg oci://docker.io/envoyproxy/gateway-helm \
  --version v1.9.1 \
  -n envoy-gateway-system \
  --create-namespace
```

Install Gateway API CRDs.

```bash
kubectl apply \
-f https://github.com/envoyproxy/gateway/releases/download/v1.9.1/quickstart.yaml
```

Verify:

```bash
kubectl get gatewayclass
```

---

# Install Prometheus

```bash
make prometheus-install
```

This installs the chart using the repo values file:

```bash
helm upgrade --install prometheus prometheus-community/prometheus \
  -n monitoring \
  --create-namespace \
  -f k8s/base/monitoring/prometheus/values.yaml
```

Verify:

```bash
kubectl get pods -n monitoring
```

If the chart is already installed, the upgrade command will keep it aligned with the project configuration.
---

# Deploy Application

Use the project overlay directly:

```bash
kubectl apply -k k8s/overlays/local
```

Or via the Makefile helper:

```bash
make k8s-up
```

Verify:

```bash
kubectl get pods -n devops-platform
kubectl get svc -n devops-platform
kubectl get gateway -n devops-platform
```

All pods should be Running.

The repo also includes Argo CD ApplicationSet automation under `argocd/applicationsets/` for GitOps-driven sync.
---

# Access Frontend

Port-forward Envoy:

```bash
kubectl port-forward -n envoy-gateway-system \
service/envoy 8080:80
```

Open:

http://localhost:8080

---

# Observability

## Prometheus

Port-forward:

```bash
kubectl port-forward svc/prometheus-server \
9090:80 \
-n monitoring
```

Open:

http://localhost:9090

Verify:

Status → Targets

Expected targets:

- api-gateway
- user-service
- task-service
- notification-service

## Grafana

```bash
kubectl port-forward svc/grafana 3001:80 -n monitoring
```

Open:

http://localhost:3001

Login with:

- Username: admin
- Password: admin123

The dashboards configured in `k8s/base/monitoring/grafana/values.yaml` include the platform overview, API gateway overview, service overview, and Kubernetes cluster overview.

---

# Metrics

Node Services

http://localhost:3000/metrics

Python Services

http://localhost:8000/metrics

---

# Useful Commands

Pods

```bash
kubectl get pods -A
```

Logs

```bash
kubectl logs -f <pod> -n devops-platform
```

Describe

```bash
kubectl describe pod <pod> -n devops-platform
```

Restart Deployment

```bash
kubectl rollout restart deployment/api-gateway \
-n devops-platform
```

Delete Cluster Resources

```bash
kubectl delete -k k8s/overlays/local
```

---

# Current Platform

- API Gateway (Node.js)
- User Service (Node.js)
- Task Service (Python gRPC)
- Notification Service (Python gRPC)
- Frontend (React/Vite)
- Gateway API (Envoy)
- Prometheus
- Grafana
- Metrics Server
- Kubernetes
- Argo CD + ApplicationSet + image updater
- GitHub Actions CI/CD pipeline for GHCR publishing