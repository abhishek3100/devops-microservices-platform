# DevOps Microservices Platform - AI Context

## Project Goal

Production-grade Kubernetes microservices platform demonstrating modern DevOps practices.

Repository:
https://github.com/abhishek3100/devops-microservices-platform

The project is educational but built using production patterns.

---

# Stack

GitHub Actions
Docker
Kubernetes
Kustomize
Gateway API
Envoy Gateway
ArgoCD
ArgoCD ApplicationSets
ArgoCD Progressive Sync
ArgoCD Hooks
ArgoCD Image Updater
Prometheus
Grafana
Loki
Promtail

---

# Repository Structure

k8s/
    base/
        infrastructure/
        monitoring/
        platform/

    overlays/
        local/
        dev/

argocd/
    applications/
        infrastructure.yaml
        monitoring.yaml

    applicationsets/
        platform.yaml

    imageupdaters/
        platform.yaml
    
    projects
        platform-project.yaml
    root.yaml

.github/
    workflows/

---

# GitOps Design

Infrastructure is deployed separately.

Infrastructure contains:

- namespaces
- Gateway API
- RBAC
- shared platform resources

Monitoring is deployed separately.

Applications are deployed using ApplicationSets.

---

# ArgoCD Design

App of Apps pattern.

root
 ├── infrastructure
 ├── monitoring
 └── platform (ApplicationSet)

Progressive Sync order

local
↓

dev

---

# Sync Waves

Infrastructure:
wave -2

Monitoring:
wave -1

Platform:
wave 0

---

# Hooks

Hooks are implemented inside infrastructure because they require shared RBAC.

Current hooks

PreSync

- namespace validation

PostSync

- gateway health validation

RBAC for hooks is shared and deployed before jobs.

---

# Image Updater

Image updater watches ApplicationSet generated Applications.

ImageUpdater CR:

argocd/imageupdaters/platform.yaml

Applications contain annotations.

Write-back method:

git

Image updater creates:

.argocd-source-<application>.yaml

Do not manually edit these files.

---

# Image Strategy

GitHub Actions pushes

latest

and

<git-sha>

Images.

Deployments default to latest.

Image updater writes SHA versions back into Git.

---

# CI/CD

Push

↓

GitHub Actions

↓

Build Images

↓

Push GHCR

↓

Image Updater

↓

Commit updated image tags

↓

ArgoCD Sync

↓

Deploy

---

# Important Notes

Infrastructure resources must never be duplicated inside overlays.

Namespaces are owned by infrastructure.

Shared ConfigMaps and Secrets are owned by infrastructure.

RBAC is shared.

Gateway resources belong to infrastructure.

---

# Known Decisions

- Gateway moved from overlays to infrastructure.
- Shared Gateway avoids duplicate ownership.
- Hooks live in infrastructure.
- Image updater uses Git write-back.
- Progressive Sync uses ApplicationSet RollingSync.
- Kustomize overlays are environment specific.
- Monitoring is a separate ArgoCD Application.

---

# Future Roadmap

- Production overlay
- Vault integration
- External Secrets
- Argo Rollouts
- Canary Deployments
- HPA
- Cluster Autoscaler
- Kyverno
- Gatekeeper
- Network Policies
- Multi-cluster ArgoCD