import { Router } from 'express';
import { TaskController } from '../controllers/taskController';
import { requireAuth } from '../middleware/authMiddleware';

const router = Router();

// Protect all task endpoints
router.use(requireAuth);

router.get('/', TaskController.getTasks);
router.post('/', TaskController.createTask);
router.get('/:id', TaskController.getTaskById);
router.put('/:id', TaskController.updateTask);
router.delete('/:id', TaskController.deleteTask);

export default router;
