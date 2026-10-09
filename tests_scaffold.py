import os

files = {
    "backend/src/routes/threat.test.ts": """
import request from 'supertest';
import express from 'express';
import threatRoutes from './threat';
import { initDb } from '../db';

const app = express();
app.use(express.json());
app.use('/api/v1/threats', threatRoutes);

describe('Threats API', () => {
  beforeAll(async () => {
    await initDb();
  });

  it('GET /api/v1/threats should return threats array', async () => {
    const res = await request(app).get('/api/v1/threats');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });
});
""",
    "frontend/src/App.test.tsx": """
import { render, screen } from '@testing-library/react';
import App from './App';
import { describe, it, expect } from 'vitest';
import React from 'react';

describe('App', () => {
  it('renders login page by default', () => {
    render(<App />);
    expect(screen.getByText(/CyberTwin-X Login/i)).toBeInTheDocument();
  });
});
""",
    "frontend/vite.config.ts": """
/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  },
});
""",
    "frontend/src/setupTests.ts": """
import '@testing-library/jest-dom';
"""
}

for filepath, content in files.items():
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    with open(filepath, 'w') as f:
        f.write(content.strip() + "\\n")
print("Tests scaffolded")
