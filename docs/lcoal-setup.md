# Local Development Setup

This guide explains how to run the DevOps Microservices Platform locally using Docker Desktop Kubernetes.

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
helm repo add prometheus-community \
https://prometheus-community.github.io/helm-charts

helm repo update

helm install prometheus prometheus-community/prometheus \
  -n monitoring \
  --create-namespace
```

Upgrade using project values:

```bash
helm upgrade prometheus prometheus-community/prometheus \
  -n monitoring \
  -f k8s/base/monitoring/prometheus/values.yaml
```

Verify:

```bash
kubectl get pods -n monitoring
```

---

# Deploy Application

```bash
kubectl apply -k k8s/overlays/local
```

Verify:

```bash
kubectl get pods -n devops-platform
kubectl get svc -n devops-platform
kubectl get gateway -n devops-platform
```

All pods should be Running.

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

# Prometheus

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
- PostgreSQL
- Gateway API (Envoy)
- Prometheus
- Metrics Server
- Kubernetes