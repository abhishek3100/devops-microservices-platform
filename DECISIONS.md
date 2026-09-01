# ADR-001

Gateway moved to infrastructure.

Reason:

Avoid duplicate ownership between overlays.

Result:

One Gateway shared across all environments.

---

# ADR-002

Hooks moved into platform.

Reason:

Shared RBAC.

---

# ADR-003

Namespaces managed by infrastructure.

Reason:

Single ownership.

---

# ADR-004

ApplicationSet uses RollingSync.

Reason:

Environment promotion order.

---

# ADR-005

Image updater uses Git write-back.

Reason:

Git remains source of truth.