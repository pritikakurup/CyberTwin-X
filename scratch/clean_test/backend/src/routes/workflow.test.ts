import request from 'supertest';
import express from 'express';
import authRoutes from './auth';
import threatRoutes from './threat';
import actionRoutes from './action';
import monitorRoutes from './monitor';
import logsRoutes from './logs';
import { initDb } from '../db';
import { DetectionEngine } from '../detection';

const app = express();
app.use(express.json());
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/threats', threatRoutes);
app.use('/api/v1/actions', actionRoutes);
app.use('/api/v1/monitor', monitorRoutes);
app.use('/api/v1/logs', logsRoutes);

describe('CyberTwin-X Full End-to-End Workflow Test', () => {
  beforeAll(async () => {
    await initDb();
  });

  it('1. User Registration & Login Workflow', async () => {
    const regRes = await request(app)
      .post('/api/v1/auth/register')
      .send({ name: 'Test User', email: 'test@cybertwin.local', password: 'password123' });
    expect(regRes.status).toBe(200);
    expect(regRes.body.message).toContain('successful');

    const loginRes = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'test@cybertwin.local', password: 'password123' });
    expect(loginRes.status).toBe(200);
    expect(loginRes.body.token).toBeDefined();
    expect(loginRes.body.name).toBe('Test User');
  });

  it('2. Synthetic Event -> Detection -> Action Creation -> Approval -> Audit Log Loop', async () => {
    const detector = new DetectionEngine();

    // Simulate high volume requests from attacker IP 192.168.1.100 to trigger DoS rule
    for (let i = 0; i < 7; i++) {
      await detector.analyze({
        timestamp: new Date().toISOString(),
        eventType: 'HIGH_VOLUME_REQUEST',
        sourceIp: '192.168.1.100',
        destIp: '10.0.0.1',
        port: 80,
        protocol: 'TCP',
        bytes: 500
      });
    }

    // Verify incident creation
    const incidentsRes = await request(app).get('/api/v1/threats');
    expect(incidentsRes.status).toBe(200);
    expect(incidentsRes.body.length).toBeGreaterThan(0);
    const dosIncident = incidentsRes.body.find((inc: any) => inc.source === '192.168.1.100');
    expect(dosIncident).toBeDefined();
    expect(dosIncident.category).toContain('Denial of Service');

    // Verify pending defensive action creation
    const actionsRes = await request(app).get('/api/v1/actions');
    expect(actionsRes.status).toBe(200);
    expect(actionsRes.body.length).toBeGreaterThan(0);
    const actionToApprove = actionsRes.body.find((act: any) => act.target === '192.168.1.100');
    expect(actionToApprove).toBeDefined();
    expect(actionToApprove.status).toBe('PENDING');

    // Approve the defensive response
    const approveRes = await request(app).post(`/api/v1/actions/${actionToApprove.id}/approve`);
    expect(approveRes.status).toBe(200);
    expect(approveRes.body.message).toContain('approved');

    // Verify action status updated to APPLIED
    const updatedActionsRes = await request(app).get('/api/v1/actions');
    const approvedAction = updatedActionsRes.body.find((act: any) => act.id === actionToApprove.id);
    expect(approvedAction.status).toBe('APPLIED');

    // Verify Audit Log creation
    const logsRes = await request(app).get('/api/v1/logs');
    expect(logsRes.status).toBe(200);
    expect(logsRes.body.length).toBeGreaterThan(0);
    const approvedLog = logsRes.body.find((log: any) => log.action === 'ACTION_APPROVED');
    expect(approvedLog).toBeDefined();

    // Verify Dashboard Metrics Endpoint
    const metricsRes = await request(app).get('/api/v1/monitor/metrics');
    expect(metricsRes.status).toBe(200);
    expect(metricsRes.body.totalIncidents).toBeGreaterThan(0);
    expect(metricsRes.body.totalActions).toBeGreaterThan(0);
  });
});
