import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("advbr_reports_db");
    
    // Acessa a coleção correta conforme a sua imagem
    const collection = db.collection("status_do_tribunal");

    // findOne retorna o primeiro objeto que encontrar, sem precisar de ID específico
    const doc = await collection.findOne({});

    // Se o documento existe, retorna os campos 'dad' e 'pings' que estão nele
    return NextResponse.json({
      statuses: doc?.dad || {},
      pings: doc?.pings || {},
      lastUpdate: doc?.atualizaEm || null
    });
  } catch (error) {
    return NextResponse.json({ 
      statuses: {}, 
      pings: {}, 
      error: 'Erro ao buscar dados' 
    }, { status: 500 });
  }
}
