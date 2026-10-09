import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';
import { 
  Play, 
  Square, 
  Server, 
  Radio, 
  ShieldAlert, 
  CheckCircle2, 
  Activity, 
  Zap,
  HardDrive,
  Cpu
} from 'lucide-react';

export default function Simulation() {
  const [scenario, setScenario] = useState<string>('normal');
  const [status, setStatus] = useState<string>('STOPPED');
  const [targetIp, setTargetIp] = useState<string>('10.0.0.1');
  const [packetRate, setPacketRate] = useState<number>(10);
  const [eventCount, setEventCount] = useState<number>(0);
  const [bytesSent, setBytesSent] = useState<number>(0);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/v1/simulation/status`)
      .then(res => res.json())
      .then(data => {
        setStatus(data.status);
        setScenario(data.scenario || 'normal');
      })
      .catch(() => setStatus('STOPPED'));
  }, []);

  const handleStart = async () => {
    setMessage(null);
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/simulation/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenario, targetIp, rate: packetRate })
      });
      const data = await res.json();
      setStatus('RUNNING');
      setMessage(`Simulation "${scenario.toUpperCase()}" started.`);
    } catch (err) {
      setMessage('Failed to start simulation server.');
    }
  };

  const handleStop = async () => {
    setMessage(null);
    try {
      await fetch(`${API_BASE_URL}/api/v1/simulation/stop`, { method: 'POST' });
      setStatus('STOPPED');
      setMessage('Simulation stopped.');
    } catch (err) {
      setMessage('Failed to stop simulation server.');
    }
  };

  useEffect(() => {
    let interval: any;
    if (status === 'RUNNING') {
      interval = setInterval(() => {
        setEventCount(prev => prev + Math.floor(Math.random() * 5) + 1);
        setBytesSent(prev => prev + Math.floor(Math.random() * 2500) + 500);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [status]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Server className="w-6 h-6 text-cyan-400" />
            Digital Twin Traffic Generator & Simulator
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Synthesize isolated virtual network traffic scenarios to evaluate rule-based threat detection and response controls.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold">
            <span className="text-slate-400">STATUS:</span>
            {status === 'RUNNING' ? (
              <span className="flex items-center gap-1.5 text-cyan-400 animate-pulse">
                <Radio className="w-4 h-4" /> ACTIVE SCENARIO
              </span>
            ) : (
              <span className="text-slate-500">IDLE / STOPPED</span>
            )}
          </div>
        </div>
      </div>

      {message && (
        <div className="p-4 rounded-xl bg-cyan-950/60 border border-cyan-800/80 text-cyan-300 text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-cyan-400" />
          <span>{message}</span>
        </div>
      )}

      {/* Network Topology Visual Canvas */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 relative overflow-hidden">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Cpu className="w-4 h-4 text-cyan-400" /> Virtual Sandbox Node Topology
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center relative z-10 py-4">
          {/* Node 1: Attacker */}
          <div className={`p-5 rounded-2xl border transition-all ${
            scenario !== 'normal' && status === 'RUNNING' 
              ? 'bg-red-950/40 border-red-500/50 glow-red' 
              : 'bg-slate-900/80 border-slate-800'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-red-400">TRAFFIC ORIGIN</span>
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
            </div>
            <h4 className="text-base font-bold text-white">Simulated Node</h4>
            <p className="text-xs text-slate-400 font-mono mt-0.5">IP: 192.168.1.100</p>
            <div className="mt-3 text-[11px] text-slate-400">
              Role: <span className="text-slate-200 font-medium">{scenario === 'dos' ? 'DoS Flooder' : scenario === 'portscan' ? 'Port Scanner' : 'Normal Client'}</span>
            </div>
          </div>

          {/* Packet Flow Conduit */}
          <div className="flex flex-col items-center justify-center space-y-2 py-2">
            <div className="text-xs font-mono text-cyan-400 flex items-center gap-1.5">
              <Activity className={`w-4 h-4 ${status === 'RUNNING' ? 'animate-spin text-cyan-400' : 'text-slate-600'}`} />
              <span>{status === 'RUNNING' ? `${packetRate} PKT/SEC` : 'LINK IDLE'}</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden relative">
              {status === 'RUNNING' && (
                <div className="w-1/2 h-full bg-gradient-to-r from-cyan-500 to-teal-400 rounded-full animate-pulse-slow"></div>
              )}
            </div>
            <span className="text-[10px] text-slate-500 font-mono">Protocol: TCP / IP Virtual Wire</span>
          </div>

          {/* Node 2: Target Twin */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">DIGITAL TWIN TARGET</span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            </div>
            <h4 className="text-base font-bold text-white">Protected Host Server</h4>
            <p className="text-xs text-slate-400 font-mono mt-0.5">IP: {targetIp}</p>
            <div className="mt-3 text-[11px] text-slate-400">
              State: <span className="text-emerald-400 font-medium">Isolated Virtual Model</span>
            </div>
          </div>
        </div>
      </div>

      {/* Control Form & Parameters Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Scenario Selection */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6 border border-slate-800 space-y-5">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyan-400" /> Select Synthetic Scenario Vector
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              onClick={() => setScenario('normal')}
              className={`p-4 rounded-xl border text-left transition-all ${
                scenario === 'normal'
                  ? 'bg-cyan-950/60 border-cyan-500/80 glow-cyan text-white'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="p-2 w-fit rounded-lg bg-cyan-500/10 text-cyan-400 mb-2">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h4 className="font-semibold text-sm text-slate-200">Normal Traffic</h4>
              <p className="text-xs text-slate-400 mt-1">Standard web browsing requests across port 80/443.</p>
            </button>

            <button
              onClick={() => setScenario('portscan')}
              className={`p-4 rounded-xl border text-left transition-all ${
                scenario === 'portscan'
                  ? 'bg-amber-950/60 border-amber-500/80 text-white'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="p-2 w-fit rounded-lg bg-amber-500/10 text-amber-400 mb-2">
                <Radio className="w-5 h-5" />
              </div>
              <h4 className="font-semibold text-sm text-slate-200">Port Scan Attack</h4>
              <p className="text-xs text-slate-400 mt-1">Rapid connection probes across sequential ports (21, 22, 80, 443, 8080).</p>
            </button>

            <button
              onClick={() => setScenario('dos')}
              className={`p-4 rounded-xl border text-left transition-all ${
                scenario === 'dos'
                  ? 'bg-red-950/60 border-red-500/80 glow-red text-white'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="p-2 w-fit rounded-lg bg-red-500/10 text-red-400 mb-2">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <h4 className="font-semibold text-sm text-slate-200">DoS Flood Attack</h4>
              <p className="text-xs text-slate-400 mt-1">High-volume request flooding to trigger rate limits.</p>
            </button>
          </div>

          {/* Configuration Input Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Target Host IP</label>
              <input
                type="text"
                value={targetIp}
                onChange={e => setTargetIp(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-xs font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Packet Generation Rate</label>
              <input
                type="number"
                value={packetRate}
                onChange={e => setPacketRate(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-xs font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Action Execution Controls */}
          <div className="flex items-center space-x-3 pt-2">
            {status !== 'RUNNING' ? (
              <button
                onClick={handleStart}
                className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-sm transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] flex items-center justify-center space-x-2"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Start Simulation Vector</span>
              </button>
            ) : (
              <button
                onClick={handleStop}
                className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-sm transition-all shadow-[0_0_20px_rgba(239,68,68,0.3)] flex items-center justify-center space-x-2"
              >
                <Square className="w-4 h-4 fill-current" />
                <span>Halt Simulation Stream</span>
              </button>
            )}
          </div>
        </div>

        {/* Real-time Telemetry Stats Panel */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-4">
              <HardDrive className="w-4 h-4 text-cyan-400" /> Live Simulation Metrics
            </h3>

            <div className="space-y-4">
              <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400 uppercase font-semibold">Events Transmitted</span>
                <p className="text-2xl font-bold text-white mt-1 font-mono">{eventCount}</p>
              </div>

              <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400 uppercase font-semibold">Volume Transferred</span>
                <p className="text-2xl font-bold text-cyan-400 mt-1 font-mono">{(bytesSent / 1024).toFixed(2)} KB</p>
              </div>

              <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400 uppercase font-semibold">Active Vector</span>
                <p className="text-sm font-semibold text-amber-400 mt-1 uppercase">{scenario}</p>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 mt-6 leading-relaxed">
            All events generated by this simulator are processed in-memory by Node.js and persisted to SQLite. No outbound network traffic leaves the local virtual environment.
          </div>
        </div>
      </div>
    </div>
  );
}
