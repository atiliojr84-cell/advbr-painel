// app/api/report-falha/route.ts
import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type IncomingReport = {
  portal: string;
  problema: string;
  createdAt?: string;
};

export async function POST(request: Request) {
  console.log("--- INÍCIO DA FUNÇÃO POST /api/report-falha ---"); // Log 1
  console.log("API /api/report-falha POST request received."); // Log 2

  // NOVO LOG DE VERIFICAÇÃO DE VARIÁVEIS DE AMBIENTE
  console.log("KV_REST_API_URL:", process.env.KV_REST_API_URL ? "Configurado" : "NÃO CONFIGURADO");
  console.log("KV_REST_API_TOKEN:", process.env.KV_REST_API_TOKEN ? "Configurado" : "NÃO CONFIGURADO");

  try {
    const body = (await request.json()) as IncomingReport;
    console.log("Request body:", body); // Log 3

    if (!body.portal || !body.problema) {
      console.error("Missing portal or problema in request body."); // Log 4
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
    console.log("Report object to be saved:", report); // Log 5

    console.log("Attempting to push report to KV list 'reports:falhas'..."); // Log 6

    try {
      // Adicionando um console.error antes e depois do lpush para garantir visibilidade
      console.error("DEBUG: Executando kv.lpush..."); // NOVO LOG DE DEBUG
      await kv.lpush("reports:falhas", JSON.stringify(report));
      console.error("DEBUG: kv.lpush executado com sucesso."); // NOVO LOG DE DEBUG
      console.log("Report successfully pushed to KV list 'reports:falhas'."); // Log 7
    } catch (lpushError) {
      console.error("ERRO ESPECÍFICO NO KV.LPUSH:", lpushError); // Log 8
      // Se o lpush falhar, vamos retornar um erro para o frontend para que a falha seja visível
      return NextResponse.json(
        { error: "Falha ao salvar o reporte no banco de dados." },
        { status: 500 }
      );
    }

    // Opcional: limitar tamanho da lista (ex: últimos 200 relatos)
    await kv.ltrim("reports:falhas", 0, 199);
    console.log("KV list 'reports:falhas' trimmed."); // Log 9

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Erro geral ao registrar falha na API:", error); // Log 10
    console.error("Verifique se as variáveis de ambiente KV_REST_API_URL e KV_REST_API_TOKEN estão configuradas no Vercel.");
    return NextResponse.json(
      { error: "Erro ao registrar falha." },
      { status: 500 }
    );
  }
}
