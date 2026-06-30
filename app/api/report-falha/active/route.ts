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
    const allReports: StoredReport[] = (raw || [])
      .map((item) => {
        try {
          return JSON.parse(item as string);
        } catch {
          return null;
        }
      })
      .filter(Boolean) as StoredReport[];

    const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000); // 12 horas em milissegundos

    // Filtra os reportes que foram criados nas últimas 12 horas
    const activeReports = allReports.filter((report) => {
      const reportDate = new Date(report.createdAt);
      return reportDate > twelveHoursAgo;
    });

    // Opcional: Para facilitar o consumo no frontend, podemos agrupar por portal
    // ou retornar uma lista simples. Para o ícone, uma lista simples é suficiente.
    return NextResponse.json({ activeReports });
  } catch (error) {
    console.error("Erro ao buscar reportes ativos de falhas:", error);
    return NextResponse.json(
      { error: "Erro ao buscar reportes ativos de falhas." },
      { status: 500 }
    );
  }
}
