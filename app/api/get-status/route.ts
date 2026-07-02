import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("advbr_reports_db");
    
    // A coleção correta é 'status_do_tribunal'
    const collection = db.collection("status_do_tribunal");

    // Buscamos o primeiro documento que contém o status
    const doc = await collection.findOne({});

    if (!doc) {
      return NextResponse.json({ statuses: {}, pings: {} });
    }

    // Retorna os dados mapeados para o que o carrossel espera
    return NextResponse.json({
      statuses: doc.dad || {},
      pings: doc.pings || {}
    });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar dados' }, { status: 500 });
  }
}
