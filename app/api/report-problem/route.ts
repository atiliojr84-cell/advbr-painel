import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export const dynamic = 'force-dynamic'; // Garante que a rota seja dinâmica

interface ReportData {
  tribunalName: string;
  tribunalUrl: string;
  problemType: string;
  timestamp: string;
}

export async function POST(request: Request) {
  try {
    const { tribunalName, tribunalUrl, problemType, timestamp }: ReportData = await request.json();

    if (!tribunalName || !tribunalUrl || !problemType || !timestamp) {
      return NextResponse.json({ error: 'Dados incompletos para o reporte.' }, { status: 400 });
    }

    // Gera um ID único para o report (ex: timestamp + nome do tribunal)
    const reportId = `report:${timestamp}-${tribunalName.replace(/\s/g, '_')}-${Math.random().toString(36).substring(2, 9)}`;

    // Salva o report no Vercel KV
    await kv.set(reportId, {
      tribunalName,
      tribunalUrl,
      problemType,
      timestamp,
      status: 'pending' // Status inicial do report
    });

    return NextResponse.json({ message: 'Reporte salvo com sucesso!', reportId }, { status: 200 });

  } catch (error) {
    console.error('Erro ao salvar reporte:', error);
    return NextResponse.json({ error: 'Erro interno do servidor ao processar o reporte.' }, { status: 500 });
  }
}
