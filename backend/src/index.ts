import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import { initDb } from './db';
import authRoutes from './routes/auth';
import simulationRoutes from './routes/simulation';
import monitorRoutes from './routes/monitor';
import threatRoutes from './routes/threat';
import actionRoutes from './routes/action';
import logsRoutes from './routes/logs';
import { SimulationEngine } from './simulation';
import { DetectionEngine } from './detection';

dotenv.config();

const app = express();
const server = http.createServer(app);
export const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());

// Initialize Engines
export const simulationEngine = new SimulationEngine();
export const detectionEngine = new DetectionEngine();
detectionEngine.setIo(io);

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/simulation', simulationRoutes);
app.use('/api/v1/monitor', monitorRoutes);
app.use('/api/v1/threats', threatRoutes);
app.use('/api/v1/actions', actionRoutes);
app.use('/api/v1/logs', logsRoutes);

app.get('/api/v1/health', (req, res) => {
  res.json({ status: 'ok', service: 'CyberTwin-X Backend' });
});

const PORT = process.env.PORT || 3000;

initDb().then(() => {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(console.error);

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});
