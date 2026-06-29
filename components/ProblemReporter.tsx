"use client";

import { useState, useEffect } from "react";
import { AlertCircle } from "lucide-react";
import Modal from "./ui/Modal"; // Importa o Modal atualizado
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

  const getRegions = () => {
    return ["Federais", ...Object.keys(allJurisdictions.regioes)];
  };

  const getStates = (region: string) => {
    if (region === "Federais") return [];
    return Object.keys(allJurisdictions.regioes[region] || {});
  };

  const getTribunals = (region: string, state: string) => {
    if (region === "Federais") return allJurisdictions.federais;
    return allJurisdictions.regioes[region]?.[state] || [];
  };

  const handleReportSubmit = async () => {
    if (!selectedTribunal && selectedRegion !== "Federais") {
      setSubmitMessage("Por favor, selecione o tribunal.");
      return;
    }
    if (!problemType) {
      setSubmitMessage("Por favor, selecione o tipo de problema.");
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage("Enviando seu reporte...");

    try {
      const response = await fetch('/api/report-problem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tribunalName: selectedTribunal?.name || selectedRegion,
          tribunalUrl: selectedTribunal?.url || "N/A",
          problemType: problemType,
          timestamp: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        setSubmitMessage("Reporte enviado com sucesso! Agradecemos sua colaboração.");
        setTimeout(resetModal, 3000);
      } else {
        const errorData = await response.json();
        setSubmitMessage(`Erro ao enviar reporte: ${errorData.error || response.statusText}`);
      }
    } catch (error) {
      setSubmitMessage(`Erro de conexão: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setModalOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg transition-all duration-300 hover:bg-red-700"
      >
        <AlertCircle size={18} />
        Reportar Falha
      </button>

      <Modal isOpen={modalOpen} onClose={resetModal} title="Reportar Falha de Acesso">
        {submitMessage && (
          <div className={`p-3 rounded mb-4 ${submitMessage.includes("sucesso") ? "bg-green-500" : "bg-red-500"} text-white`}>
            {submitMessage}
          </div>
        )}

        {!submitMessage && step === 1 && (
          <div className="space-y-3">
            <p className="text-white">Em qual **Região** o problema está ocorrendo?</p>
            {getRegions().map(region => (
              <button
                key={region}
                onClick={() => {
                  setSelectedRegion(region);
                  if (region === "Federais") {
                    setSelectedTribunal(null);
                    setStep(4);
                  } else {
                    setStep(2);
                  }
                }}
                className="w-full p-3 border border-slate-700 bg-slate-900 text-white rounded transition-all duration-300 hover:border-blue-500 hover:shadow-[0_0_10px_rgba(37,99,235,0.5)] hover:bg-slate-800 text-left"
              >
                {region}
              </button>
            ))}
          </div>
        )}

        {!submitMessage && step === 2 && selectedRegion && selectedRegion !== "Federais" && (
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

        {!submitMessage && step === 3 && selectedRegion && selectedState && (
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

        {!submitMessage && step === 4 && (selectedTribunal || selectedRegion === "Federais") && (
          <div className="space-y-3">
            <p className="text-white">Qual é a natureza do problema no **{selectedTribunal?.name || selectedRegion}**?</p>
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
                setStep(1);
                setSelectedRegion(null);
              } else if (selectedTribunal) {
                setStep(3);
                setSelectedTribunal(null);
              } else {
                setStep(2);
                setSelectedState(null);
              }
              setProblemType(null);
            }} className="text-sm text-blue-400 underline mt-4">Voltar</button>
          </div>
        )}

        {!submitMessage && step === 5 && (selectedTribunal || selectedRegion === "Federais") && problemType && (
          <div className="space-y-3 text-white">
            <p>Você está reportando um problema em:</p>
            <p className="font-bold">Tribunal: {selectedTribunal?.name || selectedRegion}</p>
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
