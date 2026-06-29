import { Metadata } from "next";
import Header from "../components/ui/Header";
import DiagnosticHub from "../components/features/DiagnosticHub";
import { kv } from '@vercel/kv';

import dynamicComponent from 'next/dynamic';
import { Loader2 } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const DynamicPdfToolHub = dynamicComponent(() => import('../components/features/PdfToolHub'), {
  loading: () => <Loader2 className="h-8 w-8 animate-spin text-blue-500" />,
  ssr: false,
});

export const metadata: Metadata = {
  title: "ADVBR Painel",
  description: "Monitoramento de portais de peticionamento e ferramentas para advogados.",
};

export default async function Home() {
  const lastUpdate = await kv.get('last_update') as string | null;

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 sm:p-8">
      <Header />
      <main className="container mx-auto mt-8">
        <DiagnosticHub lastUpdate={lastUpdate} />
        <DynamicPdfToolHub />
      </main>
    </div>
  );
}
