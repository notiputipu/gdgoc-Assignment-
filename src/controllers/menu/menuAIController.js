import { getMenuRiskGroups } from '../../services/geminiService.js';
import { getMenuById } from '../../models/menuModel.js';


export async function getMenuRiskGroupsHandler(req, res, next) {
  try {
    const id = Number(req.params.id);
    const menu = getMenuById(id);

    if (!menu) {
      return res.status(404).json({ message: 'Menu not found' });
    }

    const insights = await analyzeMenu(menu);

    if (!insights) {
      return res.status(503).json({
        message: 'AI insights are currently unavailable',
      });
    }

    return res.json({
      data: {
        menu_id: menu.id,
        name: menu.name,
        category: menu.category,
        ai_insights: insights,
      },
    });
  } catch (err) {
    next(err);
  }
}
