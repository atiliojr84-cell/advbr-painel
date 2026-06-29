"use client";

import { useState, useEffect } from "react";
import { AlertCircle } from "lucide-react";
import Modal from "./ui/Modal"; // CORRIGIDO: Agora aponta corretamente para components/ui/Modal
import { jurisdictions } from "../data/jurisdictions"; // CORRIGIDO: Assumindo que jurisdictions está em data/jurisdictions na raiz do projeto

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
    if (!selectedTribunal && selectedRegion !== "Federais") { // Garante que um tribunal ou a opção federais foi selecionada
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
      const response = await fetch('/api/report-problem', { // Novo endpoint de API
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tribunalName: selectedTribunal?.name || selectedRegion, // Usa o nome do tribunal ou "Federais"
          tribunalUrl: selectedTribunal?.url || "N/A", // URL do tribunal ou N/A para federais
          problemType: problemType,
          timestamp: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        setSubmitMessage("Reporte enviado com sucesso! Agradecemos sua colaboração.");
        setTimeout(resetModal, 3000); // Fecha o modal após 3 segundos
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

  // Funções para obter regiões, estados e tribunais
  const getRegions = () => {
    return ["Federais", ...Object.keys(allJurisdictions.regioes)];
  };

  const getStates = (region: string) => {
    if (region === "Federais") return [];
    return Object.keys(allJurisdictions.regioes[region]);
  };

  const getTribunals = (region: string, state: string | null) => {
    if (region === "Federais") {
      return allJurisdictions.federais;
    }
    if (state && allJurisdictions.regioes[region] && allJurisdictions.regioes[region][state]) {
      return allJurisdictions.regioes[region][state];
    }
    return [];
  };

  return (
    <>
      <div className="flex flex-col gap-2">
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-black border border-red-500/50 text-red-500 px-4 py-2 rounded hover:bg-red-600 hover:text-white transition-all font-bold text-sm"
        >
          <AlertCircle className="w-4 h-4" />
          Reportar Falha de Acesso
        </button>
        {/* O link para o relatório de falhas */}
        <a
          href="/reports" // Este é o link para a nova página de relatórios
          className="text-blue-400 hover:text-blue-600 text-sm underline text-center"
        >
          Ver Relatório de Falhas
        </a>
      </div>

      <Modal isOpen={modalOpen} onClose={resetModal} title="Reportar Falha de Acesso"> {/* CORRIGIDO: Adicionado o prop title */}
        <h2 className="text-xl font-bold text-white mb-4">Reportar Falha de Acesso</h2>

        {submitMessage && (
          <div className={`p-3 rounded mb-4 ${submitMessage.includes("sucesso") ? "bg-green-500" : "bg-red-500"} text-white`}>
            {submitMessage}
          </div>
        )}

        {!submitMessage && step === 1 && ( // Seleção de Região
          <div className="space-y-3">
            <p className="text-white">Em qual **Região** o problema está ocorrendo?</p>
            {getRegions().map(region => (
              <button
                key={region}
                onClick={() => {
                  setSelectedRegion(region);
                  if (region === "Federais") {
                    setSelectedTribunal(null); // Reseta tribunal se for federais
                    setStep(4); // Vai direto para seleção de problema para federais
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

        {!submitMessage && step === 3 && selectedRegion && selectedState && ( // Seleção de Tribunal
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

        {!submitMessage && step === 4 && (selectedTribunal || selectedRegion === "Federais") && ( // Seleção de Tipo de Problema
          <div className="space-y-3">
            <p className="text-white">Qual é a natureza do problema no **{selectedTribunal?.name || selectedRegion}**?</p>
            {problemas.map(prob => (
              <button
                key={prob}
                onClick={() => { setProblemType(prob); setStep(5); }} // Próximo passo é a confirmação
                className="w-full p-3 border border-slate-700 bg-slate-900 text-white rounded transition-all duration-300 hover:border-red-500 hover:shadow-[0_0_10px_rgba(239,68,68,0.5)] hover:hover:bg-slate-800 text-left"
              >
                {prob}
              </button>
            ))}
            <button onClick={() => {
              if (selectedRegion === "Federais") {
                setStep(1); // Volta para seleção de região
                setSelectedRegion(null);
              } else if (selectedTribunal) {
                setStep(3); // Volta para seleção de tribunal
                setSelectedTribunal(null);
              } else {
                setStep(2); // Volta para seleção de estado
                setSelectedState(null);
              }
              setProblemType(null);
            }} className="text-sm text-blue-400 underline mt-4">Voltar</button>
          </div>
        )}

        {!submitMessage && step === 5 && (selectedTribunal || selectedRegion === "Federais") && problemType && ( // Confirmação e Envio
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
