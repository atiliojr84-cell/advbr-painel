"use client";

import { useState, useEffect } from "react";
import { AlertCircle } from "lucide-react";
import Modal from "./ui/Modal";
import { jurisdictions } from "../data/jurisdictions";

// Estrutura para os dados de jurisdições
interface Tribunal {
  name: string;
  url: string;
}

interface Estado {
  [key: string]: Tribunal[];
}

interface Regiao {
  [key: string]: Estado;
}

interface Jurisdictions {
  federais: Tribunal[];
  regioes: Regiao;
}

// Carrega as jurisdições (ajuste o caminho se necessário)
const allJurisdictions: Jurisdictions = jurisdictions as Jurisdictions;

export default function ProblemReporter() {
  const [modalOpen, setModalOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [selectedTribunal, setSelectedTribunal] = useState<Tribunal | null>(null);
  const [problemType, setProblemType] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);

  const problemas = ["Instabilidade/Lentidão", "Offline", "Problema de Login", "Outro"];

  const resetModal = () => {
    setStep(1);
    setSelectedRegion(null);
    setSelectedState(null);
    setSelectedTribunal(null);
    setProblemType(null);
    setIsSubmitting(false);
    setSubmitMessage(null);
    setModalOpen(false);
  };

  const handleReportSubmit = async () => {
    if (!selectedTribunal) {
      setSubmitMessage("Por favor, selecione um tribunal antes de enviar.");
      return;
    }
    if (!problemType) {
      setSubmitMessage("Por favor, selecione o tipo de problema.");
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      const response = await fetch('/api/report-problem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tribunalName: selectedTribunal.name,
          tribunalUrl: selectedTribunal.url,
          problemType: problemType,
        }),
      });

      if (response.ok) {
        setSubmitMessage("Problema reportado com sucesso! Agradecemos sua colaboração.");
      } else {
        const errorData = await response.json();
        setSubmitMessage(`Erro ao reportar problema: ${errorData.error || response.statusText}`);
      }
    } catch (error) {
      setSubmitMessage(`Erro de conexão: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStates = (regiao: string) => {
    const estadosObj = (allJurisdictions.regioes as any)[regiao];
    return estadosObj ? Object.keys(estadosObj) : [];
  };

  const getTribunals = (regiao: string, estado: string) => {
    const estadosObj = (allJurisdictions.regioes as any)[regiao];
    return estadosObj && estadosObj[estado] ? estadosObj[estado] : [];
  };

  return (
    <>
      <button
        onClick={() => setModalOpen(true)}
        className="px-4 py-2 bg-red-600 text-white rounded-md transition-all duration-300 hover:bg-red-700 flex items-center gap-2 text-sm"
      >
        <AlertCircle size={18} />
        Reportar Falha de Acesso
      </button>

      <Modal isOpen={modalOpen} onClose={resetModal} title="Reportar Falha de Acesso">
        {submitMessage && (
          <div className="text-center p-4">
            <p className="text-white mb-4">{submitMessage}</p>
            <button onClick={resetModal} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              {submitMessage.includes("sucesso") ? "Fechar" : "Tentar Novamente"}
            </button>
          </div>
        )}

        {!submitMessage && step === 1 && ( // Seleção de Região
          <div className="space-y-3">
            <p className="text-white">Selecione a **Região** do Tribunal:</p>
            {Object.keys(allJurisdictions.regioes).map(regiao => (
              <button
                key={regiao}
                onClick={() => { setSelectedRegion(regiao); setStep(2); }}
                className="w-full p-3 border border-slate-700 bg-slate-900 text-white rounded transition-all duration-300 hover:border-blue-500 hover:shadow-[0_0_10px_rgba(37,99,235,0.5)] hover:bg-slate-800 text-left"
              >
                {regiao}
              </button>
            ))}
            {/* Botão para Federais - Agora vai para o passo 2 para listar os federais */}
            <button
              onClick={() => { setSelectedRegion("Federais"); setStep(2); }}
              className="w-full p-3 border border-slate-700 bg-slate-900 text-white rounded transition-all duration-300 hover:border-blue-500 hover:shadow-[0_0_10px_rgba(37,99,235,0.5)] hover:bg-slate-800 text-left"
            >
              Federais
            </button>
          </div>
        )}

        {!submitMessage && step === 2 && selectedRegion && selectedRegion !== "Federais" && ( // Seleção de Estado
          <div className="space-y-3">
            <p className="text-white">Selecione o **Estado** em {selectedRegion}:</p>
            {getStates(selectedRegion).map(state => (
              <button
                key={state}
                onClick={() => { setSelectedState(state); setStep(3); }}
                className="w-full p-3 border border-slate-700 bg-slate-900 text-white rounded transition-all duration-300 hover:border-blue-500 hover:shadow-[0_0_10px_rgba(37,99,235,0.5)] hover:bg-slate-800 text-left"
              >
                {state}
              </button>
            ))}
            <button onClick={() => { setStep(1); setSelectedRegion(null); }} className="text-sm text-blue-400 underline mt-4">Voltar</button>
          </div>
        )}

        {!submitMessage && step === 2 && selectedRegion === "Federais" && ( // NOVO PASSO: Seleção de Tribunais Federais
          <div className="space-y-3">
            <p className="text-white">Selecione o **Tribunal Federal**:</p>
            {allJurisdictions.federais.map(trib => (
              <button
                key={trib.name}
                onClick={() => { setSelectedTribunal(trib); setStep(4); }}
                className="w-full p-3 border border-slate-700 bg-slate-900 text-white rounded transition-all duration-300 hover:border-blue-500 hover:shadow-[0_0_10px_rgba(37,99,235,0.5)] hover:bg-slate-800 text-left"
              >
                {trib.name}
              </button>
            ))}
            <button onClick={() => { setStep(1); setSelectedRegion(null); setSelectedTribunal(null); }} className="text-sm text-blue-400 underline mt-4">Voltar</button>
          </div>
        )}

        {!submitMessage && step === 3 && selectedRegion && selectedState && ( // Seleção de Tribunal (para estados)
          <div className="space-y-3">
            <p className="text-white">Selecione o **Tribunal** em {selectedState}:</p>
            {getTribunals(selectedRegion, selectedState).map(trib => (
              <button
                key={trib.name}
                onClick={() => { setSelectedTribunal(trib); setStep(4); }}
                className="w-full p-3 border border-slate-700 bg-slate-900 text-white rounded transition-all duration-300 hover:border-blue-500 hover:shadow-[0_0_10px_rgba(37,99,235,0.5)] hover:bg-slate-800 text-left"
              >
                {trib.name}
              </button>
            ))}
            <button onClick={() => { setStep(2); setSelectedState(null); setSelectedTribunal(null); }} className="text-sm text-blue-400 underline mt-4">Voltar</button>
          </div>
        )}

        {!submitMessage && step === 4 && selectedTribunal && problemType === null && ( // Seleção de Tipo de Problema
          <div className="space-y-3">
            <p className="text-white">Qual é a natureza do problema no **{selectedTribunal.name}**?</p>
            {problemas.map(prob => (
              <button
                key={prob}
                onClick={() => { setProblemType(prob); setStep(5); }}
                className="w-full p-3 border border-slate-700 bg-slate-900 text-white rounded transition-all duration-300 hover:border-red-500 hover:shadow-[0_0_10px_rgba(239,68,68,0.5)] hover:hover:bg-slate-800 text-left"
              >
                {prob}
              </button>
            ))}
            <button onClick={() => {
              if (selectedRegion === "Federais") {
                setStep(2); // Volta para seleção de federais
                setSelectedTribunal(null);
              } else {
                setStep(3); // Volta para seleção de tribunal por estado
                setProblemType(null);
              }
            }} className="text-sm text-blue-400 underline mt-4">Voltar</button>
          </div>
        )}

        {!submitMessage && step === 5 && selectedTribunal && problemType && ( // Confirmação e Envio
          <div className="space-y-3 text-white">
            <p>Você está reportando um problema em:</p>
            <p className="font-bold">Tribunal: {selectedTribunal.name}</p>
            <p className="font-bold">Problema: {problemType}</p>
            <button
              onClick={handleReportSubmit}
              disabled={isSubmitting}
              className="w-full p-3 bg-red-600 text-white rounded transition-all duration-300 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed font-bold"
            >
              {isSubmitting ? "Enviando..." : "Confirmar e Enviar Reporte"}
            </button>
            <button onClick={() => setStep(4)} className="text-sm text-blue-400 underline mt-4">Voltar</button>
          </div>
        )}
      </Modal>
    </>
  );
}
