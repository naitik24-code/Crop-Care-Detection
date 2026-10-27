import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, Globe } from "lucide-react";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate auth
    onLogin();
    navigate("/");
  };

  return (
    <div className="auth-shell"><div className="auth-grid">
      <div className="auth-copy hidden md:block">
        <div className="flex items-center gap-3 mb-14"><img src="/logo.svg" alt="CropCare" className="w-12 h-12 rounded-2xl" /><span className="text-2xl font-black tracking-tight">Crop<span className="text-emerald-400">Care</span></span></div>
        <div className="text-emerald-300 text-xs uppercase tracking-[.35em] font-black mb-5">Field intelligence, simplified</div>
        <h1 className="font-headline font-black mb-8">See what your crops are telling you.</h1>
        <p className="text-emerald-50/60 text-lg leading-relaxed max-w-lg">Upload a leaf. Get a clear, explainable health signal from your local hybrid vision engine.</p>
        <div className="flex gap-3 mt-12"><span className="px-4 py-3 rounded-2xl bg-white/10 text-xs font-bold">98% target accuracy</span><span className="px-4 py-3 rounded-2xl bg-white/10 text-xs font-bold">Private by design</span></div>
      </div>

      {/* Login Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "circOut" }}
        className="auth-card w-full max-w-md px-8 sm:px-10 py-10 rounded-[2.5rem]"
      >
        <div className="text-center mb-10">
          <img src="/logo.svg" alt="CropCare logo" className="inline-flex w-16 h-16 rounded-2xl mb-5 shadow-xl shadow-emerald-500/30" />
          <div className="text-emerald-400 text-xs font-black tracking-[.3em] uppercase mb-3">CropCare Diagnostics</div>
          <h1 className="text-4xl font-black text-white tracking-tighter font-headline mb-2">Welcome Back</h1>
          <p className="text-emerald-100/40 text-sm font-medium">Access your botanical intelligence dashboard.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative group">
            <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-100/30 group-focus-within:text-emerald-400 transition-colors" />
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address" 
              className="auth-input w-full pl-16 pr-8 py-5 rounded-2xl text-white outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all placeholder:text-emerald-100/40 font-medium"
            />
          </div>

          <div className="relative group">
            <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-100/30 group-focus-within:text-emerald-400 transition-colors" />
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password" 
              className="auth-input w-full pl-16 pr-8 py-5 rounded-2xl text-white outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all placeholder:text-emerald-100/40 font-medium"
            />
          </div>

          <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest px-2">
            <label className="flex items-center gap-2 text-emerald-100/40 hover:text-emerald-400 cursor-pointer transition-colors">
              <input type="checkbox" className="rounded-sm border-white/10 bg-white/5 accent-emerald-500" />
              Remember Me
            </label>
            <a href="#" className="text-emerald-500 hover:text-white transition-colors">Forgot Password?</a>
          </div>

          <button 
            type="submit"
            className="w-full py-5 rounded-2xl bg-emerald-500 text-emerald-950 font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-500/20 hover:bg-white hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            Authenticate Engine <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-10">
          <div className="relative mb-8 text-center">
            <div className="absolute inset-x-0 top-1/2 h-px bg-white/10" />
            <span className="relative z-10 px-4 bg-emerald-950/20 text-[10px] font-black uppercase tracking-[0.3em] text-emerald-100/20">or collaborate via</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-3 py-4 rounded-xl bg-white/5 border border-white/5 text-emerald-100/60 text-xs font-bold hover:bg-white/10 transition-all">
              <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" alt="Google" className="w-4 h-4 opacity-70" />
              Google
            </button>
            <button className="flex items-center justify-center gap-3 py-4 rounded-xl bg-white/5 border border-white/5 text-emerald-100/60 text-xs font-bold hover:bg-white/10 transition-all">
              <Globe className="w-4 h-4 opacity-70" />
              GitHub
            </button>
          </div>
        </div>

        <p className="mt-10 text-center text-sm font-medium text-emerald-100/30">
          New to the platform? <Link to="/signup" className="text-emerald-500 hover:text-white transition-colors">Register Identity</Link>
        </p>
      </motion.div>
    </div></div>
  );
}
