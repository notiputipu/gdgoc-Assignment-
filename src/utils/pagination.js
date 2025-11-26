export function parsePaginationQuery(query) {
  const page = Math.max(parseInt(query.page || '1', 10), 1);
  const perPage = Math.max(Math.min(parseInt(query.per_page || '10', 10), 100), 1);
  return { page, perPage };
}

export function buildPaginationMeta({ total, page, perPage }) {
  const totalPages = Math.ceil(total / perPage) || 1;
  return { total, page, per_page: perPage, total_pages: totalPages };
}
