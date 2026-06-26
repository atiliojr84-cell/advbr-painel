import Header from "../components/ui/Header";
import Ticker from "../components/ui/Ticker";
import ServiceGrid from "../components/ServiceGrid";
import PortalCarousel from "../components/features/PortalCarousel";
import JurisdictionHub from "../components/features/JurisdictionHub";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0b0f19]">
      {/* Ticker de Notícias no topo absoluto */}
      <Ticker />
      
      <main className="p-4 md:p-8 max-w-7xl mx-auto space-y-12">
        {/* Cabeçalho com Botões de Ação */}
        <Header />

        {/* Hub de Peticionamento: 10 portais principais */}
        <section>
            <h2 className="text-lg font-semibold mb-4 text-gray-300 flex items-center gap-2">
                <i className="fa-solid fa-star text-blue-500"></i> Principais Portais de Peticionamento
            </h2>
            <PortalCarousel />
        </section>

        {/* Módulo F: Serviços Corporativos */}
        <ServiceGrid />

        {/* Novo Módulo de Jurisdições */}
        <JurisdictionHub />

        {/* Seção Know-How Institucional */}
        <section className="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl text-slate-300">
          <h2 className="text-xl font-bold text-white mb-4">Mais de 20 anos de excelência em TI Jurídica</h2>
          <p className="leading-relaxed">
            A ADVBR.INFO possui mais de 20 anos de excelência no mercado de tecnologia e segurança digital. 
            Há mais de 15 anos, dedicamos nossa expertise exclusivamente às necessidades do ecossistema jurídico, 
            prestando serviços de infraestrutura de TI para grandes escritórios e entidades de classe, como a OAB Maringá. 
            Entendemos a urgência dos seus prazos e a criticidade do sigilo dos seus processos. 
            Não somos apenas suporte técnico, somos parceiros estratégicos do seu escritório.
          </p>
        </section>
      </main>
    </div>
  );
}
