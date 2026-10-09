import React, { useEffect, useState } from 'react';
import { 
  Radio, 
  Search, 
  Filter, 
  Activity, 
  ShieldAlert, 
  Clock, 
  Wifi, 
  WifiOff, 
  FileText,
  X
} from 'lucide-react';
import { io } from 'socket.io-client';

interface EventItem {
  id?: number;
  timestamp: string;
  eventType: string;
  sourceIp: string;
  destIp: string;
  port: number;
  protocol: string;
  bytes: number;
}

export default function Monitoring() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [connected, setConnected] = useState(false);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

  useEffect(() => {
    // Initial fetch from backend
    fetch('http://localhost:3000/api/v1/monitor/events')
      .then(res => res.json())
      .then(data => setEvents(data))
      .catch(console.error);

    // Socket.IO connection
    const socket = io('http://localhost:3000');
    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));
    socket.on('new_event', (evt: EventItem) => {
      setEvents(prev => [evt, ...prev.slice(0, 99)]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const filteredEvents = events.filter(e => {
    const matchesSearch = 
      (e.sourceIp && e.sourceIp.includes(search)) ||
      (e.destIp && e.destIp.includes(search)) ||
      (e.protocol && e.protocol.toLowerCase().includes(search.toLowerCase())) ||
      (e.port && e.port.toString().includes(search));
    
    const matchesType = typeFilter === 'ALL' || e.eventType === typeFilter;

    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Radio className="w-6 h-6 text-cyan-400 animate-pulse" />
            Live Network Telemetry Console
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Real-time packet telemetry streamed via WebSockets and logged to persistent SQLite tables.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold border ${
            connected 
              ? 'bg-emerald-950/80 border-emerald-800/80 text-emerald-400' 
              : 'bg-red-950/80 border-red-800/80 text-red-400'
          }`}>
            {connected ? <Wifi className="w-4 h-4 animate-pulse" /> : <WifiOff className="w-4 h-4" />}
            <span>{connected ? 'SOCKET.IO LIVE' : 'DISCONNECTED'}</span>
          </div>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="glass-panel rounded-2xl p-4 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search IP, Port, Protocol..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Type Filter Pills */}
        <div className="flex items-center space-x-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {['ALL', 'HIGH_VOLUME_REQUEST', 'CONNECTION_ATTEMPT', 'NORMAL_HTTP'].map(type => (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                typeFilter === type
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              {type === 'ALL' ? 'All Telemetry' : type}
            </button>
          ))}
        </div>
      </div>

      {/* Event Table Panel */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 uppercase font-semibold text-[10px] border-b border-slate-800">
              <tr>
                <th className="px-5 py-3">Timestamp</th>
                <th className="px-5 py-3">Type</th>
                <th className="px-5 py-3">Source Host</th>
                <th className="px-5 py-3">Destination Host</th>
                <th className="px-5 py-3">Port</th>
                <th className="px-5 py-3">Protocol</th>
                <th className="px-5 py-3">Size</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredEvents.map((evt, idx) => (
                <tr 
                  key={idx} 
                  onClick={() => setSelectedEvent(evt)}
                  className="hover:bg-cyan-500/5 cursor-pointer transition-colors"
                >
                  <td className="px-5 py-3 text-slate-400 font-mono">
                    {new Date(evt.timestamp || Date.now()).toLocaleTimeString()}
                  </td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      evt.eventType === 'HIGH_VOLUME_REQUEST'
                        ? 'bg-red-950 text-red-400 border border-red-800'
                        : evt.eventType === 'CONNECTION_ATTEMPT'
                        ? 'bg-amber-950 text-amber-400 border border-amber-800'
                        : 'bg-cyan-950 text-cyan-400 border border-cyan-800'
                    }`}>
                      {evt.eventType || 'HIGH_VOLUME_REQUEST'}
                    </span>
                  </td>
                  <td className="px-5 py-3 font-mono text-cyan-300 font-medium">{evt.sourceIp || '192.168.1.100'}</td>
                  <td className="px-5 py-3 font-mono text-slate-300">{evt.destIp || '10.0.0.1'}</td>
                  <td className="px-5 py-3 font-mono text-amber-400">{evt.port || 80}</td>
                  <td className="px-5 py-3 font-mono text-slate-400">{evt.protocol || 'TCP'}</td>
                  <td className="px-5 py-3 font-mono text-slate-400">{evt.bytes || 500} B</td>
                </tr>
              ))}
              {filteredEvents.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-slate-500">
                    No telemetry events match the filter criteria. Start a traffic simulation.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Event Details Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-lg rounded-2xl p-6 border border-slate-700 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-cyan-400" /> Event Telemetry Details
              </h3>
              <button onClick={() => setSelectedEvent(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between p-2 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-400">Timestamp:</span>
                <span className="text-white">{new Date(selectedEvent.timestamp || Date.now()).toLocaleString()}</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-400">Event Type:</span>
                <span className="text-cyan-400 font-bold">{selectedEvent.eventType}</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-400">Source Host IP:</span>
                <span className="text-amber-400 font-bold">{selectedEvent.sourceIp}</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-400">Destination Host IP:</span>
                <span className="text-emerald-400 font-bold">{selectedEvent.destIp}</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-400">Port & Protocol:</span>
                <span className="text-white">{selectedEvent.port} / {selectedEvent.protocol}</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-400">Payload Size:</span>
                <span className="text-white">{selectedEvent.bytes} Bytes</span>
              </div>
            </div>

            <div className="pt-2">
              <button 
                onClick={() => setSelectedEvent(null)} 
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl text-xs transition-colors"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
