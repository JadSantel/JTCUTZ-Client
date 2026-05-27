# 🎯 Performance Testing Setup Checklist

## ✅ Setup Status

- ✅ **Package.json updated** - Added performance test scripts
- ✅ **K6 test files created**
  - `perf-test-main.js` - Main load testing script
  - `perf-test-spike.js` - Spike testing script
- ✅ **Helper scripts created**
  - `run-performance-tests.bat` - Windows batch file
  - `run-performance-tests.sh` - Bash script for macOS/Linux
- ✅ **Documentation created**
  - `PERF-TESTING-README.md` - Quick start guide
  - `PERFORMANCE-TESTING.md` - Comprehensive guide
  - `PERFORMANCE-BASELINE.md` - Metrics tracking template

---

## 🚀 Getting Started (Follow These Steps)

### Step 1: Install K6
Choose your operating system:

**Windows (Chocolatey):**
```bash
choco install k6
```

**Windows (Manual Download):**
Visit: https://github.com/grafana/k6/releases
Download the `.exe` file and add to PATH

**macOS:**
```bash
brew install k6
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get install k6
```

### Step 2: Verify Installation
```bash
k6 version
```

### Step 3: Start Your API Server
```bash
# From the server directory
npm run dev
```

### Step 4: Run Your First Test (New Terminal Window)
```bash
# From the server directory
npm run test:performance:smoke
```

---

## 📋 Available Commands

```bash
# Quick smoke test (5 users, 30s)
npm run test:performance:smoke

# Standard load test (50 users, 2m)
npm run test:performance:load

# Stress test (100 users, 5m)
npm run test:performance:stress

# Spike test (Dynamic load ramping)
npm run test:performance:spike

# Generate JSON report
npm run test:performance:report

# Or use helper scripts:
./run-performance-tests.bat      # Windows
bash run-performance-tests.sh    # macOS/Linux
```

---

## 📊 Test Coverage

Your performance tests now cover:

| Endpoint | Method | Test Type |
|----------|--------|-----------|
| `/api/health` | GET | ✅ Smoke, Load, Spike |
| `/api/auth/register` | POST | ✅ Smoke, Load, Spike |
| `/api/auth/login` | POST | ✅ Smoke, Load, Spike |
| `/api/appointments` | GET | ✅ Smoke, Load, Spike |
| `/api/appointments` | POST | ✅ Smoke, Load, Spike |
| `/api/gallery` | GET | ✅ Smoke, Load, Spike |

---

## 🎯 Performance Targets (From Your Form)

| Metric | Target | Status |
|--------|--------|--------|
| Response Time | ≤ 2.5s | ⏳ To be tested |
| System Throughput | ≥ 10 TPS | ⏳ To be tested |
| Error Rate | ≤ 1% | ⏳ To be tested |
| CPU Usage | ≤ 80% | ⏳ To be tested |
| Memory Usage | ≤ 70% | ⏳ To be tested |
| System Errors | < 5 | ⏳ To be tested |

---

## 📈 Test Types Explained

### 🟢 Smoke Test (5 users, 30s)
- **Purpose**: Quick validation that the system works
- **Use Case**: Before deploying, after code changes
- **Success**: No errors, all endpoints respond

### 🟡 Load Test (50 users, 2m)
- **Purpose**: Measure performance under typical load
- **Use Case**: Establish baseline, compare versions
- **Success**: < 10% error rate, p95 response time acceptable

### 🔴 Stress Test (100 users, 5m)
- **Purpose**: Find breaking point and recovery
- **Use Case**: Understand system limits
- **Success**: System doesn't crash, eventually recovers

### 🔵 Spike Test (Dynamic, 17m)
- **Purpose**: Simulate sudden traffic surge
- **Use Case**: Test auto-scaling, burst handling
- **Success**: Handles surge, recovers quickly

---

## 📝 Recording Results

Use `PERFORMANCE-BASELINE.md` to:
- Record baseline metrics
- Track improvements over time
- Document issues found
- Monitor resource usage

**Example recording:**
```
Date: 2024-05-27
Test: Load Test
Result: ✅ Pass
p95 Response: 432ms
Error Rate: 0.8%
```

---

## 🔧 Customization Guide

### Change Number of Users
Edit test file (e.g., `perf-test-main.js`):
```javascript
vus: 50  // Change this number
```

### Change Test Duration
```bash
# Via command line:
k6 run --vus 50 --duration 5m perf-test-main.js
```

### Add New Endpoints
Edit `perf-test-main.js` and add:
```javascript
group('New Endpoint', () => {
  const res = http.post(`${BASE_URL}/new/endpoint`, payload);
  check(res, {
    'status is 200': (r) => r.status === 200,
  });
});
```

---

## ✅ Next Steps

1. **Install K6** (if not done)
2. **Run smoke test** to verify setup
3. **Record baseline** in `PERFORMANCE-BASELINE.md`
4. **Run regularly** (weekly recommended)
5. **Optimize** as needed based on results

---

## 📞 Troubleshooting

| Issue | Solution |
|-------|----------|
| "Connection refused" | Start server with `npm run dev` |
| "K6 not found" | Re-install K6, ensure in PATH |
| "Tests fail immediately" | Run smoke test to debug |
| "High error rates" | Check server logs, reduce load |

---

## 📚 Additional Resources

- **K6 Documentation**: https://k6.io/docs/
- **Performance Guide**: `PERFORMANCE-TESTING.md` (in this folder)
- **Quick Start**: `PERF-TESTING-README.md` (in this folder)
- **API Health**: Visit `http://localhost:5000/api/health` during testing

---

## 🎉 You're All Set!

Your performance testing infrastructure is ready. Start with:
```bash
npm run test:performance:smoke
```

Monitor the results and optimize your API! 🚀

---

**Questions?** See the documentation files or K6 official docs.

**Last Generated**: 2024-05-27
