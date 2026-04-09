import { motion } from "framer-motion";
import { Search, BookOpen, ExternalLink } from "lucide-react";

const DISEASES = [
  {
    name: "Tomato Early Blight",
    pathogen: "Alternaria solani",
    symptoms: "Concentric rings, yellow halos, lower leaf spotting.",
    treatment: "Copper-based fungicides, pruning, crop rotation.",
    color: "emerald"
  },
  {
    name: "Tomato Target Spot",
    pathogen: "Corynespora cassiicola",
    symptoms: "Small, circular spots with light brown centers.",
    treatment: "Azozystrobin fungicides, improved airflow.",
    color: "emerald"
  },
  {
    name: "Apple Scab",
    pathogen: "Venturia inaequalis",
    symptoms: "Velvety olive-green spots, distorted leaves.",
    treatment: "Fungicides, removing fallen leaves.",
    color: "emerald"
  },
  {
    name: "Potato Late Blight",
    pathogen: "Phytophthora infestans",
    symptoms: "Water-soaked lesions, white fuzz on underside.",
    treatment: "Systemic fungicides, immediate destruction of infected crops.",
    color: "emerald"
  }
];

export default function Library() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <motion.div 
      initial="hidden" 
      animate="visible" 
      variants={containerVariants}
      className="w-full px-12"
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <motion.div variants={itemVariants}>
            <h1 className="text-5xl font-black text-slate-800 mb-4 tracking-tight">Plant Pathogen Library</h1>
            <p className="text-slate-500 text-lg font-medium leading-relaxed">Comprehensive database of botanical pathogens, identification markers, and resolutions.</p>
          </motion.div>
          <motion.div variants={itemVariants} className="relative group shrink-0">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Search database..."
              className="pl-12 pr-6 py-4 rounded-2xl bg-white border border-slate-200 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all text-sm w-full md:w-80 font-bold shadow-sm"
            />
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-20">
          {DISEASES.map((d) => (
            <motion.div 
              key={d.name} 
              variants={itemVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              className="bg-white rounded-[2rem] p-10 border border-slate-100 shadow-xl shadow-slate-200/30 hover:shadow-emerald-900/10 transition-all group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.1] transition-opacity">
                <BookOpen className="w-32 h-32" />
              </div>
              
              <div className="flex items-center gap-5 mb-10">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500 shadow-inner">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-black text-slate-800 text-xl tracking-tight mb-1">{d.name}</h3>
                  <p className="text-[10px] font-black uppercase tracking-widest text-emerald-700 italic opacity-60">{d.pathogen}</p>
                </div>
              </div>
              
              <div className="space-y-8 relative z-10">
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 group-hover:bg-white group-hover:border-emerald-100 transition-colors">
                  <h4 className="text-[10px] uppercase font-black text-slate-400 tracking-[0.2em] mb-3">Diagnostic Markers</h4>
                  <p className="text-sm text-slate-600 leading-relaxed font-bold">{d.symptoms}</p>
                </div>
                <div>
                  <h4 className="text-[10px] uppercase font-black text-slate-400 tracking-[0.2em] mb-3">Remediation Protocol</h4>
                  <p className="text-sm text-emerald-900/70 font-bold leading-relaxed">{d.treatment}</p>
                </div>
                <button className="flex items-center gap-2 text-emerald-600 text-[10px] font-black uppercase tracking-widest hover:gap-3 transition-all pt-2">
                  View Full Profile <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
