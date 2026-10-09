import os

files = {
    "frontend/src/App.tsx": """
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Activity, Shield, AlertTriangle, Settings, FileText, Server } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import Simulation from './pages/Simulation';
import Monitoring from './pages/Monitoring';

function App() {
  return (
    <BrowserRouter>
      <div className="flex h-screen bg-slate-950 text-slate-100 font-sans">
        {/* Sidebar */}
        <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
          <div className="p-6 flex items-center space-x-3">
            <Shield className="w-8 h-8 text-cyan-500" />
            <h1 className="text-xl font-bold tracking-wider text-slate-100">CyberTwin-X</h1>
          </div>
          <nav className="flex-1 px-4 space-y-2 mt-4">
            <Link to="/dashboard" className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-slate-800 text-slate-300 hover:text-white transition-colors">
              <Activity className="w-5 h-5" /> <span>Dashboard</span>
            </Link>
            <Link to="/simulation" className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-slate-800 text-slate-300 hover:text-white transition-colors">
              <Server className="w-5 h-5" /> <span>Simulation</span>
            </Link>
            <Link to="/monitoring" className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-slate-800 text-slate-300 hover:text-white transition-colors">
              <Activity className="w-5 h-5" /> <span>Monitoring</span>
            </Link>
          </nav>
        </div>
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-950 p-6">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/simulation" element={<Simulation />} />
              <Route path="/monitoring" element={<Monitoring />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
""",
    "frontend/src/pages/Dashboard.tsx": """
import React, { useEffect, useState } from 'react';
import { Activity, ShieldAlert, CheckCircle } from 'lucide-react';

export default function Dashboard() {
  const [health, setHealth] = useState<string>('Checking...');
  
  useEffect(() => {
    fetch('http://localhost:3000/api/v1/health')
      .then(res => res.json())
      .then(data => setHealth(data.status))
      .catch(() => setHealth('Offline'));
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-slate-100">Overview Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-slate-400 font-medium">Backend Status</h3>
            <CheckCircle className={`w-6 h-6 ${health === 'ok' ? 'text-green-500' : 'text-slate-600'}`} />
          </div>
          <p className="text-2xl font-bold text-white mt-2">{health}</p>
        </div>
      </div>
    </div>
  );
}
""",
    "frontend/src/pages/Simulation.tsx": """
import React, { useState } from 'react';
import { Play, Square } from 'lucide-react';

export default function Simulation() {
  const [running, setRunning] = useState(false);
  
  const startSimulation = (type: string) => {
    setRunning(true);
    fetch('http://localhost:3000/api/v1/simulation/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, intensity: 2 })
    });
  };

  const stopSimulation = () => {
    setRunning(false);
    fetch('http://localhost:3000/api/v1/simulation/stop', { method: 'POST' });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-slate-100">Digital Twin Simulation</h2>
      
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-4">
        <h3 className="text-lg font-medium text-slate-200">Simulation Controls</h3>
        <p className="text-slate-400 text-sm">Safe, isolated virtual network simulation.</p>
        
        <div className="flex space-x-4">
          <button onClick={() => startSimulation('normal')} disabled={running} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
            Start Normal Traffic
          </button>
          <button onClick={() => startSimulation('port-scan')} disabled={running} className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 disabled:opacity-50">
            Simulate Port Scan
          </button>
          <button onClick={stopSimulation} disabled={!running} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 flex items-center space-x-2">
            <Square className="w-4 h-4" /> <span>Stop Simulation</span>
          </button>
        </div>
      </div>
    </div>
  );
}
""",
    "frontend/src/pages/Monitoring.tsx": """
import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export default function Monitoring() {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    const socket = io('http://localhost:3000');
    socket.on('new_event', (event) => {
      setEvents(prev => [event, ...prev].slice(0, 50));
    });
    return () => { socket.disconnect(); };
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-slate-100">Network Monitoring</h2>
      
      <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
        <table className="w-full text-left text-sm text-slate-400">
          <thead className="bg-slate-800/50 text-slate-300">
            <tr>
              <th className="px-4 py-3">Timestamp</th>
              <th className="px-4 py-3">Source IP</th>
              <th className="px-4 py-3">Target IP</th>
              <th className="px-4 py-3">Port</th>
              <th className="px-4 py-3">Type</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {events.map((e, i) => (
              <tr key={i} className="hover:bg-slate-800/50">
                <td className="px-4 py-3">{new Date(e.timestamp || Date.now()).toLocaleTimeString()}</td>
                <td className="px-4 py-3">{e.sourceIp}</td>
                <td className="px-4 py-3">{e.destIp}</td>
                <td className="px-4 py-3">{e.port}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs ${e.eventType === 'NORMAL' ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'}`}>
                    {e.eventType}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {events.length === 0 && <div className="p-6 text-center text-slate-500">No recent events. Start a simulation.</div>}
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

print("Frontend Scaffolded")
