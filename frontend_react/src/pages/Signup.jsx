import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, User, ArrowRight } from "lucide-react";

export default function Signup({ onLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate signup and auto-login
    onLogin();
    navigate("/");
  };

  return (
    <div className="auth-shell"><div className="auth-grid">
      <div className="auth-copy hidden md:block">
        <div className="flex items-center gap-3 mb-14"><img src="/logo.svg" alt="CropCare" className="w-12 h-12 rounded-2xl" /><span className="text-2xl font-black tracking-tight">Crop<span className="text-emerald-400">Care</span></span></div>
        <div className="text-emerald-300 text-xs uppercase tracking-[.35em] font-black mb-5">A smarter field notebook</div>
        <h1 className="font-headline font-black mb-8">Turn every scan into a better season.</h1>
        <p className="text-emerald-50/60 text-lg leading-relaxed max-w-lg">Keep your crop intelligence in one calm workspace, from the first image to the final treatment plan.</p>
      </div>

      {/* Signup Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "circOut" }}
        className="auth-card w-full max-w-md px-8 sm:px-10 py-10 rounded-[2.5rem]"
      >
        <div className="text-center mb-10">
          <img src="/logo.svg" alt="CropCare logo" className="inline-flex w-16 h-16 rounded-2xl mb-6 shadow-xl shadow-emerald-500/30" />
          <div className="text-emerald-400 text-xs font-black tracking-[.3em] uppercase mb-3">CropCare Diagnostics</div>
          <h1 className="text-4xl font-black text-white tracking-tighter font-headline mb-2">Register Identity</h1>
          <p className="text-emerald-100/40 text-sm font-medium">Join the elite network of digital ethnobotanists.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative group">
            <User className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-100/30 group-focus-within:text-emerald-400 transition-colors" />
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name" 
              className="auth-input w-full pl-16 pr-8 py-5 rounded-2xl text-white outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all placeholder:text-emerald-100/40 font-medium"
            />
          </div>

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
              placeholder="Security Key (Password)" 
              className="auth-input w-full pl-16 pr-8 py-5 rounded-2xl text-white outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all placeholder:text-emerald-100/40 font-medium"
            />
          </div>

          <p className="text-[10px] text-emerald-100/30 font-medium px-2 leading-relaxed">
            By registering, you agree to our <span className="text-emerald-500">Biological Data Protocols</span> and <span className="text-emerald-500">Encryption Standards</span>.
          </p>

          <button 
            type="submit"
            className="w-full py-5 mt-4 rounded-2xl bg-emerald-500 text-emerald-950 font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-500/20 hover:bg-white hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            Create Botanist Profile <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="mt-10 text-center text-sm font-medium text-emerald-100/30">
          Already a member? <Link to="/login" className="text-emerald-500 hover:text-white transition-colors">Authenticate Access</Link>
        </p>
      </motion.div>
    </div></div>
  );
}
