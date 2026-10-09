# AegisNT Docker & OCI Container Deployment Guide

**Document ID:** DOCKER-DEPLOY-AEGIS-24H2  
**Target Runtimes:** Docker Engine 27+, Podman 5+, Kubernetes 1.30+  
**Image Repository:** `ghcr.io/aegisnt/enterprise-desktop:24h2`  

---

## 1. Container Architecture Overview

AegisNT is packaged as a standard OCI-compliant container image capable of running on bare-metal Kubernetes, edge micro-datacenters, AWS ECS/EKS, Azure Container Instances, and local workstation environments.

### Supported Operating Modes:
1. **Interactive WebRTC Desktop Streaming:** Delivers a 60FPS Windows 11 Fluent desktop over HTTPS/WebSockets via port 3000.
2. **Headless Microkernel API Node:** Lean distroless container (<180MB RAM) exposing the AegisNT REST and RPC management mesh.
3. **GPU-Accelerated Virtualization Worker:** Uses direct hardware passthrough (`/dev/dri`, `/dev/kvm`) for CAD, 3D rendering, and hardware-accelerated Win32 applications.

---

## 2. Docker Compose Production Manifest

Create `docker-compose.enterprise.yml`:

```yaml
version: '3.8'

services:
  aegisnt-enterprise:
    image: ghcr.io/aegisnt/enterprise-desktop:24h2
    container_name: aegisnt_workstation_node
    restart: always
    ports:
      - "3000:3000"     # WebRTC Low-Latency UI
      - "3389:3389"     # RDP Enhanced Subsystem
      - "8443:8443"     # Microkernel Admin API
    devices:
      - /dev/kvm:/dev/kvm:rwm
      - /dev/dri:/dev/dri:rwm
    environment:
      - AEGIS_SECURITY_PROFILE=ENTERPRISE_L2
      - WINE_SANDBOX_STRICT=1
      - VIRTIO_IOURING_ENABLED=1
      - AEGIS_HOTPATCH_DAEMON=1
    deploy:
      resources:
        limits:
          cpus: '8.0'
          memory: 16G
        reservations:
          cpus: '4.0'
          memory: 8G
    security_opt:
      - no-new-privileges:true
      - seccomp=/etc/aegisnt/seccomp-hardened.json
    tmpfs:
      - /tmp:rw,noexec,nosuid,size=2g
    healthcheck:
      test: ["CMD", "/bin/aegis-cli", "health", "--vtl1-check"]
      interval: 15s
      timeout: 3s
      retries: 3
      start_period: 10s
```

Run with:
```bash
docker compose -f docker-compose.enterprise.yml up -d
```

---

## 3. Rootless Podman & Kubernetes Manifests

### 3.1 Rootless Podman CLI
Run without root privileges using non-root user UID 10001:
```bash
podman run -d \
  --name aegis-rootless \
  --user 10001:10001 \
  --cap-drop ALL \
  --cap-add NET_BIND_SERVICE \
  --read-only \
  -p 3000:3000 \
  ghcr.io/aegisnt/enterprise-desktop:24h2
```

### 3.2 Kubernetes Deployment Manifest
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: aegisnt-desktop-cluster
  namespace: enterprise-apps
spec:
  replicas: 3
  selector:
    matchLabels:
      app: aegisnt-desktop
  template:
    metadata:
      labels:
        app: aegisnt-desktop
    spec:
      securityContext:
        runAsNonRoot: true
        runAsUser: 10001
        seccompProfile:
          type: RuntimeDefault
      containers:
        - name: aegis-os
          image: ghcr.io/aegisnt/enterprise-desktop:24h2
          resources:
            requests:
              cpu: "2"
              memory: 4Gi
            limits:
              cpu: "8"
              memory: 16Gi
          ports:
            - containerPort: 3000
```
