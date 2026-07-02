import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.portal || !body.problema) {
      return NextResponse.json(
        { error: "Portal e problema são obrigatórios." },
        { status: 400 }
      );
    }

    const report = {
      portal: body.portal,
      problema: body.problema,
      createdAt: new Date().toISOString(),
    };

    const client = await clientPromise;
    const db = client.db("advbr_reports_db");
    const collection = db.collection("falhas");

    const result = await collection.insertOne(report);

    return NextResponse.json({ ok: true, insertedId: result.insertedId });
  } catch (error) {
    console.error("Erro no Reporte:", error);
    return NextResponse.json(
      { error: "Erro interno no servidor." },
      { status: 500 }
    );
  }
}