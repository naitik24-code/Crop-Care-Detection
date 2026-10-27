import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from "react-router-dom";
import { Home as HomeIcon, History as HistoryIcon, Library as LibraryIcon, Settings as SettingsIcon, Bell, PlusCircle, HelpCircle, User, LogOut, Menu, X } from "lucide-react";
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
  const [mobileOpen, setMobileOpen] = useState(false);
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
    <div className="app-shell min-h-screen flex font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* ─── Sidebar ─── */}
      {mobileOpen && <button aria-label="Close navigation" onClick={() => setMobileOpen(false)} className="fixed inset-0 z-30 bg-emerald-950/45 md:hidden" />}
      <aside className={`fixed left-0 top-0 bottom-0 z-40 flex flex-col py-8 h-screen w-72 shadow-2xl shadow-emerald-950/20 bg-emerald-950 border-r border-white/5 transition-transform duration-300 ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
        <div className="text-2xl font-black text-white tracking-tighter mb-12 px-8 flex items-center gap-3 font-headline">
          <img src="/logo.svg" alt="CropCare logo" className="w-10 h-10 rounded-2xl shadow-lg shadow-emerald-500/30" />
          <span>Crop<span className="text-emerald-400">Care</span></span>
          <button onClick={() => setMobileOpen(false)} className="ml-auto md:hidden p-2 text-white/60"><X className="w-5 h-5" /></button>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          {navigation.map((item) => {
            const active = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                to={item.path}
                onClick={() => setMobileOpen(false)}
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
      <header className="fixed top-0 right-0 z-30 h-20 flex justify-between items-center px-5 md:px-10 left-0 md:left-72 glass-panel border-b border-emerald-900/5">
        <div className="flex items-center gap-3 font-black text-xl text-emerald-950 tracking-tighter font-headline">
          <button aria-label="Open navigation" onClick={() => setMobileOpen(true)} className="p-2 -ml-2 md:hidden text-emerald-900"><Menu className="w-5 h-5" /></button>
          <span className="hidden sm:block">Crop Health Console</span><span className="sm:hidden">CropCare</span>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 bg-emerald-900/5 px-4 py-2 rounded-full border border-emerald-900/10">
            <div className={`w-2 h-2 rounded-full ${statusColor} ${apiOnline ? "animate-pulse" : ""}`} />
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-900/60">{statusLabel}</span>
          </div>
          <button aria-label="Notifications" className="hidden sm:block p-2.5 rounded-xl text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all">
            <Bell className="w-5 h-5" />
          </button>
          <div className="w-10 h-10 rounded-2xl bg-emerald-900 flex items-center justify-center text-white text-sm font-black border border-emerald-800 shadow-xl shadow-emerald-900/20">
            U
          </div>
        </div>
      </header>

      {/* ─── Main Content ─── */}
      <main className="flex-1 ml-0 md:ml-72 pt-28 min-h-screen">
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

