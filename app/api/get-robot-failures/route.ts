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
    const collection
