import express from 'express';
import menuRoutes from './menuRoutes.js';
const router = express.Router();

// All /menu- endpoints
router.use('/menu', menuRoutes);

export default router;