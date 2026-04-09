import { motion } from "framer-motion";
import { Settings as SettingsIcon, Bell, Shield, Cpu, Save, User, Globe } from "lucide-react";

export default function Settings() {
  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "circOut", staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.98 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
  };

  return (
    <motion.div 
      initial="hidden" 
      animate="visible" 
      variants={containerVariants}
      className="w-full px-12 pb-20"
    >
      <div className="max-w-5xl mx-auto">
        <motion.div variants={itemVariants} className="mb-16">
          <h1 className="text-6xl font-black text-emerald-950 mb-6 tracking-tighter font-headline">
            Preferences
          </h1>
          <p className="text-xl text-slate-500 font-medium max-w-2xl leading-relaxed">
            Calibrate your local AI engine and synchronize your botanical diagnostic parameters.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column - Nav Links (Optional but for scale) */}
          <div className="lg:col-span-4 space-y-6">
            {[
              { label: "Profile", icon: User, active: true },
              { label: "AI Engine", icon: Cpu, active: false },
              { label: "Security", icon: Shield, active: false },
              { label: "Notifications", icon: Bell, active: false },
              { label: "Language", icon: Globe, active: false },
            ].map((link) => (
              <motion.button
                key={link.label}
                variants={itemVariants}
                className={`w-full flex items-center justify-between p-6 rounded-[2rem] transition-all group ${
                  link.active 
                    ? "bg-emerald-950 text-white shadow-2xl shadow-emerald-900/40" 
                    : "bg-white text-slate-400 botanical-shadow border border-black/5 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-4">
                  <link.icon className={`w-5 h-5 ${link.active ? "text-emerald-400" : "group-hover:text-emerald-600"}`} />
                  <span className="text-xs font-black uppercase tracking-widest">{link.label}</span>
                </div>
                {link.active && <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
              </motion.button>
            ))}
          </div>

          {/* Right Column - Form Content */}
          <div className="lg:col-span-8 space-y-10">
            <motion.div variants={itemVariants} className="bg-white rounded-[3rem] p-12 botanical-shadow border border-black/5">
              <div className="flex items-center gap-3 mb-10">
                <div className="w-10 h-10 rounded-xl bg-emerald-900 flex items-center justify-center">
                  <User className="w-5 h-5 text-emerald-100" />
                </div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-900/40">Profile Configuration</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Laboratory Admin</label>
                  <input 
                    type="text" 
                    defaultValue="Naitik Pathak"
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none outline-none focus:bg-emerald-50 focus:ring-4 focus:ring-emerald-500/10 transition-all font-bold text-emerald-950" 
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Contact Metadata</label>
                  <input 
                    type="email" 
                    defaultValue="admin@plantwise.io"
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none outline-none focus:bg-emerald-50 focus:ring-4 focus:ring-emerald-500/10 transition-all font-bold text-emerald-950" 
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Botanical Biography</label>
                <textarea 
                  rows="4"
                  defaultValue="Senior Field Researcher focusing on automated pathology detection in various tomato cultivars using deep feature extraction."
                  className="w-full px-6 py-5 rounded-[2rem] bg-slate-50 border-none outline-none focus:bg-emerald-50 focus:ring-4 focus:ring-emerald-500/10 transition-all font-bold text-emerald-950 leading-relaxed"
                />
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-white rounded-[3rem] p-12 botanical-shadow border border-black/5">
              <div className="flex items-center gap-3 mb-10">
                <div className="w-10 h-10 rounded-xl bg-emerald-900 flex items-center justify-center">
                  <Cpu className="w-5 h-5 text-emerald-100" />
                </div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-900/40">Engine Optimization</h3>
              </div>
              
              <div className="space-y-6">
                {[
                  { label: "Deep Feature Extraction (VGG19/MobileNet)", desc: "Enable multi-model synthesis for higher accuracy analytics.", active: true },
                  { label: "Real-time Histogram Neutralization", desc: "Automatically balance exposure levels in high-glare field conditions.", active: true },
                  { label: "Edge Computing Buffer", desc: "Store temporary spectral data locally to allow offline diagnostics.", active: false },
                ].map((toggle) => (
                  <div key={toggle.label} className="flex items-center justify-between p-6 rounded-3xl bg-slate-50 border border-black/[0.02]">
                    <div className="max-w-md">
                      <div className="text-xs font-black text-emerald-950 mb-1">{toggle.label}</div>
                      <div className="text-[10px] text-slate-400 font-bold leading-relaxed">{toggle.desc}</div>
                    </div>
                    <button className={`w-12 h-6 rounded-full transition-all relative ${toggle.active ? "bg-emerald-500 shadow-lg shadow-emerald-500/20" : "bg-slate-200"}`}>
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${toggle.active ? "left-7" : "left-1"}`} />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex justify-end pt-4">
              <button className="flex items-center gap-3 px-10 py-5 rounded-2xl bg-emerald-950 text-white font-black text-xs uppercase tracking-widest shadow-2xl shadow-emerald-900/40 hover:bg-emerald-800 transition-all active:scale-95">
                <Save className="w-4 h-4 text-emerald-400" />
                Synchronize Changes
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
