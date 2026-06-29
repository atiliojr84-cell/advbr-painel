"use client";

import { useState, useEffect } from "react";
import { AlertCircle } from "lucide-react";
import Modal from "./ui/Modal"; // Importa o componente Modal
import { jurisdictions } from "../data/jurisdictions"; // Ajuste o caminho conforme necessário

// Define a estrutura de um tribunal
interface Tribunal {
  name: string;
  url: string;
  alerta?: string | null;
}

// Define a estrutura de todas as jurisdições
interface AllJurisdictions {
  federais: Tribunal[];
  regioes: {
    [key: string]: {
      [key: string]: Tribunal[];
    };
  };
}

// Carrega as jurisdições
const allJurisdictions: AllJurisdictions = jurisdictions;

export default function ProblemReporter() {
  const [modalOpen, setModalOpen] = useState(false);
  const [step, setStep] = useState(1); // 1: Região, 2: Estado/Federais, 3: Tribunal, 4: Tipo de Problema, 5: Confirmação
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [selectedTribunal, setSelectedTribunal] = useState<Tribunal | null>(null);
  const [problemType, setProblemType] = useState<string | null>(null);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const problemas = [
    "Indisponibilidade",
    "Lentidão",
    "Erro ao acessar",
    "Certificado inválido",
    "Outro"
  ];

  const resetModal = () => {
    setModalOpen(false);
    setStep(1);
    setSelectedRegion(null);
    setSelectedState(null);
    setSelectedTribunal(null);
    setProblemType(null);
    setSubmitMessage(null);
    setIsSubmitting(false);
  };

  const getStates = (region: string) => {
    return Object.keys(allJurisdictions.regioes[region] || {});
  };

  const getTribunals = (region: string, state: string) => {
    return allJurisdictions.regioes[region]?.[state] || [];
  };

  const handleReportSubmit = async () => {
    console.log("DEBUG: handleReportSubmit chamado."); // DEBUG
    console.log("DEBUG: selectedTribunal antes da validação:", selectedTribunal); // DEBUG
    console.log("DEBUG: problemType antes da validação:", problemType); // DEBUG

    // Validação básica no frontend antes de enviar
    if (!selectedTribunal || !problemType) {
      setSubmitMessage("Erro: Dados incompletos para o reporte (frontend)."); // Adicionado "(frontend)" para diferenciar
      return;
    }

    setSubmitMessage(null);
    setIsSubmitting(true);

    const reportData = {
      tribunalName: selectedTribunal.name,
      // Garante que tribunalUrl seja sempre uma string, mesmo que vazia
      tribunalUrl: selectedTribunal.url || '',
      problemType: problemType,
      timestamp: new Date().toISOString(),
    };

    console.log("DEBUG: Dados sendo enviados para a API:", reportData); // NOVO LOG AQUI

    try {
      const response = await fetch('/api/report-problem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reportData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Erro desconhecido (${response.status}) ao reportar.`);
      }

      setSubmitMessage("Reporte enviado com sucesso! Agradecemos sua colaboração.");
      // resetModal(); // Decide if you want to close the modal on success
    } catch (error: any) {
      console.error("Erro ao enviar reporte:", error); // DEBUG
      setSubmitMessage(`Erro ao reportar problema: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setModalOpen(true)}
        className="px-4 py-2 bg-red-600 text-white rounded transition-all duration-300 hover:bg-red-700 flex items-center gap-2 text-sm"
      >
        <AlertCircle size={18} />
        Reportar Falha
      </button>

      <Modal isOpen={modalOpen} onClose={resetModal} title="Reportar Falha de Acesso">
        {!submitMessage && step === 1 && ( // Seleção de Região
          <div className="space-y-3">
            <p className="text-white">Selecione a **Região** do Tribunal:</p>
            {Object.keys(allJurisdictions.regioes).map(regiao => (
              <button
                key={regiao}
                onClick={() => {
                  console.log("Step 1: Selecionou Região:", regiao); // DEBUG
                  setSelectedRegion(regiao);
                  setStep(2);
                }}
                className="w-full p-3 border border-slate-700 bg-slate-900 text-white rounded transition-all duration-300 hover:border-blue-500 hover:shadow-[0_0_10px_rgba(37,99,235,0.5)] hover:bg-slate-800 text-left"
              >
                {regiao}
              </button>
            ))}
            {/* Botão para Federais */}
            <button
              onClick={() => {
                console.log("Step 1: Selecionou Região: Federais"); // DEBUG
                setSelectedRegion("Federais");
                setStep(2);
              }}
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
                onClick={() => {
                  console.log("Step 2: Selecionou Estado:", state); // DEBUG
                  setSelectedState(state);
                  setStep(3);
                }}
                className="w-full p-3 border border-slate-700 bg-slate-900 text-white rounded transition-all duration-300 hover:border-blue-500 hover:shadow-[0_0_10px_rgba(37,99,235,0.5)] hover:bg-slate-800 text-left"
              >
                {state}
              </button>
            ))}
            <button onClick={() => {
              console.log("Step 2: Voltar para Região"); // DEBUG
              setStep(1); setSelectedRegion(null);
            }} className="text-sm text-blue-400 underline mt-4">Voltar</button>
          </div>
        )}

        {!submitMessage && step === 2 && selectedRegion === "Federais" && ( // Seleção de Tribunais Federais
          <div className="space-y-3">
            <p className="text-white">Selecione o **Tribunal Federal**:</p>
            {allJurisdictions.federais.map(trib => (
              <button
                key={trib.name}
                onClick={() => {
                  console.log("Step 2 (Federais): Selecionou Tribunal:", trib.name); // DEBUG
                  setSelectedTribunal(trib);
                  setStep(4);
                }}
                className="w-full p-3 border border-slate-700 bg-slate-900 text-white rounded transition-all duration-300 hover:border-blue-500 hover:shadow-[0_0_10px_rgba(37,99,235,0.5)] hover:bg-slate-800 text-left"
              >
                {trib.name}
              </button>
            ))}
            <button onClick={() => {
              console.log("Step 2 (Federais): Voltar para Região"); // DEBUG
              setStep(1); setSelectedRegion(null); setSelectedTribunal(null);
            }} className="text-sm text-blue-400 underline mt-4">Voltar</button>
          </div>
        )}

        {!submitMessage && step === 3 && selectedRegion && selectedState && ( // Seleção de Tribunal (para estados)
          <div className="space-y-3">
            <p className="text-white">Selecione o **Tribunal** em {selectedState}:</p>
            {getTribunals(selectedRegion, selectedState).map(trib => (
              <button
                key={trib.name}
                onClick={() => {
                  console.log("Step 3: Selecionou Tribunal:", trib.name); // DEBUG
                  setSelectedTribunal(trib);
                  setStep(4);
                }}
                className="w-full p-3 border border-slate-700 bg-slate-900 text-white rounded transition-all duration-300 hover:border-blue-500 hover:shadow-[0_0_10px_rgba(37,99,235,0.5)] hover:bg-slate-800 text-left"
              >
                {trib.name}
              </button>
            ))}
            <button onClick={() => {
              console.log("Step 3: Voltar para Estado"); // DEBUG
              setStep(2); setSelectedState(null); setSelectedTribunal(null);
            }} className="text-sm text-blue-400 underline mt-4">Voltar</button>
          </div>
        )}

        {!submitMessage && step === 4 && selectedTribunal && problemType === null && ( // Seleção de Tipo de Problema
          <div className="space-y-3">
            <p className="text-white">Qual é a natureza do problema no **{selectedTribunal.name}**?</p>
            {problemas.map(prob => (
              <button
                key={prob}
                onClick={() => {
                  console.log("Step 4: Selecionou Tipo de Problema:", prob); // DEBUG
                  setProblemType(prob);
                  setStep(5);
                }}
                className="w-full p-3 border border-slate-700 bg-slate-900 text-white rounded transition-all duration-300 hover:border-red-500 hover:shadow-[0_0_10px_rgba(239,68,68,0.5)] hover:hover:bg-slate-800 text-left"
              >
                {prob}
              </button>
            ))}
            <button onClick={() => {
              console.log("Step 4: Voltar para Seleção de Tribunal"); // DEBUG
              if (selectedRegion === "Federais") {
                setStep(2);
              } else {
                setStep(3);
              }
              setProblemType(null);
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
            <button onClick={() => {
              console.log("Step 5: Voltar para Tipo de Problema"); // DEBUG
              setStep(4);
            }} className="text-sm text-blue-400 underline mt-4">Voltar</button>
          </div>
        )}
      </Modal>
    </>
  );
}
