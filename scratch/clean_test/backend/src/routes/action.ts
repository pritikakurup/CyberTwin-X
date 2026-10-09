import { Router } from 'express';
import { getDb } from '../db';
export const router = Router();
router.get('/', async (req, res) => {
  const db = getDb();
  const actions = await db.all('SELECT * FROM actions ORDER BY timestamp DESC');
  res.json(actions);
});

router.post('/:id/approve', async (req, res) => {
  const { id } = req.params;
  const db = getDb();
  await db.run('UPDATE actions SET status = ? WHERE id = ?', ['APPLIED', id]);
  await db.run('INSERT INTO logs (action, details) VALUES (?, ?)', ['ACTION_APPROVED', `Action ID: ${id} applied`]);
  res.json({ message: 'Action approved and applied' });
});

export default router;
