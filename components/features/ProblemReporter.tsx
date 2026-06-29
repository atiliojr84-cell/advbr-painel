"use client";

import { useState } from "react";
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

  const reset = () => {
    setStep(1);
    setData({ portal: "", problema: "" });
    setModalOpen(false);
  };

  const handleSelectPortal = (portal: string) => {
    setData((prev) => ({ ...prev, portal }));
    setStep(2);
  };

  const handleSelectProblema = async (problema: string) => {
    const newReport: Report = {
      portal: data.portal,
      problema,
      createdAt: new Date().toISOString(),
    };

    // Aqui você pode futuramente enviar para uma API / KV:
    // await fetch("/api/report-falha", { method: "POST", body: JSON.stringify(newReport) });

    // Por enquanto, guardamos localmente (em memória) só para UX:
    setReports((prev) => [...prev, newReport]);

    setData((prev) => ({ ...prev, problema }));
    setStep(3);
  };

  const handleCloseAfterConfirm = () => {
    reset();
  };

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
          onClick={() => setReportListOpen(true)}
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
                className="w-full p-3 border border-slate-700 bg-slate-900 text-white rounded transition-all duration-300 hover:border-red-500 hover:shadow-[0_0_10px_rgba(239,68,68,0.5)] hover:bg-slate-800 text-left"
              >
                {prob}
              </button>
            ))}
            <button
              onClick={() => setStep(1)}
              className="text-sm text-blue-400 underline mt-4"
            >
              Voltar
            </button>
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

      {/* Modal secundária: Relatório de falhas (local) */}
      <Modal
        isOpen={reportListOpen}
        onClose={() => setReportListOpen(false)}
        title="Relatório de Falhas Registradas (Sessão Atual)"
      >
        {reports.length === 0 ? (
          <p className="text-slate-300 text-sm">
            Ainda não há falhas registradas nesta sessão.
          </p>
        ) : (
          <div className="space-y-3 text-sm text-slate-200">
            {reports
              .slice()
              .reverse()
              .map((r, idx) => (
                <div
                  key={idx}
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
