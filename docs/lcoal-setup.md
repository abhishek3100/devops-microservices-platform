# Local Kubernetes Setup

This document describes how to bootstrap the local development Kubernetes cluster used by the **DevOps Microservices Platform**.

## Prerequisites

- Docker Desktop (Kubernetes enabled)
- kubectl
- Helm
- Git
- Docker CLI

Verify the cluster:

```bash
kubectl cluster-info
kubectl get nodes
```

Expected:

```
NAME                    STATUS   ROLES
desktop-control-plane   Ready    control-plane
desktop-worker          Ready
```

---

# 1. Enable Kubernetes

Enable Kubernetes from Docker Desktop:

```
Settings
→ Kubernetes
→ Enable Kubernetes
```

Verify:

```bash
kubectl get nodes
```

---

# 2. Install Metrics Server

Metrics Server provides CPU and memory metrics required by:

- `kubectl top`
- Horizontal Pod Autoscaler (HPA)

Install:

```bash
kubectl apply -f \
https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml
```

Patch for Docker Desktop:

```bash
kubectl patch deployment metrics-server \
  -n kube-system \
  --type='json' \
  -p='[
    {
      "op":"add",
      "path":"/spec/template/spec/containers/0/args/-",
      "value":"--kubelet-insecure-tls"
    }
  ]'
```

Verify:

```bash
kubectl top nodes
kubectl top pods -A
```

---

# 3. Install Gateway API CRDs

```bash
kubectl apply -f \
https://github.com/kubernetes-sigs/gateway-api/releases/latest/download/standard-install.yaml
```

Verify:

```bash
kubectl get crd | grep gateway
```

---

# 4. Install Envoy Gateway

Add the Helm repository:

```bash
helm install eg \
oci://docker.io/envoyproxy/gateway-helm \
--version v1.9.1 \
-n envoy-gateway-system \
--create-namespace
```

Install the quickstart resources:

```bash
kubectl apply -f \
https://github.com/envoyproxy/gateway/releases/download/v1.9.1/quickstart.yaml
```

Verify:

```bash
kubectl get gatewayclass
kubectl get gateway -A
```

Expected:

```
NAME
eg
```

---

# 5. Deploy Platform

Deploy the application:

```bash
kubectl apply -k k8s/overlays/local
```

Verify:

```bash
kubectl get pods -n devops-platform
```

---

# 6. Verify Gateway

```bash
kubectl get gateway -n devops-platform
```

Expected:

```
NAME               CLASS   PROGRAMMED
platform-gateway   eg      True
```

Check routes:

```bash
kubectl get httproute -n devops-platform
```

---

# 7. Access the Application

Docker Desktop exposes the Envoy Gateway through localhost.

Open:

```
http://localhost
```

---

# Useful Commands

Pods

```bash
kubectl get pods -n devops-platform
```

Services

```bash
kubectl get svc -n devops-platform
```

Gateway

```bash
kubectl get gateway -n devops-platform
kubectl describe gateway platform-gateway -n devops-platform
```

Routes

```bash
kubectl get httproute -n devops-platform
kubectl describe httproute api-route -n devops-platform
```

Metrics

```bash
kubectl top nodes
kubectl top pods -n devops-platform
```

Logs

```bash
kubectl logs -f deployment/api-gateway -n devops-platform
```

---

# Troubleshooting

## Gateway has no address

Check:

```bash
kubectl describe gateway platform-gateway -n devops-platform
```

Look for:

```
Programmed=True
```

---

## Pods not starting

```bash
kubectl describe pod <pod-name> -n devops-platform
```

---

## Images cannot be pulled

Verify:

- Image exists in GitHub Container Registry
- `imagePullSecrets` configured (if required)
- Image tag is correct

---

## Metrics unavailable

Restart Metrics Server:

```bash
kubectl rollout restart deployment metrics-server -n kube-system
```

Verify:

```bash
kubectl top nodes
```