import Header from "../components/ui/Header";
import Ticker from "../components/ui/Ticker";
import ServiceGrid from "../components/ServiceGrid";
import PortalCarousel from "../components/features/PortalCarousel";
import JurisdictionHub from "../components/features/JurisdictionHub";
import PdfToolHub from "../components/features/PdfToolHub"; // <-- ADICIONE ISSO

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

        {/* Aqui está o seu módulo de PDF que agora vai aparecer */}
        <PdfToolHub /> 

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
