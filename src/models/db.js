import Database from 'better-sqlite3';
import dotenv from 'dotenv';

dotenv.config();

const dbFile = process.env.DB_FILE || './data/menu.db';

// Create one shared db connection
export const db = new Database(dbFile);

// create table
db.exec(`
  CREATE TABLE IF NOT EXISTS menus (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    calories INTEGER NOT NULL,
    price REAL NOT NULL,
    ingredients TEXT NOT NULL,
    description TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )
`);
