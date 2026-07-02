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

    // Buscamos o documento mais recente na coleção, ordenando pelo campo 'atualiza...'
    // e pegando apenas o primeiro resultado.
    const doc = await collection.findOne({}, { sort: { 'atualiza...': -1 } });

    if (!doc) {
      // Se não encontrar o documento, retorna objetos vazios e lastUpdate nulo
      console.warn("Documento de status não encontrado na coleção 'status_do_tribunal'.");
      return NextResponse.json({ statuses: {}, pings: {}, lastUpdate: null });
    }

    // Retorna os dados mapeados para o que o frontend espera
    // Mapeamos o campo 'atualiza...' para 'lastUpdate'
    const lastUpdateValue = doc['atualiza...'] ? new Date(doc['atualiza...']).toISOString() : null;

    return NextResponse.json({
      statuses: doc.dad || {},
      pings: doc.pings || {},
      lastUpdate: lastUpdateValue
    });
  } catch (error) {
    console.error("Erro ao buscar dados de status:", error);
    return NextResponse.json({ error: 'Erro interno ao buscar dados de status' }, { status: 500 });
  }
}
