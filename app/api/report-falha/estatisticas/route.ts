import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("advbr_reports_db");
    const collection = db.collection("falsas");

    // Subtraímos 365 dias para garantir que pegamos registros antigos também
    // Isso evita que o filtro de data exclua acidentalmente seus dados
    const dataLimite = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString();

    const getStats = async () => {
      return await collection.aggregate([
        { $match: { criadoEm: { $gte: dataLimite } } },
        { $group: { _id: "$portal", count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]).toArray();
    };

    const statsResult = await getStats();

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
    return NextResponse.json({ success: false, error: "Erro ao carregar" }, { status: 500 });
  }
}
