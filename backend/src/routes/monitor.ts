import { Router } from 'express';
import { getDb } from '../db';
export const router = Router();
router.get('/events', async (req, res) => {
  const db = getDb();
  const events = await db.all('SELECT * FROM events ORDER BY timestamp DESC LIMIT 100');
  res.json(events);
});
export default router;\n