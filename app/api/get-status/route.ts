import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

// Força o Next.js a ler do banco de dados em tempo real, sem cache
export const dynamic = 'force-dynamic';
export const revalidate = 0; 

export async function GET() {
  try {
    const statuses = await kv.get('court_statuses') || {};
    return NextResponse.json(statuses);
  } catch (error) {
    return NextResponse.json({}, { status: 500 });
  }
}
