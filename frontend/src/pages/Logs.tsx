import React, { useEffect, useState } from 'react';
import { FileText } from 'lucide-react';

export default function Logs() {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    fetch('http://localhost:3000/api/v1/logs')
      .then(res => res.json())
      .then(data => setLogs(data));
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-slate-100">Audit Logs</h2>
      <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
        <table className="w-full text-left text-sm text-slate-400">
          <thead className="bg-slate-800/50 text-slate-300">
            <tr>
              <th className="px-4 py-3">Timestamp</th>
              <th className="px-4 py-3">Action</th>
              <th className="px-4 py-3">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {logs.map((log, i) => (
              <tr key={i} className="hover:bg-slate-800/50">
                <td className="px-4 py-3">{new Date(log.timestamp).toLocaleString()}</td>
                <td className="px-4 py-3 font-medium text-cyan-500">{log.action}</td>
                <td className="px-4 py-3">{log.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {logs.length === 0 && <div className="p-6 text-center text-slate-500">No logs available.</div>}
      </div>
    </div>
  );
}
