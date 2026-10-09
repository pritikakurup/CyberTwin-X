# CyberTwin-X: Digital Twin for Adaptive Cyber Defense

**Academic Cybersecurity Project — Group 32**

## 1. Project Overview

CyberTwin-X is a full-stack cybersecurity application that simulates network traffic in an isolated virtual software environment. It supports synthetic normal traffic, port-scan-style activity, and Denial of Service (DoS)-style activity. The application provides traffic monitoring, rule-based threat detection, defensive response recommendations, response approval workflows, audit logging, and a dashboard for system metrics.

## 2. Architecture and Features

- **Authentication:** User registration and login using bcrypt password hashing and JSON Web Tokens (JWT).
- **Traffic Simulation:** Generates synthetic normal and suspicious traffic events.
- **Database Persistence:** Uses SQLite to store application data, including users, events, incidents, actions, and audit logs.
- **Rule-Based Threat Detection:** Uses configured heuristics to identify suspicious traffic patterns, including port scans and high-volume requests.
- **Defensive Response Workflow:** Presents proposed defensive actions, such as `BLOCK_IP`, for operator approval or rejection within the virtual environment.
- **Audit Logging:** Records relevant application activities and response actions.
- **Real-Time Monitoring:** Uses Socket.IO for event communication between the backend and frontend.
- **Dashboard:** Displays backend health and available event, incident, and defensive-action metrics.

## 3. Technology Stack

**Frontend**
- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Lucide React
- Socket.IO Client
- Recharts

**Backend**
- Node.js
- Express
- TypeScript
- SQLite
- Socket.IO
- bcrypt
- JSON Web Tokens (JWT)

**Testing**
- Jest and Supertest for backend tests
- Vitest and React Testing Library for frontend tests

## 4. Prerequisites

Install the following before running the project:

- Node.js version 18 or later
- npm version 9 or later

Check your installed versions:

```bash
node --version
npm --version
```

## 5. Installation and Execution

### Step 1: Obtain the project

Clone the repository:

```bash
git clone https://github.com/pritikakurup/CyberTwin-X.git
cd CyberTwin-X
```

Alternatively, extract the submitted ZIP file and open a terminal in the extracted project directory.

### Step 2: Install dependencies

From the project root, run:

```bash
npm run install:all
```

This installs the backend and frontend dependencies.

### Step 3: Configure the environment

Review `.env.example` for the available configuration variables. Create the required environment file if the application needs one, and never commit real credentials or secrets.

The backend defaults to port `3001`, and the Vite frontend normally runs on port `5173`.

### Step 4: Start the application

From the project root, run:

```bash
npm run dev
```

The root script starts the backend and frontend concurrently.

Open the frontend in your browser:

**http://localhost:5173**

The backend API uses:

**http://localhost:3001**

Keep the terminal running while using the application. Stop the development servers with `Ctrl + C`.

### Alternative: Start services separately

**Terminal 1 — Backend**

```bash
cd backend
npm install
npx ts-node src/index.ts
```

**Terminal 2 — Frontend**

```bash
cd frontend
npm install
npm run dev
```

## 6. Running Automated Tests

Run the backend tests:

```bash
cd backend
npm test
```

Run the frontend tests in a separate command:

```bash
cd frontend
npm test
```

To create a production build of the frontend:

```bash
cd frontend
npm run build
```

## 7. Application Workflow

The application is designed to support the following workflow:

1. **Authentication:** Register or log in through the application's authentication pages.
2. **Simulation:** Open the Digital Twin Simulation page, select an available traffic scenario, and start the simulation.
3. **Monitoring:** Open Network Monitoring to inspect generated traffic events.
4. **Threat Detection:** Review detected incidents on the Threat Intelligence page.
5. **Defensive Responses:** Review proposed responses and approve or reject them where supported.
6. **Audit Logs:** Inspect recorded activities and response actions.
7. **Dashboard:** Review available system health and monitoring metrics.

Actual results depend on the configured simulation, detection rules, and application state.

## 8. Database and Configuration

The backend uses SQLite and initialises its database through the application code.

The project may create a local database file when it runs. If a database file is included with the submission, it should contain only appropriate demonstration data and no real credentials or sensitive personal information.

Use `.env.example` as a reference for environment configuration. Do not include real `.env` files, passwords, signing secrets, or access tokens in the submitted ZIP or public repository.

## 9. Safety and Scope

CyberTwin-X is designed for synthetic traffic simulation and defensive workflow demonstration within a virtual software environment. It is not intended to perform external network scanning, packet sniffing, or host firewall modifications.

Any proposed defensive actions should be understood as application-level demonstrations unless a separately documented and authorised integration exists.

## 10. Known Limitations

- Threat detection is based on configured rules and heuristics rather than a comprehensive production-grade detection engine.
- Traffic is synthetic and does not represent a complete real-world network.
- The application's response workflow is a demonstration and should not be treated as a substitute for production security controls.
- Test results indicate only the behaviour covered by the available automated tests.

## 11. Repository

**GitHub:** https://github.com/pritikakurup/CyberTwin-X

## 12. Project Team

**Group:** 32

| Sr. No. | Team Member Name | PRN |
|---|---|---|
| 1 | Gayatri Patil | 23070122096 |
| 2 | Pritika Kurup | 23070122167 |
| 3 | Sejal More | 24070122509 |

---cd /Users/pritikaaa/Documents/cybersec_

**End of README**


