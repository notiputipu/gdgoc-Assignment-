import { db } from './db.js';

function mapRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    calories: row.calories,
    price: row.price,
    ingredients: JSON.parse(row.ingredients),
    description: row.description,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

//CREATE
export function createMenu(data) {
  const now = new Date().toISOString();

  const stmt = db.prepare(`
    INSERT INTO menus (name, category, calories, price, ingredients, description, created_at, updated_at)
    VALUES (@name, @category, @calories, @price, @ingredients, @description, @created_at, @updated_at)
  `);

  const info = stmt.run({
    name: data.name,
    category: data.category,
    calories: data.calories,
    price: data.price,
    ingredients: JSON.stringify(data.ingredients),
    description: data.description,
    created_at: now,
    updated_at: now,
  });

  const row = db
    .prepare('SELECT * FROM menus WHERE id = ?')
    .get(info.lastInsertRowid);

  return mapRow(row);
}

//READ by id
export function getMenuById(id) {
  const row = db.prepare('SELECT * FROM menus WHERE id = ?').get(id);
  return mapRow(row);
}

//UPDATE
export function updateMenu(id, data) {
  const existing = getMenuById(id);
  if (!existing) return null;

  const now = new Date().toISOString();

  const stmt = db.prepare(`
    UPDATE menus
    SET name = @name,
        category = @category,
        calories = @calories,
        price = @price,
        ingredients = @ingredients,
        description = @description,
        updated_at = @updated_at
    WHERE id = @id
  `);

  stmt.run({
    id,
    name: data.name,
    category: data.category,
    calories: data.calories,
    price: data.price,
    ingredients: JSON.stringify(data.ingredients),
    description: data.description,
    updated_at: now,
  });

  return getMenuById(id);
}

//DELETE
export function deleteMenu(id) {
  const stmt = db.prepare('DELETE FROM menus WHERE id = ?');
  const info = stmt.run(id);
  return info.changes > 0;
}
