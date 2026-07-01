// app/api/report-falha/route.ts
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type IncomingReport = {
  portal: string;
  problema: string;
  createdAt?: string;
};

export async function POST(request: Request) {
  console.log("--- INÍCIO DA FUNÇÃO POST /api/report-falha - TESTE SIMPLIFICADO ---"); // NOVO LOG CLARO
  console.log("API /api/report-falha POST request received.");

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
      status: "Reporte recebido com sucesso (KV desativado para teste)." // Mensagem de sucesso
    };
    console.log("Simplified report object:", report);

    // NESTA VERSÃO, NÃO HÁ CONEXÃO COM KV. APENAS RETORNA SUCESSO.
    // console.log("Attempting to push report to KV list 'reports:falhas'...");
    // await kv.lpush("reports:falhas", JSON.stringify(report));
    // console.log("Report successfully pushed to KV list 'reports:falhas'.");
    // await kv.ltrim("reports:falhas", 0, 199);
    // console.log("KV list 'reports:falhas' trimmed.");

    console.log("--- FIM DA FUNÇÃO POST /api/report-falha - TESTE SIMPLIFICADO ---");
    return NextResponse.json({ ok: true, receivedReport: report }); // Retorna o reporte recebido
  } catch (error) {
    console.error("Erro geral na API de reporte simplificada:", error);
    return NextResponse.json(
      { error: "Erro ao processar o reporte simplificado." },
      { status: 500 }
    );
  }
}
