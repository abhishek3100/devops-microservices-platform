# Argo CD GitOps Setup

## Overview

This project uses **Argo CD** as the GitOps engine to continuously deploy Kubernetes resources from Git.

The deployment follows the **App of Apps** pattern:

```
GitHub Repository
        │
        ▼
 Root Application
        │
        ├───────────────┐
        ▼               ▼
Infrastructure     Monitoring
        │
        ▼
 ApplicationSet
        │
        ├───────────┐
        ▼           ▼
 platform-local   platform-dev
```

Everything deployed to the cluster originates from Git.

---

# Repository Structure

```
argocd/
│
├── applications/
│   ├── infrastructure.yaml
│   ├── monitoring.yaml
│   └── root.yaml
│
├── applicationsets/
│   └── platform.yaml
│
└── imageupdaters/
    └── platform.yaml

k8s/
├── base/
│   ├── infrastructure/
│   ├── monitoring/
│   ├── gateway/
│   └── services/
│
└── overlays/
    ├── local/
    └── dev/
```

---

# App of Apps Pattern

Instead of creating every Application manually, a single Root Application manages all child Applications.

```
Root
 │
 ├── Infrastructure
 ├── Monitoring
 └── Platform ApplicationSet
```

Benefits

- Single bootstrap
- Easy disaster recovery
- Everything stored in Git
- Declarative management

---

# Infrastructure Application

Responsible for cluster-wide resources.

Examples

- Namespaces
- Gateway API
- Envoy Gateway
- Shared ConfigMaps
- Shared Secrets
- RBAC
- Hook resources

Sync Wave

```
-2
```

Infrastructure deploys before everything else.

---

# Monitoring Application

Deploys

- Prometheus
- Grafana
- ServiceMonitors

Sync Wave

```
-1
```

Monitoring is available before workloads.

---

# Platform ApplicationSet

Instead of manually creating

```
platform-local
platform-dev
platform-stage
platform-prod
```

ApplicationSet generates them automatically.

Generator

```
List Generator
```

Current environments

```
local
dev
```

Generated Applications

```
platform-local
platform-dev
```

Adding a new environment only requires:

```
- env: stage
```

No new Application YAML is needed.

---

# Progressive Syncs

ApplicationSet uses

```
RollingSync
```

Deployment order

```
local
↓

dev
↓

(stage)

↓

prod
```

Purpose

Avoid deploying every environment simultaneously.

Useful for production promotion.

---

# Sync Waves

Deployment order inside ArgoCD

```
Infrastructure      -2

Monitoring          -1

Platform             0
```

Resources are deployed in dependency order.

---

# Kustomize Overlays

Each environment has its own overlay.

```
base/

↓

overlay/local

↓

overlay/dev
```

Environment-specific changes

- Namespace
- Replica count
- Image tags
- ConfigMaps
- Secrets

---

# ArgoCD Hooks

Hooks execute Kubernetes Jobs before or after deployments.

Implemented

## PreSync

Runs before deployment.

Purpose

- Validate cluster
- Verify prerequisites

Example

```
kubectl get namespace
```

---

## PostSync

Runs after deployment.

Purpose

Verify application health.

Example

```
curl http://api-gateway:3000/health
```

---

Hook lifecycle

```
Deployment

↓

PreSync Job

↓

Deploy Resources

↓

PostSync Job

↓

Delete Hook
```

Deletion policy

```
HookSucceeded
```

Completed Jobs are automatically removed.

---

# RBAC for Hooks

Hooks require permissions.

Created resources

```
ServiceAccount

Role

RoleBinding
```

Each namespace contains

```
hook-runner
```

Jobs execute using

```
serviceAccountName: hook-runner
```

Without RBAC

```
Forbidden

serviceaccount not found

cannot get namespaces
```

---

# ArgoCD Image Updater

Purpose

Automatically updates Kubernetes image tags when new container images appear.

Flow

```
GitHub Actions

↓

Build Docker Image

↓

Push to GHCR

↓

Image Updater detects new image

↓

Commits .argocd-source*.yaml

↓

Git changes

↓

ArgoCD Sync

↓

Rolling Update
```

No manual image updates are required.

---

# Image Update Strategy

Current strategy

```
newest-build
```

Tracked images

- api-gateway
- frontend
- user-service
- task-service
- notification-service

Annotations are stored on the generated Applications.

Example

```
argocd-image-updater.argoproj.io/image-list
```

---

# Write Back Method

Configured as

```
git
```

Image Updater commits directly into Git.

Generated file

```
.argocd-source-platform-local.yaml
```

Example

```
kustomize:

  images:

  - ghcr.io/.../api-gateway:6b561f7
```

This file overrides image tags without modifying original manifests.

---

# Why not edit deployment.yaml?

Original manifests stay clean.

```
deployment.yaml

↓

latest
```

Actual deployed image

```
.argocd-source-platform-local.yaml
```

Advantages

- Git history
- Easy rollback
- Automatic updates
- Clean manifests

---

# CI/CD Flow

Developer

↓

Push Code

↓

GitHub Actions

↓

Build Docker Images

↓

Push GHCR

↓

Image Updater detects new image

↓

Commit image tag

↓

ArgoCD detects Git change

↓

Deploy Kubernetes

↓

Run PostSync health check

---

# Deployment Flow

```
Git Push

↓

GitHub Actions

↓

Docker Build

↓

GHCR

↓

Image Updater

↓

Git Commit

↓

ArgoCD Sync

↓

Infrastructure

↓

Monitoring

↓

Platform

↓

PreSync Hook

↓

Deploy

↓

PostSync Hook

↓

Healthy
```

---

# Benefits

- Fully GitOps
- Declarative deployments
- Automatic reconciliation
- Environment promotion
- Progressive deployments
- Health verification
- Automatic image updates
- Easy rollback
- Minimal manual intervention

---

# Troubleshooting

## ImageUpdater shows 0 images

Check

```
kubectl get application platform-local \
-n argocd \
-o jsonpath='{.status.summary.images}'
```

---

## Hook not executed

Verify

```
kubectl describe application platform-local
```

Check Sync Operation.

---

## Hook fails

Check

```
kubectl logs job/<hook-name>
```

or

```
kubectl describe job <hook-name>
```

---

## ImageUpdater logs

```
kubectl logs deploy/argocd-image-updater-controller \
-n argocd
```

---

## Force reconciliation

```
kubectl annotate application platform-local \
argocd-image-updater.argoproj.io/refresh=true \
--overwrite
```

---

## Check ImageUpdater

```
kubectl get imageupdaters -n argocd
```

---

## Check generated image overrides

```
.argocd-source-platform-local.yaml
```

---

# Future Improvements

- Production environment
- Blue/Green deployments
- Canary deployments
- Notifications (Slack/Teams)
- Argo Rollouts
- Policy enforcement (OPA/Gatekeeper)
- Vault/External Secrets integration
- Multi-cluster GitOps
- Signed image verification (Cosign)