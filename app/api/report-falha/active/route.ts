import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("advbr_reports_db");
    const collection = db.collection("falhas");

    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    
    // Busca os registros dos últimos 7 dias no MongoDB
    const activeReports = await collection.find({
      createdAt: { $gte: sevenDaysAgo.toISOString() }
    }).toArray();

    return NextResponse.json({ activeReports });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar reportes." }, { status: 500 });
  }
}