// components/features/MonitoringReportButton.tsx
/** @jsxImportSource react */ // <--- Linha adicionada para resolver o erro de build
"use client";

import { useState, useEffect, useCallback } from "react";
import { ArrowLeft, Activity, AlertCircle, RefreshCw, BarChart2 } from "lucide-react"; // Adicionado BarChart2 para o ícone do botão
import { motion, AnimatePresence } from "framer-motion";

// Definindo o tipo para o reporte ativo (manual)
type ActiveReport = {
  portal: string;
  problema: string;
  createdAt: string;
};

// Definindo o tipo para as falhas do robô
type RobotFailure = {
  portalName: string;
  failureCount: number;
};

export default function MonitoringReportButton() {
  const [isOpen, setIsOpen] = useState(false);

  const [liveStatus, setLiveStatus] = useState<Record<string, string>>({});
  const [livePings, setLivePings] = useState<Record<string, number>>({});
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);
  const [activeReports, setActiveReports] = useState<ActiveReport[]>([]); // Estado para reportes manuais

  // --- Novos estados para o relatório de falhas do robô ---
  const [robotFailures, setRobotFailures] = useState<RobotFailure[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<string>('12h'); // Padrão: 12 horas
  const [loadingRobotFailures, setLoadingRobotFailures] = useState<boolean>(false);
  const [robotFailuresError, setRobotFailuresError] = useState<string | null>(null);
  // --- Fim dos novos estados ---

  const handleClose = () => {
    setIsOpen(false);
    // Limpa o relatório ao fechar, se desejar
    setTimeout(() => {
      setRobotFailures([]);
      setRobotFailuresError(null);
    }, 300); // Tempo para a animação de saída
  };

  // Função para buscar o status em tempo real
  const fetchLiveStatus = useCallback(async () => {
    try {
      const response = await fetch('/api/get-status'); // Ou '/api/get-status?t=${Date.now()}' se precisar de cache-busting
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setLiveStatus(data.status); // Ajuste conforme a estrutura real da sua API /api/get-status
      setLivePings(data.pings);
      setLastUpdate(data.lastUpdate);
    } catch (error) {
      console.error("Erro ao buscar status em tempo real:", error);
    }
  }, []);

  // Função para buscar os reportes manuais (falhas)
  const fetchActiveReports = useCallback(async () => {
    try {
      // Usamos a API existente /api/report-falha/active
      const response = await fetch(`/api/report-falha/active?t=${Date.now()}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.activeReports) {
        setActiveReports(data.activeReports);
      }
    } catch (error) {
      console.error("Erro ao buscar reportes ativos:", error);
    }
  }, []);

  // --- Nova função para buscar as falhas do robô ---
  const fetchRobotFailures = useCallback(async (period: string) => {
    setLoadingRobotFailures(true);
    setRobotFailuresError(null);
    try {
      // Esta API /api/get-robot-failures precisa ser criada no seu backend
      const response = await fetch(`/api/get-robot-failures?period=${period}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setRobotFailures(data.robotFailures);
    } catch (error) {
      console.error("Erro ao buscar falhas do robô:", error);
      setRobotFailuresError("Não foi possível carregar o relatório de falôs do robô.");
    } finally {
      setLoadingRobotFailures(false);
    }
  }, []);
  // --- Fim da nova função ---

  useEffect(() => {
    if (isOpen) {
      fetchLiveStatus();
      fetchActiveReports();
      fetchRobotFailures(selectedPeriod); // Busca as falhas do robô ao abrir o modal
      const interval = setInterval(() => {
        fetchLiveStatus();
        fetchActiveReports();
        fetchRobotFailures(selectedPeriod); // Atualiza as falhas do robô periodicamente
      }, 60000); // Atualiza a cada 1 minuto
      return () => clearInterval(interval);
    }
  }, [isOpen, fetchLiveStatus, fetchActiveReports, fetchRobotFailures, selectedPeriod]);

  // Handler para mudar o período do relatório de falhas do robô
  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period);
    fetchRobotFailures(period);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'text-green-500';
      case 'instavel':
        return 'text-yellow-500';
      case 'offline':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusIndicator = (status: string) => {
    switch (status) {
      case 'online':
        return <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>;
      case 'instavel':
        return <span className="h-2 w-2 rounded-full bg-yellow-500 mr-2"></span>;
      case 'offline':
        return <span className="h-2 w-2 rounded-full bg-red-500 mr-2"></span>;
      default:
        return <span className="h-2 w-2 rounded-full bg-gray-500 mr-2"></span>;
    }
  };

  const getPingColor = (ping: number) => {
    if (ping < 200) return 'text-green-500';
    if (ping < 500) return 'text-yellow-500';
    return 'text-red-500';
  };

  const formatLastUpdate = (isoString: string | null) => {
    if (!isoString) return "N/A";
    const date = new Date(isoString);
    return date.toLocaleString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-6 py-3 text-slate-300 capitalize font-medium bg-slate-900 rounded-xl border border-slate-800 shadow-lg glow-effect flex items-center gap-2"
      >
        <BarChart2 className="h-5 w-5" />
        <span>Relatório de Monitoramento</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" // Ajustado z-index para 50 para não conflitar com o JurisdictionHub
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()} // Impede que o clique no modal feche o backdrop
              className="bg-slate-900 p-8 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto relative border border-slate-800"
            >
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 text-slate-400 hover:text-white transition duration-200"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              <h2 className="text-2xl font-bold text-white mb-6 text-center">
                Relatório de Monitoramento
              </h2>

              {/* Seção de Status Geral e Última Atualização */}
              <div className="mb-6 pb-6 border-b border-slate-800">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <Activity className="h-5 w-5 mr-2 text-blue-400" />
                  Status Geral
                </h3>
                <div className="text-slate-400 text-sm mb-4">
                  Última atualização: {formatLastUpdate(lastUpdate)}
                  <button
                    onClick={fetchLiveStatus}
                    className="ml-2 text-blue-400 hover:text-blue-300"
                    title="Recarregar status"
                  >
                    <RefreshCw className="h-4 w-4 inline-block" />
                  </button>
                </div>
              </div>

              {/* Seção de Reportes Manuais (Advogados) */}
              {activeReports.length > 0 && (
                <div className="mb-6 pb-6 border-b border-slate-800">
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <AlertCircle className="h-5 w-5 mr-2 text-red-400" />
                    Reportes Manuais (Advogados)
                  </h3>
                  <div className="bg-slate-800 rounded-lg p-4">
                    {activeReports.map((report, index) => (
                      <div key={index} className="p-2 border-b border-slate-700 last:border-b-0">
                        <p className="text-slate-300 font-medium">{report.portal}</p>
                        <p className="text-slate-400 text-sm">Problema: {report.problema}</p>
                        <p className="text-slate-500 text-xs">Reportado em: {new Date(report.createdAt).toLocaleString('pt-BR')}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* --- Seção de Relatório de Falhas do Robô --- */}
              <div className="mb-6 pb-6 border-b border-slate-800">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <Activity className="h-5 w-5 mr-2 text-yellow-400" />
                  Relatório de Falhas do Robô
                </h3>

                {/* Botões de Período */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {['12h', '24h', '7d', '30d', '1y'].map((periodOption) => (
                    <button
                      key={periodOption}
                      onClick={() => handlePeriodChange(periodOption)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition duration-200
                        ${selectedPeriod === periodOption
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                        }`}
                    >
                      {periodOption === '12h' ? '12 Horas' :
                       periodOption === '24h' ? '24 Horas' :
                       periodOption === '7d' ? '7 Dias' :
                       periodOption === '30d' ? '30 Dias' : '1 Ano'}
                    </button>
                  ))}
                </div>

                {loadingRobotFailures && (
                  <div className="text-center text-slate-400">Carregando falhas do robô...</div>
                )}

                {robotFailuresError && (
                  <div className="text-center text-red-500">{robotFailuresError}</div>
                )}

                {!loadingRobotFailures && !robotFailuresError && (
                  <div className="bg-slate-800 rounded-lg p-4">
                    {robotFailures.length > 0 ? (
                      robotFailures.map((failure, index) => (
                        <div key={index} className="p-2 border-b border-slate-700 last:border-b-0 flex justify-between items-center">
                          <span className="text-slate-300 font-medium">{failure.portalName}</span>
                          <span className="text-yellow-400 font-bold">{failure.failureCount} quedas</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-slate-400">Nenhuma falha de robô detectada no período selecionado.</div>
                    )}
                  </div>
                )}
              </div>
              {/* --- Fim da Seção --- */}

              {/* Disclaimer */}
              <div className="mt-6 pt-6 border-t border-slate-800 text-slate-500 text-xs text-center">
                <p>
                  Este relatório é uma ferramenta de monitoramento e não substitui a verificação manual dos portais.
                  As informações são fornecidas "como estão" e podem não refletir o status em tempo real com 100% de precisão.
                  Sempre verifique o status diretamente nos portais oficiais antes de tomar decisões críticas.
                </p>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
