// app/api/report-falha/list/route.ts
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb"; // Ajuste o caminho se seu arquivo mongodb.ts estiver em outro lugar

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  console.log("--- INÍCIO DA FUNÇÃO GET /api/report-falha/list - MongoDB ---");

  try {
    const client = await clientPromise;
    const db = client.db("advbr_reports_db"); // Nome do seu banco de dados no MongoDB Atlas
    const collection = db.collection("falhas"); // Nome da coleção onde os reportes estão salvos

    console.log("Attempting to fetch reports from MongoDB...");
    const reports = await collection.find({}).sort({ createdAt: -1 }).limit(200).toArray(); // Busca os 200 mais recentes
    console.log(`Fetched ${reports.length} reports from MongoDB.`);

    console.log("--- FIM DA FUNÇÃO GET /api/report-falha/list - MongoDB ---");
    return NextResponse.json(reports);
  } catch (error) {
    console.error("Erro ao listar reportes (MongoDB):", error);
    return NextResponse.json(
      { error: "Erro ao listar reportes com MongoDB." },
      { status: 500 }
    );
  }
}
