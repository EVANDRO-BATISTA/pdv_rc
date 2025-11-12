import { NextResponse } from 'next/server';
import { openDb } from '@/lib/database';

// 🗑️ DELETE: Exclui um item
export async function DELETE(request, { params }) {
  const { id } = params; // Obtém o ID da URL (ex: /api/items/5)

  try {
    const db = await openDb();
    const result = await db.run('DELETE FROM items WHERE id = ?', id);

    if (result.changes === 0) {
      return NextResponse.json({ message: 'Item não encontrado' }, { status: 404 });
    }

    return NextResponse.json({ message: `Item com ID ${id} excluído com sucesso` }, { status: 200 });
  } catch (error) {
    console.error(`Erro ao excluir item ${id}:`, error);
    return NextResponse.json({ message: 'Erro interno do servidor ao excluir' }, { status: 500 });
  }
}

// ✍️ PUT/PATCH: Atualiza um item existente
export async function PUT(request, { params }) {
  const { id } = params;
  
  try {
    const { name, description } = await request.json();
    if (!name) {
      return NextResponse.json({ message: 'O nome é obrigatório' }, { status: 400 });
    }

    const db = await openDb();
    const result = await db.run(
      'UPDATE items SET name = ?, description = ? WHERE id = ?',
      [name, description, id]
    );

    if (result.changes === 0) {
      return NextResponse.json({ message: 'Item não encontrado ou dados idênticos' }, { status: 404 });
    }

    // Opcional: Retorna o item atualizado
    const updatedItem = await db.get('SELECT * FROM items WHERE id = ?', id);
    return NextResponse.json(updatedItem, { status: 200 });

  } catch (error) {
    console.error(`Erro ao atualizar item ${id}:`, error);
    return NextResponse.json({ message: 'Erro interno do servidor ao atualizar' }, { status: 500 });
  }
}
