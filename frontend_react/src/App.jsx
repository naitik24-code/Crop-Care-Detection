import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from "react-router-dom";
import { Home as HomeIcon, History as HistoryIcon, Library as LibraryIcon, Settings as SettingsIcon, Bell, PlusCircle, HelpCircle, User, LogOut } from "lucide-react";
import { healthCheck } from "./api";
import Home from "./pages/Home";
import History from "./pages/History";
import Library from "./pages/Library";
import Settings from "./pages/Settings";
import Help from "./pages/Help";
import Account from "./pages/Account";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

function AppContent({ onLogout }) {
  const [apiOnline, setApiOnline] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const checkStatus = () => {
      healthCheck()
        .then(() => setApiOnline(true))
        .catch(() => setApiOnline(false));
    };
    checkStatus();
    const interval = setInterval(checkStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  const statusColor = apiOnline === null ? "bg-yellow-400" : apiOnline ? "bg-emerald-500" : "bg-red-500";
  const statusLabel = apiOnline === null ? "Connecting..." : apiOnline ? "Ready" : "Offline";

  const navigation = [
    { label: "Home", icon: HomeIcon, path: "/" },
    { label: "Past Analyses", icon: HistoryIcon, path: "/history" },
    { label: "Library", icon: LibraryIcon, path: "/library" },
    { label: "Settings", icon: SettingsIcon, path: "/settings" },
    { label: "Help Center", icon: HelpCircle, path: "/help" },
    { label: "Account", icon: User, path: "/account" },
  ];

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* ─── Sidebar ─── */}
      <aside className="fixed left-0 top-0 bottom-0 z-40 flex flex-col py-8 h-screen w-64 shadow-2xl shadow-emerald-900/10 bg-emerald-950 border-r border-white/5">
        <div className="text-2xl font-black text-white tracking-tighter mb-12 px-8 flex items-center gap-2 font-headline">
          <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <ShieldIcon className="w-5 h-5 text-emerald-950" />
          </div>
          PlantWise
        </div>
        <nav className="flex-1 px-4 space-y-1">
          {navigation.map((item) => {
            const active = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group no-underline ${
                  active 
                    ? "bg-emerald-500/10 text-emerald-400 font-bold" 
                    : "text-emerald-100/40 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon className={`w-4 h-4 transition-transform duration-300 ${active ? "scale-110" : "group-hover:translate-x-0.5"}`} />
                <span className="text-xs font-bold tracking-wide uppercase">{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="px-4 mt-auto space-y-4">
          <Link
            to="/"
            className="w-full font-black py-4 rounded-2xl flex items-center justify-center gap-2 bg-emerald-500 text-emerald-950 hover:bg-emerald-400 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-emerald-900/40 group no-underline"
          >
            <PlusCircle className="w-5 h-5 stroke-[3px]" />
            New Analysis
          </Link>
          <button
            onClick={onLogout}
            className="w-full py-3 rounded-xl flex items-center justify-center gap-2 text-emerald-100/30 hover:text-red-400 hover:bg-red-400/5 transition-all text-[10px] font-black uppercase tracking-widest"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ─── Top AppBar ─── */}
      <header className="fixed top-0 right-0 z-30 h-20 flex justify-between items-center px-10 left-64 glass-panel border-b border-black/5">
        <div className="font-black text-xl text-emerald-900 tracking-tighter font-headline">
          Botanical Dashboard
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 bg-emerald-900/5 px-4 py-2 rounded-full border border-emerald-900/10">
            <div className={`w-2 h-2 rounded-full ${statusColor} ${apiOnline ? "animate-pulse" : ""}`} />
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-900/60">{statusLabel}</span>
          </div>
          <button className="p-2.5 rounded-xl text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all">
            <Bell className="w-5 h-5" />
          </button>
          <div className="w-10 h-10 rounded-2xl bg-emerald-900 flex items-center justify-center text-white text-sm font-black border border-emerald-800 shadow-xl shadow-emerald-900/20">
            U
          </div>
        </div>
      </header>

      {/* ─── Main Content ─── */}
      <main className="flex-1 ml-64 pt-28 min-h-screen">
        <Routes>
          <Route path="/" element={<Home apiOnline={apiOnline} statusColor={statusColor} />} />
          <Route path="/history" element={<History />} />
          <Route path="/library" element={<Library />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/help" element={<Help />} />
          <Route path="/account" element={<Account />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

function ShieldIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("plantwise_auth") === "true";
  });

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem("plantwise_auth", "true");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("plantwise_auth");
  };

  return (
    <Router>
      <Routes>
        {!isLoggedIn ? (
          <>
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/signup" element={<Signup onLogin={handleLogin} />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </>
        ) : (
          <Route path="*" element={<AppContent onLogout={handleLogout} />} />
        )}
      </Routes>
    </Router>
  );
}

