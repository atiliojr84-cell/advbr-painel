import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("advbr_reports_db");
    const collection = db.collection("falsas");

    // Buscamos sem filtro para ver se a API consegue ler a coleção
    const statsResult = await collection.aggregate([
      { $group: { _id: "$portal", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]).toArray();

    return NextResponse.json({ 
      success: true, 
      stats: {
        horas12: statsResult,
        horas24: statsResult,
        semana1: statsResult,
        mes1: statsResult,
        ano1: statsResult
      }
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Erro ao carregar dados" }, { status: 500 });
  }
}
