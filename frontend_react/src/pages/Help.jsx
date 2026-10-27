import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, HelpCircle, MessageSquare, Book, LifeBuoy, ChevronRight, Zap, ChevronDown } from "lucide-react";

export default function Help() {
  const [openFaq, setOpenFaq] = useState(0);
  const [search, setSearch] = useState("");
  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "circOut", staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.98 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
  };

  const faqs = [
    { q: "How does the Hybrid AI engine work?", a: "We combine MobileNetV2 for visual feature mapping with GLCM (Gray-Level Co-occurrence Matrix) to analyze leaf microscopic textures." },
    { q: "What is the optimal lighting for a scan?", a: "Natural indirect daylight is best. Avoid harsh shadows or camera flash which can distort the spectral color readings." },
    { q: "Can I use the system offline?", a: "The web interface requires a connection to synchronize with the local FastAPI backend, but prediction models reside on your local disk." },
    { q: "How do I update the disease database?", a: "Updates are pushed through our Secure Botanical Portal and can be synchronized in the Settings menu." },
  ];

  return (
    <motion.div 
      initial="hidden" 
      animate="visible" 
      variants={containerVariants}
      className="w-full px-12 pb-20"
    >
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <motion.div variants={itemVariants} className="text-center mb-20 max-w-3xl mx-auto">
          <h1 className="text-6xl font-black text-emerald-950 mb-8 tracking-tighter font-headline">
            Support Intelligence
          </h1>
          <div className="relative group mx-auto max-w-2xl">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
            <input 
              type="text"
              placeholder="Search diagnostic protocols, API docs, or system FAQs..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full pl-16 pr-8 py-6 rounded-[2.5rem] bg-white border border-black/5 botanical-shadow outline-none focus:ring-8 focus:ring-emerald-500/5 transition-all font-bold text-emerald-950 text-lg placeholder:text-slate-300"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 font-black text-[10px] uppercase tracking-widest border border-emerald-100">
              Ctrl + K
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* FAQ Section */}
          <div className="lg:col-span-8 space-y-8">
            <motion.div variants={itemVariants} className="flex items-center justify-between mb-4">
               <h3 className="text-xl font-black text-emerald-950 tracking-tighter font-headline">Frequently Asked Questions</h3>
               <button className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Browse Full Database</button>
            </motion.div>
            
            <div className="space-y-4">
               {faqs.filter((faq) => `${faq.q} ${faq.a}`.toLowerCase().includes(search.toLowerCase())).map((faq, i) => (
                 <motion.div 
                   key={i}
                   variants={itemVariants}
                   whileHover={{ x: 4 }}
                   onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                   className="bg-white rounded-[2rem] p-8 botanical-shadow border border-black/5 group cursor-pointer transition-all hover:bg-emerald-50/20"
                 >
                   <div className="flex justify-between items-center gap-6">
                      <div>
                         <div className="text-lg font-black text-emerald-950 leading-tight group-hover:text-emerald-700 transition-colors">{faq.q}</div>
                         <AnimatePresence initial={false}>{openFaq === i && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden"><div className="pt-3 text-sm text-slate-500 font-medium leading-relaxed max-w-2xl">{faq.a}</div></motion.div>}</AnimatePresence>
                      </div>
                      <ChevronDown className={`w-5 h-5 text-slate-300 group-hover:text-emerald-500 transition-all shrink-0 ${openFaq === i ? "rotate-180" : ""}`} />
                   </div>
                 </motion.div>
               ))}
            </div>
          </div>

          {/* Contact / Sidebar */}
          <div className="lg:col-span-4 space-y-10">
             <motion.div variants={itemVariants} className="bg-white rounded-[3rem] p-10 botanical-shadow border border-black/5 space-y-10">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-xl bg-emerald-900 flex items-center justify-center">
                      <LifeBuoy className="w-5 h-5 text-emerald-100" />
                   </div>
                   <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-900/40">Resource Hub</h3>
                </div>

                <div className="space-y-6">
                   {[
                     { label: "Engineering Docs", icon: Zap, color: "text-amber-500" },
                     { label: "ML Accuracy Reports", icon: Book, color: "text-emerald-500" },
                     { label: "Community Forum", icon: MessageSquare, color: "text-blue-500" },
                   ].map((item) => (
                     <button key={item.label} className="flex items-center justify-between w-full group py-2">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:shadow-lg group-hover:text-emerald-600 transition-all duration-300">
                              <item.icon className="w-6 h-6" />
                           </div>
                           <span className="text-xs font-black uppercase tracking-widest text-emerald-950">{item.label}</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-200 group-hover:translate-x-1 transition-all" />
                     </button>
                   ))}
                </div>
             </motion.div>

             <motion.div variants={itemVariants} className="bg-emerald-950 rounded-[3rem] p-10 text-white shadow-2xl shadow-emerald-900/40 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                   <MessageSquare className="w-40 h-40" />
                </div>
                <div className="relative z-10">
                   <h1 className="text-3xl font-black mb-6 tracking-tighter font-headline leading-none">Need Expert <br/>Consultation?</h1>
                   <p className="text-emerald-100/50 text-sm font-medium leading-relaxed mb-10">Our senior agronomists are available for custom pathological deep-dives.</p>
                   <button className="w-full py-5 rounded-2xl bg-emerald-500 text-emerald-950 font-black text-[10px] uppercase tracking-widest hover:bg-white transition-all active:scale-95">
                      Open Support Ticket
                   </button>
                </div>
             </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
