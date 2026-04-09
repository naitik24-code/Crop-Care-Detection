import { motion } from "framer-motion";
import { User, Shield, CreditCard, Award, TrendingUp, CheckCircle2, MoreVertical, LogOut } from "lucide-react";

export default function Account() {
  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "circOut", staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.98 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
  };

  const stats = [
    { label: "Total Diagnoses", value: "1,284", icon: TrendingUp, color: "emerald" },
    { label: "AI Accuracy Rating", value: "98.2%", icon: Award, color: "emerald" },
    { label: "Engine Uptime", value: "99.9%", icon: Shield, color: "emerald" },
  ];

  return (
    <motion.div 
      initial="hidden" 
      animate="visible" 
      variants={containerVariants}
      className="w-full px-12 pb-20"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header / Banner area */}
        <motion.div variants={itemVariants} className="relative mb-20">
          <div className="h-64 w-full rounded-[3.5rem] bg-emerald-950 overflow-hidden relative shadow-2xl shadow-emerald-900/20">
             <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)", backgroundSize: "32px 32px" }} />
             <div className="absolute bottom-0 left-0 w-full p-12 flex items-end justify-between bg-gradient-to-t from-emerald-950 to-transparent">
                <div className="flex items-center gap-8">
                  <div className="w-32 h-32 rounded-[2.5rem] bg-emerald-500 border-8 border-emerald-950 flex items-center justify-center text-emerald-950 text-4xl font-black shadow-2xl">
                    NP
                  </div>
                  <div className="pb-2">
                    <div className="flex items-center gap-3 mb-2">
                       <h1 className="text-4xl font-black text-white tracking-tighter font-headline">Naitik Pathak</h1>
                       <div className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-black text-[10px] uppercase tracking-widest">Master Botanist</div>
                    </div>
                    <p className="text-emerald-100/50 font-bold text-sm tracking-tight">Agricultural Data Scientist | Pune Research Lab</p>
                  </div>
                </div>
                <button className="px-8 py-4 rounded-2xl bg-white/10 text-white font-black text-[10px] uppercase tracking-widest hover:bg-white/20 transition-all border border-white/10 flex items-center gap-3">
                  <MoreVertical className="w-4 h-4" />
                  Profile Actions
                </button>
             </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Side - Stats & Identity */}
          <div className="lg:col-span-8 space-y-10">
            {/* Stats Bento */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {stats.map((stat) => (
                <motion.div key={stat.label} variants={itemVariants} className="bg-white rounded-[2.5rem] p-8 botanical-shadow border border-black/5 flex flex-col justify-between">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 mb-6">
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-3xl font-black text-emerald-950 tracking-tighter mb-1">{stat.value}</div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}</div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Achievement Board */}
            <motion.div variants={itemVariants} className="bg-white rounded-[3rem] p-12 botanical-shadow border border-black/5">
               <div className="flex items-center justify-between mb-10">
                  <h3 className="text-xl font-black text-emerald-950 tracking-tighter font-headline">Professional Milestones</h3>
                  <button className="text-[10px] font-black uppercase tracking-widest text-emerald-600 hover:text-emerald-700">View Badge Library</button>
               </div>
               <div className="space-y-6">
                  {[
                    { title: "Precision Pioneer", desc: "First 100 diagnoses with >95% confidence score.", date: "Jan 12, 2024" },
                    { title: "Network Contributor", desc: "Successfully synthesized 500+ local leaf samples into the global dataset.", date: "Feb 05, 2024" },
                  ].map((award) => (
                    <div key={award.title} className="flex items-start gap-5 p-6 rounded-3xl bg-slate-50 relative group transition-all hover:bg-emerald-50/30">
                       <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-emerald-600 shadow-sm border border-black/5">
                          <CheckCircle2 className="w-6 h-6" />
                       </div>
                       <div className="flex-1">
                          <div className="flex justify-between items-start mb-1">
                             <h4 className="text-sm font-black text-emerald-950">{award.title}</h4>
                             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{award.date}</span>
                          </div>
                          <p className="text-xs text-slate-500 font-medium leading-relaxed">{award.desc}</p>
                       </div>
                    </div>
                  ))}
               </div>
            </motion.div>
          </div>

          {/* Right Side - Security & Subscription */}
          <div className="lg:col-span-4 space-y-10">
             <motion.div variants={itemVariants} className="bg-emerald-950 rounded-[3rem] p-10 text-white shadow-2xl shadow-emerald-900/40 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                   <CreditCard className="w-40 h-40" />
                </div>
                <div className="relative z-10">
                   <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-12 text-emerald-500/60">Membership Plan</h3>
                   <div className="mb-12">
                      <div className="text-4xl font-black tracking-tighter mb-2">Enterprise Lab</div>
                      <div className="text-emerald-500/80 font-bold text-xs">Billed annually • Next cycle April 2025</div>
                   </div>
                   <ul className="space-y-4 mb-12">
                      {["Unlimited AI Scans", "Raw GLCM Data Export", "API Dedicated Endpoint"].map(f => (
                        <li key={f} className="flex items-center gap-3 text-xs font-bold text-white/70">
                           <div className="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center">
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                           </div>
                           {f}
                        </li>
                      ))}
                   </ul>
                   <button className="w-full py-5 rounded-2xl bg-emerald-500 text-emerald-950 font-black text-[10px] uppercase tracking-widest hover:bg-white transition-all active:scale-95">
                      Manage Subscription
                   </button>
                </div>
             </motion.div>

             <motion.div variants={itemVariants} className="bg-white rounded-[2.5rem] p-10 botanical-shadow border border-black/5">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-8 text-slate-400">Security</h3>
                <div className="space-y-6">
                   <button className="flex items-center justify-between w-full group">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-emerald-600 transition-colors">
                            <Shield className="w-5 h-5" />
                         </div>
                         <span className="text-[10px] font-black uppercase tracking-widest text-emerald-950">Update Credentials</span>
                      </div>
                      <MoreVertical className="w-4 h-4 text-slate-300" />
                   </button>
                   <button className="flex items-center justify-between w-full group pt-4 border-t border-slate-50">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-red-500 transition-colors">
                            <LogOut className="w-5 h-5" />
                         </div>
                         <span className="text-[10px] font-black uppercase tracking-widest text-emerald-950">Terminate Session</span>
                      </div>
                   </button>
                </div>
             </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
