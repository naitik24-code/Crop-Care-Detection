import { useState, useCallback } from "react";

export default function UploadCard({ onFileSelected, isLoading }) {
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback((file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file (JPG, PNG, WEBP, etc.)");
      return;
    }
    onFileSelected(file);
  }, [onFileSelected]);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  return (
    <section className="rounded-[2.5rem] p-4 flex flex-col items-center w-full mb-8 relative border border-black/5 botanical-shadow bg-white">
      <input type="file" id="file-input" accept="image/*" className="hidden"
        onChange={(e) => { handleFile(e.target.files[0]); e.target.value = ""; }}
        disabled={isLoading} />

      <label htmlFor="file-input"
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`w-full rounded-[2rem] flex flex-col items-center justify-center cursor-pointer transition-all duration-700 relative overflow-hidden ${isDragging ? "animate-pulse-subtle" : ""}`}
        style={{
          height: "380px",
          border: `2px dashed ${isDragging ? "var(--primary)" : "rgba(45,106,79,0.2)"}`,
          backgroundColor: isDragging ? "rgba(177,240,206,0.2)" : "var(--surface-container-low)",
          cursor: isLoading ? "not-allowed" : "pointer",
          opacity: isLoading ? 0.75 : 1,
        }}
      >
        {isLoading ? (
          <div className="flex flex-col items-center text-center px-6">
            <div className="w-24 h-24 rounded-3xl flex items-center justify-center mb-8 bg-emerald-900/10 shadow-inner">
              <span className="material-symbols-outlined anim-spin text-emerald-900" style={{ fontSize: "48px" }}>sync</span>
            </div>
            <h2 className="text-3xl font-black mb-3 font-headline text-emerald-950 tracking-tighter">AI Processing...</h2>
            <p className="text-slate-500 max-w-sm text-sm font-medium leading-relaxed uppercase tracking-widest">Running spectral feature extraction</p>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center px-10">
            <div className={`w-24 h-24 rounded-[1.5rem] flex items-center justify-center mb-8 transition-transform duration-700 ${isDragging ? "scale-110 shadow-2xl" : "shadow-xl shadow-emerald-900/10"}`}
              style={{ backgroundColor: isDragging ? "var(--primary)" : "var(--primary-container)" }}>
              <span className="material-symbols-outlined transition-colors duration-500" 
                style={{ color: isDragging ? "white" : "var(--primary)", fontSize: "48px", fontVariationSettings: "'FILL' 1" }}>
                cloud_upload
              </span>
            </div>
            <h2 className="text-3xl font-black mb-3 font-headline text-emerald-950 tracking-tighter">Drag and drop leaf scan</h2>
            <p className="mb-10 max-w-sm text-slate-500 text-sm font-medium leading-relaxed">
              Supports high-resolution JPG, PNG, and WEBP. For best results, use natural daylight.
            </p>
            <span className="px-12 py-5 rounded-full font-black text-xs uppercase tracking-widest flex items-center gap-3 shadow-2xl shadow-emerald-900/20 transition-all hover:scale-105 active:scale-95"
              style={{ backgroundColor: "var(--primary)", color: "var(--on-primary)", pointerEvents: "none" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>add_photo_alternate</span>
              Select Image
            </span>
          </div>
        )}
      </label>
    </section>
  );
}

