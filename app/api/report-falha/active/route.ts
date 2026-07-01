// app/api/report-falha/active/route.ts
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
    console.log("Raw data from KV lrange for active reports:", raw); // Log para ver o que vem do KV

    const allReports: StoredReport[] = (raw || [])
      .map((item) => {
        try {
          // Garante que o item é uma string antes de tentar o JSON.parse
          if (typeof item === 'string') {
            return JSON.parse(item);
          }
          console.warn("Item from KV for active reports is not a string, skipping:", item);
          return null;
        } catch (parseError) {
          console.error("Erro ao fazer JSON.parse de item do KV para active reports:", item, parseError);
          return null;
        }
      })
      .filter(Boolean) as StoredReport[]; // Remove quaisquer itens nulos resultantes de erros de parse

    // Aumentado para 7 dias para fins de depuração, conforme combinado
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // 7 dias em milissegundos

    // Filtra os reportes que foram criados nos últimos 7 dias
    const activeReports = allReports.filter((report) => {
      const reportDate = new Date(report.createdAt);
      return reportDate > sevenDaysAgo;
    });

    console.log("Filtered active reports:", activeReports); // Log para ver os relatórios ativos após o filtro

    return NextResponse.json({ activeReports });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Erro ao buscar reportes ativos de falhas na API:", errorMessage);
    console.error("Verifique se as variáveis de ambiente KV_REST_API_URL e KV_REST_API_TOKEN estão configuradas no Vercel.");
    return NextResponse.json(
      { error: "Erro ao buscar reportes ativos de falhas.", details: errorMessage },
      { status: 500 }
    );
  }
}
