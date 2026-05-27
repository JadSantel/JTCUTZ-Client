# Performance Testing Guide - JTCUTZ-Client

## Overview
This guide helps you set up and run automated performance testing on the JTCUTZ API using K6, a modern load testing tool.

## Installation

### 1. Install K6
K6 is a load testing tool that doesn't require any dependencies.

**Windows:**
```bash
# Using Chocolatey (if installed)
choco install k6

# Or download from: https://github.com/grafana/k6/releases
```

**macOS:**
```bash
brew install k6
```

**Linux:**
```bash
# Ubuntu/Debian
sudo apt-get install k6

# Fedora
sudo dnf install k6
```

### 2. Verify Installation
```bash
k6 version
```

---

## Running Performance Tests

### Available Test Scenarios

#### 1. **Smoke Test** (5 virtual users, 30 seconds)
- Quick validation that the system can handle basic load
- Use before deploying to catch obvious issues
```bash
npm run test:performance:smoke
```

#### 2. **Load Test** (50 virtual users, 2 minutes)
- Measures performance under typical user load
- Best for baseline performance metrics
```bash
npm run test:performance:load
```

#### 3. **Stress Test** (100 virtual users, 5 minutes)
- Finds breaking points of the system
- Determines maximum capacity
```bash
npm run test:performance:stress
```

#### 4. **Spike Test** (Dynamic load with peak of 100 VUs)
- Simulates sudden traffic spikes
- Tests recovery after sudden load
```bash
npm run test:performance:spike
```

#### 5. **Full Test** (Default - 10 VUs, 1 minute)
```bash
npm run test:performance
```

#### 6. **Generate Report** (Outputs JSON report)
```bash
npm run test:performance:report
```

---

## Test Metrics Explained

### Response Time Thresholds
- **p(95)** = 95th percentile (95% of requests are faster than this)
- **p(99)** = 99th percentile (99% of requests are faster than this)

### Current Thresholds (Aligned with Your Performance Form)
```
Response Time:
  - p(95) < 500ms (Main test)
  - p(95) < 1000ms (Spike test)

Error Rate:
  - Failed requests < 10% (Main test)
  - Failed requests < 5% (Spike test)

Throughput:
  - Measured in requests/sec
```

---

## Running the Tests with Environment Variables

### Test Against Different Environments
```bash
# Production
BASE_URL=https://api.jtcutz.com npm run test:performance:load

# Staging
BASE_URL=https://staging-api.jtcutz.com npm run test:performance:load

# Local development (default)
npm run test:performance:load
```

---

## Test Endpoints Covered

The performance tests cover:
1. **Health Check** - `/api/health`
2. **Authentication** - `/api/auth/register`, `/api/auth/login`
3. **Appointments** - `/api/appointments` (GET, POST)
4. **Gallery** - `/api/gallery`

---

## Interpreting Results

### Successful Output Example
```
✓ [HTTP] request(s) 5xx                          0.00%
✓ [HTTP] status is 200                           100.00%
✓ response time < 500ms                          98.5%
```

### Key Metrics to Monitor
| Metric | Green | Yellow | Red |
|--------|-------|--------|-----|
| Error Rate | < 1% | 1-5% | > 5% |
| p(95) Response Time | < 500ms | 500-1000ms | > 1000ms |
| Failed Requests | 0 | 1-10 | > 10 |

---

## Continuous Integration (CI/CD)

### GitHub Actions Integration
See `.github/workflows/performance-tests.yml` for automated testing on every push.

---

## Advanced: Custom Test Scripts

To create custom test scripts, edit the `.js` files:

```javascript
// perf-test-main.js

export const options = {
  vus: 10,                    // Number of virtual users
  duration: '1m',             // Test duration
  thresholds: {
    http_req_duration: ['p(95)<500'],   // 95% of requests < 500ms
    http_req_failed: ['rate<0.1']       // Error rate < 10%
  }
};
```

---

## Troubleshooting

### Connection Refused
- Ensure the API server is running: `npm run dev`
- Check port 5000 is accessible

### Test Fails Immediately
- Run smoke test first to debug: `npm run test:performance:smoke`
- Check server logs for errors

### High Error Rates
- Reduce VU count and duration
- Check database connections
- Review application logs

---

## Best Practices

✅ **DO:**
- Run smoke tests first
- Test during off-peak hours
- Run tests regularly (weekly)
- Monitor under realistic load
- Document baseline metrics

❌ **DON'T:**
- Run stress tests on production without approval
- Run tests against live payment systems
- Ignore threshold failures
- Skip smoke tests before load tests

---

## Resources

- [K6 Documentation](https://k6.io/docs/)
- [K6 HTTP API](https://k6.io/docs/javascript-api/k6-http/)
- [Performance Testing Best Practices](https://k6.io/docs/testing-guides/)
