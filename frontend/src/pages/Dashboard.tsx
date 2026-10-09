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
}\n