// app/api/get-robot-failures/route.ts

import { MongoClient, ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';

// Certifique-se de que a variável de ambiente MONGODB_URI está configurada no seu .env.local e no Vercel
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri!); // O '!' afirma que uri não será nulo

export async function GET(request: Request) {
  if (!uri) {
    return NextResponse.json({ error: 'MONGODB_URI não configurada.' }, { status: 500 });
  }

  try {
    await client.connect();
    const database = client.db('advbr_reports_db'); // Nome do seu banco de dados
    const collection = database.collection('robot_failures_log'); // Nome da sua nova coleção

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '12h'; // Padrão para 12 horas

    let startDate: Date;
    const now = new Date();

    switch (period) {
      case '12h':
        startDate = new Date(now.getTime() - 12 * 60 * 60 * 1000);
        break;
      case '24h':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '1y':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 12 * 60 * 60 * 1000); // Padrão
    }

    const pipeline = [
      {
        $match: {
          timestamp: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$portalName',
          failureCount: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          portalName: '$_id',
          failureCount: 1
        }
      },
      {
        $sort: { failureCount: -1 } // Ordena do maior para o menor número de falhas
      }
    ];

    const result = await collection.aggregate(pipeline).toArray();

    return NextResponse.json({ robotFailures: result });

  } catch (error) {
    console.error('Erro ao buscar falhas do robô:', error);
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 });
  } finally {
    // É importante fechar a conexão do cliente MongoDB após cada requisição
    // Em ambientes serverless como Vercel, a conexão pode ser reutilizada,
    // mas fechar explicitamente garante que não haja vazamento de conexões.
    // No entanto, para Next.js App Router, é comum manter a conexão aberta
    // e reutilizá-la. Para simplificar, vamos remover o client.close() aqui
    // e gerenciar a conexão de forma mais persistente se necessário.
    // client.close(); // Removido para evitar problemas de conexão em ambientes serverless
  }
}
