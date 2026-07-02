// app/api/get-status/route.ts
import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';
// Importar ObjectId do mongodb para tipagem, se necessário, mas vamos evitar por enquanto
// import { ObjectId } from 'mongodb'; 

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("advbr_reports_db");
    
    // A coleção correta é 'court_statuses' (confirmado pelas suas imagens)
    const collection = db.collection("court_statuses");

    // Buscamos o documento específico com _id: "current_statuses"
    // O erro de tipo ocorre porque o _id é uma string e não um ObjectId.
    // O driver do MongoDB geralmente lida com isso, mas o TypeScript reclama.
    // Vamos forçar o tipo para any para o _id na query para o TypeScript parar de reclamar.
    const doc = await collection.findOne({ _id: "current_statuses" as any });

    if (!doc) {
      console.warn("Documento de status não encontrado na coleção 'court_statuses' com _id: 'current_statuses'.");
      return NextResponse.json({ statuses: {}, pings: {}, lastUpdate: null });
    }

    // Retorna os dados mapeados para o que o frontend espera
    // O campo de dados é 'data' e o campo de atualização é 'updatedAt'
    const lastUpdateValue = doc.updatedAt ? new Date(doc.updatedAt).toISOString() : null;

    return NextResponse.json({
      statuses: doc.data || {}, // O campo de dados é 'data', não 'dad'
      pings: doc.pings || {},
      lastUpdate: lastUpdateValue
    });
  } catch (error) {
    console.error("Erro ao buscar dados de status:", error);
    return NextResponse.json({ error: 'Erro interno ao buscar dados de status' }, { status: 500 });
  }
}
