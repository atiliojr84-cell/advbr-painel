"use client";

import { useState } from "react";
import { ArrowLeft, Activity } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { jurisdictions } from "../../data/jurisdictions";

export default function JurisdictionHub({ 
  statuses = {}, 
  pings = {} 
}: { 
  statuses?: Record<string, string>;
  pings?: Record<string, number>;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<'estado' | 'tribunal'>('estado');
  const [activeRegiao, setActiveRegiao] = useState<string>('');
  const [selectedEstado, setSelectedEstado] = useState<string>('');

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

  // --- LÓGICA: Descobre se a região ou estado tem problema ---
  const getGroupStatus = (tribunals: any[]) => {
    if (!tribunals) return 'online';
    let hasOffline = false;
    let hasInstavel = false;

    tribunals.forEach(trib => {
      const status = statuses[trib.name];
      if (status === 'offline') hasOffline = true;
      if (status === 'instavel') hasInstavel = true;
    });

    if (hasOffline) return 'offline';
    if (hasInstavel) return 'instavel';
    return 'online';
  };

  const getRegionTribunals = (regionKey: string) => {
    if (regionKey === 'federais') return jurisdictions.federais;
    const regionData = (jurisdictions.regioes as any)[regionKey];
    if (!regionData) return [];
    const allTribs: any[] = [];
    Object.values(regionData).forEach((stateTribs: any) => allTribs.push(...stateTribs));
    return allTribs;
  };

  // Mantém as luzinhas originais intactas
  const getStatusColor = (nomeTribunal: string) => {
    const status = statuses[nomeTribunal];
    if (status === 'online') return "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]";
    if (status === 'instavel') return "bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.6)]";
    if (status === 'offline') return "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]";
    return "bg-slate-600 animate-pulse"; 
  };

  // --- ESTILOS NOVOS: Cores suaves para os botões (Amarelo limão puro) ---
  const getRegionBtnStyle = (status: string) => {
    const base = "px-6 py-3 text-slate-300 capitalize font-medium rounded-xl transition-colors shadow-lg border";
    if (status === 'offline') return `${base} bg-red-950/40 border-red-900/50 hover:bg-red-900/50`;

    // Amarelo limão (yellow-400) para afastar bem do vermelho
    if (status === 'instavel') return `${base} bg-yellow-400/10 border-yellow-400/50 hover:bg-yellow-400/20`;

    return `${base} bg-slate-900 border-slate-800 hover:bg-slate-800`;
  };

  const getStateBtnStyle = (status: string) => {
    const base = "p-4 text-white font-medium text-sm text-left rounded-xl transition-colors border";
    if (status === 'offline') return `${base} bg-red-950/30 border-red-900/50 hover:bg-red-900/50`;

    // Amarelo limão (yellow-400) para os botões de estado
    if (status === 'instavel') return `${base} bg-yellow-400/10 border-yellow-400/40 hover:bg-yellow-400/20`;

    return `${base} bg-slate-950 border-slate-800 hover:bg-slate-900`;
  };
  // --------------------------------------------------

  const modalBtnStyle = "bg-slate-950 hover:bg-slate-900 rounded-xl transition-colors border border-slate-800";

  return (
    <>
      <section className="py-8 px-4 text-center">
        <div className="max-w-3xl mx-auto mb-12 bg-slate-900/50 border border-slate-800 p-8 rounded-3xl shadow-xl">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 bg-blue-900/20 rounded-2xl">
              <Activity className="w-8 h-8 text-blue-500" />
            </div>
            <h2 className="text-2xl font-bold text-white">Monitoramento de Tribunais em Tempo Real</h2>
          </div>
          <p className="text-slate-400 leading-relaxed text-sm">
            Centralizamos o acesso aos principais sistemas de peticionamento do país. Realizamos o monitoramento proativo de cada portal, identificando instabilidades em tempo real.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          {["Federais", "Sul", "Sudeste", "CentroOeste", "Nordeste", "Norte"].map((r) => {
            const regionKey = regiaoMap[r.toLowerCase()];
            const tribs = getRegionTribunals(regionKey);
            const groupStatus = getGroupStatus(tribs);

            return (
              <button 
                key={r} 
                onClick={() => handleOpen(r.toLowerCase())} 
                className={getRegionBtnStyle(groupStatus)}
              >
                {r === "CentroOeste" ? "Centro-Oeste" : r}
              </button>
            );
          })}
        </div>
      </section>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              key="modal-content"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900 p-8 rounded-2xl shadow-2xl max-w-lg w-full flex flex-col max-h-[90vh] border border-slate-800"
            >
              <div className="flex items-center justify-between mb-6 shrink-0">
                <div className="flex items-center gap-3">
                  {view === 'tribunal' && activeRegiao !== 'federais' && (
                    <button onClick={() => setView('estado')} className="text-slate-400 hover:text-white transition-colors">
                      <ArrowLeft size={24} />
                    </button>
                  )}
                  <h3 className="text-white text-xl font-bold">
                    {activeRegiao === 'federais' ? 'Tribunais Federais' : (view === 'estado' ? activeRegiao : selectedEstado)}
                  </h3>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-white">Fechar</button>
              </div>

              <div className="overflow-y-auto overscroll-contain max-h-[60vh] pr-2 -mr-2 custom-scrollbar scroll-smooth">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={view + activeRegiao + selectedEstado}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {view === 'estado' ? (
                      <div className="grid grid-cols-2 gap-3 pb-4">
                        {Object.keys((jurisdictions.regioes as any)[activeRegiao] || {}).map((e) => {
                          const stateTribs = (jurisdictions.regioes as any)[activeRegiao][e];
                          const stateStatus = getGroupStatus(stateTribs);

                          return (
                            <button 
                              key={e} 
                              onClick={() => { setSelectedEstado(e); setView('tribunal'); }} 
                              className={getStateBtnStyle(stateStatus)}
                            >
                              {e}
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="space-y-3 pb-4">
                        {(activeRegiao === 'federais' ? jurisdictions.federais : (jurisdictions.regioes as any)[activeRegiao]?.[selectedEstado])?.map((t: any) => (
                          <button key={t.name} onClick={() => window.open(t.url, "_blank")} className={`w-full p-4 flex items-center justify-between ${modalBtnStyle}`}>
                            <div className="flex flex-col items-start">
                              <span className="text-white text-sm font-medium">{t.name}</span>
                              {/* AQUI ENTRA O PING */}
                              {pings[t.name] !== undefined && (
                                <span className="text-xs text-slate-500 mt-0.5">{pings[t.name]}ms</span>
                              )}
                            </div>
                            <div className={`w-3 h-3 rounded-full shrink-0 transition-colors duration-500 ${getStatusColor(t.name)}`} />
                          </button>
                        ))}
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
