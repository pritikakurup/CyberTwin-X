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
