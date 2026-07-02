import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("advbr_reports_db");
    const collection = db.collection("falhas");

    const reports = await collection.find({}).sort({ createdAt: -1 }).limit(200).toArray();
    
    // Retorna o objeto esperado pelo frontend
    return NextResponse.json({ reports });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao listar." }, { status: 500 });
  }
}