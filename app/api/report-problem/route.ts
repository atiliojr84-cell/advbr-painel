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
    const body: ReportData = await request.json();
    const { tribunalName, tribunalUrl, problemType, timestamp } = body;

    console.log("DEBUG (Backend): Dados recebidos na API:", body); // Log completo do body
    console.log(`DEBUG (Backend): tribunalName: '${tribunalName}' (valid: ${!!tribunalName})`);
    console.log(`DEBUG (Backend): tribunalUrl: '${tribunalUrl}' (valid: ${!!tribunalUrl})`);
    console.log(`DEBUG (Backend): problemType: '${problemType}' (valid: ${!!problemType})`);
    console.log(`DEBUG (Backend): timestamp: '${timestamp}' (valid: ${!!timestamp})`);


    if (!tribunalName || !tribunalUrl || !problemType || !timestamp) {
      console.error("DEBUG (Backend): Validação falhou - Dados incompletos.");
      // Adiciona mais detalhes ao erro para depuração
      const missingFields = [];
      if (!tribunalName) missingFields.push('tribunalName');
      if (!tribunalUrl) missingFields.push('tribunalUrl');
      if (!problemType) missingFields.push('problemType');
      if (!timestamp) missingFields.push('timestamp');

      return NextResponse.json({
        error: `Dados incompletos para o reporte. Campos faltando: ${missingFields.join(', ')}.`,
        missingFields: missingFields
      }, { status: 400 });
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

    console.log("DEBUG (Backend): Reporte salvo com sucesso:", reportId);
    return NextResponse.json({ message: 'Reporte salvo com sucesso!', reportId }, { status: 200 });

  } catch (error) {
    console.error('DEBUG (Backend): Erro interno do servidor ao processar o reporte:', error);
    return NextResponse.json({ error: 'Erro interno do servidor ao processar o reporte.' }, { status: 500 });
  }
}
