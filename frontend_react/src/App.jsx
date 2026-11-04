import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from "react-router-dom";
import { Home as HomeIcon, History as HistoryIcon, Library as LibraryIcon, Settings as SettingsIcon, Bell, PlusCircle, HelpCircle, User, LogOut, Menu, X, ArrowRight, ScanLine, BrainCircuit, Sprout } from "lucide-react";
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
        <footer className="mx-5 md:mx-12 mt-16 mb-8 border-t border-emerald-900/10 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[10px] font-black uppercase tracking-[.18em] text-emerald-900/40">
          <span>CropCare · Field intelligence workspace</span>
          <span>Local-first diagnostics · v2.0</span>
        </footer>
      </main>
    </div>
  );
}

function Landing() {
  return (
    <div className="auth-shell min-h-screen">
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-7">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-3"><img src="/logo.svg" alt="CropCare logo" className="w-11 h-11 rounded-2xl" /><span className="text-2xl font-black tracking-tight">Crop<span className="text-emerald-400">Care</span></span></div>
          <div className="flex items-center gap-3"><Link to="/login" className="px-5 py-3 rounded-xl text-sm font-bold text-white/70 hover:text-white transition-colors">Sign in</Link><Link to="/signup" className="px-5 py-3 rounded-xl bg-emerald-400 text-emerald-950 text-sm font-black hover:bg-white transition-colors">Create account</Link></div>
        </nav>
        <section className="grid lg:grid-cols-[1.05fr_.95fr] gap-14 items-center pt-24 pb-24">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 text-emerald-300 text-[10px] font-black uppercase tracking-[.25em] mb-7"><span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Hybrid crop intelligence</div>
            <h1 className="font-headline font-black text-6xl sm:text-8xl tracking-[-.08em] leading-[.88] mb-8">Healthier crops.<br/><span className="text-emerald-400">Clearer decisions.</span></h1>
            <p className="text-lg sm:text-xl text-emerald-50/60 leading-relaxed max-w-xl mb-10">CropCare turns a simple leaf image into an explainable disease signal using visual features, texture analysis, and a local machine learning pipeline.</p>
            <div className="flex flex-wrap gap-4"><Link to="/signup" className="inline-flex items-center gap-3 px-7 py-4 rounded-2xl bg-emerald-400 text-emerald-950 font-black hover:bg-white transition-all">Start a free scan <ArrowRight className="w-4 h-4" /></Link><a href="#how-it-works" className="px-7 py-4 rounded-2xl border border-white/15 text-white font-bold hover:bg-white/10 transition-all">See how it works</a></div>
          </div>
          <div className="relative"><div className="absolute -inset-6 rounded-[3rem] bg-emerald-400/10 blur-3xl" /><div className="relative rounded-[2.5rem] p-8 bg-white/10 border border-white/15 backdrop-blur-xl shadow-2xl"><div className="flex items-center justify-between mb-10"><span className="text-xs font-black uppercase tracking-[.2em] text-emerald-300">Live scan preview</span><span className="flex items-center gap-2 text-xs text-white/50"><span className="w-2 h-2 rounded-full bg-emerald-400" /> Engine ready</span></div><div className="h-64 rounded-3xl bg-gradient-to-br from-emerald-900 to-teal-700 flex items-center justify-center mb-6"><Sprout className="w-32 h-32 text-emerald-200/70" strokeWidth={1} /></div><div className="flex items-center justify-between"><div><div className="text-white font-black text-2xl">Tomato leaf</div><div className="text-white/40 text-sm">Texture + shape analysis</div></div><div className="text-right"><div className="text-emerald-300 font-black text-3xl">94.2%</div><div className="text-white/40 text-[10px] uppercase tracking-widest">confidence</div></div></div></div></div>
        </section>
        <section id="how-it-works" className="grid md:grid-cols-3 gap-5 pb-20"><Feature icon={ScanLine} title="Upload a leaf" text="Drop a clear JPG, PNG, or WEBP image into the scanner." /><Feature icon={BrainCircuit} title="Hybrid analysis" text="GLCM, HOG, and MobileNet features work together locally." /><Feature icon={Sprout} title="Act with clarity" text="Get a condition, confidence score, and treatment guidance." /></section>
        <footer className="border-t border-white/10 pt-6 text-xs text-white/35 flex justify-between"><span>CropCare</span><span>Built for better field decisions</span></footer>
      </div>
    </div>
  );
}

function Feature({ icon: Icon, title, text }) { return <div className="rounded-3xl bg-white/10 border border-white/10 p-7"><Icon className="w-6 h-6 text-emerald-300 mb-6" /><h3 className="text-white font-black text-lg mb-2">{title}</h3><p className="text-white/45 text-sm leading-relaxed">{text}</p></div>; }

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
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/signup" element={<Signup onLogin={handleLogin} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        ) : (
          <Route path="*" element={<AppContent onLogout={handleLogout} />} />
        )}
      </Routes>
    </Router>
  );
}

