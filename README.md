# Sales Tracking System - DevOps Pipeline

A complete DevOps pipeline implementation for a Node.js + React Sales Tracking System, covering all phases from planning to monitoring.

## 🚀 Project Overview

This project demonstrates a comprehensive DevOps pipeline including:
- CI/CD with GitHub Actions
- Containerization with Docker
- Kubernetes orchestration
- Monitoring with Prometheus & Grafana
- Logging with ELK Stack
- Automated scaling and alerting

## 📋 Table of Contents

- [Architecture](#architecture)
- [Quick Start](#quick-start)
- [DevOps Phases](#devops-phases)
- [Documentation](#documentation)
- [Contributing](#contributing)

## 🏗️ Architecture

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   GitHub    │────▶│ GitHub Actions│────▶│  Kubernetes │
│  Repository │     │    CI/CD      │     │   Cluster   │
└─────────────┘     └──────────────┘     └─────────────┘
                            │                    │
                            ▼                    ▼
                    ┌──────────────┐     ┌─────────────┐
                    │   Docker Hub │     │ Prometheus  │
                    │   Registry   │     │   Grafana   │
                    └──────────────┘     └─────────────┘
```

## 🚦 Quick Start

### Prerequisites

- Node.js 18+
- Docker & Docker Compose
- Kubernetes cluster (minikube/kind/GKE/EKS/AKS)
- kubectl configured
- GitHub account

### Local Development

```bash
# Backend
cd backend
npm install
npm start

# Frontend (new terminal)
cd frontend
npm install
npm start
```

### Docker Build & Run

#### Option 1: Using Docker Compose (Recommended - Easiest)

This will build and run both frontend and backend together:

```bash
# Build and start all services
docker-compose up --build

# Run in detached mode (background)
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

**Access the application:**
- Frontend: http://localhost:80
- Backend API: http://localhost:5000

#### Option 2: Build Individual Images

```bash
# Build backend image
docker build -t sales-backend ./backend

# Build frontend image
docker build -t sales-frontend ./frontend
```

#### Option 3: Run Individual Containers

```bash
# Run backend container
docker run -d \
  --name sales-backend \
  -p 5000:5000 \
  -e NODE_ENV=production \
  -e PORT=5000 \
  sales-backend

# Run frontend container (after backend is running)
docker run -d \
  --name sales-frontend \
  -p 80:80 \
  -e REACT_APP_API_URL=http://localhost:5000 \
  sales-frontend
```

**Useful Docker commands:**
```bash
# List running containers
docker ps

# View container logs
docker logs sales-backend
docker logs sales-frontend

# Stop containers
docker stop sales-backend sales-frontend

# Remove containers
docker rm sales-backend sales-frontend

# Remove images
docker rmi sales-backend sales-frontend

# View all images
docker images
```

### Kubernetes Deployment

```bash
# Update image references in k8s manifests
# Then deploy
kubectl apply -k k8s/

# Check status
kubectl get pods -n sales-tracking
```

## 📚 DevOps Phases

### ✅ Phase 1: Plan
- [x] DevOps roadmap documented
- [x] Error budget policy defined
- [x] Resource requirements calculated

**See**: `docs/DEVOPS_ROADMAP.md`, `docs/ERROR_BUDGET_POLICY.md`

### ✅ Phase 2: Code
- [x] Git branching strategy (Git Flow)
- [x] Pull request template
- [x] Commit message standards (Conventional Commits)

**See**: `docs/GIT_WORKFLOW.md`, `.github/PULL_REQUEST_TEMPLATE.md`

### ✅ Phase 3: Build
- [x] Optimized multi-stage Dockerfiles
- [x] GitHub Actions CI pipeline
- [x] Automated builds on commit

**See**: `.github/workflows/ci.yml`, `backend/Dockerfile`, `frontend/Dockerfile`

### ✅ Phase 4: Test
- [x] Unit tests (Jest)
- [x] Integration tests (Supertest)
- [x] Test coverage reporting
- [x] Automated test execution

**See**: `backend/tests/`, `.github/workflows/ci.yml`

### ✅ Phase 5: Release
- [x] Semantic versioning
- [x] Git tagging automation
- [x] Docker image versioning
- [x] Release scripts
- [x] Docker Hub integration
- [x] Automated GitHub releases

**See**: `scripts/create-release.sh`, `scripts/create-release.ps1`, `.github/workflows/cd.yml`, `docs/RELEASE_SETUP_GUIDE.md`

### ✅ Phase 6: Deploy
- [x] Kubernetes manifests
- [x] Rolling update strategy
- [x] Service and ingress configuration
- [x] Resource limits

**See**: `k8s/`, `k8s/README.md`

### ✅ Phase 7: Operate
- [x] Prometheus metrics collection
- [x] Grafana dashboards
- [x] ELK stack configuration
- [x] Health check endpoints

**See**: `monitoring/`, `logging/`

### ✅ Phase 8: Monitor
- [x] Horizontal Pod Autoscaler (HPA)
- [x] Alerting rules
- [x] Feedback loop (alerts trigger actions)
- [x] Automated scaling

**See**: `k8s/hpa/`, `monitoring/prometheus/alert-rules.yaml`, `docs/MONITORING_FEEDBACK_LOOP.md`

## 📖 Documentation

All documentation is in the `docs/` directory:

- **[DevOps Roadmap](docs/DEVOPS_ROADMAP.md)**: Complete pipeline overview
- **[Error Budget Policy](docs/ERROR_BUDGET_POLICY.md)**: SLO/SLI definitions
- **[Resource Requirements](docs/RESOURCE_REQUIREMENTS.md)**: Kubernetes resource specs
- **[Git Workflow](docs/GIT_WORKFLOW.md)**: Branching and commit standards
- **[Monitoring Feedback Loop](docs/MONITORING_FEEDBACK_LOOP.md)**: Alert automation

## 🔧 Configuration

### Environment Variables

**Backend** (`backend/.env`):
```env
NODE_ENV=production
PORT=5000
```

**Frontend** (`frontend/.env`):
```env
REACT_APP_API_URL=http://backend-service:5000
```

### GitHub Secrets

Required secrets for CI/CD:
- `DOCKER_USERNAME`: Your Docker Hub username
- `DOCKER_PASSWORD`: Docker Hub access token (create at https://hub.docker.com/settings/security)
- `KUBECONFIG_STAGING`: Base64 encoded kubeconfig for staging (optional)
- `KUBECONFIG_PRODUCTION`: Base64 encoded kubeconfig for production (optional)

**See**: `docs/RELEASE_SETUP_GUIDE.md` for detailed setup instructions

### Kubernetes Secrets

```bash
# Create image pull secret
kubectl create secret docker-registry ghcr-secret \
  --docker-server=ghcr.io \
  --docker-username=YOUR_USERNAME \
  --docker-password=YOUR_TOKEN \
  -n sales-tracking
```

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test

# Integration tests
cd backend
npm test -- tests/integration.test.js
```

## 📊 Monitoring

### Access Dashboards

**Prometheus**:
```bash
kubectl port-forward svc/prometheus 9090:9090 -n sales-tracking
# http://localhost:9090
```

**Grafana**:
```bash
kubectl port-forward svc/grafana 3000:3000 -n sales-tracking
# http://localhost:3000 (admin/admin)
```

**Kibana**:
```bash
kubectl port-forward svc/kibana 5601:5601 -n sales-tracking
# http://localhost:5601
```

## 🚢 Deployment

### Staging

Merges to `develop` branch automatically deploy to staging.

### Production

Tagged releases (`v*`) automatically deploy to production:

**Linux/Mac:**
```bash
# Create release
./scripts/create-release.sh patch

# Push commits and tag
git push origin main
git push origin v1.0.1
```

**Windows (PowerShell):**
```powershell
# Create release
.\scripts\create-release.ps1 -VersionType patch

# Push commits and tag
git push origin main
git push origin v1.0.1
```

**What happens automatically:**
1. GitHub Actions builds Docker images
2. Images are pushed to Docker Hub with version tags
3. GitHub Release is created automatically
4. Production deployment triggers (if configured)

## 🔄 CI/CD Pipeline

### CI Pipeline (`.github/workflows/ci.yml`)

Triggers on:
- Push to `main` or `develop`
- Pull requests

Steps:
1. Lint code
2. Run tests
3. Build Docker images
4. Security scanning
5. Upload coverage

### CD Pipeline (`.github/workflows/cd.yml`)

Triggers on:
- Push to `main`
- Tags starting with `v*`
- Manual workflow dispatch

Steps:
1. Build and push images
2. Deploy to staging
3. Deploy to production (on tag)
4. Create GitHub release

## 📈 Scaling

### Manual Scaling

```bash
kubectl scale deployment backend --replicas=5 -n sales-tracking
```

### Automatic Scaling (HPA)

HPA automatically scales based on CPU/memory:
- Backend: 2-10 pods
- Frontend: 2-5 pods

## 🐛 Troubleshooting

### Pods not starting
```bash
kubectl describe pod <pod-name> -n sales-tracking
kubectl logs <pod-name> -n sales-tracking
```

### CI/CD failures
Check GitHub Actions logs: `Actions` tab in GitHub

### Monitoring not working
```bash
# Check Prometheus targets
kubectl port-forward svc/prometheus 9090:9090 -n sales-tracking
# Visit http://localhost:9090/targets
```

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/my-feature`
2. Make changes and commit: `git commit -m "feat: add feature"`
3. Push and create PR: `git push origin feature/my-feature`
4. Follow PR template guidelines

See `docs/GIT_WORKFLOW.md` for detailed workflow.

## 📝 License

This project is for educational purposes as part of a CAT (Computer Applications Technology) practice assignment.

## 🙏 Acknowledgments

- Prometheus & Grafana for monitoring
- Kubernetes for orchestration
- GitHub Actions for CI/CD
- Docker for containerization

## 🎯 What's Next?

All 8 phases of the DevOps pipeline are complete! Here's what to do next:

### Immediate Next Steps

1. **Review Completion Status**
   - Check `docs/COMPLETION_CHECKLIST.md` for detailed status
   - Verify all phases are implemented

2. **Set Up Infrastructure**
   - Follow `docs/IMPLEMENTATION_GUIDE.md` for step-by-step setup
   - Choose your Kubernetes platform (local or cloud)
   - Configure GitHub secrets and branch protection

3. **Test the Pipeline**
   - Push code and verify CI runs
   - Test Docker builds locally
   - Deploy to Kubernetes
   - Verify monitoring works

4. **Finalize Documentation**
   - Update README with actual values
   - Add screenshots
   - Create presentation materials

### Implementation Priority

**High Priority:**
- [ ] Set up Kubernetes cluster (local or cloud)
- [ ] Configure GitHub secrets
- [ ] Test CI/CD pipeline end-to-end
- [ ] Deploy application to Kubernetes

**Medium Priority:**
- [ ] Set up monitoring (Prometheus/Grafana)
- [ ] Configure logging (ELK stack)
- [ ] Test scaling and alerts
- [ ] Create demo/presentation

**Low Priority:**
- [ ] Optimize performance
- [ ] Add advanced features
- [ ] Production hardening

### Quick Links

- **Completion Checklist**: [`docs/COMPLETION_CHECKLIST.md`](docs/COMPLETION_CHECKLIST.md)
- **Implementation Guide**: [`docs/IMPLEMENTATION_GUIDE.md`](docs/IMPLEMENTATION_GUIDE.md)
- **Troubleshooting**: [`docs/DOCKER_BUILD_TROUBLESHOOTING.md`](docs/DOCKER_BUILD_TROUBLESHOOTING.md)
- **Setup Instructions**: [`docs/SETUP_INSTRUCTIONS.md`](docs/SETUP_INSTRUCTIONS.md)

### Estimated Time to Full Implementation

- **Basic Setup**: 1-2 hours
- **Kubernetes Deployment**: 30 minutes
- **Monitoring Setup**: 30 minutes
- **Testing & Validation**: 1 hour
- **Documentation**: 30 minutes

**Total**: ~3-4 hours for complete implementation

---

**Last Updated**: 2024  
**Version**: 1.0.0  
**Status**: ✅ All 8 Phases Complete - Ready for Implementation
