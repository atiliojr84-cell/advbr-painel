"use client";

import { useState } from "react";
import Modal from "./ui/Modal";

const services = [
  { id: 1, title: "Adequação LGPD", desc: "Infraestrutura e governança de dados." },
  { id: 2, title: "Segurança e Backup", desc: "Blindagem de dados críticos." },
  { id: 3, title: "Suporte TI Jurídico", desc: "Atendimento especializado 24/7." },
  { id: 4, title: "Gestão de Infra", desc: "Parcerias estratégicas em TI." },
];

export default function ServiceGrid() {
  const [selectedService, setSelectedService] = useState<typeof services[0] | null>(null);

  const handleWhatsApp = (service: string) => {
    const msg = encodeURIComponent(`Olá Júnior, vi no Painel ADVBR sobre o serviço de ${service} e gostaria de falar com um especialista.`);
    window.open(`https://wa.me/5544984416101?text=${msg}`, "_blank");
  };

  return (
    <section className="py-12 px-4 bg-slate-50">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-slate-800 mb-8 text-center">Soluções Corporativas em TI Jurídica</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {services.map((s) => (
            <button 
              key={s.id}
              onClick={() => setSelectedService(s)}
              className="p-6 bg-white border border-slate-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all text-left"
            >
              <h3 className="font-bold text-lg text-slate-700">{s.title}</h3>
              <p className="text-slate-500 text-sm">{s.desc}</p>
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
          <div className="space-y-4">
            <p className="text-slate-600 leading-relaxed">
              O serviço de <strong>{selectedService.title}</strong> é desenhado para eliminar gargalos tecnológicos do seu escritório. 
              Como especialistas, garantimos que sua infraestrutura trabalhe a favor dos seus prazos, não contra eles.
            </p>
            <button 
              onClick={() => handleWhatsApp(selectedService.title)}
              className="w-full py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors"
            >
              Falar com Especialista no WhatsApp
            </button>
          </div>
        </Modal>
      )}
    </section>
  );
}
