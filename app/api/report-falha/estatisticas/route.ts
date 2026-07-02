import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("advbr_reports_db");
    const collection = db.collection("falsas");

    const agora = new Date();
    
    // Convertemos para ISO string para comparar com o formato texto do seu banco
    const periodos = {
      horas12: new Date(agora.getTime() - 12 * 60 * 60 * 1000).toISOString(),
      horas24: new Date(agora.getTime() - 24 * 60 * 60 * 1000).toISOString(),
      semana1: new Date(agora.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      mes1: new Date(agora.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      ano1: new Date(agora.getTime() - 365 * 24 * 60 * 60 * 1000).toISOString()
    };

    const getStats = async (dataInicioIso: string) => {
      return await collection.aggregate([
        // Comparamos String com String, que é como está no seu banco
        { $match: { criadoEm: { $gte: dataInicioIso } } },
        { $group: { _id: "$portal", count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]).toArray();
    };

    const stats = {
      horas12: await getStats(periodos.horas12),
      horas24: await getStats(periodos.horas24),
      semana1: await getStats(periodos.semana1),
      mes1: await getStats(periodos.mes1),
      ano1: await getStats(periodos.ano1)
    };

    return NextResponse.json({ success: true, stats });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Erro ao carregar estatísticas" }, { status: 500 });
  }
}
