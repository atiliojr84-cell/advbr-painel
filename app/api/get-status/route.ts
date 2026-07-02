// app/api/get-status/route.ts
import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("advbr_reports_db");
    
    // A coleção correta é 'court_statuses'
    const collection = db.collection("court_statuses");

    // Buscamos o documento específico com _id: "current_statuses"
    // Este é o documento que contém os status atuais.
    const doc = await collection.findOne({ _id: "current_statuses" });

    if (!doc) {
      console.warn("Documento de status não encontrado na coleção 'court_statuses' com _id: 'current_statuses'.");
      return NextResponse.json({ statuses: {}, pings: {}, lastUpdate: null });
    }

    // Retorna os dados mapeados para o que o frontend espera
    // O campo de atualização é 'updatedAt'
    const lastUpdateValue = doc.updatedAt ? new Date(doc.updatedAt).toISOString() : null;

    return NextResponse.json({
      statuses: doc.data || {}, // O campo de dados é 'data', não 'dad'
      pings: doc.pings || {},
      lastUpdate: lastUpdateValue
    });
  } catch (error) {
    console.error("Erro ao buscar dados de status:", error);
    return NextResponse.json({ error: 'Erro interno ao buscar dados de status' }, { status: 500 });
  }
}
