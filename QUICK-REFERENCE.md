# 🎯 Performance Testing - Visual Quick Reference

## 📦 What You Have

```
JTCUTZ-Client/
│
├── PERFORMANCE-TESTING-SETUP.md (← READ THIS FIRST!)
│
└── server/
    ├── 🧪 TEST FILES
    │   ├── perf-test-main.js
    │   └── perf-test-spike.js
    │
    ├── 🖥️  HELPER SCRIPTS
    │   ├── run-performance-tests.bat (Windows)
    │   └── run-performance-tests.sh (macOS/Linux)
    │
    ├── 📚 DOCUMENTATION
    │   ├── ⭐ PERF-TESTING-README.md (Quick Start)
    │   ├── PERFORMANCE-TESTING.md (Detailed)
    │   ├── SETUP-CHECKLIST.md (Setup Steps)
    │   ├── PERFORMANCE-BASELINE.md (Track Metrics)
    │   └── ADVANCED-MONITORING.md (CI/CD & Dashboards)
    │
    └── package.json (✅ Updated with scripts)
```

---

## 🚀 30-Second Start

```bash
# Terminal 1: Start your API
cd server
npm run dev

# Terminal 2: Run test
cd server
npm run test:performance:smoke
```

**That's it!** You'll see performance results in the console.

---

## 📊 Test Menu

```
🟢 SMOKE TEST (30 seconds)
   npm run test:performance:smoke
   └─ Use: Quick validation, before every change

🟡 LOAD TEST (2 minutes)
   npm run test:performance:load
   └─ Use: Baseline metrics, weekly testing

🔴 STRESS TEST (5 minutes)
   npm run test:performance:stress
   └─ Use: Find limits, capacity planning

🔵 SPIKE TEST (17 minutes)
   npm run test:performance:spike
   └─ Use: Test auto-scaling, sudden load
```

---

## 📈 Reading the Results

### Example Output:
```
✓ [HTTP] status is 200                           100.00%
✓ response time < 500ms                          99.2%
✓ http_req_failed                                0.00%

√ checks passed                                  1056/1056
```

### Color Interpretation:
- ✅ **GREEN** = Good performance, test passed
- ⚠️  **YELLOW** = Warning, some requests slow
- ❌ **RED** = Failed, needs optimization

---

## 🎯 Success Criteria

| Metric | Pass ✅ | Fail ❌ |
|--------|--------|--------|
| Response Time (p95) | < 500ms | > 1000ms |
| Error Rate | < 1% | > 5% |
| Throughput | > 10 TPS | < 5 TPS |
| CPU Usage | < 80% | > 90% |
| Memory Usage | < 70% | > 85% |

---

## 📋 Pre-Test Checklist

Before running tests:

- [ ] K6 installed (`k6 version` returns something)
- [ ] API server running (`npm run dev` in Terminal 1)
- [ ] MongoDB connected (check server logs)
- [ ] Environment variables set (.env file exists)
- [ ] Port 5000 accessible

---

## 🔄 Recommended Testing Schedule

```
Before deployment:
├─ Run smoke test
└─ Run load test

Weekly:
├─ Record baseline metrics
├─ Run load test
└─ Compare with previous week

Monthly:
├─ Run full stress test
├─ Review trends
└─ Optimize if needed
```

---

## 💾 Recording Results

**Step 1:** Run test
```bash
npm run test:performance:load
```

**Step 2:** Manually note results in `PERFORMANCE-BASELINE.md`
```
Date: 2024-05-27
p95 Response: 432ms
Error Rate: 0.8%
Status: ✅ PASS
```

**Alternative:** Generate JSON report
```bash
npm run test:performance:report
```

---

## 🆘 Quick Troubleshooting

**"Connection refused"**
```bash
# Make sure server is running:
npm run dev
```

**"K6 not found"**
```bash
# Install K6:
brew install k6  # macOS
choco install k6 # Windows
sudo apt-get install k6 # Linux
```

**"Tests failing"**
```bash
# Debug with smoke test:
npm run test:performance:smoke
# Check server logs for errors
```

**"High error rate"**
```bash
# Reduce load:
k6 run --vus 10 --duration 30s perf-test-main.js
# Check database connection
```

---

## 📚 Which Doc Should I Read?

**❓ I want to start testing NOW**
→ `PERF-TESTING-README.md`

**❓ I need full setup instructions**
→ `SETUP-CHECKLIST.md`

**❓ I need comprehensive details**
→ `PERFORMANCE-TESTING.md`

**❓ I want to track metrics over time**
→ `PERFORMANCE-BASELINE.md`

**❓ I want CI/CD or dashboards**
→ `ADVANCED-MONITORING.md`

**❓ I need an overview**
→ `PERFORMANCE-TESTING-SETUP.md` (main repo root)

---

## 🔧 Common Customizations

### Run with more users:
```bash
k6 run --vus 100 --duration 5m perf-test-main.js
```

### Run against different server:
```bash
BASE_URL=https://api.example.com npm run test:performance:load
```

### Generate detailed report:
```bash
npm run test:performance:report
# Creates: performance-report.json
```

---

## ✨ Performance Test Endpoints

Your tests automatically check:

```
✓ GET  /api/health                (Response time < 100ms)
✓ POST /api/auth/register         (Response time < 500ms)
✓ POST /api/auth/login            (Response time < 300ms)
✓ GET  /api/appointments          (Response time < 1000ms)
✓ POST /api/appointments          (Response time < 800ms)
✓ GET  /api/gallery               (Response time < 500ms)
```

---

## 🎓 Performance Testing Tips

✅ **DO:**
- Start with smoke tests
- Run tests regularly (weekly)
- Document baseline metrics
- Test before deployment
- Monitor CPU/Memory while testing

❌ **DON'T:**
- Skip smoke tests
- Run stress tests on production
- Ignore performance degradation
- Run tests during peak hours
- Assume improvements without testing

---

## 📞 Support Resources

| Need | Resource |
|------|----------|
| Quick help | This page + PERF-TESTING-README.md |
| Installation | SETUP-CHECKLIST.md |
| Detailed guide | PERFORMANCE-TESTING.md |
| Metrics tracking | PERFORMANCE-BASELINE.md |
| Advanced setup | ADVANCED-MONITORING.md |
| K6 docs | https://k6.io/docs/ |

---

## 🎉 Next Steps

1. **Install K6** (5 minutes)
2. **Run smoke test** (30 seconds)
3. **Review results** (5 minutes)
4. **Record baseline** (2 minutes)
5. **Run weekly** (as part of workflow)

---

## Example: Full Testing Session

```bash
# 1. Navigate to server
cd server

# 2. Terminal 1: Start API
npm run dev

# 3. Terminal 2: Run smoke test (confirm setup works)
npm run test:performance:smoke

# 4. Terminal 2: Run load test (get baseline)
npm run test:performance:load

# 5. Terminal 2: Generate report
npm run test:performance:report

# 6. Open PERFORMANCE-BASELINE.md and record results
# Update with: response time, error rate, timestamp

# 7. Done! ✓
```

---

**Total setup time: ~10 minutes**
**Time to first test: ~2 minutes**
**Time per test run: 30s - 5m (depending on type)**

---

## Questions?

→ Start with `PERF-TESTING-README.md` in the `/server` directory
→ All detailed docs are there too!

**Happy Testing! 🚀**
