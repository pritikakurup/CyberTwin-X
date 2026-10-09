import React, { useEffect, useState } from 'react';
import { 
  FileText, 
  Search, 
  RefreshCw, 
  CheckCircle2, 
  ShieldAlert, 
  UserCheck,
  Lock
} from 'lucide-react';

interface AuditLog {
  id: number;
  action: string;
  details: string;
  timestamp: string;
}

export default function Logs() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3000/api/v1/logs');
      const data = await res.json();
      setLogs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filtered = logs.filter(l => 
    l.action.toLowerCase().includes(search.toLowerCase()) ||
    l.details.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-cyan-400" />
            System Audit Trail & Access Logs
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Immutable audit record of user authorizations, threat detections, and countermeasure approvals in SQLite.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button 
            onClick={fetchLogs}
            className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-cyan-400' : ''}`} /> Refresh Trail
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="glass-panel rounded-2xl p-4 border border-slate-800 flex items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search Action or Log Details..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <span className="text-xs text-slate-400">
          Total Log Records: <span className="text-white font-bold">{filtered.length}</span>
        </span>
      </div>

      {/* Logs Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 uppercase font-semibold text-[10px] border-b border-slate-800">
              <tr>
                <th className="px-5 py-3">Timestamp</th>
                <th className="px-5 py-3">Action Event</th>
                <th className="px-5 py-3">Audit Details</th>
                <th className="px-5 py-3">Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map(log => (
                <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-5 py-3 text-slate-400 font-mono whitespace-nowrap">
                    {new Date(log.timestamp || Date.now()).toLocaleString()}
                  </td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      log.action === 'THREAT_DETECTED'
                        ? 'bg-amber-950 text-amber-400 border border-amber-800'
                        : log.action === 'ACTION_APPROVED'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : 'bg-cyan-950 text-cyan-400 border border-cyan-800'
                    }`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-slate-200 font-mono">{log.details}</td>
                  <td className="px-5 py-3">
                    <span className="text-emerald-400 flex items-center gap-1 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" /> SUCCESS
                    </span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-5 py-8 text-center text-slate-500">
                    No audit log entries found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
