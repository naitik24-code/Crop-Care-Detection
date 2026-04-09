import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Cpu, Activity, Info } from "lucide-react";
import UploadCard from "../components/UploadCard";
import ResultCard from "../components/ResultCard";
import { predictDisease } from "../api";

export default function Home({ apiOnline, statusColor }) {
  const [view, setView] = useState("dashboard");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [filename, setFilename] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState(null);

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "circOut" } }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.98 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
  };

  const handleFileSelected = async (file) => {
    setIsLoading(true);
    setError(null);
    setFilename(file.name);
    const url = URL.createObjectURL(file);
    setImageUrl(url);

    try {
      const data = await predictDisease(file);
      setResult(data);
      setView("result");

      // Persist to local storage
      const existingHistory = JSON.parse(localStorage.getItem("plantwise_history") || "[]");
      const newEntry = {
        id: Date.now(),
        date: new Date().toISOString().split("T")[0],
        crop: data.prediction.split("___")[0], // Extract crop name
        result: data.prediction.split("___")[1]?.replace(/_/g, " ") || data.prediction,
        confidence: data.confidence,
        status: data.confidence > 0.9 ? "Healthy" : data.confidence > 0.7 ? "Warning" : "Critical"
      };
      
      // Keep only last 50 entries
      const updatedHistory = [newEntry, ...existingHistory].slice(0, 50);
      localStorage.setItem("plantwise_history", JSON.stringify(updatedHistory));

    } catch (err) {
      console.error("[HOME ERROR]", err);
      const msg = err.response?.data?.detail || err.message || "Unknown error";
      setError(`Backend Error: ${msg}\n\nEnsure 'python backend/app.py' is running on port 8000.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setView("dashboard");
    setResult(null);
    setFilename("");
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    setImageUrl("");
    setError(null);
  };

  return (
    <motion.div 
      initial="hidden" 
      animate="visible" 
      variants={containerVariants}
      className="w-full px-12"
    >
      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="max-w-4xl mx-auto mb-10 rounded-2xl p-6 flex items-start gap-4 bg-red-50 text-red-900 border border-red-100 shadow-xl shadow-red-900/5 overflow-hidden"
          >
            <Info className="shrink-0 text-red-600 w-6 h-6" />
            <div className="flex-1">
              <h4 className="font-black text-sm uppercase tracking-widest mb-2">Engine System Alert</h4>
              <pre className="text-xs font-mono leading-relaxed opacity-70 whitespace-pre-wrap">{error}</pre>
            </div>
            <button onClick={() => setError(null)} className="text-red-900/40 hover:text-red-900 p-2 transition-colors">
              <span className="material-symbols-outlined">close</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dashboard View */}
      {view === "dashboard" ? (
        <div className="max-w-5xl mx-auto flex flex-col items-center">
          <motion.div variants={itemVariants} className="text-center mb-16 max-w-3xl">
            <h1 className="text-7xl font-black mb-6 tracking-tighter leading-[0.9] text-emerald-950 font-headline">
              Crop Intelligence
            </h1>
            <p className="text-xl text-slate-500 leading-relaxed font-medium">
              Elite botanical diagnostics powered by a Hybrid AI Pipeline. Our neural networks analyze cellular patterns to identify plant pathologies with 98% accuracy.
              <span className="block mt-4 text-xs text-emerald-600 font-black uppercase tracking-[0.2em]">(GLCM + HOG + MOBILENETV2)</span>
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="w-full max-w-4xl flex justify-center mb-20">
            <UploadCard onFileSelected={handleFileSelected} isLoading={isLoading} />
          </motion.div>

          {/* Feature Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 w-full mb-12">
            <motion.div 
              variants={itemVariants}
              whileHover={{ y: -8 }}
              className="md:col-span-8 rounded-[3rem] p-12 bg-white border border-black/5 botanical-shadow relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover:scale-110 transition-transform duration-1000">
                <ShieldCheck className="w-80 h-80 text-emerald-900" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-10">
                  <div className="w-10 h-10 rounded-xl bg-emerald-900 flex items-center justify-center shadow-2xl shadow-emerald-900/40">
                    <ShieldCheck className="w-5 h-5 text-emerald-100" />
                  </div>
                  <span className="font-black uppercase tracking-[0.25em] text-[10px] text-emerald-900/40">Core Technology</span>
                </div>
                <h3 className="text-4xl font-black mb-8 text-emerald-950 tracking-tighter font-headline leading-tight">
                  Hybrid Machine <br/>Learning Engine
                </h3>
                <p className="text-lg leading-relaxed mb-10 text-slate-500 max-w-xl">
                  Unlike simple CNNs, our engine extracts <span className="font-bold text-emerald-900">2852 mathematical features</span> per image, 
                  synthesizing deep visual embeddings with high-resolution texture and shape analytics.
                </p>
                <div className="flex gap-3 flex-wrap">
                  {["Deep Vision", "Texture Analytics", "Morphological Mapping"].map(tag => (
                    <span key={tag} className="px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest bg-emerald-900/5 text-emerald-900 border border-emerald-900/10">{tag}</span>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div 
              variants={itemVariants}
              whileHover={{ y: -8 }}
              className="md:col-span-4 rounded-[3rem] p-12 bg-emerald-950 text-white shadow-2xl shadow-emerald-950/20 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/40 to-transparent" />
              <div className="relative z-10 h-full flex flex-col">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] mb-12 text-emerald-500/60">Engine Health</h3>
                <div className="space-y-10 flex-1">
                  {[
                    { label: "Predictor API", icon: Activity }, 
                    { label: "Dataset Model", icon: Cpu }, 
                    { label: "Vision Pipeline", icon: ShieldCheck }
                  ].map(({ label, icon: Icon }) => (
                    <div key={label} className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                          <Icon className="w-5 h-5 text-white/40" />
                        </div>
                        <span className="text-xs font-bold tracking-widest uppercase text-white/80">{label}</span>
                      </div>
                      <div className={`w-2.5 h-2.5 rounded-full shadow-2xl ${statusColor} ${apiOnline ? "animate-pulse shadow-emerald-500" : ""}`} />
                    </div>
                  ))}
                </div>
                <button className="mt-12 w-full py-5 rounded-2xl bg-white/10 border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-emerald-500 hover:text-emerald-950 hover:border-emerald-500 transition-all active:scale-95">
                  Run Diagnostic
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      ) : (
        <ResultCard
          result={result}
          filename={filename}
          imageUrl={imageUrl}
          onReset={handleReset}
        />
      )}
    </motion.div>
  );
}

