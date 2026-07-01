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

    const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000); // 12 horas em milissegundos

    // Filtra os reportes que foram criados nas últimas 12 horas
    const activeReports = allReports.filter((report) => {
      const reportDate = new Date(report.createdAt);
      return reportDate > twelveHoursAgo;
    });

    console.log("Filtered active reports:", activeReports); // Log para ver os relatórios ativos após o filtro

    // Opcional: Para facilitar o consumo no frontend, podemos agrupar por portal
    // ou retornar uma lista simples. Para o ícone, uma lista simples é suficiente.
    return NextResponse.json({ activeReports });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Erro ao buscar reportes ativos de falhas na API:", errorMessage);
    // Adicionei este log para ver se o erro está relacionado às variáveis de ambiente do KV
    console.error("Verifique se as variáveis de ambiente KV_REST_API_URL e KV_REST_API_TOKEN estão configuradas no Vercel.");
    return NextResponse.json(
      { error: "Erro ao buscar reportes ativos de falhas.", details: errorMessage },
      { status: 500 }
    );
  }
}
