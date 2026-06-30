import Header from "../components/ui/Header"; // Caminho de importação ajustado
import Ticker from "../components/ui/Ticker";
import ServiceGrid from "../components/ServiceGrid";
import PortalCarousel from "../components/features/PortalCarousel";
import JurisdictionHub from "../components/features/JurisdictionHub";
import DiagnosticHub from "../components/features/DiagnosticHub";
import ProductCarousel from "../components/features/ProductCarousel";
import Footer from "../components/ui/Footer"; // Importado o novo componente Footer
// import ProblemReporter from "../components/features/ProblemReporter"; // Removido, pois já está no Header
import { kv } from "@vercel/kv";

import nextDynamic from "next/dynamic";
import { Loader2, Briefcase } from "lucide-react"; // Importado Briefcase

export const dynamic = "force-dynamic";
export const revalidate = 0;

const DynamicPdfToolHub = nextDynamic(
  () => import("../components/features/PdfToolHub"),
  {
    ssr: false,
    loading: () => (
      <div className="flex justify-center items-center h-40 text-white">
        <Loader2 className="animate-spin text-blue-500" size={32} />
        Carregando Ferramentas PDF...
      </div>
    ),
  }
);

export default async function Home() {
  const statuses = (await kv.get("court_statuses")) || {};
  const pings = (await kv.get("court_pings")) || {};

  return (
    <div className="min-h-screen bg-[#0b0f19]">
      <Ticker />

      {/* Renderiza o componente Header diretamente. Ele já contém sua própria tag <header> */}
      <Header />

      <main className="p-4 md:p-8 max-w-7xl mx-auto space-y-12">
        <section>
          <div className="flex justify-between items-end mb-4">
            <h2 className="text-lg font-semibold text-gray-300 flex items-center gap-2">
              <i className="fa-solid fa-star text-blue-500"></i> Principais
              Portais de Peticionamento
            </h2>
          </div>
          <PortalCarousel
            statuses={statuses as Record<string, string>}
            pings={pings as Record<string, number>}
          />
        </section>

        <JurisdictionHub />
        <DynamicPdfToolHub />
        <DiagnosticHub />
        <ServiceGrid />

        <section>
          <h2 className="text-xl font-bold text-white mb-4">
            Produtos de Informática
          </h2>
          <ProductCarousel />
        </section>

        {/* Seção "Nossa Expertise" - Texto atualizado */}
        <section className="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl text-slate-300">
          <h2 className="text-2xl font-bold text-white mb-4 text-center flex items-center justify-center gap-2">
            <Briefcase className="w-7 h-7 text-blue-500" /> {/* Ícone de maleta */}
            Nossa Expertise: Mais de Duas Décadas Dedicadas à Tecnologia
          </h2>
          <p className="leading-relaxed text-center max-w-3xl mx-auto">
            Com uma trajetória de **mais de 20 anos ininterruptos na área de Tecnologia da Informação**, nossa paixão e foco sempre foram a excelência. Ao longo dessas duas décadas, construímos uma sólida especialização no **atendimento empresarial**, compreendendo as dinâmicas e exigências de diversos setores.
            <br /><br />
            Nos últimos **15 anos**, direcionamos nossa expertise de forma aprofundada para o **segmento jurídico**. Essa especialização nasceu da nossa **experiência direta e contínua com diversos clientes advogados e escritórios de advocacia**, onde desenvolvemos um conhecimento ímpar sobre as necessidades tecnológicas e operacionais desses profissionais.
            <br /><br />
            Essa experiência nos permitiu dominar os desafios específicos do ambiente jurídico, desde a segurança de dados sensíveis até a otimização de sistemas para prazos e processos. Nosso compromisso é oferecer soluções de TI que não apenas funcionem, mas que impulsionem a produtividade, garantam a segurança e simplifiquem o dia a dia dos profissionais do direito.
          </p>
        </section>
      </main>

      <Footer /> {/* Renderizado o novo componente Footer aqui */}
    </div>
  );
}
