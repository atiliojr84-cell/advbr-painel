// components/features/JurisdictionHub.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { ArrowLeft, Activity, AlertCircle, RefreshCw } from "lucide-react";
// Importe 'jurisdictions' e defina um tipo mais flexível para ele
import { jurisdictions as rawJurisdictions } from "../../data/jurisdictions";

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

// Definindo um tipo mais flexível para o objeto jurisdictions
// Isso permite que ele seja indexado por strings
type FlexibleJurisdictions = {
  [key: string]: any; // Permite acessar propriedades com qualquer string
};

const jurisdictions: FlexibleJurisdictions = rawJurisdictions;

export default function JurisdictionHub() {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<'estado' | 'tribunal'>('estado');
  const [activeRegiao, setActiveRegiao] = useState<string>('');
  const [selectedEstado, setSelectedEstado] = useState<string>('');

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
    setIsOpen(true);
    setView('tribunal');
  };

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      setView('estado');
      setActiveRegiao('');
      setSelectedEstado('');
      setRobotFailures([]); // Limpa o relatório ao fechar
      setRobotFailuresError(null);
    }, 300); // Tempo para a animação de saída
  };

  const handleBackToRegiao = () => {
    setSelectedEstado('');
    setView('tribunal');
  };

  const handleSelectEstado = (estado: string) => {
    setSelectedEstado(estado);
    setView('estado'); // Mantém a view como 'estado' para exibir os tribunais do estado
  };

  // Função para buscar o status em tempo real
  const fetchLiveStatus = useCallback(async () => {
    try {
      const response = await fetch('/api/get-status');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setLiveStatus(data.status);
      setLivePings(data.pings);
      setLastUpdate(data.lastUpdate);
    } catch (error) {
      console.error("Erro ao buscar status em tempo real:", error);
    }
  }, []);

  // Função para buscar os reportes manuais (falhas)
  const fetchActiveReports = useCallback(async () => {
    try {
      const response = await fetch('/api/get-falhas'); // Certifique-se de que esta API existe e retorna os reportes manuais
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setActiveReports(data.falhas); // Supondo que a API retorna um objeto com uma chave 'falhas'
    } catch (error) {
      console.error("Erro ao buscar reportes ativos:", error);
    }
  }, []);

  // --- Nova função para buscar as falhas do robô ---
  const fetchRobotFailures = useCallback(async (period: string) => {
    setLoadingRobotFailures(true);
    setRobotFailuresError(null);
    try {
      const response = await fetch(`/api/get-robot-failures?period=${period}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setRobotFailures(data.robotFailures);
    } catch (error) {
      console.error("Erro ao buscar falhas do robô:", error);
      setRobotFailuresError("Não foi possível carregar o relatório de falhas do robô.");
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

  const renderJurisdictions = (data: any) => {
    return Object.entries(data).map(([key, value]: [string, any]) => (
      <div key={key} className="p-2 border-b border-gray-700 last:border-b-0 flex justify-between items-center">
        <span className="text-gray-300">{value.nome}</span>
        <div className="flex items-center">
          {getStatusIndicator(liveStatus[key] || 'desconhecido')}
          <span className={`${getStatusColor(liveStatus[key] || 'desconhecido')} text-sm font-medium mr-2`}>
            {liveStatus[key] || 'Desconhecido'}
          </span>
          {livePings[key] !== undefined && (
            <span className={`${getPingColor(livePings[key])} text-sm`}>
              {livePings[key]}ms
            </span>
          )}
        </div>
      </div>
    ));
  };

  const renderEstados = (regiao: string) => {
    const estados = jurisdictions[regiao];
    if (!estados) return null;

    return Object.entries(estados).map(([estadoKey, estadoData]: [string, any]) => (
      <div
        key={estadoKey}
        className="p-2 border-b border-gray-700 last:border-b-0 cursor-pointer hover:bg-gray-700 flex justify-between items-center"
        onClick={() => handleSelectEstado(estadoKey)}
      >
        <span className="text-gray-300">{estadoData.nome}</span>
        <ArrowLeft className="h-4 w-4 text-gray-400 rotate-180" />
      </div>
    ));
  };

  const renderTribunaisDoEstado = (estado: string) => {
    const regiaoData = jurisdictions[activeRegiao];
    if (!regiaoData || !regiaoData[estado]) return null;

    const tribunais = regiaoData[estado].tribunais;
    return renderJurisdictions(tribunais);
  };

  const renderTribunaisFederais = () => {
    const federais = jurisdictions.federais;
    if (!federais) return null;
    return renderJurisdictions(federais);
  };

  const renderRegioes = () => {
    return (
      <div className="grid grid-cols-2 gap-4">
        {Object.entries(jurisdictions).map(([regiaoKey, regiaoData]: [string, any]) => (
          <button
            key={regiaoKey}
            onClick={() => handleOpen(regiaoKey)}
            className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg shadow-md transition duration-200"
          >
            {regiaoData.nome}
          </button>
        ))}
      </div>
    );
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full shadow-lg flex items-center space-x-2 transition duration-200 z-50"
      >
        <Activity className="h-5 w-5" />
        <span>Jurisdiction Hub</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-gray-900 bg-opacity-95 flex items-center justify-center z-[100]"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto relative"
            >
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition duration-200"
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
                Jurisdiction Hub
              </h2>

              {view !== 'estado' && view !== 'tribunal' && (
                <div className="mb-4">
                  {renderRegioes()}
                </div>
              )}

              {view === 'tribunal' && activeRegiao && (
                <>
                  <button
                    onClick={handleClose}
                    className="mb-4 text-blue-400 hover:text-blue-300 flex items-center"
                  >
                    <ArrowLeft className="h-5 w-5 mr-2" />
                    Voltar para Regiões
                  </button>
                  <h3 className="text-xl font-semibold text-white mb-4">
                    {jurisdictions[activeRegiao]?.nome || activeRegiao}
                  </h3>
                  <div className="bg-gray-700 rounded-lg p-4 mb-6">
                    {activeRegiao === 'federais' ? renderTribunaisFederais() : renderEstados(activeRegiao)}
                  </div>
                </>
              )}

              {view === 'estado' && selectedEstado && (
                <>
                  <button
                    onClick={handleBackToRegiao}
                    className="mb-4 text-blue-400 hover:text-blue-300 flex items-center"
                  >
                    <ArrowLeft className="h-5 w-5 mr-2" />
                    Voltar para {jurisdictions[activeRegiao]?.nome || activeRegiao}
                  </button>
                  <h3 className="text-xl font-semibold text-white mb-4">
                    {jurisdictions[activeRegiao]?.[selectedEstado]?.nome || selectedEstado}
                  </h3>
                  <div className="bg-gray-700 rounded-lg p-4 mb-6">
                    {renderTribunaisDoEstado(selectedEstado)}
                  </div>
                </>
              )}

              {/* Seção de Status Geral e Última Atualização */}
              <div className="mt-8 pt-6 border-t border-gray-700">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <Activity className="h-5 w-5 mr-2 text-blue-400" />
                  Status Geral
                </h3>
                <div className="text-gray-400 text-sm mb-4">
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
                <div className="mt-6 pt-6 border-t border-gray-700">
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <AlertCircle className="h-5 w-5 mr-2 text-red-400" />
                    Reportes Manuais (Advogados)
                  </h3>
                  <div className="bg-gray-700 rounded-lg p-4">
                    {activeReports.map((report, index) => (
                      <div key={index} className="p-2 border-b border-gray-600 last:border-b-0">
                        <p className="text-gray-300 font-medium">{report.portal}</p>
                        <p className="text-gray-400 text-sm">Problema: {report.problema}</p>
                        <p className="text-gray-500 text-xs">Reportado em: {new Date(report.createdAt).toLocaleString('pt-BR')}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* --- Nova Seção de Relatório de Falhas do Robô --- */}
              <div className="mt-6 pt-6 border-t border-gray-700">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <Activity className="h-5 w-5 mr-2 text-yellow-400" />
                  Relatório de Falhas do Robô
                </h3>

                {/* Botões de Período */}
                <div className="flex space-x-2 mb-4">
                  {['12h', '24h', '7d', '30d', '1y'].map((periodOption) => (
                    <button
                      key={periodOption}
                      onClick={() => handlePeriodChange(periodOption)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition duration-200
                        ${selectedPeriod === periodOption
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
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
                  <div className="text-center text-gray-400">Carregando falhas do robô...</div>
                )}

                {robotFailuresError && (
                  <div className="text-center text-red-500">{robotFailuresError}</div>
                )}

                {!loadingRobotFailures && !robotFailuresError && (
                  <div className="bg-gray-700 rounded-lg p-4">
                    {robotFailures.length > 0 ? (
                      robotFailures.map((failure, index) => (
                        <div key={index} className="p-2 border-b border-gray-600 last:border-b-0 flex justify-between items-center">
                          <span className="text-gray-300 font-medium">{failure.portalName}</span>
                          <span className="text-yellow-400 font-bold">{failure.failureCount} quedas</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-gray-400">Nenhuma falha de robô detectada no período selecionado.</div>
                    )}
                  </div>
                )}
              </div>
              {/* --- Fim da Nova Seção --- */}

              {/* Disclaimer */}
              <div className="mt-8 pt-6 border-t border-gray-700 text-gray-500 text-xs text-center">
                <p>
                  Este Jurisdiction Hub é uma ferramenta de monitoramento e não substitui a verificação manual dos portais.
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
