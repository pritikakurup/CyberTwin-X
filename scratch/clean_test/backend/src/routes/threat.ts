import { Router } from 'express';
import { getDb } from '../db';
export const router = Router();
router.get('/', async (req, res) => {
  const db = getDb();
  const incidents = await db.all('SELECT * FROM incidents ORDER BY timestamp DESC');
  res.json(incidents);
});
export default router;
