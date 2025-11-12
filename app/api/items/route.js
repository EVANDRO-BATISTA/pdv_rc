import { NextResponse } from 'next/server';
import { openDb } from '@/lib/database';

// 📚 GET: Lista todos os itens
export async function GET() {
  try {
    const db = await openDb();
    const items = await db.all('SELECT * FROM items');
    return NextResponse.json(items, { status: 200 });
  } catch (error) {
    console.error('Erro ao buscar itens:', error);
    return NextResponse.json({ message: 'Erro ao buscar itens' }, { status: 500 });
  }
}

// ✨ POST: Cria um novo item
export async function POST(request) {
  try {
    const { name, description } = await request.json();
    if (!name) {
      return NextResponse.json({ message: 'O nome é obrigatório' }, { status: 400 });
    }

    const db = await openDb();
    const result = await db.run(
      'INSERT INTO items (name, description) VALUES (?, ?)',
      [name, description]
    );

    // Retorna o item recém-criado, incluindo o ID gerado
    return NextResponse.json({
      id: result.lastID,
      name,
      description
    }, { status: 201 });

  } catch (error) {
    console.error('Erro ao criar item:', error);
    return NextResponse.json({ message: 'Erro ao criar item' }, { status: 500 });
  }
}
