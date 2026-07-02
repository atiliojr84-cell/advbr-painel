// app/api/get-status/route.ts
import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("advbr_reports_db");
    
    const collection = db.collection("status_do_tribunal");

    // Buscamos o documento específico que contém "_eu ia": "status_atuais"
    // Isso garante que estamos pegando o documento correto e atual.
    const doc = await collection.findOne({ "_eu ia": "status_atuais" });

    if (!doc) {
      // Se não encontrar o documento, retorna objetos vazios
      return NextResponse.json({ statuses: {}, pings: {}, lastUpdate: null });
    }

    // Retorna os dados mapeados para o que o frontend espera
    // Incluímos o campo 'atualiza...' como 'lastUpdate'
    return NextResponse.json({
      statuses: doc.dad || {},
      pings: doc.pings || {},
      lastUpdate: doc['atualiza...'] ? new Date(doc['atualiza...']).toISOString() : null // Mapeia o campo 'atualiza...' para 'lastUpdate'
    });
  } catch (error) {
    console.error("Erro ao buscar dados de status:", error); // Adicionado log para depuração
    return NextResponse.json({ error: 'Erro ao buscar dados' }, { status: 500 });
  }
}
