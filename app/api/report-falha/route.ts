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
  try {
    const body = (await request.json()) as IncomingReport;

    if (!body.portal || !body.problema) {
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

    // Guardar no KV como lista (lista de relatos)
    // usamos uma chave única, por exemplo "reports:falhas"
    await kv.lpush("reports:falhas", JSON.stringify(report));

    // Opcional: limitar tamanho da lista (ex: últimos 200 relatos)
    await kv.ltrim("reports:falhas", 0, 199);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Erro ao registrar falha:", error);
    return NextResponse.json(
      { error: "Erro ao registrar falha." },
      { status: 500 }
    );
  }
}
