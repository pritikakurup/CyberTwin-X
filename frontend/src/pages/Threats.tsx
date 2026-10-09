import React, { useEffect, useState } from 'react';
import { 
  AlertTriangle, 
  ShieldAlert, 
  ShieldCheck, 
  Clock, 
  Server, 
  ArrowRight,
  RefreshCw,
  Search
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../config';

interface Incident {
  id: number;
  category: string;
  severity: string;
  source: string;
  rule: string;
  evidence: string;
  status: string;
  timestamp: string;
}

export default function Threats() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchThreats = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/threats`);
      const data = await res.json();
      setIncidents(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchThreats();
  }, []);

  const filtered = incidents.filter(inc => 
    inc.category.toLowerCase().includes(search.toLowerCase()) ||
    inc.source.includes(search) ||
    inc.rule.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-amber-400" />
            Rule-Based Threat Intelligence & Incidents
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Anomalous traffic patterns flagged by the Digital Twin heuristic analysis engine.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button 
            onClick={fetchThreats}
            className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-cyan-400' : ''}`} /> Refresh Incidents
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="glass-panel rounded-2xl p-4 border border-slate-800 flex items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Filter by Threat Category, Source IP, or Rule..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="text-xs text-slate-400">
          Showing <span className="text-white font-bold">{filtered.length}</span> Threat Records
        </div>
      </div>

      {/* Threat Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map(inc => (
          <div 
            key={inc.id} 
            className="glass-card rounded-2xl p-5 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              {/* Card Header */}
              <div className="flex items-center justify-between mb-3">
                <span className={`px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider ${
                  inc.severity === 'CRITICAL'
                    ? 'bg-red-950 text-red-400 border border-red-800 glow-red'
                    : 'bg-amber-950 text-amber-400 border border-amber-800'
                }`}>
                  {inc.severity} SEVERITY
                </span>
                <span className="text-xs text-slate-500 font-mono flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {new Date(inc.timestamp || Date.now()).toLocaleTimeString()}
                </span>
              </div>

              <h3 className="text-base font-bold text-white mb-1">{inc.category}</h3>
              <p className="text-xs text-slate-400">
                Rule Triggered: <span className="text-slate-200 font-medium">{inc.rule}</span>
              </p>

              {/* Evidence Box */}
              <div className="mt-3 p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono space-y-1">
                <div className="text-slate-400">Source Host: <span className="text-cyan-400 font-bold">{inc.source}</span></div>
                <div className="text-slate-500 text-[11px]">Evidence: {inc.evidence}</div>
              </div>
            </div>

            {/* Footer Action */}
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                inc.status === 'OPEN' ? 'bg-amber-950 text-amber-400 border border-amber-800' : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
              }`}>
                STATUS: {inc.status}
              </span>

              <Link
                to="/responses"
                className="px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold transition-all flex items-center space-x-1.5 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
              >
                <span>Countermeasure Review</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="md:col-span-2 glass-panel rounded-2xl p-12 text-center text-slate-500 space-y-3">
            <ShieldCheck className="w-12 h-12 text-emerald-500/40 mx-auto" />
            <h4 className="text-base font-semibold text-slate-300">No Threat Incidents Detected</h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              The Digital Twin threat engine has not flagged any anomalous events matching the rule thresholds.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
