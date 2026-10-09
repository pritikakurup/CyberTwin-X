import os

files = {
    "backend/src/routes/auth.ts": """
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
""",
    "frontend/src/pages/Login.tsx": """
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3000/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      localStorage.setItem('token', data.token);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center h-full bg-slate-950 text-slate-100">
      <div className="w-full max-w-md p-8 bg-slate-900 border border-slate-800 rounded-lg">
        <div className="flex items-center justify-center space-x-2 mb-6">
          <Shield className="w-8 h-8 text-cyan-500" />
          <h2 className="text-2xl font-bold">CyberTwin-X Login</h2>
        </div>
        {error && <div className="p-3 mb-4 text-sm text-red-400 bg-red-900/20 border border-red-800 rounded">{error}</div>}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-slate-200 focus:outline-none focus:border-cyan-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-slate-200 focus:outline-none focus:border-cyan-500" />
          </div>
          <button type="submit" className="w-full py-2 bg-cyan-600 hover:bg-cyan-700 rounded text-white font-medium transition-colors">Login</button>
        </form>
        <div className="mt-4 text-center text-sm text-slate-400">
          Don't have an account? <Link to="/register" className="text-cyan-500 hover:underline">Register</Link>
        </div>
      </div>
    </div>
  );
}
""",
    "frontend/src/pages/Register.tsx": """
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield } from 'lucide-react';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3000/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      navigate('/login');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center h-full bg-slate-950 text-slate-100">
      <div className="w-full max-w-md p-8 bg-slate-900 border border-slate-800 rounded-lg">
        <div className="flex items-center justify-center space-x-2 mb-6">
          <Shield className="w-8 h-8 text-cyan-500" />
          <h2 className="text-2xl font-bold">CyberTwin-X Register</h2>
        </div>
        {error && <div className="p-3 mb-4 text-sm text-red-400 bg-red-900/20 border border-red-800 rounded">{error}</div>}
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-slate-200 focus:outline-none focus:border-cyan-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-slate-200 focus:outline-none focus:border-cyan-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-slate-200 focus:outline-none focus:border-cyan-500" />
          </div>
          <button type="submit" className="w-full py-2 bg-cyan-600 hover:bg-cyan-700 rounded text-white font-medium transition-colors">Register</button>
        </form>
        <div className="mt-4 text-center text-sm text-slate-400">
          Already have an account? <Link to="/login" className="text-cyan-500 hover:underline">Login</Link>
        </div>
      </div>
    </div>
  );
}
"""
}

for filepath, content in files.items():
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    with open(filepath, 'w') as f:
        f.write(content.strip() + "\\n")
print("Auth components written")
