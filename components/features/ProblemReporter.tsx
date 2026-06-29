"use client";

import { useState, useEffect } from "react";
import { AlertCircle, FileText } from "lucide-react";
import Modal from "../ui/Modal";

const portais = ["PJe", "e-Proc", "Projudi", "e-SAJ", "PJe Office", "Certisign"];
const problemas = ["Instabilidade/Lentidão", "Offline", "Problema de Login"];

type Report = {
  portal: string;
  problema: string;
  createdAt: string;
};

export default function ProblemReporter() {
  const [modalOpen, setModalOpen] = useState(false);
  const [reportListOpen, setReportListOpen] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [data, setData] = useState<{ portal: string; problema: string }>({
    portal: "",
    problema: "",
  });
  const [reports, setReports] = useState<Report[]>([]);
  const [loadingReports, setLoadingReports] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const reset = () => {
    setStep(1);
    setData({ portal: "", problema: "" });
    setModalOpen(false);
    setErrorMsg(null);
  };

  const handleSelectPortal = (portal: string) => {
    setData((prev) => ({ ...prev, portal }));
    setStep(2);
    setErrorMsg(null);
  };

  const handleSelectProblema = async (problema: string) => {
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

      // Se deu certo, vamos para o passo 3 (confirmação)
      setData((prev) => ({ ...prev, problema }));
      setStep(3);
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
      setErrorMsg(
        "Não foi possível carregar o relatório de falhas agora."
      );
    } finally {
      setLoadingReports(false);
    }
  };

  // Quando fechar o modal de relatório, limpamos mensagem de erro
  useEffect(() => {
    if (!reportListOpen) {
      setErrorMsg(null);
    }
  }, [reportListOpen]);

  return (
    <>
      <div className="flex flex-col gap-2">
        {/* Botão: Reportar Falha */}
        <button
          onClick={() => setModalOpen(true)}
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
        {step === 1 && (
          <div className="space-y-3">
            <p className="text-white">
              Doutor, selecione o portal onde o senhor está enfrentando
              dificuldades:
            </p>
            {portais.map((p) => (
              <button
                key={p}
                onClick={() => handleSelectPortal(p)}
                className="w-full p-3 border border-slate-700 bg-slate-900 text-white rounded transition-all duration-300 hover:border-blue-500 hover:shadow-[0_0_10px_rgba(37,99,235,0.5)] hover:bg-slate-800 text-left"
              >
                {p}
              </button>
            ))}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-3">
            <p className="text-white">
              Qual é a natureza do problema no{" "}
              <strong>{data.portal}</strong>?
            </p>
            {problemas.map((prob) => (
              <button
                key={prob}
                onClick={() => handleSelectProblema(prob)}
                disabled={loadingSubmit}
                className="w-full p-3 border border-slate-700 bg-slate-900 text-white rounded transition-all duration-300 hover:border-red-500 hover:shadow-[0_0_10px_rgba(239,68,68,0.5)] hover:bg-slate-800 text-left disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loadingSubmit && data.problema === prob
                  ? "Enviando..."
                  : prob}
              </button>
            ))}
            <button
              onClick={() => setStep(1)}
              className="text-sm text-blue-400 underline mt-4"
            >
              Voltar
            </button>
            {errorMsg && (
              <p className="text-xs text-red-400 mt-2">{errorMsg}</p>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <p className="text-white">
              Obrigado, doutor. Seu relato sobre{" "}
              <strong>{data.portal}</strong> foi registrado como{" "}
              <strong>{data.problema}</strong>.
            </p>
            <p className="text-sm text-slate-400">
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
