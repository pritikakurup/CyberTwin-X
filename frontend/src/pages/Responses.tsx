import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../config';
import { 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertTriangle, 
  Lock, 
  Shield, 
  RefreshCw,
  Cpu
} from 'lucide-react';

interface DefensiveAction {
  id: number;
  actionType: string;
  target: string;
  reason: string;
  status: string;
  incidentId: number;
  timestamp: string;
}

export default function Responses() {
  const [actions, setActions] = useState<DefensiveAction[]>([]);
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'APPLIED'>('ALL');
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<string | null>(null);

  const fetchActions = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/actions`);
      const data = await res.json();
      setActions(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActions();
  }, []);

  const handleApprove = async (id: number) => {
    setFeedback(null);
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/actions/${id}/approve`, {
        method: 'POST'
      });
      if (res.ok) {
        setActions(prev => prev.map(a => a.id === id ? { ...a, status: 'APPLIED' } : a));
        setFeedback(`Countermeasure #${id} approved and applied to virtual network model.`);
      }
    } catch (err) {
      setFeedback('Failed to execute countermeasure approval.');
    }
  };

  const filtered = actions.filter(a => filter === 'ALL' || a.status === filter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            Approval-Gated Defensive Responses
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Human-in-the-loop countermeasure approval console. Approved responses update virtual model host state.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button 
            onClick={fetchActions}
            className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-cyan-400' : ''}`} /> Refresh Actions
          </button>
        </div>
      </div>

      {feedback && (
        <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-800/80 text-emerald-300 text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="glass-panel rounded-2xl p-4 border border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {(['ALL', 'PENDING', 'APPLIED'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filter === f
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              {f === 'ALL' ? 'All Countermeasures' : f}
            </button>
          ))}
        </div>

        <span className="text-xs text-slate-400">
          Total Proposed: <span className="text-white font-bold">{actions.length}</span>
        </span>
      </div>

      {/* Action Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map(act => (
          <div 
            key={act.id} 
            className="glass-card rounded-2xl p-5 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold bg-cyan-950 text-cyan-400 border border-cyan-800 uppercase tracking-wider">
                  ACTION: {act.actionType}
                </span>
                <span className="text-xs text-slate-500 font-mono flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {new Date(act.timestamp || Date.now()).toLocaleTimeString()}
                </span>
              </div>

              <h3 className="text-base font-bold text-white mb-1">Target Host: <span className="font-mono text-amber-400">{act.target}</span></h3>
              <p className="text-xs text-slate-400">Reason: {act.reason}</p>

              <div className="mt-3 p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono space-y-1">
                <div className="text-slate-400">Expected Virtual Effect: <span className="text-emerald-400">Apply Packet Drop Rule for {act.target}</span></div>
                <div className="text-slate-500 text-[11px]">Associated Incident ID: #{act.incidentId || 'N/A'}</div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
              {act.status === 'PENDING' ? (
                <div className="flex items-center space-x-2 w-full">
                  <button
                    onClick={() => handleApprove(act.id)}
                    className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-[0_0_15px_rgba(34,197,94,0.3)] flex items-center justify-center space-x-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Approve & Apply Countermeasure</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between w-full">
                  <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" /> APPLIED TO VIRTUAL MODEL
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono">SQLite Record Logged</span>
                </div>
              )}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="md:col-span-2 glass-panel rounded-2xl p-12 text-center text-slate-500 space-y-3">
            <Shield className="w-12 h-12 text-slate-600 mx-auto" />
            <h4 className="text-base font-semibold text-slate-300">No Defensive Countermeasures Listed</h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              When threat incidents are detected, proposed countermeasures will appear here for operator authorization.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
