// app/api/report-falha/route.ts
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb"; // Ajuste o caminho se seu arquivo mongodb.ts estiver em outro lugar

export const dynamic = "force-dynamic";
export const revalidate = 0;

type IncomingReport = {
  portal: string;
  problema: string;
  createdAt?: string;
};

export async function POST(request: Request) {
  console.log("--- INÍCIO DA FUNÇÃO POST /api/report-falha - MongoDB ---");

  try {
    const body = (await request.json()) as IncomingReport;
    console.log("Request body received:", body);

    if (!body.portal || !body.problema) {
      console.error("Missing portal or problema in request body.");
      return NextResponse.json(
        { error: "Portal e problema são obrigatórios." },
        { status: 400 }
      );
    }

    const report = {
      portal: body.portal,
      problema: body.problema,
      createdAt: body.createdAt || new Date().toISOString(),
    };
    console.log("Report object to be saved:", report);

    // Conecta ao MongoDB
    const client = await clientPromise;
    const db = client.db("advbr_reports_db"); // Nome do seu banco de dados no MongoDB Atlas
    const collection = db.collection("falhas"); // Nome da coleção onde os reportes serão salvos

    console.log("Attempting to insert report into MongoDB...");
    const result = await collection.insertOne(report);
    console.log("Report inserted into MongoDB:", result.insertedId);

    console.log("--- FIM DA FUNÇÃO POST /api/report-falha - MongoDB ---");
    return NextResponse.json({ ok: true, insertedId: result.insertedId });
  } catch (error) {
    console.error("Erro geral na API de reporte (MongoDB):", error);
    return NextResponse.json(
      { error: "Erro ao processar o reporte com MongoDB." },
      { status: 500 }
    );
  }
}
