"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Activity } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { jurisdictions } from "../../data/jurisdictions";

interface DiagnosticHubProps {
  lastUpdate: string | null;
}

export default function DiagnosticHub({ lastUpdate }: DiagnosticHubProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<'estado' | 'tribunal'>('estado');
  const [activeRegiao, setActiveRegiao] = useState<string>('');
  const [selectedEstado, setSelectedEstado] = useState<string>('');

  const [liveStatus, setLiveStatus] = useState<Record<string, string>>({});
  const [livePings, setLivePings] = useState<Record<string, number>>({});

  const regiaoMap: { [key: string]: string } = {
    federais: "federais",
    sul: "Sul",
    sudeste: "Sudeste",
    centrooeste: "CentroOeste",
    nordeste: "Nordeste",
    norte: "Norte"
  };

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch('/api/status');
        if (response.ok) {
          const data = await response.json();
          setLiveStatus(data.statuses);
          setLivePings(data.pings);
        }
      } catch (error) {
        console.error("Erro ao buscar status:", error);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 60000); // Atualiza a cada 1 minuto
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (tribunalName: string) => {
    const status = liveStatus[tribunalName];
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'instavel':
        return 'bg-yellow-500';
      case 'offline':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const modalBtnStyle = "border border-slate-700 bg-slate-900 text-white rounded transition-all duration-300 hover:border-blue-500 hover:shadow-[0_0_10px_rgba(37,99,235,0.5)] hover:bg-slate-800 text-left";

  const handleBack = () => {
    if (view === 'tribunal') {
      if (activeRegiao === 'federais') {
        setView('estado'); // Volta para a seleção de região (Federais)
        setActiveRegiao(''); // Limpa a região ativa para mostrar todas as opções
      } else {
        setView('estado'); // Volta para a seleção de estado
        setSelectedEstado('');
      }
    } else if (view === 'estado') {
      setIsOpen(false);
      setActiveRegiao('');
    }
  };

  return (
    <section className="w-full max-w-6xl mx-auto p-4 my-8">
      <div className="flex items-center justify-center gap-3 mb-8">
        <Activity className="w-8 h-8 text-blue-500" />
        <h2 className="text-3xl font-bold text-white">Monitoramento de Tribunais</h2>
      </div>

      <div className="bg-slate-800 p-6 rounded-xl shadow-lg text-center mb-8">
        <p className="text-slate-400 text-sm mb-2">Última atualização: {lastUpdate ? new Date(lastUpdate).toLocaleString('pt-BR') : 'Carregando...'}</p>
        <button
          onClick={() => setIsOpen(true)}
          className="py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors duration-200"
        >
          Ver Status Detalhado
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900 p-8 rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col"
            >
              {/* Cabeçalho do Modal */}
              <div className="flex items-center justify-between mb-6 shrink-0">
                <h3 className="text-white text-xl font-bold">Status dos Tribunais</h3>
                <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-white">Fechar</button>
              </div>

              <div className="overflow-y-auto overscroll-contain max-h-[60vh] pr-2 -mr-2 custom-scrollbar scroll-smooth">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={view + activeRegiao + selectedEstado}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.2 }}
                  >
                    {/* Seleção de Região */}
                    {view === 'estado' && !activeRegiao && (
                      <div className="space-y-3">
                        <p className="text-white">Selecione a **Região** do Tribunal:</p>
                        {Object.keys(jurisdictions.regioes).map(regiao => (
                          <button
                            key={regiao}
                            onClick={() => { setView('estado'); setActiveRegiao(regiao); }}
                            className={`w-full p-4 flex items-center justify-between ${modalBtnStyle}`}
                          >
                            <span className="text-white text-sm font-medium">{regiaoMap[regiao] || regiao}</span>
                            <ArrowLeft size={20} className="rotate-180 text-slate-400" />
                          </button>
                        ))}
                        {/* Botão para Federais */}
                        <button
                          onClick={() => { setView('tribunal'); setActiveRegiao('federais'); }}
                          className={`w-full p-4 flex items-center justify-between ${modalBtnStyle}`}
                        >
                          <span className="text-white text-sm font-medium">Federais</span>
                          <ArrowLeft size={20} className="rotate-180 text-slate-400" />
                        </button>
                      </div>
                    )}

                    {/* Seleção de Estado (dentro de uma região) */}
                    {view === 'estado' && activeRegiao && activeRegiao !== 'federais' && (
                      <div className="space-y-3">
                        <p className="text-white">Selecione o **Estado** da região {regiaoMap[activeRegiao] || activeRegiao}:</p>
                        <button onClick={handleBack} className="text-sm text-blue-400 underline mb-4">Voltar</button>
                        {Object.keys((jurisdictions.regioes as any)[activeRegiao] || {}).map(estado => (
                          <button key={estado} onClick={() => { setView('tribunal'); setSelectedEstado(estado); }} className={`w-full p-4 flex items-center justify-between ${modalBtnStyle}`}>
                            <span className="text-white text-sm font-medium">{estado}</span>
                            <ArrowLeft size={20} className="rotate-180 text-slate-400" />
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Exibição de Tribunais (Federais ou por Estado) */}
                    {view === 'tribunal' && (
                      <div className="space-y-3">
                        <p className="text-white">Portais em {activeRegiao === 'federais' ? 'Federais' : selectedEstado}:</p>
                        <button onClick={handleBack} className="text-sm text-blue-400 underline mb-4">Voltar</button>
                        {(activeRegiao === 'federais' ? jurisdictions.federais : (jurisdictions.regioes as any)[activeRegiao]?.[selectedEstado])?.map((t: any) => (
                          <button key={t.name} onClick={() => window.open(t.url, "_blank")} className={`w-full p-4 flex items-center justify-between ${modalBtnStyle}`}>
                            <span className="text-white text-sm font-medium">{t.name}</span>

                            <div className="flex items-center gap-3">
                              {livePings[t.name] ? (
                                <span className="text-xs text-slate-400 font-mono">
                                  {livePings[t.name]}ms
                                </span>
                              ) : null}
                              <div className={`w-3 h-3 rounded-full shrink-0 transition-colors duration-500 ${getStatusColor(t.name)}`} />
                            </div>

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
    </section>
  );
}
