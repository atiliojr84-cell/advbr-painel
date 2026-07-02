import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("advbr_reports_db");
    const collection = db.collection("status_do_tribunal");

    // Buscamos o documento mantendo a estrutura encontrada no Atlas
    const doc = await collection.findOne({});

    if (!doc) {
      return NextResponse.json({ statuses: {}, pings: {} });
    }

    // O seu componente espera "statuses" e "pings". 
    // Vamos garantir que ele leia do documento, independentemente da estrutura interna.
    return NextResponse.json({
      statuses: doc.dad || {},
      pings: doc.pings || {},
      lastUpdate: doc.atualizaEm || null
    });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar dados' }, { status: 500 });
  }
}
