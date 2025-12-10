# Monitoring Feedback Loop - Phase 8

This document describes the monitoring feedback loop implementation where alerts trigger automated responses.

## Overview

The feedback loop connects monitoring alerts to automated actions, enabling self-healing capabilities and proactive response to issues.

## Architecture

```
Prometheus → Alertmanager → Webhook → GitHub Actions → Kubernetes Actions
```

## Components

### 1. Prometheus Alert Rules

Alerts are defined in `monitoring/prometheus/alert-rules.yaml`:

- **HighErrorRate**: Error rate > 0.1%
- **HighCPUUsage**: CPU usage > 85%
- **PodCrashLooping**: Pod restarting frequently
- **DeploymentFailed**: Deployment has unavailable replicas

### 2. Alertmanager

Routes alerts to webhook receivers configured in `monitoring/alertmanager/config.yaml`.

### 3. Webhook Receiver

A webhook service receives alerts and triggers GitHub Actions workflows via repository dispatch events.

### 4. GitHub Actions

The workflow `monitor-triggered-deploy.yml` responds to alerts:

- **High CPU**: Scales up deployments
- **Deployment Failed**: Rolls back to previous version
- **Pod Crash Loop**: Restarts affected pods
- **High Error Rate**: Scales up and notifies team

## Setup Instructions

### Step 1: Deploy Alertmanager

```bash
kubectl apply -f monitoring/alertmanager/config.yaml
kubectl apply -f monitoring/alertmanager/deployment.yaml
```

### Step 2: Configure Webhook Receiver

Create a webhook service that:
1. Receives alerts from Alertmanager
2. Formats them for GitHub API
3. Triggers repository dispatch events

Example webhook receiver (Python Flask):

```python
from flask import Flask, request, jsonify
import requests
import os

app = Flask(__name__)
GITHUB_TOKEN = os.getenv('GITHUB_TOKEN')
GITHUB_REPO = os.getenv('GITHUB_REPO')  # owner/repo

@app.route('/webhook', methods=['POST'])
def webhook():
    alert = request.json
    
    # Map alert labels to action type
    alert_type = map_alert_to_action(alert)
    
    # Trigger GitHub Actions workflow
    url = f"https://api.github.com/repos/{GITHUB_REPO}/dispatches"
    headers = {
        'Authorization': f'token {GITHUB_TOKEN}',
        'Accept': 'application/vnd.github.v3+json'
    }
    data = {
        'event_type': 'monitor-alert',
        'client_payload': {
            'alert_type': alert_type,
            'alert_name': alert.get('alerts', [{}])[0].get('labels', {}).get('alertname'),
            'severity': alert.get('alerts', [{}])[0].get('labels', {}).get('severity')
        }
    }
    
    response = requests.post(url, json=data, headers=headers)
    return jsonify({'status': 'triggered', 'response': response.status_code})

def map_alert_to_action(alert):
    alert_name = alert.get('alerts', [{}])[0].get('labels', {}).get('alertname', '')
    
    if 'HighCPUUsage' in alert_name:
        return 'high-cpu'
    elif 'DeploymentFailed' in alert_name:
        return 'deployment-failed'
    elif 'PodCrashLooping' in alert_name:
        return 'pod-crash-loop'
    elif 'HighErrorRate' in alert_name:
        return 'high-error-rate'
    
    return 'unknown'

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)
```

### Step 3: Update Alertmanager Config

Update `monitoring/alertmanager/config.yaml`:

```yaml
receivers:
- name: 'webhook-receiver'
  webhook_configs:
  - url: 'http://webhook-receiver:5001/webhook'
    send_resolved: true
```

### Step 4: Deploy Webhook Receiver

```bash
# Create webhook deployment
kubectl apply -f monitoring/webhook-receiver/
```

### Step 5: Configure GitHub Secrets

Add to GitHub repository secrets:

- `GITHUB_TOKEN`: Personal access token with repo scope
- `KUBECONFIG_PRODUCTION`: Base64 encoded kubeconfig

## Automated Actions

### High CPU Usage

**Trigger**: CPU usage > 85% for 5 minutes

**Action**:
1. Scale up backend to 5 replicas
2. Scale up frontend to 3 replicas
3. Notify team via Slack/Email

**Recovery**: HPA will scale down when CPU normalizes

### Deployment Failed

**Trigger**: Deployment has unavailable replicas for 10 minutes

**Action**:
1. Rollback backend deployment
2. Rollback frontend deployment
3. Notify team immediately

### Pod Crash Loop

**Trigger**: Pod restarting frequently

**Action**:
1. Delete problematic pod (Kubernetes will recreate)
2. Scale up deployment temporarily
3. Notify team

### High Error Rate

**Trigger**: Error rate > 0.1% for 5 minutes

**Action**:
1. Scale up backend to handle load
2. Enable circuit breaker (if implemented)
3. Notify on-call engineer

## HPA Configuration

HPA is configured to automatically scale based on metrics:

### Backend HPA
- **Min Replicas**: 2
- **Max Replicas**: 10
- **CPU Target**: 70%
- **Memory Target**: 80%

### Frontend HPA
- **Min Replicas**: 2
- **Max Replicas**: 5
- **CPU Target**: 70%

## Monitoring the Feedback Loop

### Metrics to Track

1. **Alert Response Time**: Time from alert to action
2. **Automated Actions**: Count of automated responses
3. **Success Rate**: Percentage of successful automated fixes
4. **False Positives**: Alerts that didn't require action

### Dashboard

Create a Grafana dashboard showing:
- Alert frequency over time
- Automated action success rate
- Response time distribution
- Alert resolution time

## Testing

### Test Alert Triggering

```bash
# Manually trigger workflow
gh workflow run monitor-triggered-deploy.yml \
  -f alert_type=high-cpu

# Or via API
curl -X POST \
  -H "Authorization: token YOUR_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/repos/OWNER/REPO/actions/workflows/monitor-triggered-deploy.yml/dispatches \
  -d '{"ref":"main","inputs":{"alert_type":"high-cpu"}}'
```

### Test Alertmanager Webhook

```bash
# Send test alert to webhook
curl -X POST http://webhook-receiver:5001/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "alerts": [{
      "labels": {
        "alertname": "HighCPUUsage",
        "severity": "warning"
      },
      "annotations": {
        "summary": "High CPU usage detected"
      }
    }]
  }'
```

## Best Practices

1. **Gradual Rollout**: Start with warning-level alerts
2. **Human Oversight**: Always notify team, don't fully automate
3. **Rollback Safety**: Test rollback procedures regularly
4. **Documentation**: Document all automated actions
5. **Monitoring**: Monitor the monitoring system itself
6. **Testing**: Regularly test alert triggers
7. **Tuning**: Adjust thresholds based on actual behavior

## Limitations

- Not all issues can be automatically resolved
- Requires careful tuning to avoid false positives
- May mask underlying problems
- Should complement, not replace, human oversight

## Future Enhancements

1. **Machine Learning**: Predict issues before they occur
2. **Auto-tuning**: Automatically adjust HPA thresholds
3. **Multi-cluster**: Extend to multiple Kubernetes clusters
4. **Cost Optimization**: Scale down during low usage
5. **A/B Testing**: Test different scaling strategies

---

**Last Updated**: 2024

