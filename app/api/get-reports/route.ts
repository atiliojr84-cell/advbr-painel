import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export const dynamic = 'force-dynamic'; // Garante que a rota seja dinâmica

export async function GET() {
  try {
    // Busca todas as chaves que começam com 'report:'
    const reportKeys = await kv.keys('report:*');

    if (reportKeys.length === 0) {
      return NextResponse.json({ reports: [] }, { status: 200 });
    }

    // Busca os valores para todas as chaves encontradas
    const reports = await kv.mget<any[]>(...reportKeys);

    // Filtra reports nulos (se alguma chave não existir mais) e ordena por timestamp
    const validReports = reports.filter(report => report !== null).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return NextResponse.json({ reports: validReports }, { status: 200 });

  } catch (error) {
    console.error('Erro ao buscar reports:', error);
    return NextResponse.json({ error: 'Erro interno do servidor ao buscar os reports.' }, { status: 500 });
  }
}
