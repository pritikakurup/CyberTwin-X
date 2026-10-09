import { Router } from 'express';
import { getDb } from '../db';
export const router = Router();
router.get('/', async (req, res) => {
  const db = getDb();
  const actions = await db.all('SELECT * FROM actions ORDER BY timestamp DESC');
  res.json(actions);
});
export default router;\n