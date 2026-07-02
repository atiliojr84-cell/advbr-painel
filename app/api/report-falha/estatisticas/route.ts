import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("advbr_reports_db");
    
    // Buscamos o documento mais recente da coleção de status
    const statusDoc = await db.collection("status_do_tribunal")
      .find({})
      .sort({ atualizadoEm: -1 })
      .limit(1)
      .toArray();

    // Extraímos os dados de status e pings conforme o componente espera
    const dad = statusDoc[0]?.dad || {};
    const pings = statusDoc[0]?.pings || {};

    return NextResponse.json({ 
      statuses: dad, 
      pings: pings 
    });
  } catch (error) {
    return NextResponse.json({ statuses: {}, pings: {} }, { status: 500 });
  }
}
