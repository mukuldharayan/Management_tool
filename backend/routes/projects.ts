import { Router } from 'express';
import { verifyToken } from '../middleware/authenication.js';
import {
  createProject,
  listProjects,
  getProject,
  updateProject,
  deleteProject
} from '../controller/projectController.js';
import { createTask, listTasks } from '../controller/taskController.js';

const router = Router();

router.use(verifyToken);

router.get('/list', listProjects);
router.post('/create', createProject);
router.get('/:id', getProject);
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);

// tasks under projects
router.post('/:projectId/tasks', createTask);
router.get('/:projectId/tasks', listTasks);

export default router;
