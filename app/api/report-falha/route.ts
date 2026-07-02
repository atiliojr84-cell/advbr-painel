import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(request: Request) {
  try {
    const json = await request.json();

    if (!json.portal || !json.problema) {
      return NextResponse.json({ error: "Dados incompletos" }, { status: 400 });
    }

    const report = {
      portal: json.portal,
      problema: json.problema,
      createdAt: new Date().toISOString(),
    };

    const client = await clientPromise;
    const db = client.db("advbr_reports_db");
    const collection = db.collection("falhas");

    await collection.insertOne(report);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Erro fatal ao salvar no MongoDB:", error);
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}