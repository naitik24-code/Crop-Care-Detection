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
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-emerald-950">
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full opacity-40" style={{ backgroundImage: "radial-gradient(circle at 15% 20%, #34d399 0, transparent 18%), radial-gradient(circle at 85% 80%, #0f766e 0, transparent 23%)" }} />
        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-950/90 via-transparent to-emerald-950/20" />
      </div>

      {/* Signup Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "circOut" }}
        className="relative z-10 w-full max-w-md px-10 py-12 rounded-[3.5rem] bg-white/5 backdrop-blur-3xl border border-white/10 shadow-2xl"
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
              className="w-full pl-16 pr-8 py-5 rounded-2xl bg-white/5 border border-white/5 text-white outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all placeholder:text-emerald-100/20 font-medium"
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
              className="w-full pl-16 pr-8 py-5 rounded-2xl bg-white/5 border border-white/5 text-white outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all placeholder:text-emerald-100/20 font-medium"
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
              className="w-full pl-16 pr-8 py-5 rounded-2xl bg-white/5 border border-white/5 text-white outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all placeholder:text-emerald-100/20 font-medium"
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
    </div>
  );
}
