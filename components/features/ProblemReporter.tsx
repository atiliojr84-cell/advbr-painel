"use client";

import { useState, useEffect } from "react";
import { AlertCircle, FileText, ArrowLeft } from "lucide-react";
import Modal from "../ui/Modal";
import { jurisdictions } from "../../data/jurisdictions";

const problemas = ["Instabilidade/Lentidão", "Offline", "Problema de Login"];

type Report = {
  portal: string;
  problema: string;
  createdAt: string;
};

type ViewStep = "regiao" | "estado" | "tribunal" | "problema" | "confirm";

export default function ProblemReporter() {
  const [modalOpen, setModalOpen] = useState(false);
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

  const reset = () => {
    setView("regiao");
    setActiveRegiao("");
    setSelectedEstado("");
    setSelectedTribunal(null);
    setData({ portal: "", problema: "" });
    setModalOpen(false);
    setErrorMsg(null);
  };

  // Abertura do modal principal
  const openReporterModal = () => {
    reset();
    setModalOpen(true);
  };

  // Etapa: selecionar região
  const handleSelectRegiao = (regiaoSlug: string) => {
    const regiaoKey =
      regiaoSlug.toLowerCase() === "federais" ? "federais" : regiaoSlug;
    setActiveRegiao(regiaoKey);

    if (regiaoKey === "federais") {
      // Vai direto para lista de tribunais federais
      setView("tribunal");
    } else {
      // Primeiro mostra estados da região
      setView("estado");
    }
  };

  // Etapa: selecionar estado
  const handleSelectEstado = (estado: string) => {
    setSelectedEstado(estado);
    setView("tribunal");
  };

  // Etapa: selecionar tribunal
  const handleSelectTribunal = (tribunal: any) => {
    setSelectedTribunal(tribunal);
    const regiaoLabel =
      activeRegiao === "federais"
        ? "Tribunais Federais"
        : activeRegiao || "Região";

    const estadoLabel =
      activeRegiao === "federais" ? "" : selectedEstado ? ` - ${selectedEstado}` : "";

    const portalLabel = `[${regiaoLabel}${estadoLabel}] ${tribunal.name}`;

    setData((prev) => ({ ...prev, portal: portalLabel }));
    setView("problema");
  };

  // Etapa: escolher tipo de problema e enviar para API
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
    reset();
  };

  // Abrir relatório de falhas (KV)
  const openReportList = async () => {
    setReportListOpen(true);
    setLoadingReports(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/report-falha/list", {
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Falha ao carregar relatório.");
      }

      const json = (await res.json()) as { reports: Report[] };
      setReports(json.reports || []);
    } catch (err) {
      console.error(err);
      setErrorMsg("Não foi possível carregar o relatório de falhas agora.");
    } finally {
      setLoadingReports(false);
    }
  };

  useEffect(() => {
    if (!reportListOpen) {
      setErrorMsg(null);
    }
  }, [reportListOpen]);

  // Helpers para montar estados/tribunais a partir de jurisdictions
  const getEstadosDaRegiao = (regiaoKey: string): string[] => {
    const estadosObj = (jurisdictions.regioes as any)?.[regiaoKey];
    if (!estadosObj) return [];
    return Object.keys(estadosObj);
  };

  const getTribunaisDaSelecao = (): any[] => {
    if (activeRegiao === "federais") {
      return jurisdictions.federais || [];
    }
    const estadosObj = (jurisdictions.regioes as any)?.[activeRegiao];
    if (!estadosObj) return [];
    const tribunais = estadosObj[selectedEstado];
    if (!Array.isArray(tribunais)) return [];
    return tribunais;
  };

  return (
    <>
      <div className="flex flex-col gap-2">
        {/* Botão: Reportar Falha */}
        <button
          onClick={openReporterModal}
          className="flex items-center justify-center gap-2 bg-black border border-red-500/50 text-red-500 px-4 py-2 rounded hover:bg-red-600 hover:text-white transition-all font-bold text-sm"
        >
          <AlertCircle className="w-4 h-4" />
          Reportar Falha de Acesso
        </button>

        {/* Botão: Ver Relatório de Falhas */}
        <button
          onClick={openReportList}
          className="flex items-center justify-end gap-1 text-xs text-slate-400 hover:text-white underline transition-colors"
        >
          <FileText className="w-3 h-3" />
          Ver Relatório de Falhas
        </button>
      </div>

      {/* Modal principal: fluxo de reporte */}
      <Modal isOpen={modalOpen} onClose={reset} title="Comunicar Instabilidade">
        {/* Barra de título dinâmica, com "Voltar" igual ao JurisdictionHub */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {(view === "estado" || view === "tribunal" || view === "problema") && (
              <button
                onClick={() => {
                  if (view === "estado") {
                    setView("regiao");
                    setActiveRegiao("");
                  } else if (view === "tribunal") {
                    if (activeRegiao === "federais") {
                      setView("regiao");
                      setActiveRegiao("");
                    } else {
                      setView("estado");
                      setSelectedEstado("");
                    }
                  } else if (view === "problema") {
                    setView("tribunal");
                    setData((prev) => ({ ...prev, problema: "" }));
                  }
                }}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <ArrowLeft size={18} />
              </button>
            )}
            <h3 className="text-white text-sm font-bold">
              {view === "regiao" && "Selecione a região ou tribunais federais"}
              {view === "estado" && `Região: ${activeRegiao}`}
              {view === "tribunal" &&
                (activeRegiao === "federais"
                  ? "Tribunais Federais"
                  : `Estado: ${selectedEstado}`)}
              {view === "problema" && data.portal}
              {view === "confirm" && "Relato registrado"}
            </h3>
          </div>
        </div>

        {/* Conteúdo por etapa, imitando JurisdictionHub */}
        {view === "regiao" && (
          <div className="space-y-3">
            <p className="text-white text-sm">
              Doutor, selecione a região ou os tribunais federais onde o senhor
              está enfrentando dificuldades:
            </p>
            <div className="flex flex-wrap justify-center gap-3 mt-3">
              {["Federais", "Sul", "Sudeste", "CentroOeste", "Nordeste", "Norte"].map(
                (r) => (
                  <button
                    key={r}
                    onClick={() => handleSelectRegiao(r.toLowerCase())}
                    className="px-4 py-2 text-slate-300 capitalize font-medium bg-slate-900 rounded-xl hover:bg-slate-800 transition-colors border border-slate-800 shadow-lg text-xs"
                  >
                    {r === "CentroOeste" ? "Centro-Oeste" : r}
                  </button>
                )
              )}
            </div>
          </div>
        )}

        {view === "estado" && (
          <div className="space-y-3">
            <p className="text-white text-sm">
              Agora selecione o estado dentro da região{" "}
              <strong>{activeRegiao}</strong>:
            </p>
            <div className="grid grid-cols-2 gap-3 mt-3">
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

        {view === "tribunal" && (
          <div className="space-y-3">
            <p className="text-white text-sm">
              Selecione o tribunal ou portal em que o senhor está enfrentando
              dificuldades:
            </p>
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1 mt-2">
              {getTribunaisDaSelecao().map((t: any) => (
                <button
                  key={t.name}
                  onClick={() => handleSelectTribunal(t)}
                  className="w-full p-3 border border-slate-700 bg-slate-900 text-white rounded transition-all duration-300 hover:border-blue-500 hover:shadow-[0_0_10px_rgba(37,99,235,0.5)] hover:bg-slate-800 text-left text-xs flex justify-between items-center"
                >
                  <span>{t.name}</span>
                  {/* opcional: mostrar URL resumida */}
                  <span className="text-[10px] text-slate-400 ml-2 truncate max-w-[50%]">
                    {t.url.replace(/^https?:\/\/(www\.)?/, "")}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

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

        {view === "confirm" && (
          <div className="space-y-4">
            <p className="text-white text-sm">
              Obrigado, doutor. Seu relato sobre{" "}
              <strong>{data.portal}</strong> foi registrado como{" "}
              <strong>{data.problema}</strong>.
            </p>
            <p className="text-xs text-slate-400">
              Esses registros contribuem para o diagnóstico automático de
              instabilidades e ajudam outros colegas a saberem quando um portal
              está com problemas.
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
      </Modal>

      {/* Modal secundária: Relatório de falhas (dados do KV) */}
      <Modal
        isOpen={reportListOpen}
        onClose={() => setReportListOpen(false)}
        title="Relatório de Falhas Registradas"
      >
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
      </Modal>
    </>
  );
}
