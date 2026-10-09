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
}\n