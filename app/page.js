'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Estado para gerenciar qual item está sendo editado
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');

  // 1. Função para carregar os itens (READ)
  const fetchItems = async () => {
    try {
      const res = await fetch('/api/items');
      const data = await res.json();
      setItems(data);
    } catch (error) {
      console.error('Falha ao carregar itens:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // 2. Função para adicionar um novo item (CREATE)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, description }),
      });

      if (res.ok) {
        fetchItems();
        setName('');
        setDescription('');
      } else {
        alert('Erro ao criar item.');
      }
    } catch (error) {
      console.error('Falha ao adicionar item:', error);
    }
  };

  // 3. Função para Excluir um item (DELETE)
  const handleDelete = async (id) => {
    if (!confirm('Tem certeza que deseja excluir este item?')) return;
    
    try {
      const res = await fetch(`/api/items/${id}`, {
        method: 'DELETE',
      });
      
      if (res.ok) {
        // Remove da lista local e recarrega
        setItems(items.filter(item => item.id !== id));
      } else {
        alert('Erro ao excluir item.');
      }
    } catch (error) {
      console.error('Falha ao excluir item:', error);
    }
  };

  // 4. Funções para o Formulário de Edição (UPDATE)
  const handleEdit = (item) => {
    setEditingId(item.id);
    setEditName(item.name);
    setEditDescription(item.description || '');
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/items/${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: editName, description: editDescription }),
      });

      if (res.ok) {
        // Atualiza a lista e sai do modo de edição
        fetchItems();
        setEditingId(null);
      } else {
        alert('Erro ao atualizar item.');
      }
    } catch (error) {
      console.error('Falha ao atualizar item:', error);
    }
  };


  if (loading) return <p>Carregando...</p>;

  return (
    <main style={{ padding: '20px' }}>
      <h1>CRUD Completo com Next.js e SQLite</h1>

      <h2>Criar Novo Item</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px', marginBottom: '30px' }}>
        <input
          type="text"
          placeholder="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <textarea
          placeholder="Descrição (opcional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button type="submit">Adicionar Item</button>
      </form>

      <hr style={{ margin: '20px 0' }} />

      <h2>Lista de Itens</h2>
      {items.length === 0 ? (
        <p>Nenhum item encontrado.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {items.map((item) => (
            <li key={item.id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
              {editingId === item.id ? (
                // Modo de Edição
                <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        required
                    />
                    <textarea
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                    />
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button type="submit">Salvar</button>
                        <button type="button" onClick={() => setEditingId(null)}>Cancelar</button>
                    </div>
                </form>
              ) : (
                // Modo de Visualização
                <div>
                    <strong>{item.name}</strong>: {item.description || 'Sem descrição'} (ID: {item.id})
                    <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
                        <button onClick={() => handleEdit(item)}>Editar</button>
                        <button onClick={() => handleDelete(item.id)}>Excluir</button>
                    </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
