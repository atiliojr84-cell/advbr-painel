import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("advbr_reports_db");
    const collection = db.collection("falhas");

    const agora = new Date();
    const periodos = {
      horas12: new Date(agora.getTime() - 12 * 60 * 60 * 1000),
      horas24: new Date(agora.getTime() - 24 * 60 * 60 * 1000),
      semana1: new Date(agora.getTime() - 7 * 24 * 60 * 60 * 1000),
      mes1: new Date(agora.getTime() - 30 * 24 * 60 * 60 * 1000),
      ano1: new Date(agora.getTime() - 365 * 24 * 60 * 60 * 1000)
    };

    const getStats = async (dataInicio: Date) => {
      return await collection.aggregate([
        { $match: { createdAt: { $gte: dataInicio } } },
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