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
  console.log("--- INÍCIO DA FUNÇÃO POST /api/report-falha ---"); // NOVO LOG ADICIONADO AQUI
  console.log("API /api/report-falha POST request received."); // Log 1

  // NOVO LOG DE VERIFICAÇÃO DE VARIÁVEIS DE AMBIENTE
  console.log("KV_REST_API_URL:", process.env.KV_REST_API_URL ? "Configurado" : "NÃO CONFIGURADO");
  console.log("KV_REST_API_TOKEN:", process.env.KV_REST_API_TOKEN ? "Configurado" : "NÃO CONFIGURADO");

  try {
    const body = (await request.json()) as IncomingReport;
    console.log("Request body:", body); // Log 2

    if (!body.portal || !body.problema) {
      console.error("Missing portal or problema in request body."); // Log 3
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
    console.log("Report object to be saved:", report); // Log 4

    // Guardar no KV como lista (lista de relatos)
    // usamos uma chave única, por exemplo "reports:falhas"
    // Alterado para usar a chave "reports:falhas"

    console.log("Attempting to push report to KV list 'reports:falhas'..."); // Log 5
    try { // NOVO TRY...CATCH ESPECÍFICO PARA O LPUSH
      await kv.lpush("reports:falhas", JSON.stringify(report));
      console.log("Report successfully pushed to KV list 'reports:falhas'."); // Log 6 (agora mais confiável)
    } catch (lpushError) {
      console.error("ERRO ESPECÍFICO NO KV.LPUSH:", lpushError); // NOVO LOG DE ERRO
      // Se o lpush falhar, podemos decidir se queremos continuar ou retornar um erro.
      // Por enquanto, vamos apenas logar e continuar para ver se o ltrim ainda é executado.
    }


    // Opcional: limitar tamanho da lista (ex: últimos 200 relatos)
    // Alterado para usar a chave "reports:falhas"
    await kv.ltrim("reports:falhas", 0, 199);
    console.log("KV list 'reports:falhas' trimmed."); // Log 7

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Erro geral ao registrar falha na API:", error); // Log 8 (modificado para "geral")
    console.error("Verifique se as variáveis de ambiente KV_REST_API_URL e KV_REST_API_TOKEN estão configuradas no Vercel.");
    return NextResponse.json(
      { error: "Erro ao registrar falha." },
      { status: 500 }
    );
  }
}
