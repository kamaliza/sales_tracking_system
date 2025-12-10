# Kubernetes Deployment Manifests

This directory contains Kubernetes manifests for deploying the Sales Tracking System.

## Structure

```
k8s/
├── namespace.yaml          # Namespace definition
├── backend/
│   ├── deployment.yaml     # Backend deployment
│   └── service.yaml        # Backend service
├── frontend/
│   ├── deployment.yaml     # Frontend deployment
│   └── service.yaml        # Frontend service
├── hpa/
│   ├── backend-hpa.yaml    # Backend horizontal pod autoscaler
│   └── frontend-hpa.yaml   # Frontend horizontal pod autoscaler
├── pdb/
│   ├── backend-pdb.yaml    # Backend pod disruption budget
│   └── frontend-pdb.yaml   # Frontend pod disruption budget
├── ingress.yaml            # Ingress configuration
└── kustomization.yaml      # Kustomize configuration
```

## Prerequisites

1. Kubernetes cluster (v1.20+)
2. kubectl configured
3. Docker images pushed to registry
4. Ingress controller installed (nginx-ingress)
5. cert-manager installed (for TLS)

## Deployment Steps

### 1. Update Image References

Before deploying, update the image references in the deployment files:

```bash
# Replace YOUR_USERNAME with your GitHub username or Docker Hub username
sed -i 's/YOUR_USERNAME/your-actual-username/g' k8s/backend/deployment.yaml
sed -i 's/YOUR_USERNAME/your-actual-username/g' k8s/frontend/deployment.yaml
```

### 2. Update Ingress Hosts

Update the ingress.yaml file with your actual domain names:

```bash
# Replace example.com with your domain
sed -i 's/example.com/your-domain.com/g' k8s/ingress.yaml
```

### 3. Deploy Using kubectl

```bash
# Apply all manifests
kubectl apply -k k8s/

# Or apply individually
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/backend/
kubectl apply -f k8s/frontend/
kubectl apply -f k8s/ingress.yaml
kubectl apply -f k8s/hpa/
kubectl apply -f k8s/pdb/
```

### 4. Verify Deployment

```bash
# Check pods
kubectl get pods -n sales-tracking

# Check services
kubectl get svc -n sales-tracking

# Check ingress
kubectl get ingress -n sales-tracking

# Check HPA
kubectl get hpa -n sales-tracking

# View logs
kubectl logs -f deployment/backend -n sales-tracking
kubectl logs -f deployment/frontend -n sales-tracking
```

## Rolling Updates

The deployments are configured with rolling update strategy:

- **maxSurge:** 1 (can have 1 extra pod during update)
- **maxUnavailable:** 0 (ensures availability during update)

To trigger a rolling update:

```bash
# Update image
kubectl set image deployment/backend backend=ghcr.io/USERNAME/sales_tracking_system/backend:v1.0.1 -n sales-tracking
kubectl set image deployment/frontend frontend=ghcr.io/USERNAME/sales_tracking_system/frontend:v1.0.1 -n sales-tracking

# Watch rollout
kubectl rollout status deployment/backend -n sales-tracking
kubectl rollout status deployment/frontend -n sales-tracking

# Rollback if needed
kubectl rollout undo deployment/backend -n sales-tracking
```

## Scaling

### Manual Scaling

```bash
# Scale backend
kubectl scale deployment backend --replicas=5 -n sales-tracking

# Scale frontend
kubectl scale deployment frontend --replicas=3 -n sales-tracking
```

### Automatic Scaling (HPA)

HPA is configured to automatically scale based on CPU and memory usage:

- **Backend:** Scales between 2-10 pods (CPU: 70%, Memory: 80%)
- **Frontend:** Scales between 2-5 pods (CPU: 70%)

Check HPA status:

```bash
kubectl describe hpa backend-hpa -n sales-tracking
kubectl describe hpa frontend-hpa -n sales-tracking
```

## Resource Requirements

See [RESOURCE_REQUIREMENTS.md](../docs/RESOURCE_REQUIREMENTS.md) for detailed resource specifications.

## Troubleshooting

### Pods not starting

```bash
# Check pod events
kubectl describe pod <pod-name> -n sales-tracking

# Check logs
kubectl logs <pod-name> -n sales-tracking
```

### Image pull errors

```bash
# Check image pull secrets
kubectl get secrets -n sales-tracking

# Create image pull secret for GitHub Container Registry
kubectl create secret docker-registry ghcr-secret \
  --docker-server=ghcr.io \
  --docker-username=YOUR_USERNAME \
  --docker-password=YOUR_GITHUB_TOKEN \
  --namespace=sales-tracking

# Add to deployment
kubectl patch deployment backend -n sales-tracking -p '{"spec":{"template":{"spec":{"imagePullSecrets":[{"name":"ghcr-secret"}]}}}}'
```

### Service not accessible

```bash
# Check service endpoints
kubectl get endpoints -n sales-tracking

# Test service from within cluster
kubectl run -it --rm debug --image=busybox --restart=Never -- sh
# Then: wget -O- http://backend-service:5000/health
```

## Blue-Green Deployment (Alternative)

For zero-downtime deployments, you can implement blue-green deployment:

```bash
# Deploy new version as "green"
kubectl apply -f k8s/backend/deployment-green.yaml

# Wait for green to be ready
kubectl wait --for=condition=available deployment/backend-green -n sales-tracking

# Switch service to green
kubectl patch service backend-service -n sales-tracking -p '{"spec":{"selector":{"version":"green"}}}'

# Monitor and rollback if needed
# If all good, delete blue deployment
kubectl delete deployment backend-blue -n sales-tracking
```

---

For more information, see the main [README.md](../README.md).

