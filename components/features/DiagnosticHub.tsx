"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BadgeCheck, MonitorCheck, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

export default function DiagnosticHub() {
  const [activeModal, setActiveModal] = useState<'token' | 'pje' | null>(null);
  const [isTestingPje, setIsTestingPje] = useState(false);
  const [pjeResult, setPjeResult] = useState<'success' | 'error' | null>(null);

  const whatsappNumber = "5544984416101";

  // Mensagens pré-configuradas
  const msgToken = encodeURIComponent("Olá! Vim pelo site advbr.info e estou precisando de suporte com o meu Token/Certificado Digital.");
  const msgPje = encodeURIComponent("Olá! Vim pelo site advbr.info e o teste do meu PJe Office Pro falhou. Preciso de suporte.");

  const handleTestPje = async () => {
    setIsTestingPje(true);
    setPjeResult(null);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // Timeout de 3 segundos

      // Tenta bater na porta padrão do PJe Office localmente
      await fetch('http://127.0.0.1:8800/pjeOffice/', { 
        mode: 'no-cors',
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      setPjeResult('success');
    } catch (error) {
      setPjeResult('error');
    } finally {
      setIsTestingPje(false);
    }
  };

  const closeModal = () => {
    setActiveModal(null);
    setPjeResult(null);
  };

  return (
    <section className="w-full max-w-6xl mx-auto p-4 my-8">
      <div className="flex items-center justify-center gap-3 mb-8">
        <MonitorCheck className="w-8 h-8 text-blue-500" />
        <h2 className="text-3xl font-bold text-white">Diagnóstico de Infraestrutura</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card Token */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setActiveModal('token')}
          className="bg-slate-800 p-6 rounded-xl shadow-lg cursor-pointer hover:bg-slate-700 transition-colors duration-200 flex flex-col items-center text-center"
        >
          {/* ÍCONE SELO DE CERTIFICADO EM AZUL */}
          <BadgeCheck className="w-12 h-12 text-blue-400 mb-4" />
          <h3 className="text-white text-xl font-bold mb-2">Teste de Token</h3>
          <p className="text-slate-400 text-sm">Verifique a comunicação do seu Certificado Digital</p>
        </motion.div>

        {/* Card PJe Office */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setActiveModal('pje')}
          className="bg-slate-800 p-6 rounded-xl shadow-lg cursor-pointer hover:bg-slate-700 transition-colors duration-200 flex flex-col items-center text-center"
        >
          <MonitorCheck className="w-12 h-12 text-blue-400 mb-4" />
          <h3 className="text-white text-xl font-bold mb-2">Teste PJe Office Pro</h3>
          <p className="text-slate-400 text-sm">Valide se o assinador está rodando corretamente</p>
        </motion.div>
      </div>

      {/* Modais Inteligentes (Padrão advBR) */}
      <AnimatePresence>
        {activeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50"
            onClick={closeModal}
          >
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900 p-8 rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col"
            >
              {/* Cabeçalho do Modal */}
              <div className="flex items-center justify-between mb-6 shrink-0">
                <h3 className="text-white text-xl font-bold">
                  {activeModal === 'token' ? 'Diagnóstico de Token' : 'Diagnóstico PJe Office Pro'}
                </h3>
                <button onClick={closeModal} className="text-slate-500 hover:text-white">Fechar</button>
              </div>

              <div className="overflow-y-auto pr-2">
                {/* CONTEÚDO MODAL TOKEN */}
                {activeModal === 'token' && (
                  <div className="flex flex-col items-center text-center">
                    {/* ÍCONE SELO DE CERTIFICADO EM AZUL NO MODAL */}
                    <BadgeCheck className="w-12 h-12 text-blue-400 mb-4" />
                    <p className="text-slate-300 mb-6 leading-relaxed">
                      Doutor(a), o teste de comunicação do seu Certificado Digital é realizado em um ambiente externo seguro fornecido pela Certisign.
                    </p>

                    <a 
                      href="https://suporte.certisign.com.br/duvidas-suporte/certificado-digital/teste-certificado/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full py-4 rounded-xl shadow-lg shrink-0 bg-blue-600 hover:bg-blue-700 text-white font-bold transition-colors mb-6 block"
                    >
                      Iniciar Teste (Nova Aba)
                    </a>

                    <div className="w-full border-t border-slate-800 pt-6">
                      <p className="text-sm text-slate-400 mb-3">O teste falhou ou o token não acendeu?</p>
                      <a 
                        href={`https://wa.me/${whatsappNumber}?text=${msgToken}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full py-4 rounded-xl shadow-lg shrink-0 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold transition-colors"
                      >
                        <i className="fa-brands fa-whatsapp text-xl"></i>
                        Suporte via WhatsApp
                      </a>
                    </div>
                  </div>
                )}

                {/* CONTEÚDO MODAL PJE OFFICE */}
                {activeModal === 'pje' && (
                  <div className="flex flex-col items-center text-center">
                    <MonitorCheck className="w-12 h-12 text-blue-400 mb-4" />
                    <p className="text-slate-300 mb-6 leading-relaxed">
                      Doutor(a), nosso sistema tentará se comunicar com o PJe Office Pro instalado na sua máquina para verificar se ele está ativo e pronto para assinar petições.
                    </p>

                    {!pjeResult && (
                      <button 
                        onClick={handleTestPje}
                        disabled={isTestingPje}
                        className={`w-full py-4 rounded-xl shadow-lg shrink-0 text-white font-bold transition-colors mb-6 flex justify-center items-center gap-2 ${isTestingPje ? 'bg-slate-600 cursor-wait' : 'bg-blue-600 hover:bg-blue-700'}`}
                      >
                        {isTestingPje ? <><Loader2 className="animate-spin" /> Testando...</> : "Iniciar Teste Local"}
                      </button>
                    )}

                    {pjeResult === 'success' && (
                      <div className="w-full bg-emerald-900/50 border border-emerald-500 p-4 rounded-xl mb-6 flex flex-col items-center">
                        <CheckCircle2 className="w-8 h-8 text-emerald-400 mb-2" />
                        <p className="text-emerald-400 font-bold">PJe Office Pro detectado e rodando perfeitamente!</p>
                      </div>
                    )}

                    {pjeResult === 'error' && (
                      <div className="w-full bg-red-900/50 border border-red-500 p-4 rounded-xl mb-6 flex flex-col items-center">
                        <AlertCircle className="w-8 h-8 text-red-400 mb-2" />
                        <p className="text-red-400 font-bold mb-2">Falha na comunicação.</p>
                        <p className="text-sm text-red-300">O PJe Office Pro pode estar fechado, desatualizado ou bloqueado pelo antivírus.</p>
                      </div>
                    )}

                    <div className="w-full border-t border-slate-800 pt-6">
                      <p className="text-sm text-slate-400 mb-3">Precisa de ajuda para configurar?</p>
                      <a 
                        href={`https://wa.me/${whatsappNumber}?text=${msgPje}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full py-4 rounded-xl shadow-lg shrink-0 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold transition-colors"
                      >
                        <i className="fa-brands fa-whatsapp text-xl"></i>
                        Suporte via WhatsApp
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
