# Monitoring & Observability

This project includes a complete monitoring stack for Kubernetes using Prometheus, Grafana, Loki and Promtail.

---

# Architecture

```
                    +----------------+
                    |   Grafana      |
                    +-------+--------+
                            |
            +---------------+----------------+
            |                                |
     +------+-------+                +-------+------+
     | Prometheus   |                |    Loki      |
     +------+-------+                +-------+------+
            |                                ^
            |                                |
            |                         +------+------+
            |                         |  Promtail   |
            |                         +------+------+
            |                                |
            +--------------------------------+
                           Kubernetes
```

---

# Components

| Component | Purpose |
|-----------|---------|
| Metrics Server | Kubernetes resource metrics (CPU/Memory) |
| Prometheus | Metrics collection and storage |
| Grafana | Dashboards and visualization |
| Loki | Centralized log storage |
| Promtail | Collects Kubernetes logs and sends them to Loki |

---

# Install Metrics Server

```bash
helm repo add metrics-server https://kubernetes-sigs.github.io/metrics-server
helm repo update

helm install metrics-server metrics-server/metrics-server \
  -n kube-system \
  --set args="{--kubelet-insecure-tls}"
```

Verify:

```bash
kubectl top nodes
kubectl top pods -A
```

---

# Install Prometheus

```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update

helm install prometheus prometheus-community/prometheus \
  -n monitoring \
  --create-namespace \
  -f k8s/base/monitoring/prometheus/values.yaml
```

Verify:

```bash
kubectl get pods -n monitoring
```

---

# Install Grafana

```bash
helm repo add grafana https://grafana.github.io/helm-charts
helm repo update

helm install grafana grafana/grafana \
  -n monitoring \
  -f k8s/base/monitoring/grafana/values.yaml
```

Access:

```bash
kubectl port-forward svc/grafana 3001:80 -n monitoring
```

Login:

```
Username: admin
Password: admin123
```

---

# Install Loki

```bash
helm install loki grafana/loki \
  -n monitoring \
  -f k8s/base/monitoring/loki/values.yaml
```

Verify:

```bash
kubectl get pods -n monitoring
```

---

# Install Promtail

```bash
helm install promtail grafana/promtail \
  -n monitoring \
  -f k8s/base/monitoring/promtail/values.yaml
```

Verify:

```bash
kubectl get daemonset -n monitoring
```

---

# Configure Grafana

## Prometheus

Datasource URL

```
http://prometheus-server.monitoring.svc.cluster.local
```

---

## Loki

Datasource URL

```
http://loki.monitoring.svc.cluster.local:3100
```

---

# Metrics

The following metrics are exposed:

## API Gateway

- HTTP Requests
- Request Duration
- Process CPU
- Process Memory

Endpoint

```
/metrics
```

---

## User Service

- HTTP Requests
- Request Duration
- CPU
- Memory

Endpoint

```
/metrics
```

---

## Task Service

- gRPC Request Count
- gRPC Request Duration

Metrics Port

```
8000
```

---

## Notification Service

- gRPC Request Count
- gRPC Request Duration

Metrics Port

```
8000
```

---

# View Metrics

Prometheus

```
http://localhost:9090
```

Useful queries:

```
up
```

```
http_requests_total
```

```
grpc_requests_total
```

```
process_cpu_seconds_total
```

```
process_resident_memory_bytes
```

---

# View Logs

Open Grafana

```
Explore
```

Select

```
Loki
```

Examples:

All application logs

```logql
{namespace="devops-platform"}
```

API Gateway

```logql
{namespace="devops-platform",pod=~"api-gateway.*"}
```

User Service

```logql
{namespace="devops-platform",pod=~"user-service.*"}
```

Task Service

```logql
{namespace="devops-platform",pod=~"task-service.*"}
```

Notification Service

```logql
{namespace="devops-platform",pod=~"notification-service.*"}
```

---

# Generate Traffic

Example:

```bash
curl http://localhost/api/users/health
```

or

```bash
curl http://localhost/api/tasks
```

The requests will appear in:

- Prometheus
- Grafana
- Loki

---

# Verify Installation

```bash
kubectl get pods -n monitoring
```

Expected components:

- Prometheus
- Grafana
- Loki
- Promtail

---

# Project Structure

```
k8s/
└── base/
    └── monitoring/
        ├── grafana/
        │   └── values.yaml
        ├── prometheus/
        │   └── values.yaml
        ├── loki/
        │   └── values.yaml
        └── promtail/
            └── values.yaml

docs/
└── monitoring.md
```

---

# Outcome

The platform now provides:

- ✅ Kubernetes Metrics
- ✅ Application Metrics
- ✅ Resource Monitoring
- ✅ Dashboards with Grafana
- ✅ Centralized Logging with Loki
- ✅ Kubernetes Log Collection using Promtail
- ✅ Unified Observability Stack