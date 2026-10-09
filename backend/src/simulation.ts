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
}\n