"use client";

import { useState } from "react";
import { ArrowLeft, Activity } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { jurisdictions } from "../../data/jurisdictions";

export default function JurisdictionHub() {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<'estado' | 'tribunal'>('estado');
  const [activeRegiao, setActiveRegiao] = useState<string>('');
  const [selectedEstado, setSelectedEstado] = useState<string>('');

  const getStatusColor = (alerta: string | null) => {
    if (!alerta) return "bg-green-500";
    return alerta.toLowerCase().includes("grave") ? "bg-red-500" : "bg-yellow-500";
  };

  const regiaoMap: { [key: string]: string } = {
    federais: "federais",
    sul: "Sul",
    sudeste: "Sudeste",
    centrooeste: "CentroOeste",
    nordeste: "Nordeste",
    norte: "Norte"
  };

  const handleOpen = (regiaoSlug: string) => {
    const key = regiaoMap[regiaoSlug];
    setActiveRegiao(key);
    setView(key === 'federais' ? 'tribunal' : 'estado');
    setIsOpen(true);
  };

  const btnStyle = "bg-slate-900 rounded-xl glow-effect";

  return (
    <>
      <section className="py-8 px-4 text-center">
        {/* NOVO BLOCO DE MONITORAMENTO */}
        <div className="max-w-3xl mx-auto mb-12 bg-slate-900/50 border border-slate-800 p-8 rounded-3xl shadow-xl">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 bg-blue-900/20 rounded-2xl">
              <Activity className="w-8 h-8 text-blue-500" />
            </div>
            <h2 className="text-2xl font-bold text-white">Monitoramento de Tribunais em Tempo Real</h2>
          </div>
          
          <p className="text-slate-400 leading-relaxed mb-6 text-sm">
            Centralizamos o acesso aos principais sistemas de peticionamento do país em um ambiente único e de alta disponibilidade. 
            Além do acesso descomplicado, realizamos o monitoramento proativo de cada portal, identificando instabilidades, 
            lentidões ou indisponibilidades em tempo real, permitindo que você tome decisões rápidas e evite perder prazos 
            críticos devido a falhas sistêmicas.
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-4">
          {["Federais", "Sul", "Sudeste", "CentroOeste", "Nordeste", "Norte"].map((r) => (
            <button 
              key={r} 
              onClick={() => handleOpen(r.toLowerCase())}
              className={`px-6 py-3 rounded-full text-slate-300 capitalize ${btnStyle}`}
            >
              {r === "CentroOeste" ? "Centro-Oeste" : r}
            </button>
          ))}
        </div>
      </section>

      {isOpen && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900 p-8 rounded-3xl border border-slate-700 w-full max-w-md shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-6">
                {view === 'tribunal' && activeRegiao !== 'federais' && (
                  <button onClick={() => setView('estado')} className="text-slate-400 hover:text-white transition-colors">
                    <ArrowLeft size={20} />
                  </button>
                )}
                <span className="uppercase text-sm tracking-widest text-white">
                  {activeRegiao === 'federais' ? 'TRIBUNAIS FEDERAIS' : (view === 'estado' ? activeRegiao : selectedEstado)}
                </span>
                <button onClick={() => setIsOpen(false)} className="ml-auto text-slate-500 hover:text-white">Fechar</button>
              </div>

              <div className="overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={view + activeRegiao + selectedEstado}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {view === 'estado' ? (
                      <div className="grid grid-cols-2 gap-3">
                        {Object.keys((jurisdictions.regioes as any)[activeRegiao] || {}).map((e) => (
                          <button key={e} onClick={() => { setSelectedEstado(e); setView('tribunal'); }} className={`p-4 text-white font-medium text-sm text-left ${btnStyle}`}>
                            {e}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {(activeRegiao === 'federais' ? jurisdictions.federais : (jurisdictions.regioes as any)[activeRegiao]?.[selectedEstado])?.map((t: any) => (
                          <button key={t.name} onClick={() => window.open(t.url, "_blank")} className={`w-full p-4 flex items-center justify-between ${btnStyle}`}>
                            <span className="text-white text-sm font-medium">{t.name}</span>
                            <div className={`w-2.5 h-2.5 rounded-full ${getStatusColor(t.alerta)}`} />
                          </button>
                        ))}
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      )}
    </>
  );
}
