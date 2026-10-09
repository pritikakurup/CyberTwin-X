import request from 'supertest';
import express from 'express';
import threatRoutes from './threat';
import { initDb } from '../db';

const app = express();
app.use(express.json());
app.use('/api/v1/threats', threatRoutes);

describe('Threats API', () => {
  beforeAll(async () => {
    await initDb();
  });

  it('GET /api/v1/threats should return threats array', async () => {
    const res = await request(app).get('/api/v1/threats');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });
});\n