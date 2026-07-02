import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("advbr_reports_db");
    
    // Busca o documento mais recente da coleção status_do_tribunal
    const doc = await db.collection("status_do_tribunal")
      .find({})
      .sort({ atualizaEm: -1 })
      .limit(1)
      .toArray();

    const dados = doc[0]?.dad || {};
    const pings = doc[0]?.pings || {};

    // Mapeamento para garantir que as chaves do banco batam com o PortalCarousel
    const normalizedStatuses: Record<string, string> = {
      "PJe Nacional": dados["PJe Nacional"] || "online",
      "E-proc TJPR": dados["E-proc TJPR"] || "online",
      "e-SAJ SP": dados["e-SAJ SP"] || "online",
      "Projudi TJPR": dados["Projudi TJPR"] || "online",
      "STF": dados["STF"] || "online",
      "STJ": dados["STJ"] || "online",
      "TRT9": dados["TRT9"] || "online",
      "TRT9 2º Grau": dados["TRT9 2º Grau"] || "online",
      "TRF3": dados["TRF3"] || "online",
      "TRF4": dados["TRF4"] || "online"
    };

    return NextResponse.json({ 
      statuses: normalizedStatuses, 
      pings: pings 
    });
  } catch (error) {
    return NextResponse.json({ statuses: {}, pings: {} }, { status: 500 });
  }
}
