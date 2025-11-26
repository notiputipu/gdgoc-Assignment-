import { db } from './db.js';

// Helper to parse pagination query into numbers
function parsePaginationQuery(query) {
  // query.page and query.per_page come as strings from req.query
  let page = Number(query.page || '1');       // default page = 1
  let perPage = Number(query.per_page || '10'); // default per_page = 10

  // Basic safety: avoid weird values
  if (Number.isNaN(page) || page < 1) page = 1;
  if (Number.isNaN(perPage) || perPage < 1) perPage = 10;
  if (perPage > 100) perPage = 100; // optional limit

  const offset = (page - 1) * perPage;

  return { page, perPage, offset };
}

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

// BASIC LIST
export function listMenusBasic() {
  const rows = db.prepare('SELECT * FROM menus ORDER BY id ASC').all();
  return rows.map(row => ({
    id: row.id,
    name: row.name,
    category: row.category,
    calories: row.calories,
    price: row.price,
    ingredients: JSON.parse(row.ingredients),
    description: row.description,
    created_at: row.created_at,
    updated_at: row.updated_at,
  }));
}

// LIST WITH FILTERS + PAGINATION
export function listMenusWithFilters(query) {
    const { page, perPage } = parsePaginationQuery(query);

  const conditions = [];
  const params = {};

  if (query.q) {
    conditions.push('(name LIKE @q OR category LIKE @q OR description LIKE @q OR ingredients LIKE @q)');
    params.q = `%${query.q}%`;
  }

  if (query.category) {
    conditions.push('category = @category');
    params.category = query.category;
  }

  if (query.min_price) {
    conditions.push('price >= @min_price');
    params.min_price = Number(query.min_price);
  }

  if (query.max_price) {
    conditions.push('price <= @max_price');
    params.max_price = Number(query.max_price);
  }

  if (query.max_cal) {
    conditions.push('calories <= @max_cal');
    params.max_cal = Number(query.max_cal);
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  // Sorting
  let sortField = 'id';
  let sortDir = 'ASC';

  if (query.sort) {
    const [field, dir] = query.sort.split(':');
    const allowedFields = ['price', 'calories', 'created_at', 'name'];
    const allowedDir = ['asc', 'desc'];

    if (allowedFields.includes(field)) sortField = field;
    if (allowedDir.includes((dir || '').toLowerCase())) sortDir = dir.toUpperCase();
  }

  const totalStmt = db.prepare(`SELECT COUNT(*) as count FROM menus ${whereClause}`);
  const { count: total } = totalStmt.get(params);

  const offset = (page - 1) * perPage;

  const rows = db.prepare(`
    SELECT * FROM menus
    ${whereClause}
    ORDER BY ${sortField} ${sortDir}
    LIMIT @limit OFFSET @offset
  `).all({ ...params, limit: perPage, offset });

  return {
    data: rows.map(mapRow),
    pagination: buildPaginationMeta({ total, page, perPage }),
  };
}

// FULL-TEXT SEARCH
export function searchMenus(query) {
  const { q, page, per_page } = query;

  const searchTerm = (q || '').trim();
  const { page: pageNum, perPage, offset } = parsePaginationQuery({
    page,
    per_page,
  });

  const like = `%${searchTerm}%`;

  const baseWhere = `
    FROM menus
    WHERE name LIKE @like
       OR description LIKE @like
       OR ingredients LIKE @like
  `;

  // 1) total count
  const totalRow = db
    .prepare(`SELECT COUNT(*) as total ${baseWhere}`)
    .get({ like });
  const total = totalRow.total;

  // 2) paginated rows
  const rows = db
    .prepare(
      `SELECT * ${baseWhere}
       ORDER BY id ASC
       LIMIT @limit OFFSET @offset`
    )
    .all({
      like,
      limit: perPage,
      offset,
    });

  const data = rows.map((row) => ({
    id: row.id,
    name: row.name,
    category: row.category,
    calories: row.calories,
    price: row.price,
    ingredients: JSON.parse(row.ingredients),
    description: row.description,
  }));

  const totalPages = total > 0 ? Math.ceil(total / perPage) : 1;

  return {
    data,
    pagination: {
      total,
      page: pageNum,
      per_page: perPage,
      total_pages: totalPages,
    },
  };
}
