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
  console.log("API /api/report-falha POST request received."); // Log 1

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
    // ALTERAÇÃO AQUI: Mudando a chave para reports:falhas_TESTE
    await kv.lpush("reports:falhas_TESTE", JSON.stringify(report));
    console.log("Report successfully pushed to KV list 'reports:falhas_TESTE'."); // Log 5

    // Opcional: limitar tamanho da lista (ex: últimos 200 relatos)
    await kv.ltrim("reports:falhas_TESTE", 0, 199);
    console.log("KV list 'reports:falhas_TESTE' trimmed."); // Log 6

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Erro ao registrar falha na API:", error); // Log 7
    // Adicionei este log para ver se o erro está relacionado às variáveis de ambiente do KV
    console.error("Verifique se as variáveis de ambiente KV_REST_API_URL e KV_REST_API_TOKEN estão configuradas no Vercel.");
    return NextResponse.json(
      { error: "Erro ao registrar falha." },
      { status: 500 }
    );
  }
}
