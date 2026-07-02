import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("advbr_reports_db");
    
    // Busca o documento de status mais recente
    const doc = await db.collection("status_do_tribunal").find({}).sort({ atualizaEm: -1 }).limit(1).toArray();
    const dados = doc[0]?.dad || {};
    const pings = doc[0]?.pings || {};

    // Mapeamento que traduz os nomes do banco para as chaves do seu PortalCarousel
    const tradutor: Record<string, string> = {
      "[Sul - Paraná] TJPR ": "E-proc TJPR",
      "[Tribunais Federais] TRF3 ": "TRF3",
      "[Tribunais Federais] PJe Nacional ": "PJe Nacional",
      "[São Paulo] e-SAJ SP ": "e-SAJ SP",
      "[Sul - Paraná] Projudi TJPR ": "Projudi TJPR",
      "[Supremo] STF ": "STF",
      "[Superior] STJ ": "STJ",
      "[Trabalhista] TRT9 PJe ": "TRT9",
      "[Trabalhista] TRT9 2º Grau ": "TRT9 2º Grau",
      "[Tribunais Federais] TRF4 ": "TRF4"
    };

    const statuses: Record<string, string> = {};
    
    // Converte os status do banco para as chaves esperadas pelo carrossel
    Object.keys(tradutor).forEach((keyBanco) => {
      const keyCarrossel = tradutor[keyBanco];
      statuses[keyCarrossel] = dados[keyBanco] || "online";
    });

    return NextResponse.json({ statuses, pings });
  } catch (error) {
    return NextResponse.json({ statuses: {}, pings: {} }, { status: 500 });
  }
}
