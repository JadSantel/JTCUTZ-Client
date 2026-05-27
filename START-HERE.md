# 🚀 START HERE - First Steps

> **You have 5 minutes to see your first performance test results!**

---

## Step 1: Install K6 (2 minutes)

Choose your operating system:

### Windows (Chocolatey)
```bash
choco install k6
```

### Windows (Manual)
1. Visit: https://github.com/grafana/k6/releases
2. Download the `.exe` file
3. Run the installer

### macOS
```bash
brew install k6
```

### Linux (Ubuntu/Debian)
```bash
sudo apt-get install k6
```

### Verify Installation
```bash
k6 version
```

You should see: `k6 vX.XX.X (version info)`

---

## Step 2: Start Your API Server (30 seconds)

Open a terminal and run:
```bash
cd server
npm run dev
```

You should see:
```
Server running on port 5000
MongoDB connected
```

**Keep this terminal open!**

---

## Step 3: Run Your First Test (1 minute)

Open a NEW terminal and run:
```bash
cd server
npm run test:performance:smoke
```

Watch as your performance test runs! You'll see:
- Test progress
- Response times
- Error rates
- Performance metrics

---

## 📊 Reading the Results

When the test finishes, look for:

```
✓ [HTTP] status is 200                    100.00%
✓ response time < 500ms                   99.2%
✓ http_req_failed                         0.00%

√ checks passed                          1056/1056
```

**Green ✓ = Good!**
**Red ✗ = Needs investigation**

---

## 🎯 What Just Happened?

Your test just:
- ✅ Made 5 concurrent user requests
- ✅ Ran for 30 seconds
- ✅ Tested 6 API endpoints
- ✅ Measured response times
- ✅ Tracked error rates
- ✅ Verified system stability

---

## 📈 Next: Run More Detailed Tests

### Load Test (2 minutes)
```bash
npm run test:performance:load
```

### Stress Test (5 minutes)
```bash
npm run test:performance:stress
```

### Get All Available Tests
```bash
npm run test:performance:spike
```

---

## 💾 Save Your Baseline

Open `PERFORMANCE-BASELINE.md` and record your results:

```
Date: 2024-05-27
Test: Smoke Test
Status: ✅ PASS

Metrics:
- Average Response: 234ms
- p95 Response: 412ms
- Error Rate: 0%
- Throughput: 17.5 TPS
```

This helps you track improvements over time!

---

## 📚 After Testing

### Want Quick Start Guide?
→ Read `PERF-TESTING-README.md` (in `/server`)

### Want Detailed Instructions?
→ Read `SETUP-CHECKLIST.md` (in `/server`)

### Want Quick Reference?
→ Read `QUICK-REFERENCE.md` (in repo root)

### Want to Understand Everything?
→ Read `PERFORMANCE-TESTING.md` (in `/server`)

---

## 🔧 Common Commands

```bash
# Quick test (30 seconds)
npm run test:performance:smoke

# Full test (2 minutes)
npm run test:performance:load

# Stress the system (5 minutes)
npm run test:performance:stress

# Sudden spike test (17 minutes)
npm run test:performance:spike

# Generate report
npm run test:performance:report
```

---

## ⚠️ Important Notes

- **Server must be running** before tests start
- **New terminal** - Run tests in a different terminal than the server
- **Give server time** - Wait a few seconds for server to fully start
- **Monitor resources** - Watch your CPU/Memory while testing

---

## 🆘 Troubleshooting

**"Connection refused"**
- Make sure server is running: `npm run dev`
- Verify it says "Server running on port 5000"

**"K6 not found"**
- Re-install K6 using the instructions above
- Verify: `k6 version`

**"Test fails immediately"**
- Check server logs for errors
- Run: `npm run test:performance:smoke --verbose`

**"MongoDB connection error"**
- Ensure MongoDB is running
- Check `.env` file has correct MONGO_URI

---

## 🎉 You're Doing Great!

You've just successfully:
- ✅ Set up automated performance testing
- ✅ Run your first performance test
- ✅ Measured your API's performance
- ✅ Recorded baseline metrics

**Next time, just run:**
```bash
# Start server (Terminal 1)
npm run dev

# Run test (Terminal 2)
npm run test:performance:smoke
```

---

## 📖 Documentation Available

| Document | Purpose |
|----------|---------|
| `PERF-TESTING-README.md` | Quick start guide |
| `SETUP-CHECKLIST.md` | Step-by-step setup |
| `PERFORMANCE-TESTING.md` | Comprehensive guide |
| `PERFORMANCE-BASELINE.md` | Track metrics over time |
| `QUICK-REFERENCE.md` | Visual reference |
| `ADVANCED-MONITORING.md` | CI/CD & dashboards |
| `SETUP-COMPLETE.md` | Full setup overview |

All are in `/server/` directory!

---

## 🚀 Next: Weekly Testing Routine

```bash
# Every week:
npm run test:performance:load
# Record results in PERFORMANCE-BASELINE.md
# Compare with previous week
# Optimize if needed
```

---

**That's it! You're now performance testing your API! 🎉**

Go run your first test now:
```bash
npm run test:performance:smoke
```

Questions? Read the docs in `/server/` directory.

**Happy Testing! 🚀**
