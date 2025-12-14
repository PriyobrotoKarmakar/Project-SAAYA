# Kubernetes Deployment Guide

## 📦 Deploy to Kubernetes

### 1. Apply ConfigMap (Do this FIRST)

```bash
kubectl apply -f k8s/configmap.yaml
```

### 2. Apply Deployments and Services

```bash
kubectl apply -f k8s/saaya-deployment.yaml
```

### 3. Verify Deployment

```bash
# Check pods
kubectl get pods

# Check services
kubectl get svc

# Check backend logs
kubectl logs -l app=saaya-backend

# Check frontend logs
kubectl logs -l app=saaya-frontend
```

## 🔄 Update IP Address (When EC2 Changes)

### Option 1: Edit ConfigMap Directly

```bash
kubectl edit configmap saaya-config
```

Change `BACKEND_IP` and `VITE_BACKEND_IP` to your new IP, save and exit.

### Option 2: Update ConfigMap File

1. Edit `k8s/configmap.yaml`:
   ```yaml
   BACKEND_IP: "YOUR_NEW_IP"
   VITE_BACKEND_IP: "YOUR_NEW_IP"
   ```

2. Apply changes:
   ```bash
   kubectl apply -f k8s/configmap.yaml
   ```

### Restart Pods to Pick Up New Config

```bash
kubectl rollout restart deployment saaya-backend
kubectl rollout restart deployment saaya-frontend
```

## 🚀 Complete Deployment Flow

When you get a new EC2 IP:

1. **Update ConfigMap:**
   ```bash
   # Edit the file
   nano k8s/configmap.yaml
   
   # Apply changes
   kubectl apply -f k8s/configmap.yaml
   ```

2. **Restart Deployments:**
   ```bash
   kubectl rollout restart deployment saaya-backend
   kubectl rollout restart deployment saaya-frontend
   ```

3. **Verify:**
   ```bash
   kubectl logs -l app=saaya-backend
   ```

You should see:
```
📡 Server running on: http://YOUR_NEW_IP:5000
```

## 🔍 Troubleshooting

**Backend still shows localhost?**
```bash
# Check if ConfigMap exists
kubectl get configmap saaya-config

# Check ConfigMap content
kubectl describe configmap saaya-config

# Check pod environment variables
kubectl exec -it <pod-name> -- env | grep BACKEND
```

**Frontend not connecting to backend?**
- Frontend needs to be rebuilt with new IP baked in
- Or use runtime config (advanced)
