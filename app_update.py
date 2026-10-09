import os

files = {
    "frontend/src/App.tsx": """
import React from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { Activity, Shield, Server } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import Simulation from './pages/Simulation';
import Monitoring from './pages/Monitoring';
import Login from './pages/Login';
import Register from './pages/Register';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  if (['/login', '/register'].includes(location.pathname)) return <>{children}</>;

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans">
      <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
        <div className="p-6 flex items-center space-x-3">
          <Shield className="w-8 h-8 text-cyan-500" />
          <h1 className="text-xl font-bold tracking-wider text-slate-100">CyberTwin-X</h1>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <Link to="/dashboard" className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-slate-800 text-slate-300 hover:text-white transition-colors">
            <Activity className="w-5 h-5" /> <span>Dashboard</span>
          </Link>
          <Link to="/simulation" className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-slate-800 text-slate-300 hover:text-white transition-colors">
            <Server className="w-5 h-5" /> <span>Simulation</span>
          </Link>
          <Link to="/monitoring" className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-slate-800 text-slate-300 hover:text-white transition-colors">
            <Activity className="w-5 h-5" /> <span>Monitoring</span>
          </Link>
          <button onClick={() => { localStorage.removeItem('token'); window.location.href = '/login'; }} className="w-full text-left flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-red-900/50 text-slate-300 hover:text-red-400 transition-colors mt-auto">
            <span>Logout</span>
          </button>
        </nav>
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-950 p-6">
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
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/simulation" element={<ProtectedRoute><Simulation /></ProtectedRoute>} />
          <Route path="/monitoring" element={<ProtectedRoute><Monitoring /></ProtectedRoute>} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
"""
}

for filepath, content in files.items():
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    with open(filepath, 'w') as f:
        f.write(content.strip() + "\\n")
print("App.tsx updated")
