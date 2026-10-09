import { Router } from 'express';
import { simulationEngine } from '../index';
export const router = Router();
router.post('/start', (req, res) => {
  const { type, intensity } = req.body;
  simulationEngine.start(type || 'normal', intensity || 1);
  res.json({ message: 'Simulation started' });
});
router.post('/stop', async (req, res) => {
  await simulationEngine.stop();
  res.json({ message: 'Simulation stopped' });
});
router.get('/status', (req, res) => {
  res.json(simulationEngine.status());
});
export default router;\n