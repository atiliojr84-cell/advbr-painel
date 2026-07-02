import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("advbr_reports_db");
    // Corrigido para buscar na coleção que realmente existe no seu Atlas
    const collection = db.collection("status_do_tribunal");

    // Busca o documento que contém os dados atuais
    const doc = await collection.findOne({});

    if (!doc) {
      return NextResponse.json({ statuses: {}, pings: {} });
    }

    return NextResponse.json({
      statuses: doc.dad || {},
      pings: doc.pings || {},
      lastUpdate: doc.atualizaEm || null
    });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar dados no MongoDB' }, { status: 500 });
  }
}
