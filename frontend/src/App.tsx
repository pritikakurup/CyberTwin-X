import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { 
  Shield, 
  Activity, 
  Server, 
  AlertTriangle, 
  Sliders, 
  FileText, 
  LogOut, 
  Menu, 
  X, 
  Radio, 
  Cpu, 
  CheckCircle2, 
  AlertCircle,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { API_BASE_URL } from './config';
import Dashboard from './pages/Dashboard';
import Simulation from './pages/Simulation';
import Monitoring from './pages/Monitoring';
import Threats from './pages/Threats';
import Responses from './pages/Responses';
import Logs from './pages/Logs';
import SettingsPage from './pages/Settings';
import Login from './pages/Login';
import Register from './pages/Register';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [backendStatus, setBackendStatus] = useState<'connected' | 'error' | 'checking'>('checking');

  useEffect(() => {
    if (['/login', '/register'].includes(location.pathname)) return;
    const checkHealth = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/v1/health`);
        if (res.ok) setBackendStatus('connected');
        else setBackendStatus('error');
      } catch {
        setBackendStatus('error');
      }
    };
    checkHealth();
    const interval = setInterval(checkHealth, 10000);
    return () => clearInterval(interval);
  }, [location.pathname]);

  if (['/login', '/register'].includes(location.pathname)) return <>{children}</>;

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Activity },
    { path: '/simulation', label: 'Digital Twin Simulation', icon: Server },
    { path: '/monitoring', label: 'Network Monitoring', icon: Radio },
    { path: '/threats', label: 'Threat Intelligence', icon: AlertTriangle },
    { path: '/responses', label: 'Defensive Responses', icon: ShieldCheck },
    { path: '/logs', label: 'Audit Logs', icon: FileText },
    { path: '/settings', label: 'Settings', icon: Sliders },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    window.location.href = '/login';
  };

  const userName = localStorage.getItem('userName') || 'Administrator';

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden">
      {/* Sidebar for Desktop */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-900/90 backdrop-blur-md border-r border-slate-800/80 flex flex-col transition-transform duration-300 md:static md:translate-x-0 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-cyan-500/10 border border-cyan-500/30 rounded-xl glow-cyan">
              <Shield className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-wider text-white">CyberTwin-X</h1>
              <p className="text-xs text-cyan-400 font-medium tracking-widest uppercase">Adaptive Defense</p>
            </div>
          </div>
          <button className="md:hidden text-slate-400 hover:text-white" onClick={() => setIsMobileOpen(false)}>
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileOpen(false)}
                className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive 
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)]' 
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Environment Status Widget */}
        <div className="p-4 mx-3 my-2 bg-slate-950/60 border border-slate-800 rounded-xl">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" /> Environment Mode
            </span>
            <span className="px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/50 text-[10px] font-semibold">ISOLATED</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-tight">Virtual Twin Sandbox active. No host firewall changes.</p>
        </div>

        {/* Logout */}
        <div className="p-4 border-t border-slate-800/80">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 px-3 py-2 rounded-lg bg-red-950/30 border border-red-800/30 text-red-400 hover:bg-red-900/40 hover:text-red-300 transition-colors text-sm font-medium"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-slate-900/60 backdrop-blur-md border-b border-slate-800/80 px-6 flex items-center justify-between z-30">
          <div className="flex items-center space-x-4">
            <button className="md:hidden text-slate-400 hover:text-white" onClick={() => setIsMobileOpen(true)}>
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h2 className="text-base font-semibold text-white capitalize">
                {location.pathname.replace('/', '') || 'Dashboard'}
              </h2>
              <p className="text-xs text-slate-400">Group 32 • Digital Twin Security Operations Center</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Backend Status Indicator */}
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-950 border border-slate-800 text-xs font-medium">
              <span className="text-slate-400">Backend API:</span>
              {backendStatus === 'connected' && (
                <span className="flex items-center gap-1 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Online
                </span>
              )}
              {backendStatus === 'error' && (
                <span className="flex items-center gap-1 text-red-400">
                  <AlertCircle className="w-3.5 h-3.5" /> Disconnected
                </span>
              )}
              {backendStatus === 'checking' && (
                <span className="text-slate-400 animate-pulse">Connecting...</span>
              )}
            </div>

            {/* User Profile Pill */}
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/60 text-xs">
              <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-medium text-slate-200">{userName}</span>
            </div>
          </div>
        </header>

        {/* Route Pages Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900/40 via-slate-950 to-slate-950">
          {children}
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/simulation" element={<ProtectedRoute><Simulation /></ProtectedRoute>} />
          <Route path="/monitoring" element={<ProtectedRoute><Monitoring /></ProtectedRoute>} />
          <Route path="/threats" element={<ProtectedRoute><Threats /></ProtectedRoute>} />
          <Route path="/responses" element={<ProtectedRoute><Responses /></ProtectedRoute>} />
          <Route path="/logs" element={<ProtectedRoute><Logs /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;