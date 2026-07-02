"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Activity, AlertCircle } from "lucide-react"; // Importado AlertCircle
import { motion, AnimatePresence } from "framer-motion";
import { jurisdictions } from "../../data/jurisdictions";

// Definindo o tipo para o reporte ativo
type ActiveReport = {
  portal: string;
  problema: string;
  createdAt: string;
};

export default function JurisdictionHub() {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<'estado' | 'tribunal'>('estado');
  const [activeRegiao, setActiveRegiao] = useState<string>('');
  const [selectedEstado, setSelectedEstado] = useState<string>('');

  const [liveStatus, setLiveStatus] = useState<Record<string, string>>({});
  const [livePings, setLivePings] = useState<Record<string, number>>({});
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);
  const [activeReports, setActiveReports] = useState<ActiveReport[]>([]); // Novo estado para reportes ativos

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

  const getStatusColor = (nomeTribunal: string) => {
    const status = liveStatus[nomeTribunal];
    if (status === 'online') return "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]";
    if (status === 'instavel') return "bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.6)]";
    if (status === 'offline') return "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]";
    return "bg-slate-600 animate-pulse";
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Busca de Status e Pings
        const statusRes = await fetch(`/api/get-status?t=${Date.now()}`, { cache: 'no-store' });
        const statusData = await statusRes.json();
        if (statusData.statuses) {
          setLiveStatus(statusData.statuses);
          setLivePings(statusData.pings || {});
          if (statusData.lastUpdate) setLastUpdate(statusData.lastUpdate);
        } else {
          setLiveStatus(statusData);
        }

        // Busca de Reportes Ativos
        const reportsRes = await fetch(`/api/report-falha/active?t=${Date.now()}`, { cache: 'no-store' });
        const reportsData = await reportsRes.json();
        if (reportsData.activeReports) {
          setActiveReports(reportsData.activeReports);
        }
      } catch (error) {
        console.error("Erro ao buscar dados", error);
      }
    };
    fetchData();

    // Opcional: Atualizar a cada X minutos para manter os reportes recentes
    const intervalId = setInterval(fetchData, 5 * 60 * 1000); // A cada 5 minutos
    return () => clearInterval(intervalId);

  }, []);

  // Função para verificar se um tribunal tem reportes ativos
  const hasActiveReport = (tribunalName: string): boolean => {
    // O formato do portal no reporte é "[Região - Estado] Nome do Tribunal"
    // Precisamos verificar se o nome do tribunal está contido no campo 'portal' do reporte
    return activeReports.some(report => report.portal.includes(tribunalName));
  };

  // Função para formatar a data e hora no formato brasileiro
  const formatDateTimeBrazil = (isoString: string | null) => {
    if (!isoString) return 'Carregando...';
    try {
      const dateObject = new Date(isoString);
      if (isNaN(dateObject.getTime())) {
        return 'Data inválida';
      }

      const optionsDate: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        timeZone: 'America/Sao_Paulo'
      };
      const optionsTime: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false, // Formato 24 horas
        timeZone: 'America/Sao_Paulo'
      };

      const formattedDate = dateObject.toLocaleDateString('pt-BR', optionsDate);
      const formattedTime = dateObject.toLocaleTimeString('pt-BR', optionsTime);

      return `${formattedDate} ${formattedTime}`;
    } catch (e) {
      console.error("Erro ao formatar data e hora:", e);
      return 'Erro na data';
    }
  };

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

          {lastUpdate && (
            <div className="mt-6 inline-block bg-slate-800/50 border border-slate-700 px-4 py-2 rounded-full">
              <span className="text-xs text-slate-400">
                Status dos portais atualizado em: <strong className="text-slate-200">
                  {formatDateTimeBrazil(lastUpdate)}
                </strong>
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          {["Federais", "Sul", "Sudeste", "CentroOeste", "Nordeste", "Norte"].map((r) => (
            <button 
              key={r} 
              onClick={() => handleOpen(r.toLowerCase())} 
              className={`px-6 py-3 text-slate-300 capitalize font-medium bg-slate-900 rounded-xl border border-slate-800 shadow-lg glow-effect`} // Adicionado glow-effect
            >
              {r === "CentroOeste" ? "Centro-Oeste" : r}
            </button>
          ))}
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
                        {Object.keys((jurisdictions.regioes as any)[activeRegiao] || {}).map((e) => (
                          <button 
                            key={e} 
                            onClick={() => { setSelectedEstado(e); setView('tribunal'); }} // Fechado o onClick
                            className={`p-4 text-white font-medium text-sm text-left bg-slate-950 rounded-xl border border-slate-800 glow-effect`} // Adicionado glow-effect
                          >
                            {e}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-3 pb-4">
                        {(activeRegiao === 'federais' ? jurisdictions.federais : (jurisdictions.regioes as any)[activeRegiao]?.[selectedEstado])?.map((t: any) => (
                          <button 
                            key={t.name} 
                            onClick={() => window.open(t.url, "_blank")} 
                            className={`w-full p-4 flex items-center justify-between bg-slate-950 rounded-xl border border-slate-800 glow-effect`} // Adicionado glow-effect
                          >
                            <span className="text-white text-sm font-medium">{t.name}</span>

                            <div className="flex items-center gap-3">
                              {/* Ícone de reporte de falha */}
                              {hasActiveReport(t.name) && (
                                <span title="Problema reportado recentemente!"> {/* Adicionado span com title */}
                                  <AlertCircle size={18} className="text-red-500 animate-pulse" />
                                </span>
                              )}

                              {livePings[t.name] ? (
                                <span className="text-xs text-slate-400 font-mono">
                                  {livePings[t.name]}ms
                                </span>
                              ) : null}
                              <div className={`w-3 h-3 rounded-full shrink-0 transition-colors duration-500 ${getStatusColor(t.name)}`} />
                            </div>

                          </button>
                        ))}
                        {/* NOVO: Disclaimer para o alerta de reporte */}
                        {activeReports.length > 0 && ( // Só mostra o disclaimer se houver reportes ativos
                          <div className="mt-4 p-3 bg-slate-800/50 border border-slate-700 rounded-lg flex items-center gap-2 text-xs text-slate-300">
                            <AlertCircle size={16} className="text-red-500" />
                            <span>
                              **Atenção:** Portais com este ícone <AlertCircle size={12} className="inline-block text-red-500" /> indicam que foram citados em reportes manuais por advogados.
                            </span>
                          </div>
                        )}
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
