"use client";

import { useState } from "react";
import Modal from "./ui/Modal";

const services = [
  { id: 1, title: "Adequação LGPD", desc: "Proteção estrutural e criptografia para dados sensíveis de clientes." },
  { id: 2, title: "Segurança Digital e Backup", desc: "Antivírus corporativo, blindagem de rede e rotinas de backup seguras." },
  { id: 3, title: "Suporte TI Jurídico", desc: "Resolução rápida de problemas: PJe, eproc, tokens e certificados." },
  { id: 4, title: "Gestão e Infraestrutura", desc: "Planejamento estratégico de TI com suporte remoto e presencial." },
];

export default function ServiceGrid() {
  const [selectedService, setSelectedService] = useState<typeof services[0] | null>(null);

  const handleWhatsApp = (service: string) => {
    const msg = encodeURIComponent(`Olá, Doutor(a). Como podemos ajudar a estruturar a TI do seu escritório? Vi no Painel ADVBR sobre o serviço de ${service}.`);
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
              /* Aplicando o glow-effect e removendo a borda estática */
              className="p-6 bg-slate-900 rounded-xl glow-effect text-left"
            >
              <h3 className="font-bold text-lg text-white">
                {s.title}
              </h3>
              <p className="text-slate-400 text-sm mt-2 leading-relaxed">{s.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {selectedService && (
        <Modal 
          isOpen={!!selectedService} 
          onClose={() => setSelectedService(null)} 
          title={selectedService.title}
        >
          <div className="space-y-6">
            <p className="text-slate-300 leading-relaxed">
              O serviço de <strong>{selectedService.title}</strong> é desenhado para eliminar gargalos tecnológicos do seu escritório. 
              Como especialistas com 15 anos de atuação no ambiente jurídico, garantimos que sua infraestrutura trabalhe a favor dos seus prazos e da segurança dos dados dos seus clientes.
            </p>
            
            <button 
              onClick={() => handleWhatsApp(selectedService.title)}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
            >
              Falar com Especialista no WhatsApp
            </button>
          </div>
        </Modal>
      )}
    </section>
  );
}
