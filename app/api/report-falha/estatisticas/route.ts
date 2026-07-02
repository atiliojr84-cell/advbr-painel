import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("advbr_reports_db");
    const collection = db.collection("falsas");

    // Buscamos os últimos documentos e agrupamos por portal
    const data = await collection.find({}).sort({ criadoEm: -1 }).toArray();

    return NextResponse.json({ 
      success: true, 
      stats: {
        horas12: data,
        horas24: data,
        semana1: data,
        mes1: data,
        ano1: data
      }
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Erro ao ler a coleção" }, { status: 500 });
  }
}
