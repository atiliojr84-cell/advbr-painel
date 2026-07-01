// app/api/report-falha/list/route.ts
import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type StoredReport = {
  portal: string;
  problema: string;
  createdAt: string;
};

export async function GET() {
  try {
    const raw = await kv.lrange("reports:falhas", 0, -1); // Pega todos os reportes
    console.log("Raw data from KV lrange for list reports:", raw); // Log para ver o que vem do KV

    const allReports: StoredReport[] = (raw || [])
      .map((item) => {
        try {
          if (typeof item === 'string') {
            return JSON.parse(item);
          }
          console.warn("Item from KV for list reports is not a string, skipping:", item);
          return null;
        } catch (parseError) {
          console.error("Erro ao fazer JSON.parse de item do KV para list reports:", item, parseError);
          return null;
        }
      })
      .filter(Boolean) as StoredReport[]; // Remove quaisquer itens nulos resultantes de erros de parse

    console.log("All reports from KV for list:", allReports); // NOVO LOG AQUI

    return NextResponse.json({ reports: allReports });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Erro ao buscar lista de reportes de falhas na API:", errorMessage);
    console.error("Verifique se as variáveis de ambiente KV_REST_API_URL e KV_REST_API_TOKEN estão configuradas no Vercel.");
    return NextResponse.json(
      { error: "Erro ao buscar lista de reportes de falhas.", details: errorMessage },
      { status: 500 }
    );
  }
}
