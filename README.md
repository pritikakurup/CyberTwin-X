# CyberTwin-X: Digital Twin for Adaptive Cyber Defense

## Overview
CyberTwin-X is a digital twin application for cybersecurity that creates an isolated virtual network environment to simulate normal traffic, port scans, and Denial of Service (DoS) attacks. It provides real-time monitoring, rule-based threat detection, and an interface for investigating incidents and deploying simulated defensive responses.

## Implemented Features
- User Authentication (Registration & Login via backend)
- Virtual Network Simulation (Normal Traffic, Port Scan, DoS)
- Real-time Network Monitoring (Socket.IO + SQLite)
- Rule-based Threat Detection (identifies high-volume requests and port scans)
- Incident Management (Dashboard & Threat viewing)
- Application Settings & Health checks

## Technology Stack
- **Frontend**: React, TypeScript, Vite, Tailwind CSS, Recharts, Lucide, Socket.IO Client.
- **Backend**: Node.js, Express, TypeScript, SQLite, Socket.IO Server.

## Prerequisites
- Node.js (v18 or higher)
- npm

## Setup Instructions

1. **Install dependencies:**
   From the root of the project, run:
   ```bash
   npm install
   npm run install:all
   ```

2. **Database Initialization:**
   The SQLite database initializes automatically when the backend starts.

3. **Start the Application:**
   From the root of the project, run:
   ```bash
   npm run dev
   ```
   This will start both the backend server (port 3000) and the frontend Vite server (usually port 5173).

## Usage
- Open `http://localhost:5173` in your browser.
- Navigate to the Simulation tab to start generating traffic.
- Navigate to Monitoring to see real-time events.
- If a threat is detected, it will be logged.

## Important Note
This application operates strictly within an isolated virtual environment. All attacks and defensive actions are synthesized internally and **do not** interact with the host machine's actual networking stack or firewall.

## GitHub Repository
URL: https://github.com/pritikakurup/CyberTwin-X (Pending publication)
