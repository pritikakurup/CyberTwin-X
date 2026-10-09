import os

files = {
    "backend/src/db.ts": """
import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';

let db: Database;

export async function initDb() {
  db = await open({
    filename: './database.sqlite',
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT UNIQUE,
      password TEXT
    );
    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      sourceIp TEXT,
      destIp TEXT,
      port INTEGER,
      protocol TEXT,
      eventType TEXT,
      scenarioId TEXT
    );
    CREATE TABLE IF NOT EXISTS incidents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      category TEXT,
      severity TEXT,
      source TEXT,
      rule TEXT,
      evidence TEXT,
      status TEXT
    );
    CREATE TABLE IF NOT EXISTS actions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      actionType TEXT,
      target TEXT,
      reason TEXT,
      status TEXT,
      incidentId INTEGER
    );
    CREATE TABLE IF NOT EXISTS logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      action TEXT,
      details TEXT
    );
  `);
  console.log("Database initialized.");
}

export function getDb() { return db; }
""",
    "backend/src/simulation.ts": """
import { getDb } from './db';
import { io, detectionEngine } from './index';

export class SimulationEngine {
  private interval: NodeJS.Timeout | null = null;
  private running = false;
  private eventCount = 0;

  async start(type: string, intensity: number) {
    if (this.running) return;
    this.running = true;
    this.eventCount = 0;
    
    await getDb().run('INSERT INTO logs (action, details) VALUES (?, ?)', ['SIMULATION_START', `Type: ${type}`]);
    
    this.interval = setInterval(async () => {
      if (!this.running) return;
      this.eventCount++;
      const db = getDb();
      
      let sourceIp = '10.0.0.10';
      let destIp = '10.0.0.20';
      let port = 80;
      let protocol = 'TCP';
      let eventType = 'NORMAL';
      
      if (type === 'port-scan') {
        port = Math.floor(Math.random() * 65535);
        eventType = 'CONNECTION_ATTEMPT';
      } else if (type === 'dos') {
        eventType = 'HIGH_VOLUME_REQUEST';
      }
      
      const res = await db.run(
        'INSERT INTO events (sourceIp, destIp, port, protocol, eventType, scenarioId) VALUES (?, ?, ?, ?, ?, ?)',
        [sourceIp, destIp, port, protocol, eventType, type]
      );
      
      const event = await db.get('SELECT * FROM events WHERE id = ?', [res.lastID]);
      io.emit('new_event', event);
      
      detectionEngine.analyze(event);
      
      if (this.eventCount >= intensity * 10) {
        this.stop();
      }
    }, 1000 / intensity);
  }
  
  async stop() {
    this.running = false;
    if (this.interval) clearInterval(this.interval);
    await getDb().run('INSERT INTO logs (action, details) VALUES (?, ?)', ['SIMULATION_STOP', `Events generated: ${this.eventCount}`]);
  }
  
  status() {
    return { running: this.running, eventCount: this.eventCount };
  }
}
""",
    "backend/src/detection.ts": """
import { getDb } from './db';
import { io } from './index';

export class DetectionEngine {
  private recentEvents: any[] = [];
  
  async analyze(event: any) {
    this.recentEvents.push(event);
    const now = new Date(event.timestamp).getTime();
    this.recentEvents = this.recentEvents.filter(e => now - new Date(e.timestamp).getTime() < 10000);
    
    const dosEvents = this.recentEvents.filter(e => e.eventType === 'HIGH_VOLUME_REQUEST');
    if (dosEvents.length > 5) {
      await this.createIncident('Denial of Service', 'CRITICAL', event.sourceIp, 'Rate limit exceeded > 5 per 10s', 'Many high volume requests');
      this.recentEvents = this.recentEvents.filter(e => e.eventType !== 'HIGH_VOLUME_REQUEST'); // clear to prevent spam
    }
    
    const scanEvents = this.recentEvents.filter(e => e.eventType === 'CONNECTION_ATTEMPT');
    if (scanEvents.length > 5) {
      const uniquePorts = new Set(scanEvents.map(e => e.port));
      if (uniquePorts.size > 3) {
        await this.createIncident('Port Scan', 'HIGH', event.sourceIp, 'Multiple ports accessed rapidly', 'Accessed > 3 ports within 10s');
        this.recentEvents = this.recentEvents.filter(e => e.eventType !== 'CONNECTION_ATTEMPT');
      }
    }
  }
  
  private async createIncident(category: string, severity: string, source: string, rule: string, evidence: string) {
    const db = getDb();
    const res = await db.run(
      'INSERT INTO incidents (category, severity, source, rule, evidence, status) VALUES (?, ?, ?, ?, ?, ?)',
      [category, severity, source, rule, evidence, 'OPEN']
    );
    const incident = await db.get('SELECT * FROM incidents WHERE id = ?', [res.lastID]);
    io.emit('new_incident', incident);
    await db.run('INSERT INTO logs (action, details) VALUES (?, ?)', ['THREAT_DETECTED', `Category: ${category}, Source: ${source}`]);
  }
}
"""
}

for filepath, content in files.items():
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    with open(filepath, 'w') as f:
        f.write(content.strip() + "\\n")

print("Backend Scaffolded")
