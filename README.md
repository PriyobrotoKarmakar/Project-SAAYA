# 🛡️ Project Saaya

### Women's Safety IoT Platform with Real-Time Emergency Response

<div align="center">

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![React](https://img.shields.io/badge/react-18.3.1-61DAFB.svg)
![Docker](https://img.shields.io/badge/docker-ready-2496ED.svg)
![DevOps](https://img.shields.io/badge/DevOps-enabled-orange.svg)

**A Digital Twin IoT system that receives real-time signals from smartwatch simulators and alerts a React Dashboard with automatic police station dispatch.**

[Features](#features) • [Architecture](#architecture) • [Getting Started](#getting-started) • [API Reference](#api-reference) • [Deployment](#deployment)

</div>

---

## 📖 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [API Reference](#api-reference)
- [Testing](#testing)
- [Docker & Deployment](#docker--deployment)
- [Usage Guide](#usage-guide)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

**Project Saaya** is a comprehensive Women's Safety platform that combines IoT sensor simulation, real-time data processing, interactive mapping, and automated emergency response. The system monitors heart rate data from simulated smartwatches, automatically detects emergencies (heart rate > 150 BPM), and dispatches the nearest police station with visual route guidance.

### Key Highlights

✅ **Real-time Emergency Detection** - Automatic SOS alerts based on heart rate thresholds  
✅ **Pan-India Police Database** - 100+ police stations across all states  
✅ **Smart Route Calculation** - Haversine formula for nearest station detection  
✅ **Multi-Route Visualization** - Color-coded routes for simultaneous emergencies  
✅ **MVC Backend Architecture** - Clean, scalable, production-ready code  
✅ **Docker & Kubernetes Ready** - Containerized microservices deployment  
✅ **Automated QA Testing** - Maven + JUnit quality gates  
✅ **Single Configuration Source** - One `.env` file for all deployments

---

## ✨ Features

### Frontend (React Dashboard)

#### 🗺️ Interactive Map System

- **Satellite Imagery** - Esri World Imagery with place names overlay
- **Dynamic Markers** - Red emergency markers, blue police station markers
- **Smart Auto-Zoom** - Automatic bounds fitting on new alerts only
- **Multi-Route Display** - 8 distinct colors for simultaneous emergency routes
- **Police Station Dispatch** - Stations appear only when emergency is verified
- **Distance Calculation** - Real-time distance display in kilometers

#### 🚨 Emergency Response

- **"Verify Rape Attempt" Button** - One-click emergency verification
- **Automatic Police Dispatch** - Finds and visualizes nearest police station route
- **Real-Time Notifications** - Toast alerts for new emergencies and verifications
- **Alert Management** - Remove/close alerts with backend synchronization
- **Color-Coded Routes** - Unique colors prevent route confusion

#### 📊 Dashboard Features

- **Live Statistics** - Active alerts, total nodes, system health
- **Scrollable Alert Feed** - Custom-styled scrollbar, fixed height container
- **Real-Time Clock** - Updates every second
- **Glass Morphism UI** - Modern dark cyberpunk theme
- **Responsive Grid** - 100vh fixed height, no page overflow
- **Emergency Contact Card** - Quick access to hotlines

### Backend (Node.js + Express)

#### 🏗️ MVC Architecture

- **Models** - Alert and Telemetry data structures
- **Controllers** - Business logic for telemetry processing
- **Routes** - RESTful API endpoint definitions
- **Config** - Centralized configuration management

#### 🔧 API Endpoints

- `GET /api/health` - Health check (Kubernetes liveness probe)
- `POST /api/telemetry` - Receive smartwatch sensor data
- `GET /api/alerts` - Retrieve active alerts (last 10)
- `GET /api/stats` - System statistics and metrics
- `DELETE /api/alerts/:deviceId/:timestamp` - Remove specific alert
- `DELETE /api/alerts/clear` - Clear all alerts (testing)

#### 💡 Smart Features

- **SOS Detection** - Heart rate > 150 BPM triggers automatic alert
- **Color-Coded Logging** - Red for emergencies, green for normal
- **Memory Management** - Keeps only last 50 alerts
- **Input Validation** - Comprehensive payload validation
- **CORS Enabled** - Cross-origin resource sharing configured
- **Silent Polling** - Reduced console spam for health checks

### Quality Assurance

#### 🧪 Maven + JUnit Testing

- **4 Automated Tests** - Health, alerts, stats, JSON validation
- **Quality Gate Integration** - Tests must pass before deployment
- **Auto-Config Sync** - Reads IP from root `.env` file
- **CI/CD Ready** - Maven lifecycle integration

---

## 🛠️ Technology Stack

### Frontend

- **React** 18.3.1 - Component-based UI framework
- **Vite** 7.2.7 - Fast build tool and dev server
- **React Leaflet** 5.0.0 - Interactive maps
- **Leaflet** 1.9.4 - Mapping library
- **React Toastify** 10.0.0 - Toast notifications
- **Lucide React** 0.561.0 - Icon library
- **Tailwind CSS** 4.x - Utility-first CSS framework

### Backend

- **Node.js** 18+ - JavaScript runtime
- **Express** 4.18.2 - Web framework
- **CORS** 2.8.5 - Cross-origin support
- **Body Parser** 1.20.2 - Request parsing
- **Nodemon** 3.0.1 - Development auto-reload

### DevOps & Testing

- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Maven** 3.9.x - Build automation
- **JUnit** 4.13.2 - Unit testing framework
- **Selenium** 4.10.0 - Browser automation (future)

### Database

- **In-Memory Arrays** - Current (easily migrates to MongoDB/PostgreSQL)

### Mapping

- **Esri ArcGIS** - Satellite imagery tiles
- **Haversine Formula** - Distance calculation

---

## 🏛️ Architecture

```text
┌─────────────────────────────────────────────────────────────┐
│                     Project Saaya                           │
│                 Full-Stack Architecture                     │
└─────────────────────────────────────────────────────────────┘

┌──────────────┐          ┌──────────────┐        ┌──────────────┐
│   Frontend   │          │   Backend    │        │  QA Suite    │
│  (React +    │◄────────►│  (Node.js +  │◄───────│  (Maven +    │
│   Vite)      │   REST   │   Express)   │  Tests │   JUnit)     │
│              │   API    │              │        │              │
└──────────────┘          └──────────────┘        └──────────────┘
       │                         │                        │
       │                         │                        │
       ▼                         ▼                        ▼
┌──────────────┐          ┌──────────────┐        ┌──────────────┐
│ React Leaflet│          │  MVC Pattern │        │ Automated    │
│ Interactive  │          │  - Models    │        │ Health       │
│ Map + Routes │          │  - Controllers        │ Checks       │
└──────────────┘          │  - Routes    │        └──────────────┘
                          │  - Config    │
                          └──────────────┘
                                 │
                                 │
                                 ▼
                          ┌──────────────┐
                          │ In-Memory    │
                          │ Data Storage │
                          │ (Migration   │
                          │  Ready)      │
                          └──────────────┘

┌─────────────────────────────────────────────────────────────┐
│              Deployment Layer (Docker + K8s)                │
│                                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                   │
│  │ Backend  │  │ Frontend │  │  Nginx   │                   │
│  │Container │  │Container │  │ Reverse  │                   │
│  │(Node:18) │  │(Nginx)   │  │  Proxy   │                   │
│  └──────────┘  └──────────┘  └──────────┘                   │
└─────────────────────────────────────────────────────────────┘
```

### MVC Backend Structure

```text
Backend
├── Models (Data Structures)
│   ├── Alert.js - SOS alert schema
│   └── Telemetry.js - Sensor data schema
│
├── Controllers (Business Logic)
│   └── telemetryController.js
│       ├── processTelemetry() - SOS detection logic
│       ├── getAlerts() - Alert retrieval
│       ├── removeAlert() - Alert deletion
│       ├── getStats() - System metrics
│       └── checkHealth() - Health monitoring
│
├── Routes (API Endpoints)
│   └── apiRoutes.js - Maps URLs to controllers
│
└── Config (Configuration)
    └── constants.js - Centralized settings
```

---

## 📁 Project Structure

```text
project-saaya/
│
├── .env                          # Single source of truth for IP config
├── .env.example                  # Template for environment variables
├── docker-compose.yml            # Multi-container orchestration
├── DEPLOYMENT.md                 # AWS deployment guide
├── README.md                     # This file
│
├── backend/                      # Node.js + Express Backend
│   ├── config/
│   │   └── constants.js          # Centralized configuration
│   ├── controllers/
│   │   └── telemetryController.js # Business logic layer
│   ├── models/
│   │   ├── Alert.js              # Alert data model
│   │   └── Telemetry.js          # Telemetry data model
│   ├── routes/
│   │   └── apiRoutes.js          # API endpoint definitions
│   ├── server.js                 # Express server entry point
│   ├── package.json              # Backend dependencies
│   ├── Dockerfile                # Backend container config
│   └── .dockerignore             # Docker exclusions
│
├── frontend/                     # React + Vite Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── AlertCard.jsx     # Alert display with Verify/Close
│   │   │   ├── AlertsList.jsx    # Scrollable alert container
│   │   │   ├── AlertsHeader.jsx  # Alerts panel header
│   │   │   ├── EmergencyContact.jsx # Hotline contact card
│   │   │   ├── Header.jsx        # Dashboard header + clock
│   │   │   ├── MapPanel.jsx      # Interactive map + routes
│   │   │   ├── Sidebar.jsx       # Navigation sidebar
│   │   │   ├── StatWidget.jsx    # Individual stat widget
│   │   │   └── StatsGrid.jsx     # Stats container
│   │   ├── data/
│   │   │   ├── Police_Data.js    # 100+ police stations
│   │   │   └── policeStations.js # Distance utilities
│   │   ├── styles/
│   │   │   └── theme.css         # Centralized theme
│   │   ├── config.js             # API configuration
│   │   ├── App.jsx               # Main application logic
│   │   └── main.jsx              # Entry point
│   ├── public/                   # Static assets
│   ├── package.json              # Frontend dependencies
│   ├── vite.config.js            # Vite configuration
│   ├── tailwind.config.js        # Tailwind configuration
│   ├── Dockerfile                # Frontend container config
│   └── .dockerignore             # Docker exclusions
│
└── qa-suite/                     # Maven + JUnit Testing
    ├── src/
    │   └── test/
    │       └── java/
    │           └── com/
    │               └── saaya/
    │                   ├── SaayaTest.java # Test suite
    │                   └── TestConfig.java # Auto-generated config
    ├── .mvn/
    │   └── jvm.config            # JVM warning suppression
    ├── pom.xml                   # Maven configuration
    └── sync-config.js            # Config generator from .env
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18.0.0 ([Download](https://nodejs.org/))
- **npm** >= 9.0.0 (comes with Node.js)
- **Java JDK** >= 8 (for QA tests) ([Download](https://www.oracle.com/java/technologies/downloads/))
- **Maven** >= 3.9.0 (for QA tests) ([Download](https://maven.apache.org/download.cgi))
- **Docker** (optional, for containerized deployment) ([Download](https://www.docker.com/))

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/PriyobrotoKarmakar/project-saaya.git
```bash
git clone https://github.com/PriyobrotoKarmakar/project-saaya.git
cd project-saaya
```

#### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

#### 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

#### 4. Configure Environment Variables

Create a `.env` file in the **root directory**:

```bash
# Copy the template
cp .env.example .env
```

Edit `.env`:

```bash
# For localhost development
VITE_BACKEND_IP=localhost
VITE_BACKEND_PORT=5000

# For AWS EC2 deployment (Replace with your server IP)
# VITE_BACKEND_IP=<YOUR_EC2_PUBLIC_IP>
# VITE_BACKEND_PORT=5000
```

> **Note:** This single `.env` file controls both frontend and QA test configurations!

### Running the Application

#### Start Backend Server

```bash
cd backend
npm run dev
```

Server runs on: `http://localhost:5000`

#### Start Frontend Dashboard

```bash
cd frontend
npm run dev
```

Dashboard runs on: `http://localhost:5173`

### Testing the System

#### Send Test Telemetry (Normal)

```http
POST http://localhost:5000/api/telemetry
Content-Type: application/json

{
  "deviceId": "Saaya_001",
  "heartRate": 120,
  "lat": 28.6139,
  "lng": 77.2090
}
```

Expected: ✅ Normal pulse logged (green console output)

#### Send Test Telemetry (Emergency)

```http
POST http://localhost:5000/api/telemetry
Content-Type: application/json

{
  "deviceId": "Saaya_002",
  "heartRate": 165,
  "lat": 19.0760,
  "lng": 72.8777
}
```

Expected: 🚨 SOS alert triggered (red console output, dashboard notification)

---

## ⚙️ Configuration

### Single Source Configuration

Project Saaya uses a **single `.env` file** in the root directory to manage all environment-specific settings.

#### Configuration Flow

```text
.env (ROOT)
  ↓
  ├─→ Frontend: Auto-reads via import.meta.env.VITE_BACKEND_IP
  │   └─→ Updates all API endpoints in config.js
  │
  └─→ QA Tests: sync-config.js generates TestConfig.java
      └─→ Maven auto-runs sync before tests
```

#### Changing Backend IP

**For Local Development:**

```bash
VITE_BACKEND_IP=localhost
```

**For AWS EC2 Deployment:**

```bash
VITE_BACKEND_IP=<YOUR_EC2_PUBLIC_IP>  # Example: 13.110.x.x
```

**Sync to QA Tests:**

```bash
cd qa-suite
node sync-config.js
```

> Maven automatically runs this sync before tests, so manual execution is optional!

---

## 📡 API Reference

### Base URL

```text
http://localhost:5000/api
```

### Endpoints

#### 1. Health Check

```http
GET /api/health
```

**Response:**

```json
{
  "status": "UP",
  "service": "Saaya-Backend",
  "timestamp": "2025-12-14T10:30:00.000Z"
}
```

#### 2. Telemetry Ingestion

```http
POST /api/telemetry
Content-Type: application/json
```

**Request Body:**

```json
{
  "deviceId": "Saaya_001",
  "heartRate": 165,
  "lat": 28.6139,
  "lng": 77.2090
}
```

**Response (Normal):**

```json
{
  "success": true,
  "message": "Telemetry received",
  "deviceId": "Saaya_001",
  "heartRate": 120,
  "alertTriggered": false,
  "timestamp": "2025-12-14T10:30:00.000Z"
}
```

**Response (SOS):**

```json
{
  "success": true,
  "message": "Telemetry received",
  "deviceId": "Saaya_001",
  "heartRate": 165,
  "alertTriggered": true,
  "timestamp": "2025-12-14T10:30:00.000Z"
}
```

#### 3. Get Active Alerts

```http
GET /api/alerts
```

**Response:**

```json
[
  {
    "deviceId": "Saaya_002",
    "status": "SOS",
    "heartRate": 165,
    "coordinates": [19.0760, 72.8777],
    "location": "Lat: 19.0760, Lng: 72.8777",
    "timestamp": "Just now",
    "createdAt": 1702547400000
  }
]
```

#### 4. Get System Statistics

```http
GET /api/stats
```

**Response:**

```json
{
  "totalAlerts": 5,
  "totalTelemetryReceived": 120,
  "activeDevices": 8,
  "lastUpdate": "2025-12-14T10:30:00.000Z"
}
```

#### 5. Remove Specific Alert

```http
DELETE /api/alerts/:deviceId/:timestamp
```

**Example:**

```http
DELETE /api/alerts/Saaya_002/Just%20now
```

**Response:**

```json
{
  "success": true,
  "message": "Alert removed",
  "deviceId": "Saaya_002",
  "timestamp": "Just now"
}
```

#### 6. Clear All Alerts (Testing)

```http
DELETE /api/alerts/clear
```

**Response:**

```json
{
  "success": true,
  "message": "All alerts cleared",
  "count": 5
}
```

---

## 🧪 Testing

### Automated Quality Gates (Maven + JUnit)

#### Prerequisites

- Java JDK 8+ installed
- Maven 3.9+ installed
- Backend server running

#### Run All Tests

```bash
cd qa-suite
mvn test
```

#### Test Cases

| Test | Description | Endpoint |
|------|-------------|----------|
| `testBackendIsRunning` | Verifies backend health | `/api/health` |
| `testAlertsEndpoint` | Validates alerts API | `/api/alerts` |
| `testStatsEndpoint` | Validates stats API | `/api/stats` |
| `testHealthResponseStructure` | Checks JSON validity | `/api/health` |

#### Expected Output (Success)

```text
-------------------------------------------------------
 T E S T S
-------------------------------------------------------
Running com.saaya.SaayaTest
  [Maven QA] Starting Project Saaya Health Check...
   Target: http://localhost:5000/api/health
   --> HTTP Response Code: 200
 [Success] Backend is Healthy. Ready for Cloud Deployment.

[Maven QA] Testing Alerts API Endpoint...
   Target: http://localhost:5000/api/alerts
   --> HTTP Response Code: 200
[Success] Alerts API is operational.

[Maven QA] Testing Stats API Endpoint...
   Target: http://localhost:5000/api/stats
   --> HTTP Response Code: 200
[Success] Stats API is operational.

[Maven QA] Validating Health Response Structure...
   Response: {"status":"UP","service":"Saaya-Backend","timestamp":"..."}
[Success] Health response structure is valid.

Tests run: 4, Failures: 0, Errors: 0, Skipped: 0

-------------------------------------------------------
BUILD SUCCESS
-------------------------------------------------------
Total time:  3.334 s
```

#### Sync Configuration from .env

Before running tests, ensure QA config is synced:

```bash
cd qa-suite
node sync-config.js
```

Output:

```text
✅ TestConfig.java updated with BACKEND_IP: localhost
```

> **Note:** Maven automatically runs this sync in the `generate-test-sources` phase!

---

## 🐳 Docker & Deployment

### Docker Images

Project Saaya includes production-ready Dockerfiles for both backend and frontend.

#### Build Backend Image

```bash
cd backend
docker build -t saaya-backend .
```

**Image Size:** ~150MB (Node.js 18 Alpine)

#### Build Frontend Image

```bash
cd frontend
docker build -t saaya-frontend .
```

**Image Size:** ~25MB (Nginx Alpine with React build)

### Docker Compose

Run the entire stack with one command:

```bash
docker-compose up -d
```

**Services:**

- `backend` - Node.js API server (port 5000)
- `frontend` - Nginx serving React build (port 80)

**Access:**

- Frontend: <http://localhost>
- Backend API: <http://localhost:5000>

**Stop Services:**

```bash
docker-compose down
```

### AWS EC2 Deployment

#### Step 1: Update Configuration

Edit `.env` in the root directory:

```bash
VITE_BACKEND_IP=<YOUR_EC2_PUBLIC_IP>
VITE_BACKEND_PORT=5000
```

#### Step 2: Sync QA Configuration

```bash
cd qa-suite
node sync-config.js
```

#### Step 3: Rebuild Frontend

```bash
cd frontend
npm run build
```

#### Step 4: Run Quality Tests

```bash
cd qa-suite
mvn clean test
```

#### Step 5: Deploy with Docker

```bash
docker-compose build
docker-compose up -d
```

**Security Group Rules (AWS EC2):**

- Port 80 (HTTP) - Inbound from 0.0.0.0/0
- Port 5000 (Backend API) - Inbound from 0.0.0.0/0
- Port 22 (SSH) - Inbound from your IP

For detailed deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md).

---

## 📚 Usage Guide

### Emergency Response Workflow

#### 1. Monitor Dashboard

- Dashboard polls backend every 2 seconds
- New SOS alerts trigger toast notifications
- Alerts appear in right panel with red styling

#### 2. Verify Emergency

- Click **"Verify Rape Attempt"** button on alert card
- System automatically:
  - Finds nearest police station (Haversine algorithm)
  - Draws colored route on map
  - Displays station details (name, contact, distance)
  - Shows police marker on map

#### 3. Multiple Simultaneous Emergencies

- Each verified route gets a unique color (8 colors available)
- Routes are clearly distinguishable
- Station popups show which device they're responding to

#### 4. Resolve Emergency

- Click **X button** on alert card
- Alert removed from:
  - Frontend state
  - Backend database
  - Map visualization (route + marker disappear)

### Police Database Coverage

**100+ Police Stations Across India:**

- **North:** Delhi, Chandigarh, Jaipur, Lucknow, Noida, Gurugram, Faridabad
- **South:** Bangalore, Chennai, Hyderabad, Cochin, Coimbatore, Trivandrum
- **West:** Mumbai, Pune, Ahmedabad, Surat, Nagpur, Indore, Vadodara
- **East:** Kolkata, Bhubaneswar, Guwahati, Ranchi, Patna
- **Central:** Bhopal, Raipur

Each station includes:

- Unique ID
- Name and address
- City and state
- Contact number
- GPS coordinates

### Map Features

- **Satellite Imagery:** Esri ArcGIS World Imagery
- **Place Labels:** Esri World Boundaries layer
- **Smart Zoom:** Auto-fits bounds on new alerts only
- **Interactive Popups:** Click markers for details
- **Radius Circles:** 300m circles around SOS locations
- **Route Lines:** Dashed polylines from station to victim

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

### Development Setup

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`mvn test` in qa-suite)
5. Commit changes (`git commit -m 'Add amazing feature'`)
6. Push to branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Code Standards

- **Backend:** Follow MVC pattern, use ES6+ syntax
- **Frontend:** Use functional components, React hooks
- **Testing:** Add tests for new features
- **Documentation:** Update README for significant changes
- **Commits:** Use clear, descriptive commit messages

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Esri ArcGIS** - Satellite imagery tiles
- **React Leaflet** - Interactive mapping library
- **Express.js** - Backend framework
- **Vite** - Frontend build tool
- **JUnit** - Testing framework

---

## 📞 Contact & Support

**Author:** Priyobroto Karmakar  
**Repository:** [github.com/PriyobrotoKarmakar/project-saaya](https://github.com/PriyobrotoKarmakar/project-saaya)

**Emergency Hotlines (India):**

- Women Helpline: **1091**
- National Emergency: **112**
- Police: **100**

---

<div align="center">

**⭐ If you find this project useful, please consider giving it a star!**

Made with ❤️ for Women's Safety

</div>
