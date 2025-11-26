import { db } from './db.js';

export function groupMenuByCategoryCount() {
  const rows = db.prepare(`
    SELECT category, COUNT(*) as count
    FROM menus
    GROUP BY category
  `).all();

  const result = {};
  for (const row of rows) {
    result[row.category] = row.count;
  }
  return result;
}

export function groupMenuByCategoryList(perCategory = 5) {
  const rows = db.prepare(`
    SELECT * FROM menus
    ORDER BY category, price ASC
  `).all();

  const grouped = {};
  for (const row of rows) {
    if (!grouped[row.category]) {
      grouped[row.category] = [];
    }
    if (grouped[row.category].length < perCategory) {
      grouped[row.category].push({
        id: row.id,
        name: row.name,
        category: row.category,
        price: row.price,
      });
    }
  }
  return grouped;
}
