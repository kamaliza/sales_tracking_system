# Monitoring Setup - Prometheus & Grafana

This directory contains monitoring configurations for the Sales Tracking System using Prometheus and Grafana.

## Components

- **Prometheus**: Metrics collection and alerting
- **Grafana**: Visualization and dashboards
- **Alertmanager**: Alert routing and notification (optional)

## Prerequisites

1. Kubernetes cluster
2. kubectl configured
3. Sufficient resources (see resource requirements)

## Deployment

### 1. Deploy Prometheus

```bash
# Apply Prometheus configuration
kubectl apply -f monitoring/prometheus/prometheus-config.yaml
kubectl apply -f monitoring/prometheus/alert-rules.yaml
kubectl apply -f monitoring/prometheus/deployment.yaml

# Verify
kubectl get pods -n sales-tracking | grep prometheus
kubectl get svc -n sales-tracking | grep prometheus
```

### 2. Deploy Grafana

```bash
# Create Grafana credentials secret (update password!)
kubectl create secret generic grafana-credentials \
  --from-literal=admin-user=admin \
  --from-literal=admin-password=YOUR_SECURE_PASSWORD \
  -n sales-tracking

# Apply Grafana configuration
kubectl apply -f monitoring/grafana/dashboard-config.yaml
kubectl apply -f monitoring/grafana/deployment.yaml

# Verify
kubectl get pods -n sales-tracking | grep grafana
```

### 3. Access Dashboards

#### Prometheus
```bash
# Port forward
kubectl port-forward svc/prometheus 9090:9090 -n sales-tracking

# Access at http://localhost:9090
```

#### Grafana
```bash
# Port forward
kubectl port-forward svc/grafana 3000:3000 -n sales-tracking

# Access at http://localhost:3000
# Default credentials: admin/admin (change in production!)
```

## Metrics Collection

### Application Metrics

To expose custom metrics from your application, add Prometheus client libraries:

#### Backend (Node.js)
```javascript
const promClient = require('prom-client');

// Create metrics
const httpRequestDuration = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status']
});

const httpRequestsTotal = new promClient.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status']
});

// Expose metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', promClient.register.contentType);
  res.end(await promClient.register.metrics());
});
```

#### Frontend (React)
For frontend metrics, use a service like StatsD or send metrics to backend.

## Alerting

Alerts are configured in `prometheus/alert-rules.yaml`. Key alerts include:

- **HighErrorRate**: Error rate exceeds 0.1%
- **HighResponseTime**: p95 response time > 300ms
- **LowAvailability**: Availability < 99.9%
- **HighCPUUsage**: CPU usage > 85%
- **HighMemoryUsage**: Memory usage > 90%
- **PodCrashLooping**: Pod restarting frequently

### Alertmanager (Optional)

To route alerts to Slack/Email/PagerDuty:

```bash
# Install Alertmanager
kubectl apply -f monitoring/alertmanager/
```

## Dashboards

### Pre-configured Dashboards

1. **Sales Tracking System Dashboard**: Main application metrics
2. **Kubernetes Cluster Dashboard**: Cluster-level metrics
3. **Error Budget Dashboard**: SLO/SLI tracking

### Custom Dashboards

Import JSON dashboards or create new ones in Grafana UI.

## Troubleshooting

### Prometheus not scraping metrics

```bash
# Check Prometheus targets
kubectl port-forward svc/prometheus 9090:9090 -n sales-tracking
# Visit http://localhost:9090/targets

# Check service discovery
kubectl logs deployment/prometheus -n sales-tracking
```

### Grafana can't connect to Prometheus

```bash
# Add Prometheus data source in Grafana
# URL: http://prometheus:9090
# Access: Server (default)
```

### Metrics not appearing

1. Verify application exposes `/metrics` endpoint
2. Check Prometheus service discovery configuration
3. Verify pod labels match scrape config
4. Check Prometheus logs for errors

## Resource Usage

- **Prometheus**: ~500m CPU, 2Gi memory, 20Gi storage
- **Grafana**: ~100m CPU, 256Mi memory, 10Gi storage

## Production Considerations

1. **High Availability**: Run Prometheus in HA mode
2. **Retention**: Adjust retention period based on storage
3. **Security**: Use RBAC, network policies, and TLS
4. **Backup**: Backup Prometheus data regularly
5. **Scaling**: Use Thanos or Cortex for long-term storage

---

For logging setup, see [../logging/README.md](../logging/README.md)

