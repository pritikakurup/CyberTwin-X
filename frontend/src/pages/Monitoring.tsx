import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export default function Monitoring() {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    const socket = io('http://localhost:3000');
    socket.on('new_event', (event) => {
      setEvents(prev => [event, ...prev].slice(0, 50));
    });
    return () => { socket.disconnect(); };
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-slate-100">Network Monitoring</h2>
      
      <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
        <table className="w-full text-left text-sm text-slate-400">
          <thead className="bg-slate-800/50 text-slate-300">
            <tr>
              <th className="px-4 py-3">Timestamp</th>
              <th className="px-4 py-3">Source IP</th>
              <th className="px-4 py-3">Target IP</th>
              <th className="px-4 py-3">Port</th>
              <th className="px-4 py-3">Type</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {events.map((e, i) => (
              <tr key={i} className="hover:bg-slate-800/50">
                <td className="px-4 py-3">{new Date(e.timestamp || Date.now()).toLocaleTimeString()}</td>
                <td className="px-4 py-3">{e.sourceIp}</td>
                <td className="px-4 py-3">{e.destIp}</td>
                <td className="px-4 py-3">{e.port}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs ${e.eventType === 'NORMAL' ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'}`}>
                    {e.eventType}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {events.length === 0 && <div className="p-6 text-center text-slate-500">No recent events. Start a simulation.</div>}
      </div>
    </div>
  );
}\n