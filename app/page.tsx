import Header from "../components/ui/Header";
import Ticker from "../components/ui/Ticker";
import ServiceGrid from "../components/ServiceGrid";
import PortalCarousel from "../components/features/PortalCarousel";
import JurisdictionHub from "../components/features/JurisdictionHub";
// import PdfToolHub from "../components/features/PdfToolHub"; // <-- REMOVA ESTA LINHA

import dynamic from 'next/dynamic'; // <-- ADICIONE ESTA LINHA
import { Loader2 } from 'lucide-react'; // <-- ADICIONE ESTA LINHA (ou outro ícone de carregamento de sua preferência)

// Importa PdfToolHub dinamicamente, garantindo que ele só seja carregado no cliente
const DynamicPdfToolHub = dynamic(() => import('../components/features/PdfToolHub'), {
  ssr: false, // ISSO É CRÍTICO! Desativa a renderização no servidor.
  loading: () => (
    <div className="flex justify-center items-center h-40 text-white">
      <Loader2 className="animate-spin text-blue-500" size={32} /> Carregando Ferramentas PDF...
    </div>
  ),
});

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0b0f19]">
      <Ticker />

      <main className="p-4 md:p-8 max-w-7xl mx-auto space-y-12">
        <Header />

        <section>
          <h2 className="text-lg font-semibold mb-4 text-gray-300 flex items-center gap-2">
            <i className="fa-solid fa-star text-blue-500"></i> Principais Portais de Peticionamento
          </h2>
          <PortalCarousel />
        </section>

        <JurisdictionHub />

        {/* Use o componente dinâmico aqui */}
        <DynamicPdfToolHub /> 

        <ServiceGrid />

        <section className="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl text-slate-300">
          <h2 className="text-xl font-bold text-white mb-4">Mais de 20 anos de excelência em TI Jurídica</h2>
          <p className="leading-relaxed">
            A advBR.info possui mais de 20 anos de excelência no mercado de tecnologia e segurança digital...
          </p>
        </section>
      </main>
    </div>
  );
}
