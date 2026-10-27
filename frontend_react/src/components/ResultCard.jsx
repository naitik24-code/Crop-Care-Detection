import { useState } from "react";

export default function ResultCard({ result, filename, imageUrl, onReset }) {
  const [diagnosticId] = useState(() => `BI-${Math.floor(Math.random() * 9000) + 1000}-X7`);
  const { prediction = "", confidence = 0, description = "", solution = "" } = result;

  const formattedPred = prediction.replace(/___/g, " - ").replace(/_/g, " ");
  const confPercentage = (confidence * 100).toFixed(1);

  const solutionSteps = solution
    .split(".")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col animate-fade-in px-4 pb-20">
      {/* Header Section */}
      <div className="flex items-end justify-between mb-12 flex-wrap gap-6">
        <div>
          <h1 className="text-5xl font-black mb-3 font-headline tracking-tighter text-emerald-950">
            Analysis Complete
          </h1>
          <div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest">
            <span className="material-symbols-outlined text-sm">fingerprint</span>
            Diagnostic ID: {diagnosticId} • {filename}
          </div>
        </div>
        <div className="flex items-center gap-3 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-emerald-900/5 bg-emerald-50 text-emerald-700 border border-emerald-100">
          <span className="material-symbols-outlined text-base animate-pulse" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
          AI Engine Synchronized
        </div>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Core Pathology Card (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          <div className="rounded-[3rem] p-12 bg-white botanical-shadow border border-black/5 relative overflow-hidden group">
            <div className="flex flex-col md:flex-row gap-12 items-start">
              {/* Image Preview Window */}
              <div className="shrink-0 w-64">
                <div className="relative rounded-[2rem] overflow-hidden shadow-2xl shadow-emerald-900/10 border-4 border-white transform -rotate-2 group-hover:rotate-0 transition-transform duration-700">
                  {imageUrl && <img src={imageUrl} alt="Uploaded leaf" className="w-full aspect-square object-cover" />}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white text-[10px] font-black uppercase tracking-widest bg-emerald-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg">
                    Sample Plate
                  </div>
                </div>
              </div>

              {/* Diagnostic Metadata */}
              <div className="flex-1 space-y-8">
                <div>
                  <span className="font-black uppercase tracking-[0.3em] text-[10px] block mb-4 text-emerald-600">
                    Primary Pathogen Detected
                  </span>
                  <h2 className="text-5xl font-black font-headline text-emerald-950 tracking-tighter leading-tight mb-2">
                    {formattedPred}
                  </h2>
                  <p className="text-slate-400 font-serif italic text-lg opacity-80">Biological Classification Pending</p>
                </div>

                {/* Accuracy Gauge */}
                <div className="space-y-3">
                  <div className="flex justify-between items-end px-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">ML Confidence Score</span>
                    <span className="text-3xl font-black text-emerald-900 tracking-tighter">{confPercentage}%</span>
                  </div>
                  <div className="h-4 w-full rounded-full bg-slate-100 p-1 border border-black/5 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000 shadow-lg shadow-emerald-500/20"
                      style={{ width: `${confPercentage}%`, backgroundColor: "var(--primary)" }}
                    />
                  </div>
                </div>

                {/* AI Insight Block */}
                <div className="rounded-3xl p-8 bg-emerald-50/50 border border-emerald-100/50">
                  <h4 className="font-black text-[10px] uppercase tracking-widest mb-4 flex items-center gap-2 text-emerald-800">
                    <span className="material-symbols-outlined text-sm">info</span>
                    Neural Insight
                  </h4>
                  <p className="leading-relaxed text-slate-600 font-medium text-sm">
                    {description || "Deep spectral analysis indicates cellular anomalies consistent with this pathology. Immediate isolation is advised to mitigate lateral transmission across the crop population."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Environmental Context Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="rounded-[2.5rem] p-10 bg-white botanical-shadow border border-black/5">
               <h3 className="text-[10px] font-black uppercase tracking-widest mb-6 text-emerald-900/40">Environment</h3>
               <div className="flex items-center gap-4 mb-4">
                 <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center">
                   <span className="material-symbols-outlined text-emerald-600">thermostat</span>
                 </div>
                 <div className="text-xl font-black text-emerald-950">Humid / Moderate</div>
               </div>
               <p className="text-xs text-slate-500 font-medium leading-relaxed">High humidity levels detected in your region over the last 48 hours favored fungal germination and cellular decay.</p>
            </div>
            
            <div className="rounded-[2.5rem] p-10 bg-white botanical-shadow border border-black/5">
               <h3 className="text-[10px] font-black uppercase tracking-widest mb-6 text-emerald-900/40">Prevalence</h3>
               <div className="flex items-center gap-4 mb-4">
                 <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center">
                   <span className="material-symbols-outlined text-emerald-600">group</span>
                 </div>
                 <div className="text-xl font-black text-emerald-950">Common</div>
               </div>
               <p className="text-xs text-slate-500 font-medium leading-relaxed">This pathogen is currently active in your cultivar type with high local frequency reported this week.</p>
            </div>
          </div>
        </div>

        {/* Right Column: Treatment Plan (4 cols) */}
        <div className="lg:col-span-4 rounded-[3rem] p-10 bg-emerald-950 text-white shadow-2xl shadow-emerald-900/20 flex flex-col relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 to-transparent" />
          <div className="relative z-10 flex flex-col h-full">
            <h3 className="text-3xl font-black mb-10 leading-none font-headline tracking-tighter">Recommended <br/>Action Plan</h3>
            <ul className="space-y-6 flex-1">
              {(solutionSteps.length > 0 ? solutionSteps : ["Apply copper-based fungicide", "Remove infected foliage", "Increase canopy airflow"]).map((step, i) => (
                <li key={i} className="flex gap-4 items-start group">
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0 border border-emerald-500/30 group-hover:bg-emerald-500 transition-colors">
                    <span className="material-symbols-outlined text-[14px] text-emerald-400 group-hover:text-emerald-950" style={{ fontVariationSettings: "'wght' 700" }}>check</span>
                  </div>
                  <span className="text-sm font-bold tracking-tight text-white/90 leading-tight">{step}</span>
                </li>
              ))}
            </ul>
            
            <div className="mt-12 space-y-4">
              <button
                className="w-full py-5 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-emerald-950 hover:border-emerald-500 transition-all active:scale-95"
              >
                Export PDF Report
              </button>
              <button
                onClick={onReset}
                className="w-full py-5 rounded-2xl bg-emerald-500 text-emerald-950 font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-emerald-500/20 hover:bg-white transition-all active:scale-95"
              >
                Capture New Scan
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

