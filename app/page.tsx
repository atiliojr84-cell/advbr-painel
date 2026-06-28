import Header from "../components/ui/Header";
import Ticker from "../components/ui/Ticker";
import ServiceGrid from "../components/ServiceGrid";
import PortalCarousel from "../components/features/PortalCarousel";
import JurisdictionHub from "../components/features/JurisdictionHub";
import DiagnosticHub from "../components/features/DiagnosticHub";
import { kv } from '@vercel/kv';

import nextDynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const DynamicPdfToolHub = nextDynamic(() => import('../components/features/PdfToolHub'), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center h-40 text-white">
      <Loader2 className="animate-spin text-blue-500" size={32} /> Carregando Ferramentas PDF...
    </div>
  ),
});

export default async function Home() {
  const statuses = await kv.get('court_statuses') || {};
  const pings = await kv.get('court_pings') || {};
  // lastUpdate ainda é buscado, mas não será exibido diretamente aqui
  const lastUpdate = await kv.get('last_update') || 'Aguardando robôs...';

  return (
    <div className="min-h-screen bg-[#0b0f19]">
      <Ticker />

      <main className="p-4 md:p-8 max-w-7xl mx-auto space-y-12">
        <Header />

        <section>
          <div className="flex justify-between items-end mb-4">
            <h2 className="text-lg font-semibold text-gray-300 flex items-center gap-2">
              <i className="fa-solid fa-star text-blue-500"></i> Principais Portais de Peticionamento
            </h2>
            {/* REMOVIDO: A exibição de "Última verificação" foi removida daqui */}
          </div>
          <PortalCarousel
            statuses={statuses as Record<string, string>}
            pings={pings as Record<string, number>}
          />
        </section>

        {/* Componente JurisdictionHub agora exibirá a data e hora completa */}
        <JurisdictionHub />

        <DynamicPdfToolHub />

        <DiagnosticHub />

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
