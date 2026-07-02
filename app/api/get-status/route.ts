import { NextResponse } from 'next/server';
import { Filter } from "mongodb";
import clientPromise from '../../../lib/mongodb';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("advbr_reports_db");
    const collection = db.collection("court_statuses");

    const doc = await collection.findOne({ _id: "current_statuses" } as Filter<any>);

    return NextResponse.json({
      statuses: doc?.data || {},
      pings: doc?.pings || {},
      lastUpdate: doc?.updatedAt || null
    });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar dados no MongoDB' }, { status: 500 });
  }
}