import {
  createMenu,
  getMenuById,
  updateMenu,
  deleteMenu,
} from '../../models/menuCrud.js';

// POST /menu
export async function createMenuHandler(req, res, next) {
  try {
    const body = req.body;
    const menu = createMenu(body);
    return res.status(201).json({
      message: 'Menu created successfully',
      data: menu,
    });
  } catch (err) {
    next(err);
  }
}

// GET /menu/id
export async function getMenuByIdHandler(req, res, next) {
  try {
    const id = Number(req.params.id);
    const menu = getMenuById(id);
    if (!menu) {
      return res.status(404).json({ message: 'Menu not found' });
    }
    return res.json({ data: menu });
  } catch (err) {
    next(err);
  }
}

// PUT /menu/id
export async function updateMenuHandler(req, res, next) {
  try {
    const id = Number(req.params.id);
    const body = req.body;
    const updated = updateMenu(id, body);
    if (!updated) {
      return res.status(404).json({ message: 'Menu not found' });
    }
    return res.json({
      message: 'Menu updated successfully',
      data: updated,
    });
  } catch (err) {
    next(err);
  }
}

// DELETE /menu/id
export async function deleteMenuHandler(req, res, next) {
  try {
    const id = Number(req.params.id);
    const ok = deleteMenu(id);
    if (!ok) {
      return res.status(404).json({ message: 'Menu not found' });
    }
    return res.json({ message: 'Menu deleted successfully' });
  } catch (err) {
    next(err);
  }
}
