import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const statuses = await kv.get('court_statuses') || {};
    const pings = await kv.get('court_pings') || {};
    const lastUpdate = await kv.get('last_update') || null;

    return NextResponse.json({
      statuses,
      pings,
      lastUpdate
    });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar dados' }, { status: 500 });
  }
}
