"use client";

import { useState } from "react";
import { AlertCircle } from "lucide-react";
import Modal from "../ui/Modal";

const portais = ["PJe", "e-Proc", "Projudi", "e-SAJ", "PJe Office", "Certisign"];
const problemas = ["Instabilidade/Lentidão", "Offline", "Problema de Login"];

export default function ProblemReporter() {
  const [modalOpen, setModalOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [data, setData] = useState({ portal: "", problema: "" });

  const reset = () => { setStep(1); setData({ portal: "", problema: "" }); setModalOpen(false); };

  return (
    <>
      <div className="flex flex-col gap-2">
        <button 
          onClick={() => setModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-black border border-red-500/50 text-red-500 px-4 py-2 rounded hover:bg-red-600 hover:text-white transition-all font-bold text-sm"
        >
          <AlertCircle className="w-4 h-4" /> Reportar Falha de Acesso
        </button>
        <button className="text-xs text-slate-400 hover:text-white underline text-right transition-colors">
          Ver Relatório de Falhas
        </button>
      </div>

      <Modal isOpen={modalOpen} onClose={reset} title="Comunicar Instabilidade">
        {step === 1 && (
          <div className="space-y-3">
            <p className="text-white">Doutor, selecione o portal onde o senhor está enfrentando dificuldades:</p>
            {portais.map(p => (
              <button key={p} onClick={() => { setData({...data, portal: p}); setStep(2); }} 
                className="w-full p-3 border border-slate-700 bg-slate-900 text-white rounded transition-all duration-300 hover:border-blue-500 hover:shadow-[0_0_10px_rgba(37,99,235,0.5)] hover:bg-slate-800 text-left">
                {p}
              </button>
            ))}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-3">
            <p className="text-white">Qual é a natureza do problema no <strong>{data.portal}</strong>?</p>
            {problemas.map(prob => (
              <button key={prob} onClick={() => { console.log("Reportado:", { ...data, problema: prob }); reset(); }} 
                className="w-full p-3 border border-slate-700 bg-slate-900 text-white rounded transition-all duration-300 hover:border-red-500 hover:shadow-[0_0_10px_rgba(239,68,68,0.5)] hover:bg-slate-800 text-left">
                {prob}
              </button>
            ))}
            <button onClick={() => setStep(1)} className="text-sm text-blue-400 underline mt-4">Voltar</button>
          </div>
        )}
      </Modal>
    </>
  );
}
