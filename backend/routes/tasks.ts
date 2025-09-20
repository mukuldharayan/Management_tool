import { Router } from 'express';
import { verifyToken } from '../middleware/authenication.js';
import { getTask, updateTask, deleteTask } from '../controller/taskController.js';

const router = Router();

router.use(verifyToken);

router.get('/:id', getTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

export default router;
