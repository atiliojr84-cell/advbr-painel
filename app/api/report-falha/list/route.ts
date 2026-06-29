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
    // Pegamos até 200 registros (mesmo limite do ltrim)
    const raw = await kv.lrange("reports:falhas", 0, 199);

    const reports: StoredReport[] = (raw || [])
      .map((item) => {
        try {
          return JSON.parse(item as string);
        } catch {
          return null;
        }
      })
      .filter(Boolean) as StoredReport[];

    return NextResponse.json({ reports });
  } catch (error) {
    console.error("Erro ao buscar relatório de falhas:", error);
    return NextResponse.json(
      { error: "Erro ao buscar relatório de falhas." },
      { status: 500 }
    );
  }
}
