# ⚡ JTCUTZ Performance Testing Setup

## Quick Start (60 seconds)

### Step 1: Install K6
```bash
# Windows (Chocolatey)
choco install k6

# macOS
brew install k6

# Linux
sudo apt-get install k6
```

### Step 2: Start Your API Server
```bash
npm run dev
```
*(Keep this terminal open)*

### Step 3: Run Tests (New Terminal)
```bash
# Windows
.\run-performance-tests.bat

# macOS/Linux
bash run-performance-tests.sh
```

**Or run directly:**
```bash
npm run test:performance:smoke     # Quick test (30s)
npm run test:performance:load      # Standard load test (2m)
npm run test:performance:stress    # Push to limits (5m)
npm run test:performance:spike     # Sudden spike test
```

---

## What Gets Tested?

✅ **Response Time** - Is your API fast?
✅ **System Throughput** - How many requests/sec?
✅ **Error Rate** - Are requests failing?
✅ **CPU & Memory** - System resource usage

---

## Expected Results

| Test Type | Users | Duration | Pass if |
|-----------|-------|----------|---------|
| Smoke | 5 | 30s | 0 errors |
| Load | 50 | 2m | < 10% errors, p95 < 500ms |
| Stress | 100 | 5m | System recovers |
| Spike | Dynamic | 17m | Handles surge |

---

## 📊 Reading the Results

✅ = Test passed
❌ = Test failed

Green numbers = Good performance
Red numbers = Needs optimization

---

## 🛠️ Customizing Tests

Edit these files:
- `perf-test-main.js` - Main load test
- `perf-test-spike.js` - Spike test

Change VUs (virtual users):
```javascript
vus: 50  // Number of concurrent users
```

---

## 📖 Full Documentation

See `PERFORMANCE-TESTING.md` for detailed guide

---

## ⚠️ Important Notes

- Server must be running before tests start
- Don't run stress tests on production without approval
- Run smoke tests first to debug issues
- Check logs if tests fail

---

## 🆘 Troubleshooting

**"Connection refused"**
- Is the server running? → `npm run dev`

**"Tests failing immediately"**
- Run smoke test: `npm run test:performance:smoke`
- Check server logs for errors

**"High error rates"**
- Reduce user count
- Check database connection
- Check app logs

---

## 📞 Need Help?

1. Read `PERFORMANCE-TESTING.md` for detailed guide
2. Run with `--verbose` flag: `k6 run --verbose perf-test-main.js`
3. Check K6 docs: https://k6.io/docs/

Enjoy testing! 🚀
