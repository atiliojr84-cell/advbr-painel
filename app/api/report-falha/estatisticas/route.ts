import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("advbr_reports_db");
    // Mudamos para a coleção correta que armazena o status
    const collection = db.collection("status_do_tribunal");

    // Buscamos os status mais recentes de cada portal
    const statsResult = await collection.aggregate([
      { $sort: { criadoEm: -1 } },
      { $group: { _id: "$portal", status: { $first: "$status" }, count: { $sum: 1 } } }
    ]).toArray();

    return NextResponse.json({ success: true, stats: { statusGeral: statsResult } });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Erro ao carregar status" }, { status: 500 });
  }
}
