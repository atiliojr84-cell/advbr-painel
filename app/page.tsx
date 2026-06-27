import Header from "../components/ui/Header";
import Ticker from "../components/ui/Ticker";
import ServiceGrid from "../components/ServiceGrid";
import PortalCarousel from "../components/features/PortalCarousel";
import JurisdictionHub from "../components/features/JurisdictionHub";
import DiagnosticHub from "../components/features/DiagnosticHub";
import { kv } from '@vercel/kv'; // <-- 1. IMPORTAMOS O BANCO DE DADOS AQUI

import dynamic from 'next/dynamic'; 
import { Loader2 } from 'lucide-react'; 

// 2. FORÇAMOS A PÁGINA A SEMPRE PEGAR O DADO MAIS NOVO (SEM CACHE)
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const DynamicPdfToolHub = dynamic(() => import('../components/features/PdfToolHub'), {
  ssr: false, 
  loading: () => (
    <div className="flex justify-center items-center h-40 text-white">
      <Loader2 className="animate-spin text-blue-500" size={32} /> Carregando Ferramentas PDF...
    </div>
  ),
});

// 3. TRANSFORMAMOS A FUNÇÃO EM 'ASYNC' PARA LER O BANCO
export default async function Home() {
  // 4. PUXAMOS OS STATUS REAIS DOS ROBÔS
  const statuses = await kv.get('court_statuses') || {};

  return (
    <div className="min-h-screen bg-[#0b0f19]">
      <Ticker />

      <main className="p-4 md:p-8 max-w-7xl mx-auto space-y-12">
        <Header />

        <section>
          <h2 className="text-lg font-semibold mb-4 text-gray-300 flex items-center gap-2">
            <i className="fa-solid fa-star text-blue-500"></i> Principais Portais de Peticionamento
          </h2>
          {/* 5. INJETAMOS OS STATUS DIRETAMENTE NO CARROSSEL */}
          <PortalCarousel statuses={statuses as Record<string, string>} />
        </section>

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
