import os

files = {
    "backend/src/routes/auth.ts": """
import { Router } from 'express';
export const router = Router();
router.post('/register', (req, res) => res.json({ message: 'Register endpoint' }));
router.post('/login', (req, res) => res.json({ message: 'Login endpoint' }));
export default router;
""",
    "backend/src/routes/simulation.ts": """
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
export default router;
""",
    "backend/src/routes/monitor.ts": """
import { Router } from 'express';
import { getDb } from '../db';
export const router = Router();
router.get('/events', async (req, res) => {
  const db = getDb();
  const events = await db.all('SELECT * FROM events ORDER BY timestamp DESC LIMIT 100');
  res.json(events);
});
export default router;
""",
    "backend/src/routes/threat.ts": """
import { Router } from 'express';
import { getDb } from '../db';
export const router = Router();
router.get('/', async (req, res) => {
  const db = getDb();
  const incidents = await db.all('SELECT * FROM incidents ORDER BY timestamp DESC');
  res.json(incidents);
});
export default router;
""",
    "backend/src/routes/action.ts": """
import { Router } from 'express';
import { getDb } from '../db';
export const router = Router();
router.get('/', async (req, res) => {
  const db = getDb();
  const actions = await db.all('SELECT * FROM actions ORDER BY timestamp DESC');
  res.json(actions);
});
export default router;
"""
}

for filepath, content in files.items():
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    with open(filepath, 'w') as f:
        f.write(content.strip() + "\\n")

print("Backend routes scaffolded")
