import React, { useState } from 'react';
import { 
  Sliders, 
  Save, 
  RotateCcw, 
  CheckCircle2, 
  ShieldCheck, 
  Zap,
  Server
} from 'lucide-react';

export default function Settings() {
  const [dosThreshold, setDosThreshold] = useState<number>(5);
  const [portScanThreshold, setPortScanThreshold] = useState<number>(3);
  const [timeWindow, setTimeWindow] = useState<number>(10);
  const [autoApprove, setAutoApprove] = useState<boolean>(false);
  const [toast, setToast] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setToast('Detection parameters updated successfully.');
    setTimeout(() => setToast(null), 4000);
  };

  const handleReset = () => {
    setDosThreshold(5);
    setPortScanThreshold(3);
    setTimeWindow(10);
    setAutoApprove(false);
    setToast('Parameters reset to default values.');
    setTimeout(() => setToast(null), 4000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <Sliders className="w-6 h-6 text-cyan-400" />
          Detection Thresholds & System Preferences
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Configure rule-based threat engine sensitivity, simulation defaults, and defensive response options.
        </p>
      </div>

      {toast && (
        <div className="p-4 rounded-xl bg-cyan-950/60 border border-cyan-800 text-cyan-300 text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-cyan-400" />
          <span>{toast}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Threat Detection Rule Engine Settings */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-5">
          <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Zap className="w-4 h-4 text-amber-400" /> Threat Detection Sensitivity Thresholds
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                DoS High-Volume Request Limit
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={dosThreshold}
                onChange={e => setDosThreshold(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
              />
              <p className="text-[11px] text-slate-500 mt-1">Flag DoS incident if requests exceed this limit within window.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Port Scan Unique Port Threshold
              </label>
              <input
                type="number"
                min="1"
                max="50"
                value={portScanThreshold}
                onChange={e => setPortScanThreshold(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
              />
              <p className="text-[11px] text-slate-500 mt-1">Flag Port Scan if distinct ports accessed exceed this value.</p>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Evaluation Window Duration (Seconds)
              </label>
              <input
                type="number"
                min="5"
                max="60"
                value={timeWindow}
                onChange={e => setTimeWindow(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>
        </div>

        {/* Response Gating Options */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Response Governance Options
          </h3>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <div>
              <h4 className="text-xs font-semibold text-white">Require Manual Operator Approval for Countermeasures</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Keep human-in-the-loop gating before applying virtual drop rules.</p>
            </div>
            <input
              type="checkbox"
              checked={!autoApprove}
              onChange={e => setAutoApprove(!e.target.checked)}
              className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-cyan-500"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center space-x-3 pt-2">
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Configurations</span>
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white font-semibold text-xs transition-all flex items-center space-x-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Defaults</span>
          </button>
        </div>
      </form>
    </div>
  );
}
