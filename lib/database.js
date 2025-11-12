import * as sqlite from 'sqlite';
import sqlite3 from 'sqlite3';

// Variável global para armazenar a instância do DB.
let db = null;

export async function openDb() {
  if (db) {
    return db;
  }

  // Abre a conexão com o banco de dados. O arquivo 'database.sqlite' será criado.
  db = await sqlite.open({
    filename: './database.sqlite',
    driver: sqlite3.Database,
  });

  // Garante que a tabela 'items' exista
  await db.exec(`
    CREATE TABLE IF NOT EXISTS items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT
    );
  `);

  return db;
}
