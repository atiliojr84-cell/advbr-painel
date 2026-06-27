import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export const revalidate = 0; 

export async function GET() {
  try {
    const statuses = await kv.get('court_statuses') || {};
    return NextResponse.json(statuses);
  } catch (error) {
    return NextResponse.json({}, { status: 500 });
  }
}
