import { Response } from 'express';
import Task from '../models/Task.js';
import Project from '../models/Project.js';
import { AuthRequest } from '../middleware/authenication.js';

export async function createTask(req: AuthRequest, res: Response) {
  const body = req.body as {
    title: string;
    description?: string;
    status?: 'todo' | 'in-progress' | 'done';
    dueDate?: string;
  };

  const projectId = req.params.projectId;

  if (!body.title)
    return res.status(400).json({ message: 'Title required' });
  if (body.dueDate) {
    const dueDate = new Date(body.dueDate);
    const now = new Date();

    if (isNaN(dueDate.getTime()) || dueDate <= now) {
      return res.status(400).json({
        message: 'Due date must be a valid date in the future.',
      });
    }
  }

  try {
    const project = await Project.findOne({ _id: projectId, owner: req.user?.id });

    if (!project)
      return res.status(404).json({ message: 'Project not found' });

    const task = await Task.create({
      title: body.title,
      description: body.description,
      status: body.status ?? 'todo',
      dueDate: body.dueDate ? new Date(body.dueDate) : undefined,
      project: projectId,
    });

    res.status(201).json({
      message: 'Task added successfully.',
      Task: task,
    });
  } catch (err: any) {
    res.status(500).json({ message: 'Create task failed', error: err.message });
  }
}


export async function listTasks(req: AuthRequest, res: Response) {
  const projectId = req.params.projectId;
  const status = req.query.status as string | undefined;

  try {
    const project = await Project.findOne({ _id: projectId, owner: req.user?.id });

    if (!project) 
        return res.status(404).json({ message: 'Project not found' });

    const filter: any = { project: projectId };
    if (status) filter.status = status;

    const tasks = await Task.find(filter).sort({ dueDate: 1 });
    res.status(201).json({
        message: 'Tasks successfully fetched.',
        Task: tasks
    });
  } catch (err: any) {
    res.status(500).json({ message: 'List tasks failed', error: err.message });
  }
}

export async function getTask(req: AuthRequest, res: Response) {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) 
        return res.status(404).json({ message: 'Task not found' });

    const project = await Project.findOne({ _id: task.project, owner: req.user?.id });

    if (!project) 
        return res.status(403).json({ message: 'Not allowed' });

    res.status(201).json({
        message: 'Tasks successfully fetched by Id.',
        Tasks: task
    });;
  } catch (err: any) {
    res.status(500).json({ message: 'Get task failed', error: err.message });
  }
}

export async function updateTask(req: AuthRequest, res: Response) {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) 
        return res.status(404).json({ message: 'Task not found' });

    const project = await Project.findOne({ _id: task.project, owner: req.user?.id });

    if (!project) 
        return res.status(403).json({ message: 'Not allowed' });

    const updated = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(201).json({
        message: 'Task updated successfully.',
        updatedTask: updated
    });
  } catch (err: any) {
    res.status(500).json({ message: 'Update task failed', error: err.message });
  }
}

export async function deleteTask(req: AuthRequest, res: Response) {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) 
        return res.status(404).json({ message: 'Task not found' });

    const project = await Project.findOne({ _id: task.project, owner: req.user?.id });
    
    if (!project)
         return res.status(403).json({ message: 'Not allowed' });

    await Task.findByIdAndDelete(req.params.id);
    res.status(201).json({
        message: 'Task Deleted successfully.'
    });
  } catch (err: any) {
    res.status(500).json({ message: 'Delete task failed', error: err.message });
  }
}
