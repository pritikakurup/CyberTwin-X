import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getDb } from '../db';
export const router = Router();

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'Missing fields' });
  const db = getDb();
  try {
    const hash = await bcrypt.hash(password, 10);
    await db.run('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hash]);
    await db.run('INSERT INTO logs (action, details) VALUES (?, ?)', ['USER_REGISTER', `User: ${email}`]);
    res.json({ message: 'Registration successful' });
  } catch (err: any) {
    if (err.message.includes('UNIQUE')) return res.status(409).json({ error: 'Email exists' });
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const db = getDb();
  const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
  await db.run('INSERT INTO logs (action, details) VALUES (?, ?)', ['USER_LOGIN', `User: ${email}`]);
  res.json({ token, name: user.name });
});

export default router;
