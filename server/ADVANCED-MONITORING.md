# Advanced: CI/CD & Monitoring Setup

## GitHub Actions Integration

We've created a workflow file that automatically runs performance tests on every push and pull request.

### To Enable GitHub Actions:

1. **Create the directories** (if they don't exist):
```bash
mkdir -p .github/workflows
```

2. **Move the workflow file:**
```bash
# Copy the performance-tests.yml file from the repo root to .github/workflows/
cp github-workflows-performance-tests.yml .github/workflows/performance-tests.yml
```

3. **Push to GitHub**:
```bash
git add .github/workflows/performance-tests.yml
git commit -m "Add automated performance testing workflow"
git push
```

### What It Does:
- Automatically runs smoke and load tests on every push
- Runs daily performance tests (2 AM UTC)
- Comments on PRs with performance results
- Uploads performance reports as artifacts
- Fails the build if thresholds are exceeded

---

## Local Monitoring While Running Tests

### Monitor CPU & Memory Usage

**Windows (PowerShell):**
```powershell
# Open a new PowerShell window
Get-Process node | Select-Object -Property ProcessName, CPU, WorkingSet | Format-Table
```

**macOS:**
```bash
# Open Activity Monitor
open -a "Activity Monitor"
# Or use Terminal:
top -o cpu -r | head -n 20
```

**Linux:**
```bash
# Real-time monitoring
htop
# Or:
watch -n 1 "ps aux | grep node"
```

### Monitor Network Traffic
```bash
# Using netstat (all platforms)
netstat -an | grep ESTABLISHED | wc -l

# Linux with iftop:
sudo iftop
```

---

## Real-Time Metrics Dashboard (Optional)

### Option 1: Using K6 Cloud (Free Tier)

**Step 1: Sign up for free at https://app.k6.io**

**Step 2: Get your token:**
- Account settings → API tokens → Create new token

**Step 3: Log in from CLI:**
```bash
k6 login cloud
```

**Step 4: Run tests with cloud reporting:**
```bash
k6 run --out cloud perf-test-main.js
```

**Benefits:**
- Real-time results dashboard
- Compare test runs
- Share results with team

### Option 2: Using Prometheus + Grafana (Self-Hosted)

**Install Prometheus:**
```bash
# macOS
brew install prometheus

# Linux
sudo apt-get install prometheus

# Windows: Download from https://prometheus.io/download/
```

**Configure Prometheus** (`prometheus.yml`):
```yaml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'k6'
    static_configs:
      - targets: ['localhost:9090']
```

**Run K6 with Prometheus output:**
```bash
k6 run --out experimental-prometheus-rw perf-test-main.js
```

---

## Performance Tracking Over Time

### Weekly Testing Schedule
```bash
# Add to crontab (macOS/Linux)
0 2 * * 1 cd /path/to/project/server && npm run test:performance:load >> perf-logs/weekly-$(date +\%Y\%m\%d).log 2>&1
```

### Automated Report Generation
```bash
# Run test and save results with timestamp
npm run test:performance:report
mv performance-report.json performance-report-$(date +%Y%m%d-%H%M%S).json
```

---

## Performance Regression Detection

### Alert When Performance Degrades

Create a script `check-performance.js`:

```javascript
const fs = require('fs');
const path = require('path');

const currentReport = JSON.parse(fs.readFileSync('performance-report.json', 'utf8'));
const baselineFile = 'baseline-performance.json';

if (!fs.existsSync(baselineFile)) {
  console.log('Baseline not found. Saving current as baseline.');
  fs.writeFileSync(baselineFile, JSON.stringify(currentReport, null, 2));
  process.exit(0);
}

const baseline = JSON.parse(fs.readFileSync(baselineFile, 'utf8'));

// Check for regressions
const thresholdIncrease = 1.1; // Allow 10% increase

const currentP95 = currentReport.metrics['http_req_duration'].values.p95;
const baselineP95 = baseline.metrics['http_req_duration'].values.p95;

if (currentP95 > baselineP95 * thresholdIncrease) {
  console.error(`Performance Regression Detected!`);
  console.error(`p95 Response Time: ${baselineP95}ms → ${currentP95}ms`);
  process.exit(1);
} else {
  console.log('Performance OK ✓');
  process.exit(0);
}
```

---

## Stress Test Post-Analysis

After running stress tests, analyze results:

```bash
# Export results to JSON
k6 run --out json=stress-test-results.json perf-test-spike.js

# Analyze with custom script (node.js)
node analyze-performance.js stress-test-results.json
```

---

## Scaling Recommendations Based on Metrics

| Metric | Threshold Exceeded | Action |
|--------|-------------------|--------|
| p95 Response > 1s | Yes | Optimize code, add caching |
| Error Rate > 5% | Yes | Increase capacity, check logs |
| CPU > 80% | Yes | Horizontal scaling, optimize queries |
| Memory > 70% | Yes | Memory leak check, increase RAM |
| Throughput < 10 TPS | Yes | Add load balancer, scale horizontally |

---

## Best Practices for Continuous Performance Monitoring

✅ **DO:**
- Run smoke tests before every deployment
- Track baseline metrics weekly
- Alert on performance regression (> 10%)
- Document all optimizations
- Archive old reports for trend analysis

❌ **DON'T:**
- Skip smoke tests before production deployment
- Ignore consistent performance degradation
- Run stress tests during peak hours
- Commit performance test files with secrets
- Assume performance improvements without testing

---

## Emergency Response Plan

If performance degrades:

1. **Identify**: Check error logs and recent changes
2. **Isolate**: Run smoke test on specific endpoints
3. **Measure**: Get p95/p99 response times
4. **Investigate**: Profile code, check database queries
5. **Implement**: Apply optimization
6. **Verify**: Re-run tests to confirm improvement
7. **Document**: Record what was fixed

---

## Example: Complete Performance Testing Workflow

```bash
# 1. Pull latest code
git pull origin main

# 2. Run smoke test (quick validation)
npm run test:performance:smoke

# 3. If smoke test passes, run load test
npm run test:performance:load

# 4. Generate report
npm run test:performance:report

# 5. Analyze results
node check-performance.js

# 6. If all good, commit and push
git commit -am "Performance verified - all tests passing"
git push

# 7. GitHub Actions will run full suite
```

---

## Performance Testing Checklist for Deployment

Before deploying to production:

- [ ] Run full smoke test (0 errors)
- [ ] Run load test (p95 < threshold)
- [ ] Check CPU usage stays below 80%
- [ ] Verify no memory leaks (memory stable)
- [ ] Error rate below 1%
- [ ] Database connection pool healthy
- [ ] All external API calls responding
- [ ] Compare with baseline metrics
- [ ] Document any changes from baseline
- [ ] Get approval from team lead

---

## Resources

- **K6 Cloud**: https://app.k6.io
- **Prometheus**: https://prometheus.io
- **Grafana**: https://grafana.com
- **Performance Testing Guide**: https://k6.io/docs/testing-guides/

---

## Questions?

Check the documentation or K6 official guides for more information.

Happy testing! 🚀
