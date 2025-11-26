import {groupMenuByCategoryCount, groupMenuByCategoryList} from '../../models/menuStats.js';
import {listMenusBasic, listMenusWithFilters, searchMenus} from '../../models/menuQueries.js';

// GET /menu  
export async function listMenuBasicHandler(req, res, next) {
  try {
    const data = listMenusBasic();
    return res.json({ data });
  } catch (err) {
    next(err);
  }
}

// GET /menu with filters & pagination.
export async function listMenuWithFiltersHandler(req, res, next) {
  try {
    const result = listMenusWithFilters(req.query);
    return res.json(result);
  } catch (err) {
    next(err);
  }
}

// GET /menu/group-by-category
export async function groupByCategoryHandler(req, res, next) {
  try {
    const mode = req.query.mode || 'count';

    if (mode === 'count') {
      const data = groupMenuByCategoryCount();
      return res.json({ data });
    }

    const perCategory = Number(req.query.per_category || '5');
    const data = groupMenuByCategoryList(perCategory);
    return res.json({ data });
  } catch (err) {
    next(err);
  }
}

// GET /menu/search
export async function searchMenuHandler(req, res, next) {
  try {
    const result = searchMenus(req.query);
    return res.json(result);
  } catch (err) {
    next(err);
  }
}
