import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const statuses = await kv.get('court_statuses') || {};
  const pings = await kv.get('court_pings') || {};

  return NextResponse.json({ statuses, pings });
}
