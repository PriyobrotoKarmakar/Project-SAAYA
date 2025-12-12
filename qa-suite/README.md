# Project Saaya - QA Automation Suite

## 🎯 Overview

This is the **Quality Gate** for Project Saaya - an automated testing suite using Maven and JUnit that validates the backend health before deployment to production.

## 📁 Structure

```
qa-suite/
├── pom.xml                           # Maven configuration
├── README.md                         # This file
└── src/
    └── test/
        └── java/
            └── com/
                └── saaya/
                    └── SaayaTest.java  # Test suite
```

## 🔧 Prerequisites

1. **Java JDK 8 or higher**
   - Check: `java -version`
   - Download: https://www.oracle.com/java/technologies/downloads/

2. **Maven**
   - Check: `mvn -version`
   - Download: https://maven.apache.org/download.cgi

3. **Backend Running**
   - The Node.js backend must be running on `http://localhost:5000`
   - Start with: `cd backend && npm run dev`

## 🚀 Running Tests

### Step 1: Start the Backend
```bash
cd ../backend
npm run dev
```
Keep this terminal open!

### Step 2: Run Tests (in a new terminal)
```bash
cd qa-suite
mvn test
```

## ✅ Expected Output

**SUCCESS:**
```
-------------------------------------------------------
 T E S T S
-------------------------------------------------------
Running com.saaya.SaayaTest
🛡️  [Maven QA] Starting Project Saaya Health Check...
   Target: http://localhost:5000/api/health
   --> HTTP Response Code: 200
✅ [Success] Backend is Healthy. Ready for Cloud Deployment.

🔍 [Maven QA] Testing Alerts API Endpoint...
   Target: http://localhost:5000/api/alerts
   --> HTTP Response Code: 200
✅ [Success] Alerts API is operational.

📊 [Maven QA] Testing Stats API Endpoint...
   Target: http://localhost:5000/api/stats
   --> HTTP Response Code: 200
✅ [Success] Stats API is operational.

Tests run: 4, Failures: 0, Errors: 0, Skipped: 0

-------------------------------------------------------
BUILD SUCCESS
-------------------------------------------------------
```

**FAILURE (Backend Down):**
```
🛡️  [Maven QA] Starting Project Saaya Health Check...
   --> ❌ Error connecting to Backend: Connection refused
🚨 CRITICAL: Backend is Down! Deployment Aborted.

Tests run: 1, Failures: 1, Errors: 0, Skipped: 0

-------------------------------------------------------
BUILD FAILURE
-------------------------------------------------------
```

## 🧪 Test Cases

| Test | Description | Endpoint |
|------|-------------|----------|
| `testBackendIsRunning` | ⚠️ CRITICAL: Verifies backend is UP | `/api/health` |
| `testAlertsEndpoint` | Validates alerts API is responding | `/api/alerts` |
| `testStatsEndpoint` | Validates stats API is responding | `/api/stats` |
| `testHealthResponseStructure` | Checks JSON structure validity | `/api/health` |

## 🐳 CI/CD Integration

### Jenkins Pipeline Example:
```groovy
stage('Quality Gate') {
    steps {
        dir('qa-suite') {
            sh 'mvn clean test'
        }
    }
}
```

### GitHub Actions Example:
```yaml
- name: Run QA Tests
  run: |
    cd qa-suite
    mvn clean test
```

## 🔮 Future Enhancements

- [ ] Add Selenium WebDriver for UI testing
- [ ] Test POST /api/telemetry with mock data
- [ ] Validate SOS alert triggering logic
- [ ] Test police route calculation accuracy
- [ ] Load testing with JMeter
- [ ] Security testing (OWASP ZAP)
- [ ] Performance benchmarking

## 📊 Maven Commands

| Command | Description |
|---------|-------------|
| `mvn clean` | Clean previous builds |
| `mvn test` | Run all tests |
| `mvn clean test` | Clean and test |
| `mvn -Dtest=SaayaTest#testBackendIsRunning test` | Run single test |

## 🛡️ DevOps Value

This QA suite ensures:
- ✅ No broken deployments reach production
- ✅ Backend API contracts are respected
- ✅ Health checks pass before Kubernetes rollout
- ✅ Automated regression testing
- ✅ CI/CD pipeline validation

---

**Project Saaya** - Women's Safety Platform
*Digital Twin IoT System with Automated Quality Gates*
