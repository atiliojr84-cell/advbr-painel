"use client";

import { useState } from "react";
import { Megaphone } from "lucide-react";
import Modal from "../ui/Modal";

// Lista de portais para monitoramento
const portais = ["PJe", "e-Proc", "Projudi", "e-SAJ", "PJe Office", "Certisign"];
const problemas = ["Instabilidade/Lentidão", "Offline", "Problema de Login"];

export default function ProblemReporter() {
  const [modalOpen, setModalOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [data, setData] = useState({ portal: "", problema: "" });

  const reset = () => {
    setStep(1);
    setData({ portal: "", problema: "" });
    setModalOpen(false);
  };

  return (
    <>
      {/* Botões do Canto Superior Direito */}
      <div className="flex flex-col gap-2">
        <button 
          onClick={() => setModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-black border border-white text-white px-4 py-2 rounded hover:bg-red-400 transition-colors font-bold text-sm"
        >
          <Megaphone className="w-4 h-4" /> Estou com problema!
        </button>
        <button className="text-xs text-slate-400 hover:text-white underline text-right transition-colors">
          Ver Relatório de Falhas
        </button>
      </div>

      <Modal isOpen={modalOpen} onClose={reset} title="Comunicar Instabilidade">
        {step === 1 && (
          <div className="space-y-3">
            <p className="text-slate-700">Doutor, selecione o portal onde o senhor está enfrentando dificuldades:</p>
            <div className="grid grid-cols-1 gap-2">
              {portais.map(p => (
                <button 
                  key={p} 
                  onClick={() => { setData({...data, portal: p}); setStep(2); }} 
                  className="w-full p-3 border border-slate-200 hover:bg-black hover:text-white rounded transition-all text-left"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-3">
            <p className="text-slate-700">Qual é a natureza do problema no <strong>{data.portal}</strong>?</p>
            <div className="grid grid-cols-1 gap-2">
              {problemas.map(prob => (
                <button 
                  key={prob} 
                  onClick={() => { 
                    // Aqui faremos a chamada da sua API para o Redis no próximo passo
                    console.log("Enviando reporte para Redis:", { ...data, problema: prob });
                    reset(); 
                  }} 
                  className="w-full p-3 border border-slate-200 hover:bg-red-500 hover:text-white rounded transition-all text-left"
                >
                  {prob}
                </button>
              ))}
            </div>
            <button onClick={() => setStep(1)} className="text-sm text-slate-500 underline mt-4">Voltar</button>
          </div>
        )}
      </Modal>
    </>
  );
}
