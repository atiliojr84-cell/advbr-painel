"use client";

import { useState } from "react";
import { AlertCircle, FileText, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { jurisdictions } from "../../data/jurisdictions";

const problemas = ["Instabilidade/Lentidão", "Offline", "Problema de Login"];

type Report = {
  portal: string;
  problema: string;
  createdAt: string;
};

type ViewStep = "regiao" | "estado" | "tribunal" | "problema" | "confirm";

export default function ProblemReporter() {
  const [isOpen, setIsOpen] = useState(false);
  const [reportListOpen, setReportListOpen] = useState(false);

  const [view, setView] = useState<ViewStep>("regiao");
  const [activeRegiao, setActiveRegiao] = useState<string>("");
  const [selectedEstado, setSelectedEstado] = useState<string>("");
  const [selectedTribunal, setSelectedTribunal] = useState<any | null>(null);

  const [data, setData] = useState<{ portal: string; problema: string }>({
    portal: "",
    problema: "",
  });

  const [reports, setReports] = useState<Report[]>([]);
  const [loadingReports, setLoadingReports] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const resetFlow = () => {
    setView("regiao");
    setActiveRegiao("");
    setSelectedEstado("");
    setSelectedTribunal(null);
    setData({ portal: "", problema: "" });
    setErrorMsg(null);
  };

  const openReporterModal = () => {
    resetFlow();
    setIsOpen(true);
  };

  // --- seleção região / estado / tribunal ---

  const handleSelectRegiao = (regiaoSlug: string) => {
    const regiaoKey =
      regiaoSlug.toLowerCase() === "federais" ? "federais" : regiaoSlug;
    setActiveRegiao(regiaoKey);

    if (regiaoKey === "federais") {
      setView("tribunal");
    } else {
      setView("estado");
    }
  };

  const handleSelectEstado = (estado: string) => {
    setSelectedEstado(estado);
    setView("tribunal");
  };

  const handleSelectTribunal = (tribunal: any) => {
    setSelectedTribunal(tribunal);

    const regiaoLabel =
      activeRegiao === "federais"
        ? "Tribunais Federais"
        : activeRegiao || "Região";

    const estadoLabel =
      activeRegiao === "federais"
        ? ""
        : selectedEstado
        ? ` - ${selectedEstado}`
        : "";

    const portalLabel = `[${regiaoLabel}${estadoLabel}] ${tribunal.name}`;

    setData((prev) => ({ ...prev, portal: portalLabel }));
    setView("problema");
  };

  const getEstadosDaRegiao = (regiaoKey: string): string[] => {
    if (
      !jurisdictions.regioes ||
      !regiaoKey ||
      !(jurisdictions.regioes as any)[regiaoKey]
    ) {
      return [];
    }
    return Object.keys((jurisdictions.regioes as any)[regiaoKey] || {});
  };

  const getTribunaisDaSelecao = (): any[] => {
    if (!jurisdictions) return [];

    if (activeRegiao === "federais") {
      return jurisdictions.federais || [];
    }

    if (
      jurisdictions.regioes &&
      (jurisdictions.regioes as any)[activeRegiao] &&
      (jurisdictions.regioes as any)[activeRegiao][selectedEstado]
    ) {
      return (jurisdictions.regioes as any)[activeRegiao][
        selectedEstado
      ] as any[];
    }

    return [];
  };

  const handleBack = () => {
    if (view === "estado") {
      setView("regiao");
      setActiveRegiao("");
    } else if (view === "tribunal") {
      if (activeRegiao === "federais") {
        setView("regiao");
        setActiveRegiao("");
      } else {
        setView("estado");
        setSelectedTribunal(null);
      }
    } else if (view === "problema") {
      setView("tribunal");
      setData((prev) => ({ ...prev, problema: "" }));
    } else if (view === "confirm") {
      resetFlow();
      setIsOpen(false);
    }
  };

  // --- envio do relato ---

  const handleSelectProblema = async (problema: string) => {
    if (!data.portal) return;

    setLoadingSubmit(true);
    setErrorMsg(null);

    try {
      const payload = {
        portal: data.portal,
        problema,
      };

      const res = await fetch("/api/report-falha", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Erro na API /api/report-falha:", text);
        throw new Error("Falha ao registrar o problema.");
      }

      setData((prev) => ({ ...prev, problema }));
      setView("confirm");
    } catch (err) {
      console.error(err);
      setErrorMsg(
        "Não foi possível registrar a falha agora. Tente novamente em alguns instantes."
      );
    } finally {
      setLoadingSubmit(false);
    }
  };

  const handleCloseAfterConfirm = () => {
    setIsOpen(false);
    resetFlow();
  };

  // --- relatório ---

  const openReportList = async () => {
    setReportListOpen(true);
    setLoadingReports(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/report-falha/list", { cache: "no-store" });

      if (!res.ok) {
        const text = await res.text();
        console.error("Erro na API /api/report-falha/list:", text);
        throw new Error("Falha ao carregar relatório.");
      }

      const json = (await res.json()) as { reports: Report[] };
      setReports(json.reports || []);
    } catch (err) {
      console.error(err);
      setErrorMsg(
        "Não foi possível carregar o relatório neste momento. Tente novamente mais tarde."
      );
    } finally {
      setLoadingReports(false);
    }
  };

  // --- título dinâmico da janela ---

  const getModalTitle = () => {
    if (view === "regiao") return "Reportar Falha de Acesso";
    if (view === "estado") return `Região: ${activeRegiao}`;
    if (view === "tribunal") {
      if (activeRegiao === "federais") return "Tribunais Federais";
      return selectedEstado || "Tribunais";
    }
    if (view === "problema") return "Natureza da Falha";
    if (view === "confirm") return "Relato registrado";
    return "Reportar Falha";
  };

  return (
    <>
      {/* Botões principais - A classe justify-end empurrará tudo para a direita */}
      <div className="flex flex-wrap gap-2 justify-end w-full">
        <button
          onClick={openReporterModal}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-900/40 border border-red-700/60 text-red-100 text-xs hover:bg-red-900/70 hover:border-red-500 transition-colors"
        >
          <AlertCircle size={16} />
          <span>Reportar Falha de Acesso</span>
        </button>

        <button
          onClick={openReportList}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 text-xs hover:bg-slate-800 hover:border-slate-500 transition-colors"
        >
          <FileText size={16} />
          <span>Ver Relatório de Falhas</span>
        </button>
      </div>

      {/* Modal principal: fluxo de reporte */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="reporter-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              key="reporter-content"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900 p-6 rounded-2xl shadow-2xl max-w-xl w-full flex flex-col max-h-[90vh] border border-slate-800"
            >
              {/* Cabeçalho da modal */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  {view !== "regiao" && view !== "confirm" && (
                    <button
                      onClick={handleBack}
                      className="text-slate-400 hover:text-white transition-colors"
                    >
                      <ArrowLeft size={20} />
                    </button>
                  )}
                  <h3 className="text-white text-sm font-bold">
                    {getModalTitle()}
                  </h3>
                </div>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    resetFlow();
                  }}
                  className="text-slate-500 hover:text-white"
                >
                  Fechar
                </button>
              </div>

              {/* Conteúdo da modal */}
              <div className="overflow-y-auto max-h-[70vh] pr-2 space-y-4">
                {/* Step 1: Região */}
                {view === "regiao" && (
                  <div className="space-y-3">
                    <p className="text-slate-300 text-sm">
                      Doutor, selecione a região ou os tribunais federais onde
                      o senhor está enfrentando dificuldades:
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => handleSelectRegiao("federais")}
                        className="p-3 bg-slate-950 hover:bg-slate-900 rounded-xl border border-slate-800 text-left text-xs text-white"
                      >
                        Tribunais Federais
                      </button>
                      <button
                        onClick={() => handleSelectRegiao("Sul")}
                        className="p-3 bg-slate-950 hover:bg-slate-900 rounded-xl border border-slate-800 text-left text-xs text-white"
                      >
                        Região Sul
                      </button>
                      <button
                        onClick={() => handleSelectRegiao("Sudeste")}
                        className="p-3 bg-slate-950 hover:bg-slate-900 rounded-xl border border-slate-800 text-left text-xs text-white"
                      >
                        Região Sudeste
                      </button>
                      <button
                        onClick={() => handleSelectRegiao("CentroOeste")}
                        className="p-3 bg-slate-950 hover:bg-slate-900 rounded-xl border border-slate-800 text-left text-xs text-white"
                      >
                        Região Centro-Oeste
                      </button>
                      <button
                        onClick={() => handleSelectRegiao("Nordeste")}
                        className="p-3 bg-slate-950 hover:bg-slate-900 rounded-xl border border-slate-800 text-left text-xs text-white"
                      >
                        Região Nordeste
                      </button>
                      <button
                        onClick={() => handleSelectRegiao("Norte")}
                        className="p-3 bg-slate-950 hover:bg-slate-900 rounded-xl border border-slate-800 text-left text-xs text-white"
                      >
                        Região Norte
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 2: Estado */}
                {view === "estado" && (
                  <div className="space-y-3">
                    <p className="text-slate-300 text-sm">
                      Agora, escolha o Estado:
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      {getEstadosDaRegiao(activeRegiao).map((estado) => (
                        <button
                          key={estado}
                          onClick={() => handleSelectEstado(estado)}
                          className="p-3 text-white font-medium text-xs text-left bg-slate-950 hover:bg-slate-900 rounded-xl transition-colors border border-slate-800"
                        >
                          {estado}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 3: Tribunal */}
                {view === "tribunal" && (
                  <div className="space-y-3">
                    <p className="text-slate-300 text-sm">
                      Selecione o tribunal ou portal em que o senhor está
                      enfrentando dificuldades:
                    </p>
                    <div className="space-y-2 max-h-72 overflow-y-auto pr-1 mt-2">
                      {getTribunaisDaSelecao().map((t: any) => (
                        <button
                          key={t.name}
                          onClick={() => handleSelectTribunal(t)}
                          className="w-full p-3 border border-slate-700 bg-slate-900 text-white rounded transition-all duration-300 hover:border-blue-500 hover:shadow-[0_0_10px_rgba(37,99,235,0.5)] hover:bg-slate-800 text-left text-xs flex justify-between items-center"
                        >
                          <span>{t.name}</span>
                          <span className="text-[10px] text-slate-400 ml-2 truncate max-w-[50%]">
                            {t.url.replace(/^https?:\/\/(www\.)?/, "")}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 4: Tipo de problema */}
                {view === "problema" && (
                  <div className="space-y-3">
                    <p className="text-white text-sm">
                      Qual é a natureza do problema em{" "}
                      <strong>{data.portal}</strong>?
                    </p>
                    {problemas.map((prob) => (
                      <button
                        key={prob}
                        onClick={() => handleSelectProblema(prob)}
                        disabled={loadingSubmit}
                        className="w-full p-3 border border-slate-700 bg-slate-900 text-white rounded transition-all duration-300 hover:border-red-500 hover:shadow-[0_0_10px_rgba(239,68,68,0.5)] hover:bg-slate-800 text-left disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                      >
                        {loadingSubmit && data.problema === prob
                          ? "Enviando..."
                          : prob}
                      </button>
                    ))}
                    {errorMsg && (
                      <p className="text-xs text-red-400 mt-2">{errorMsg}</p>
                    )}
                  </div>
                )}

                {/* Step 5: Confirmação */}
                {view === "confirm" && (
                  <div className="space-y-4">
                    <p className="text-white text-sm">
                      Obrigado, doutor. Seu relato sobre{" "}
                      <strong>{data.portal}</strong> foi registrado como{" "}
                      <strong>{data.problema}</strong>.
                    </p>
                    <p className="text-xs text-slate-400">
                      Esses registros contribuem para o diagnóstico automático
                      de instabilidades e ajudam outros colegas a saberem quando
                      um portal está com problemas.
                    </p>
                    <div className="flex justify-end">
                      <button
                        onClick={handleCloseAfterConfirm}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm font-semibold"
                      >
                        Fechar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de relatório */}
      <AnimatePresence>
        {reportListOpen && (
          <motion.div
            key="reportlist-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setReportListOpen(false)}
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              key="reportlist-content"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900 p-6 rounded-2xl shadow-2xl max-w-lg w-full flex flex-col max-h-[90vh] border border-slate-800"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white text-sm font-bold">
                  Relatório de Falhas Registradas
                </h3>
                <button
                  onClick={() => setReportListOpen(false)}
                  className="text-slate-500 hover:text-white"
                >
                  Fechar
                </button>
              </div>

              {loadingReports ? (
                <p className="text-slate-300 text-sm">Carregando relatório...</p>
              ) : errorMsg ? (
                <p className="text-red-400 text-sm">{errorMsg}</p>
              ) : reports.length === 0 ? (
                <p className="text-slate-300 text-sm">
                  Ainda não há falhas registradas.
                </p>
              ) : (
                <div className="space-y-3 text-sm text-slate-200 max-h-80 overflow-y-auto pr-1">
                  {reports.map((r, idx) => (
                    <div
                      key={`${r.portal}-${r.createdAt}-${idx}`}
                      className="border border-slate-700 rounded-lg p-3 bg-slate-900"
                    >
                      <p>
                        <span className="font-semibold">Portal:</span>{" "}
                        {r.portal}
                      </p>
                      <p>
                        <span className="font-semibold">Problema:</span>{" "}
                        {r.problema}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        Registrado em:{" "}
                        {new Date(r.createdAt).toLocaleString("pt-BR")}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
