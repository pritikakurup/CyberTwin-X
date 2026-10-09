import React, { useEffect, useState } from 'react';
import { Shield, CheckCircle, XCircle } from 'lucide-react';

export default function Responses() {
  const [actions, setActions] = useState<any[]>([]);

  useEffect(() => {
    fetch('http://localhost:3000/api/v1/actions')
      .then(res => res.json())
      .then(data => setActions(data));
  }, []);

  const approveAction = async (id: number) => {
    try {
      await fetch(`http://localhost:3000/api/v1/actions/${id}/approve`, { method: 'POST' });
      setActions(actions.map(act => act.id === id ? { ...act, status: 'APPLIED' } : act));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-slate-100">Defensive Responses</h2>
      <div className="grid gap-4">
        {actions.map((act, i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex justify-between items-center">
            <div>
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-cyan-500" />
                <h3 className="font-medium text-slate-200">{act.actionType}</h3>
              </div>
              <p className="text-sm text-slate-400 mt-1">Target: {act.target} | Reason: {act.reason}</p>
            </div>
            <div className="text-right">
              {act.status === 'PENDING' ? (
                <div className="flex space-x-2">
                  <button onClick={() => approveAction(act.id)} className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm flex items-center space-x-1">
                    <CheckCircle className="w-4 h-4" /> <span>Approve</span>
                  </button>
                  <button className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm flex items-center space-x-1">
                    <XCircle className="w-4 h-4" /> <span>Reject</span>
                  </button>
                </div>
              ) : (
                <span className={`px-2 py-1 rounded text-xs ${act.status === 'APPLIED' ? 'bg-green-900/50 text-green-400' : 'bg-slate-800 text-slate-400'}`}>
                  {act.status}
                </span>
              )}
            </div>
          </div>
        ))}
        {actions.length === 0 && <div className="text-slate-500">No defensive actions required.</div>}
      </div>
    </div>
  );
}
