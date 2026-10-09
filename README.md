# CyberTwin-X: Digital Twin for Adaptive Cyber Defense

**Academic Cybersecurity Project — Group 32**

## Overview
CyberTwin-X is a full-stack digital twin framework for cybersecurity. It creates an isolated, virtual network environment to simulate normal traffic, port scanning, and Denial of Service (DoS) attacks. It provides real-time traffic monitoring, rule-based threat detection heuristics, defensive response recommendations, response approval workflows, audit logging, and dynamic metrics dashboards.

## Architecture & Features
- **Authentication**: User registration & login with password hashing (`bcrypt`), JWT token issuance, and route protection.
- **Traffic Simulation Engine**: Configurable synthetic traffic generator emitting normal and malicious events (`HIGH_VOLUME_REQUEST`, `CONNECTION_ATTEMPT`).
- **SQLite Data Persistence**: Stores users, events, detected incidents, recommended defensive actions, and audit logs.
- **Rule-based Detection Engine**: Monitors real-time events to flag Port Scans (>3 unique ports/10s) and DoS attacks (>5 high-volume requests/10s).
- **Defensive Response Approval**: Generates pending `BLOCK_IP` action proposals upon threat detection, allowing operators to approve/apply responses and update virtual network state.
- **Audit Logging**: Persists system actions (`USER_REGISTER`, `USER_LOGIN`, `THREAT_DETECTED`, `ACTION_APPROVED`) in SQLite and provides an Audit Logs UI.
- **Real-Time WebSockets**: Instant event and threat broadcasting via `Socket.IO`.
- **Overview Dashboard**: Displays backend health and live metrics (total events, incidents, defensive actions).

## Technology Stack
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons, Socket.IO Client, React Router v6.
- **Backend**: Node.js, Express, TypeScript, SQLite (`sqlite` / `sqlite3`), Socket.IO, `bcrypt`, `jsonwebtoken`.
- **Testing**: Jest & Supertest (Backend), Vitest & React Testing Library (Frontend).

## Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

## Setup & Execution

### 1. Install Dependencies
From the project root:
```bash
npm run install:all
```

### 2. Run Application (Concurrent Backend & Frontend)
```bash
npm run dev
```
- Backend runs on: `http://localhost:3001`
- Frontend runs on: `http://localhost:5173`

### 3. Run Automated Test Suites
```bash
# Backend Tests (Jest + Supertest)
cd backend && npm test

# Frontend Tests (Vitest + React Testing Library)
cd frontend && npm test
```

## Verified Workflow (End-to-End)
1. **User Authentication**: Register/Login at `/register` or `/login`.
2. **Simulation**: Navigate to `/simulation`, select "Port Scan" or "DoS", and click "Start Simulation".
3. **Monitoring**: Navigate to `/monitoring` to view real-time traffic events streamed via Socket.IO.
4. **Threat Detection**: Heuristics detect anomalous traffic patterns and persist an incident to SQLite.
5. **Defensive Response**: Navigate to `/responses` to review pending defensive proposals and click "Approve".
6. **Audit Logging & Dashboard**: Action approval updates the virtual network state, logs an entry in `/logs`, and increments metrics on `/dashboard`.

## Environment & Exclusions
- Configured in `.env` (derived from `.env.example`).
- Secrets, `node_modules`, `dist`, `.DS_Store`, and `database.sqlite` are excluded via `.gitignore`.

## Important Safety Note
All simulations and defensive actions operate strictly within an isolated virtual software environment. CyberTwin-X **does not** perform external network scanning, packet sniffing, or host firewall modifications.

## GitHub Repository
URL: https://github.com/pritikakurup/CyberTwin-X
