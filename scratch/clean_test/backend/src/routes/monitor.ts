import { Router } from 'express';
import { getDb } from '../db';
export const router = Router();
router.get('/events', async (req, res) => {
  const db = getDb();
  const events = await db.all('SELECT * FROM events ORDER BY timestamp DESC LIMIT 100');
  res.json(events);
});

router.get('/metrics', async (req, res) => {
  const db = getDb();
  const events = await db.get('SELECT COUNT(*) as count FROM events');
  const incidents = await db.get('SELECT COUNT(*) as count FROM incidents');
  const actions = await db.get('SELECT COUNT(*) as count FROM actions');
  res.json({
    totalEvents: events.count,
    totalIncidents: incidents.count,
    totalActions: actions.count
  });
});

export default router;
