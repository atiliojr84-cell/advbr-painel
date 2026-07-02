// app/page.tsx
import Header from "../components/ui/Header";
import Ticker from "../components/ui/Ticker";
import ServiceGrid from "../components/ServiceGrid";
import PortalCarousel from "../components/features/PortalCarousel";
import JurisdictionHub from "../components/features/JurisdictionHub";
import DiagnosticHub from "../components/features/DiagnosticHub";
import ProductCarousel from "../components/features/ProductCarousel";
import Footer from "../components/ui/Footer";
import nextDynamic from "next/dynamic";
import { Loader2, Briefcase } from "lucide-react";

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

// Função para buscar os dados de status
async function getStatusData() {
  try {
    // Chamada direta à API interna, como se fosse uma função local
    // Isso é possível em Server Components no Next.js
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/get-status`, {
      cache: 'no-store', // Garante que os dados sejam sempre frescos
    });

    if (!res.ok) {
      console.error(`Erro ao buscar dados de status: ${res.status} ${res.statusText}`);
      return { statuses: {}, pings: {}, lastUpdate: null };
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Falha ao buscar dados de status:", error);
    return { statuses: {}, pings: {}, lastUpdate: null };
  }
}

export default async function Home() { // Adicionado 'async' aqui
  const { statuses, pings } = await getStatusData(); // Chama a função para obter os dados

  return (
    <div className="min-h-screen bg-[#0b0f19]">
      <Ticker />
      <Header />

      <main className="p-4 md:p-8 max-w-7xl mx-auto space-y-12">
        <section>
          <div className="flex justify-between items-end mb-4">
            <h2 className="text-lg font-semibold text-gray-300 flex items-center gap-2">
              <i className="fa-solid fa-star text-blue-500"></i> Principais Portais de Peticionamento
            </h2>
          </div>
          <PortalCarousel
            statuses={statuses} // Agora passando os statuses da API
            pings={pings}       // Agora passando os pings da API
          />
        </section>

        <JurisdictionHub />
        <DynamicPdfToolHub />
        <DiagnosticHub />
        <ServiceGrid />

        <section>
          <h2 className="text-xl font-bold text-white mb-4">Produtos de Informática</h2>
          <ProductCarousel />
        </section>

        <section className="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl text-slate-300">
          <h2 className="text-2xl font-bold text-white mb-4 text-center flex items-center justify-center gap-2">
            <Briefcase className="w-7 h-7 text-blue-500" />
            Nossa Expertise: Mais de Duas Décadas Dedicadas à Tecnologia
          </h2>
          <p className="leading-relaxed text-center max-w-3xl mx-auto">
            Com uma trajetória de mais de 20 anos ininterruptos na área de Tecnologia da Informação, nossa paixão e foco sempre foram a excelência.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
