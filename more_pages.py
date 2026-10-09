import os

files = {
    "frontend/src/pages/Threats.tsx": """
import React, { useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle, Clock } from 'lucide-react';

export default function Threats() {
  const [incidents, setIncidents] = useState<any[]>([]);

  useEffect(() => {
    fetch('http://localhost:3000/api/v1/threats')
      .then(res => res.json())
      .then(data => setIncidents(data));
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-slate-100">Threat Management</h2>
      <div className="grid gap-4">
        {incidents.map((inc, i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex justify-between items-center">
            <div>
              <div className="flex items-center space-x-2">
                <AlertTriangle className={`w-5 h-5 ${inc.severity === 'CRITICAL' ? 'text-red-500' : 'text-amber-500'}`} />
                <h3 className="font-medium text-slate-200">{inc.category}</h3>
              </div>
              <p className="text-sm text-slate-400 mt-1">Source: {inc.source} | Rule: {inc.rule}</p>
            </div>
            <div className="text-right">
              <span className={`px-2 py-1 rounded text-xs ${inc.status === 'OPEN' ? 'bg-amber-900/50 text-amber-400' : 'bg-green-900/50 text-green-400'}`}>
                {inc.status}
              </span>
              <p className="text-xs text-slate-500 mt-2">{new Date(inc.timestamp).toLocaleString()}</p>
            </div>
          </div>
        ))}
        {incidents.length === 0 && <div className="text-slate-500">No threats detected.</div>}
      </div>
    </div>
  );
}
""",
    "frontend/src/pages/Settings.tsx": """
import React from 'react';

export default function Settings() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-slate-100">Settings</h2>
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
        <p className="text-slate-400">Settings configuration for simulation limits and detection thresholds will be managed here.</p>
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
print("More pages scaffolded")
