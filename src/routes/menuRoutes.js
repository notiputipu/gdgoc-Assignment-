import express from 'express';
import { getMenuRiskGroupsHandler } from '../controllers/menu/menuAIController.js';
import { createMenuHandler, getMenuByIdHandler, updateMenuHandler, deleteMenuHandler } from '../controllers/menu/menuCrudController.js';
import { listMenuBasicHandler, listMenuWithFiltersHandler, groupByCategoryHandler, searchMenuHandler } from '../controllers/menu/menuQueryController.js';

const router = express.Router();

// POST /menu
router.post('/', createMenuHandler);

// GET /menu basic
router.get('/', listMenuBasicHandler);

// GET /menu with filters & pagination
router.get('/', listMenuWithFiltersHandler); 

// GET /menu/group-by-category
router.get('/group-by-category', groupByCategoryHandler);

// GET /menu/search
router.get('/search', searchMenuHandler);

// GET /menu/id
router.get('/:id', getMenuByIdHandler);

// PUT /menu/id
router.put('/:id', updateMenuHandler);

// DELETE /menu/id
router.delete('/:id', deleteMenuHandler);

// Risk group
router.get('/menu/:id/risk-groups', getMenuRiskGroupsHandler);

export default router;
