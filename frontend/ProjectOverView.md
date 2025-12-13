Here is a professional, high-impact `README.md` file for **Project Saaya**.

I have designed this specifically so that if you feed this file to an AI in the future (like Cursor, GitHub Copilot, or ChatGPT), it will immediately understand **why** you are building this (the emotion) and **exactly** how to structure the code (the DevOps tools).

You can save this file as `README.md` in your main project folder.

-----

# 🌑 Project Saaya: The Invisible Shield

[](https://kubernetes.io/)
[](https://www.jenkins.io/)
[](https://maven.apache.org/)
[](https://aws.amazon.com/)

> *"Fear is a glitch. Safety is the code."*

## 📖 Project Overview

**Project Saaya** is a Cloud-Native, "Digital Twin" IoT platform designed to address the critical gap in women's safety infrastructure. [cite_start]Research indicates that **89% of harassment cases go unreported** due to fear or lack of immediate evidence[cite: 16].

Standard safety devices fail when servers crash or networks lag. **Project Saaya** solves this by building a **Zero-Downtime, Self-Healing Infrastructure**. It acts as an "Invisible Shield" that follows the victim everywhere, using a mocked IoT network to detect distress signals (Heart Rate Spikes/SOS) and relaying them to a Central Command Dashboard instantly.

-----

## 🏗️ System Architecture (The "Ghost" Infrastructure)

Since hardware availability is limited during development, this project utilizes a **Digital Twin Simulator** to mimic real-world IoT traffic.

1.  **The Shadow (Simulator):** A Node.js script simulating a smart bangle. It generates telemetry (Heart Rate, GPS) and triggers "Panic Events" based on randomized stress algorithms.
2.  **The Brain (Backend):** A Node.js/Express Microservice that ingests telemetry. It uses logic gates to classify threats (e.g., `HeartRate > 150 BPM` = **Critical Alert**).
3.  **The Eye (Dashboard):** A React.js Command Center for authorities. It visualizes victims on a map and flashes **RED** during active alerts.
4.  **The Guardian (DevOps):** A fully automated CI/CD pipeline ensuring the system never fails.

-----

## 🛠️ Tech Stack & Tool Integration

### 1\. Application Layer (Full Stack)

  * **Frontend:** React.js (Live Dashboard with Polling).
  * **Backend:** Node.js + Express (REST API).
  * **Database:** MongoDB (storing Telemetry & Alerts).
  * **Simulator:** Node.js (Generating synthetic IoT packets).

### 2\. DevOps Layer (Syllabus Compliance)

  * **Source Control:** **Git** (GitHub) for version tracking.
  * **Containerization:** **Docker** for packaging the Node.js backend into lightweight, portable containers.
  * **Orchestration:** **Kubernetes (K8s)** for deploying containers with Auto-Scaling and Self-Healing (restarting crashed pods).
  * **CI/CD Automation:** **Jenkins** pipelines to automate the `Commit -> Test -> Build -> Deploy` lifecycle.
  * **Configuration Mgmt:** **Ansible** for provisioning AWS EC2 instances and installing dependencies.
  * **Monitoring:** **Nagios** for tracking server health (CPU/Memory) to detect "DDoS" or high-load scenarios.

### 3\. Quality Assurance (Critical for Reliability)

  * **Build Tool:** **Maven** (Java). Used specifically to manage the **Test Suite** dependencies.
  * **Testing:** **Selenium**. Automated browser tests triggered by Maven to verify the "Health" of the deployed web application before it goes live.

-----

## 🤖 Implementation Specs (For AI Generation)

*This section provides context for AI assistants to generate the correct codebase.*

### **Backend Specification (`/backend`)**

  * **Framework:** Express.js.
  * **Endpoints:**
      * `POST /api/telemetry`: Accepts JSON `{ deviceId, heartRate, gps, timestamp }`. Logic: If `heartRate > 150`, flag as `status: "SOS"`.
      * `GET /api/alerts`: Returns active SOS records.
      * `GET /health`: Returns `{ status: "UP" }` (Used by K8s Liveness Probe).
  * **Docker:** Create a `Dockerfile` exposing port 5000. Use `node:alpine`.

### **Simulator Specification (`/simulator`)**

  * **Logic:** Loop every 3 seconds. 10% probability of sending `heartRate: 160`. Otherwise, send `heartRate: 70-90`.
  * **Network:** `axios.post()` to the Backend API.

### **Frontend Specification (`/frontend`)**

  * **UI Theme:** Dark Mode ("Cyberpunk" / Security Console style).
  * **Components:** `AlertFeed.js` (List), `MapPanel.js` (Visual).
  * **Behavior:** Poll `/api/alerts` every 2 seconds. If array length \> 0, trigger **Emergency State** (Red Background).

### **Maven Test Suite (`/qa-suite`)**

  * **Structure:** Standard Maven Project (`pom.xml`).
  * **Dependency:** `selenium-java`.
  * **Test Case:** Open Headless Chrome -\> Visit Backend `/health` -\> Assert Response contains "UP".

-----

## 🚀 Setup & Installation

### Prerequisites

  * Node.js & npm
  * Docker Desktop
  * Java JDK & Maven

### Step 1: Run the Infrastructure

```bash
# Clone the repo
git clone https://github.com/your-username/project-saaya.git

# Start the Backend (The Brain)
cd backend
npm install
npm start
# Server runs on 13.220.122.72:5000
```

### Step 2: Launch the Dashboard

```bash
# Start the Frontend (The Eye)
cd frontend
npm install
npm start
# Dashboard runs on localhost:3000
```

### Step 3: Activate the Simulation

```bash
# Start the IoT Mock (The Shadow)
cd simulator
node device_sim.js
# You should see "Sending Data..." in the console
```

-----

## 🔮 Future Scope

  * [cite_start]**Hardware Integration:** Connecting Graphene-based sweat sensors[cite: 109].
  * [cite_start]**AI Analysis:** Integrating AWS Rekognition for analyzing video evidence[cite: 101].
  * [cite_start]**Blockchain:** Storing evidence logs on a tamper-proof ledger for legal validity[cite: 109].

-----

**Built with ❤️ and Code. Dedicated to the 89%.**