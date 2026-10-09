import React, { useEffect, useState } from 'react';
import { Activity, ShieldAlert, CheckCircle, Database } from 'lucide-react';

export default function Dashboard() {
  const [health, setHealth] = useState<string>('Checking...');
  const [metrics, setMetrics] = useState({ totalEvents: 0, totalIncidents: 0, totalActions: 0 });
  
  useEffect(() => {
    fetch('http://localhost:3000/api/v1/health')
      .then(res => res.json())
      .then(data => setHealth(data.status))
      .catch(() => setHealth('Offline'));

    fetch('http://localhost:3000/api/v1/monitor/metrics')
      .then(res => res.json())
      .then(data => setMetrics(data))
      .catch(console.error);
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-slate-100">Overview Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-slate-400 font-medium">Backend Status</h3>
            <CheckCircle className={`w-6 h-6 ${health === 'ok' ? 'text-green-500' : 'text-slate-600'}`} />
          </div>
          <p className="text-2xl font-bold text-white mt-2">{health}</p>
        </div>
        
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-slate-400 font-medium">Total Events</h3>
            <Activity className="w-6 h-6 text-cyan-500" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">{metrics.totalEvents}</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-slate-400 font-medium">Incidents</h3>
            <ShieldAlert className="w-6 h-6 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">{metrics.totalIncidents}</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-slate-400 font-medium">Defensive Actions</h3>
            <Database className="w-6 h-6 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">{metrics.totalActions}</p>
        </div>
      </div>
    </div>
  );
}
