"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const services = [
  { id: 1, title: "Adequação LGPD", desc: "Proteção estrutural e criptografia para dados sensíveis de clientes." },
  { id: 2, title: "Segurança Digital e Backup", desc: "Antivírus corporativo, blindagem de rede e rotinas de backup seguras." },
  { id: 3, title: "Suporte TI Jurídico", desc: "Resolução rápida de problemas: PJe, eproc, tokens e certificados." },
  { 
    id: 5, 
    title: "Consultoria e Suporte Remoto Nacional", 
    desc: "Gestão completa de TI para escritórios de advocacia em todo o Brasil, com atendimento especializado e ativo para otimização e resolução de problemas, tudo remotamente." 
  },
];

export default function ServiceGrid() {
  const [selectedService, setSelectedService] = useState<typeof services[0] | null>(null);

  const handleWhatsApp = (serviceTitle: string) => {
    let msgText = `Olá, Como podemos ajudar a estruturar a TI do seu escritório? Vi no Painel ADVBR sobre o serviço de ${serviceTitle}.`;

    // Mensagem específica para o serviço de Consultoria e Suporte Remoto Nacional
    if (serviceTitle === "Consultoria e Suporte Remoto Nacional") {
      msgText = `Olá, Tenho interesse em saber mais sobre a Consultoria e Suporte Remoto Nacional para meu escritório de advocacia (atendimento recorrente ou pontual).`;
    } else if (serviceTitle === "Adequação LGPD") { // Mensagem específica para LGPD
      msgText = `Olá, Tenho interesse em saber mais sobre a Adequação LGPD (Infraestrutura e Processos de TI) para meu escritório de advocacia.`;
    }

    const msg = encodeURIComponent(msgText);
    window.open(`https://wa.me/5544984416101?text=${msg}`, "_blank");
  };

  return (
    <section className="py-12 px-4 bg-slate-950">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-white mb-8 text-center border-b border-slate-800 pb-4">
          Soluções Corporativas em TI Jurídica
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {services.map((s) => (
            <button 
              key={s.id}
              onClick={() => setSelectedService(s)}
              className="p-6 bg-slate-900 rounded-xl glow-effect text-left"
            >
              <h3 className="font-bold text-lg text-white">{s.title}</h3>
              <p className="text-slate-400 text-sm mt-2 leading-relaxed">{s.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {selectedService && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedService(null)}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900 p-8 rounded-3xl border border-slate-700 w-full max-w-md shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-white text-xl font-bold">{selectedService.title}</h3>
                <button onClick={() => setSelectedService(null)} className="text-slate-500 hover:text-white">Fechar</button>
              </div>

              {/* Descrição dinâmica para os serviços */}
              {selectedService.id === 1 ? ( // Adequação LGPD
                <p className="text-slate-300 leading-relaxed mb-6">
                  Nossa Adequação LGPD foca na **infraestrutura e nos processos de TI** do seu escritório. Garantimos que seus sistemas, redes e fluxos de dados estejam em conformidade com a Lei Geral de Proteção de Dados, implementando medidas de segurança, controle de acesso e governança de dados. Nosso trabalho abrange a proteção estrutural e a criptografia para dados sensíveis de clientes, minimizando riscos e fortalecendo a segurança digital do seu ambiente jurídico.
                </p>
              ) : selectedService.id === 5 ? ( // Consultoria e Suporte Remoto Nacional
                <p className="text-slate-300 leading-relaxed mb-6">
                  Nosso serviço de <strong>Consultoria e Suporte Remoto Nacional</strong> oferece uma gestão de TI completa e proativa para advogados e escritórios em qualquer lugar do Brasil. Atuamos ativamente na configuração de redes, otimização de sistemas, implementação de segurança digital, rotinas de backup e gerenciamento de servidores, tudo por acesso remoto. Resolvemos os problemas do dia a dia e implementamos melhorias contínuas, garantindo que sua infraestrutura tecnológica esteja sempre alinhada aos seus prazos e necessidades.
                  <br /><br />
                  Trabalhamos com duas modalidades flexíveis:
                  <br />
                  <strong>1. Atendimento Recorrente (Mensalidade):</strong> Ideal para quem busca uma parceria contínua, com acompanhamento constante e suporte ilimitado para manter o escritório sempre produtivo e seguro.
                  <br />
                  <strong>2. Atendimento Pontual:</strong> Perfeito para resolver problemas específicos ou realizar configurações sob demanda, com pagamento por serviço prestado.
                  <br /><br />
                  Este modelo de atendimento cobre todas as suas demandas de TI, excluindo apenas intervenções físicas de hardware que exijam deslocamento.
                </p>
              ) : ( // Outros serviços
                <p className="text-slate-300 leading-relaxed mb-6">
                  O serviço de <strong>{selectedService.title}</strong> é desenhado para eliminar gargalos tecnológicos do seu escritório. 
                  Como especialistas com 15 anos de atuação no ambiente jurídico, garantimos que sua infraestrutura trabalhe a favor dos seus prazos e da segurança dos dados dos seus clientes.
                </p>
              )}

              <div className="flex gap-4">
                <button onClick={() => setSelectedService(null)} className="flex-1 py-3 text-slate-400 font-medium">Cancelar</button>
                <button 
                  onClick={() => handleWhatsApp(selectedService.title)}
                  className="flex-[2] py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/50"
                >
                  Consultar Especialista por WhatsApp
                </button>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      )}
    </section>
  );
}
