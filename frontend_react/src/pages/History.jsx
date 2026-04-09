import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { History as HistoryIcon, FileText, ChevronRight, Activity, Calendar, Trash2 } from "lucide-react";

export default function History() {
  const [pastAnalyses, setPastAnalyses] = useState([]);

  useEffect(() => {
    const loadHistory = () => {
      const saved = localStorage.getItem("plantwise_history");
      if (saved) {
        setPastAnalyses(JSON.parse(saved));
      } else {
        // Initial mock data if empty
        const initialMock = [
          { id: 1, date: "2024-03-28", crop: "Tomato", result: "Early Blight", confidence: 0.94, status: "Critical" },
          { id: 2, date: "2024-03-27", crop: "Apple", result: "Apple Scab", confidence: 0.88, status: "Warning" },
          { id: 3, date: "2024-03-25", crop: "Potato", result: "Healthy", confidence: 0.98, status: "Healthy" },
        ];
        setPastAnalyses(initialMock);
        localStorage.setItem("plantwise_history", JSON.stringify(initialMock));
      }
    };
    loadHistory();
  }, []);

  const deleteEntry = (id) => {
    const updated = pastAnalyses.filter(item => item.id !== id);
    setPastAnalyses(updated);
    localStorage.setItem("plantwise_history", JSON.stringify(updated));
  };

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
            Diagnostic Archives
          </h1>
          <p className="text-xl text-slate-500 font-medium max-w-2xl leading-relaxed">
            A chronological record of cellular analyses and pathological findings synchronized with your local ML engine.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6">
          <AnimatePresence mode="popLayout">
            {pastAnalyses.map((item) => (
              <motion.div 
                key={item.id} 
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, scale: 0.9, x: -50 }}
                whileHover={{ x: 8 }}
                className="bg-white rounded-[2.5rem] p-8 flex items-center justify-between transition-all cursor-pointer group botanical-shadow border border-black/5"
              >
                <div className="flex items-center gap-10">
                  {/* Visual Marker */}
                  <div className="relative">
                    <div className="w-20 h-20 rounded-[2rem] bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-950 group-hover:text-emerald-400 transition-all duration-500 shadow-inner">
                      <FileText className="w-8 h-8" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white border-4 border-slate-50 flex items-center justify-center">
                      <div className={`w-3 h-3 rounded-full ${item.status === "Healthy" ? "bg-emerald-500" : item.status === "Warning" ? "bg-yellow-400" : "bg-red-500"}`} />
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg">
                        {item.crop}
                      </span>
                      <div className="flex items-center gap-1.5 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                        <Calendar className="w-3.5 h-3.5" />
                        {item.date}
                      </div>
                    </div>
                    <h3 className="text-3xl font-black text-emerald-950 tracking-tighter font-headline leading-none">
                      {item.result}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-16">
                  {/* Stats */}
                  <div className="hidden md:flex flex-col items-end gap-1">
                    <div className="flex items-baseline gap-1 text-emerald-900">
                      <span className="text-4xl font-black tracking-tighter">{(item.confidence * 100).toFixed(0)}</span>
                      <span className="text-xs font-black opacity-40">%</span>
                    </div>
                    <div className="text-[10px] uppercase font-black text-slate-400 tracking-[0.2em]">Confidence</div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={(e) => { e.stopPropagation(); deleteEntry(item.id); }}
                      className="w-12 h-12 rounded-xl bg-red-50 text-red-300 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                    <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300 shadow-sm">
                      <ChevronRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {pastAnalyses.length === 0 && (
            <div className="text-center py-20 bg-slate-50/50 rounded-[3rem] border border-dashed border-slate-200">
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No diagnostic records found</p>
            </div>
          )}
        </div>

        {/* Bottom Insight Card */}
        <motion.div 
          variants={itemVariants} 
          className="mt-16 rounded-[3rem] p-12 bg-emerald-950 text-white shadow-2xl shadow-emerald-900/20 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-12 opacity-10">
            <Activity className="w-48 h-48" />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="max-w-xl">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-6 text-emerald-500">System Analytics</h4>
              <p className="text-2xl font-black font-headline tracking-tight leading-tight mb-4">
                Your archive is now <span className="text-emerald-400">synchronizing in real-time</span> with every new scan you perform.
              </p>
              <p className="text-sm text-white/50 font-medium">Capture high-resolution scans to maintain an accurate pathological history for your farm records.</p>
            </div>
            <button className="px-10 py-5 rounded-2xl bg-emerald-500 text-emerald-950 font-black text-xs uppercase tracking-widest shadow-2xl shadow-emerald-500/20 hover:bg-white transition-all active:scale-95 whitespace-nowrap">
              Export Database
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}


