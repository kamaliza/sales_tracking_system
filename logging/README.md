# Logging Setup - ELK Stack

This directory contains logging configurations for the Sales Tracking System using the ELK Stack (Elasticsearch, Logstash, Kibana).

## Components

- **Elasticsearch**: Log storage and indexing
- **Logstash**: Log processing and transformation
- **Kibana**: Log visualization and analysis
- **Filebeat**: Log collection from Kubernetes pods

## Prerequisites

1. Kubernetes cluster
2. kubectl configured
3. Helm (recommended for Elasticsearch)
4. Sufficient storage (50Gi+)

## Deployment Options

### Option 1: Using Helm (Recommended)

```bash
# Add Elastic Helm repository
helm repo add elastic https://helm.elastic.co
helm repo update

# Install Elasticsearch
helm install elasticsearch elastic/elasticsearch \
  --namespace sales-tracking \
  --set replicas=1 \
  --set resources.requests.cpu=1000m \
  --set resources.requests.memory=2Gi \
  --set volumeClaimTemplate.resources.requests.storage=50Gi

# Install Kibana
helm install kibana elastic/kibana \
  --namespace sales-tracking \
  --set elasticsearchHosts=http://elasticsearch-master:9200

# Install Filebeat
helm install filebeat elastic/filebeat \
  --namespace sales-tracking \
  -f logging/filebeat/filebeat-config.yaml
```

### Option 2: Manual Deployment

```bash
# Apply configurations
kubectl apply -f logging/elasticsearch/
kubectl apply -f logging/kibana/
kubectl apply -f logging/filebeat/
```

## Configuration

### Filebeat Configuration

Filebeat is configured to:
- Collect logs from all containers in the cluster
- Add Kubernetes metadata
- Send logs to Elasticsearch

Update `logging/filebeat/filebeat-config.yaml` with your Elasticsearch credentials.

### Log Collection

Filebeat automatically collects logs from:
- All pods in the `sales-tracking` namespace
- System logs (if configured)
- Application logs

## Access Kibana

```bash
# Port forward
kubectl port-forward svc/kibana 5601:5601 -n sales-tracking

# Access at http://localhost:5601
```

### Initial Setup

1. Open Kibana UI
2. Go to Management > Index Patterns
3. Create index pattern: `filebeat-*`
4. Select `@timestamp` as time field
5. Create index pattern

## Log Queries

### Find errors in backend

```
kubernetes.namespace: sales-tracking AND 
kubernetes.labels.app: backend AND 
level: error
```

### Find slow requests

```
kubernetes.namespace: sales-tracking AND 
message: *duration* AND 
message: *ms
```

### Filter by pod

```
kubernetes.pod.name: backend-abc123
```

## Log Retention

Configure log retention in Elasticsearch:

```yaml
# In Elasticsearch configuration
PUT /_template/logs
{
  "index_patterns": ["filebeat-*"],
  "settings": {
    "index.lifecycle.name": "logs-policy",
    "index.lifecycle.rollover_alias": "logs"
  }
}
```

## Resource Requirements

- **Elasticsearch**: 1000m CPU, 2Gi memory, 50Gi storage
- **Kibana**: 500m CPU, 1Gi memory
- **Filebeat**: 100m CPU, 200Mi memory per node

## Troubleshooting

### Logs not appearing in Kibana

1. Check Filebeat pods are running
2. Verify Elasticsearch is accessible
3. Check Filebeat logs: `kubectl logs -f daemonset/filebeat -n sales-tracking`
4. Verify index pattern exists in Kibana

### Elasticsearch cluster health

```bash
# Check cluster health
kubectl exec -it elasticsearch-master-0 -n sales-tracking -- curl http://localhost:9200/_cluster/health
```

### High disk usage

1. Set up index lifecycle management
2. Configure log retention policies
3. Consider using hot/warm/cold tiers

## Production Considerations

1. **High Availability**: Run Elasticsearch with 3+ nodes
2. **Security**: Enable X-Pack security features
3. **Backup**: Regular snapshots to S3/GCS
4. **Performance**: Tune JVM heap size
5. **Monitoring**: Monitor Elasticsearch cluster health

## Alternative: Loki Stack

For lighter-weight logging, consider Grafana Loki:

```bash
helm repo add grafana https://grafana.github.io/helm-charts
helm install loki grafana/loki-stack \
  --namespace sales-tracking \
  --set promtail.enabled=true
```

---

For monitoring setup, see [../monitoring/README.md](../monitoring/README.md)

