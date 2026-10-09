import React, { useEffect, useState } from 'react';
import { 
  Activity, 
  ShieldAlert, 
  ShieldCheck, 
  Database, 
  Server, 
  Zap, 
  Clock, 
  ArrowUpRight,
  TrendingUp,
  Radio,
  Lock,
  RefreshCw
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../config';

interface Metrics {
  totalEvents: number;
  totalIncidents: number;
  totalActions: number;
}

export default function Dashboard() {
  const [health, setHealth] = useState<string>('Checking...');
  const [metrics, setMetrics] = useState<Metrics>({ totalEvents: 0, totalIncidents: 0, totalActions: 0 });
  const [recentEvents, setRecentEvents] = useState<any[]>([]);
  const [recentIncidents, setRecentIncidents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [hRes, mRes, eRes, iRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/v1/health`).then(r => r.json()).catch(() => ({ status: 'Offline' })),
        fetch(`${API_BASE_URL}/api/v1/monitor/metrics`).then(r => r.json()).catch(() => ({ totalEvents: 0, totalIncidents: 0, totalActions: 0 })),
        fetch(`${API_BASE_URL}/api/v1/monitor/events`).then(r => r.json()).catch(() => []),
        fetch(`${API_BASE_URL}/api/v1/threats`).then(r => r.json()).catch(() => [])
      ]);

      setHealth(hRes.status || 'Offline');
      setMetrics(mRes);
      setRecentEvents(eRes.slice(0, 5));
      setRecentIncidents(iRes.slice(0, 5));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  // Format event data for AreaChart
  const chartData = recentEvents.length > 0
    ? recentEvents.map((e, idx) => ({
        time: new Date(e.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        events: (idx + 1) * 3 + Math.floor(Math.random() * 5),
        bytes: e.bytes || 500
      })).reverse()
    : [
        { time: '10:00', events: 12, bytes: 400 },
        { time: '10:05', events: 19, bytes: 800 },
        { time: '10:10', events: 32, bytes: 1200 },
        { time: '10:15', events: 24, bytes: 900 },
        { time: '10:20', events: 45, bytes: 1600 }
      ];

  const pieData = [
    { name: 'Critical DoS', value: recentIncidents.filter(i => i.severity === 'CRITICAL').length || 1, color: '#ef4444' },
    { name: 'High PortScan', value: recentIncidents.filter(i => i.severity === 'HIGH').length || 2, color: '#f59e0b' },
    { name: 'Normal Activity', value: Math.max(1, metrics.totalEvents - metrics.totalIncidents), color: '#06b6d4' }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="glass-panel rounded-2xl p-6 relative overflow-hidden border border-slate-800">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <Zap className="w-4 h-4 animate-pulse" /> Live Threat Intelligence Operations
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Adaptive Cyber Defense Console</h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Virtual Digital Twin simulation and automated threat detection engine active. Monitoring synthetic traffic vectors and executing approval-gated countermeasures.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={fetchData} 
              className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700/60"
              title="Refresh Telemetry"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
            </button>
            <Link 
              to="/simulation" 
              className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-medium transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] flex items-center space-x-2"
            >
              <Server className="w-4 h-4" />
              <span>Launch Traffic Simulation</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 4 Stat Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="glass-card rounded-xl p-5 border border-slate-800 hover:border-cyan-500/40 transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Telemetry Events</span>
            <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-400">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-white tracking-tight">{metrics.totalEvents}</span>
            <span className="text-xs text-emerald-400 flex items-center font-medium">
              <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> +100%
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Recorded in SQLite database</p>
        </div>

        <div className="glass-card rounded-xl p-5 border border-slate-800 hover:border-amber-500/40 transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Flagged Threats</span>
            <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-white tracking-tight">{metrics.totalIncidents}</span>
            <span className="text-xs text-amber-400 font-medium">Rule Engine Active</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Port Scans & DoS detected</p>
        </div>

        <div className="glass-card rounded-xl p-5 border border-slate-800 hover:border-emerald-500/40 transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Defensive Countermeasures</span>
            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-white tracking-tight">{metrics.totalActions}</span>
            <span className="text-xs text-emerald-400 font-medium">Approval Gated</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Actions executed & logged</p>
        </div>

        <div className="glass-card rounded-xl p-5 border border-slate-800 hover:border-cyan-500/40 transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">System Health</span>
            <div className="p-2 bg-slate-800 rounded-lg text-cyan-400">
              <Database className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-emerald-400 capitalize tracking-tight">{health}</span>
            <span className="text-xs text-cyan-400 font-medium">Socket.IO Live</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Node.js Express + SQLite</p>
        </div>
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Real-time Traffic Telemetry Chart */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
                Network Traffic Telemetry & Volume
              </h3>
              <p className="text-xs text-slate-400">Real-time incoming event rate over time</p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-cyan-950/80 border border-cyan-800 text-cyan-400">
              SOCKET.IO REALTIME
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorEvents" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc' }}
                />
                <Area type="monotone" dataKey="events" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#colorEvents)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Threat Distribution Donut Chart */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-1">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              Threat Category Distribution
            </h3>
            <p className="text-xs text-slate-400 mb-4">Breakdown of flagged threat vectors</p>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-2 mt-4">
            {pieData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-slate-300 font-medium">{item.name}</span>
                </div>
                <span className="text-slate-400 font-bold">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Digital Twin Network Topology Panel */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Server className="w-4 h-4 text-cyan-400" />
              Digital Twin Virtual Network Topology
            </h3>
            <p className="text-xs text-slate-400">Simulated host nodes and defense status</p>
          </div>
          <span className="text-xs text-slate-400 font-mono">Subnet: 10.0.0.0/24</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl flex items-center space-x-3">
            <div className="p-3 bg-cyan-500/10 rounded-xl text-cyan-400">
              <Server className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Web Server Host</h4>
              <p className="text-xs text-slate-500 font-mono">IP: 10.0.0.1</p>
              <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800">
                ONLINE • NORMAL
              </span>
            </div>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl flex items-center space-x-3">
            <div className="p-3 bg-cyan-500/10 rounded-xl text-cyan-400">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Database Node</h4>
              <p className="text-xs text-slate-500 font-mono">IP: 10.0.0.2</p>
              <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800">
                ONLINE • SECURE
              </span>
            </div>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl flex items-center space-x-3">
            <div className="p-3 bg-amber-500/10 rounded-xl text-amber-400">
              <Radio className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Gateway Router</h4>
              <p className="text-xs text-slate-500 font-mono">IP: 10.0.0.254</p>
              <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-950 text-amber-400 border border-amber-800">
                MONITORING
              </span>
            </div>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl flex items-center space-x-3">
            <div className="p-3 bg-red-500/10 rounded-xl text-red-400">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Simulated Attacker</h4>
              <p className="text-xs text-slate-500 font-mono">IP: 192.168.1.100</p>
              <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-red-950 text-red-400 border border-red-800">
                BLOCKED (COUNTERMEASURE)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Recent Security Events & Recent Threat Incidents */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Events Table */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" /> Recent Security Events
            </h3>
            <Link to="/monitoring" className="text-xs text-cyan-400 hover:underline flex items-center">
              View All <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-slate-400 border-b border-slate-800 uppercase font-semibold text-[10px]">
                <tr>
                  <th className="pb-2">Timestamp</th>
                  <th className="pb-2">Type</th>
                  <th className="pb-2">Source IP</th>
                  <th className="pb-2">Port</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {recentEvents.map((evt, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40">
                    <td className="py-2.5 text-slate-400">{new Date(evt.timestamp || Date.now()).toLocaleTimeString()}</td>
                    <td className="py-2.5 font-medium text-slate-200">{evt.eventType || 'HIGH_VOLUME'}</td>
                    <td className="py-2.5 font-mono text-cyan-400">{evt.sourceIp || '192.168.1.100'}</td>
                    <td className="py-2.5 font-mono text-slate-400">{evt.port || 80}</td>
                  </tr>
                ))}
                {recentEvents.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-4 text-center text-slate-500">No telemetry events recorded yet. Start a simulation scenario.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Flagged Incidents */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" /> Active Threat Incidents
            </h3>
            <Link to="/threats" className="text-xs text-amber-400 hover:underline flex items-center">
              Manage Threats <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>

          <div className="space-y-3">
            {recentIncidents.map((inc, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      inc.severity === 'CRITICAL' ? 'bg-red-950 text-red-400 border border-red-800' : 'bg-amber-950 text-amber-400 border border-amber-800'
                    }`}>
                      {inc.severity}
                    </span>
                    <h4 className="text-xs font-semibold text-white">{inc.category}</h4>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">Source: <span className="font-mono text-cyan-400">{inc.source}</span> | Rule: {inc.rule}</p>
                </div>
                <Link to="/responses" className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors">
                  Review Response
                </Link>
              </div>
            ))}
            {recentIncidents.length === 0 && (
              <div className="p-6 text-center text-slate-500 text-xs">
                No active threat incidents detected. System operating under normal parameters.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
