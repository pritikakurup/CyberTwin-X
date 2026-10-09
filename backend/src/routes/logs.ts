import { Router } from 'express';
import { getDb } from '../db';
export const router = Router();
router.get('/', async (req, res) => {
  const db = getDb();
  const logs = await db.all('SELECT * FROM logs ORDER BY timestamp DESC LIMIT 200');
  res.json(logs);
});
export default router;
