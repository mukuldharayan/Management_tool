import { Response } from 'express';
import Project from '../models/Project.js';
import Task from '../models/Task.js';
import { AuthRequest } from '../middleware/authenication.js';

export async function createProject(req: AuthRequest, res: Response) {
  const userId = req.user?.id;
  
  if (!userId) 
    return res.status(401).json({ message: 'Unauthorized' });

  const body = req.body as { title: string; description?: string; status?: 'active' | 'completed' };

  if (!body.title)
     return res.status(400).json({ message: 'Title required' });

  try {
    const project = await Project.create({
      title: body.title,
      description: body.description,
      status: body.status ?? 'active',
      owner: userId,
    });
    res.status(201).json({
        message: 'Project created successfully.',
        Project: project
    });
  } catch (err: any) {
    res.status(500).json({ message: 'Create project failed', error: err.message });
  }
}

export async function listProjects(req: AuthRequest, res: Response) {
  const userId = req.user?.id;

  if (!userId)
     return res.status(401).json({ message: 'Unauthorized' });

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const q = (req.query.q as string) || '';

  try {
    const filter: any = { owner: userId };
    if (q) filter.title = { $regex: q, $options: 'i' };

    const items = await Project.find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Project.countDocuments(filter);
    res.status(201).json({
        message: 'Projects successfully fetched.',
        Projects: items, total, page, limit 
    });
  } catch (err: any) {
    res.status(500).json({ message: 'List projects failed', error: err.message });
  }
}

export async function getProject(req: AuthRequest, res: Response) {
  const userId = req.user?.id;
  if (!userId) 
    return res.status(401).json({ message: 'Unauthorized' });

  try {
    const project = await Project.findOne({ _id: req.params.id, owner: userId });
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const tasks = await Task.find({ project: project._id });
    res.status(201).json({
        message: 'Project successfully fetched by ID.',
        Project: project, tasks 
    });
  } catch (err: any) {
    res.status(500).json({ message: 'Get project failed', error: err.message });
  }
}

export async function updateProject(req: AuthRequest, res: Response) {
  const userId = req.user?.id;

  if (!userId) 
    return res.status(401).json({ message: 'Unauthorized' });

  try {
    const updated = await Project.findOneAndUpdate(
      { _id: req.params.id, owner: userId },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Project not found or not allowed' });
    res.status(201).json({
        message: 'Project updated successfully.',
        Project: updated
    });
  } catch (err: any) {
    res.status(500).json({ message: 'Update failed', error: err.message });
  }
}

export async function deleteProject(req: AuthRequest, res: Response) {
  const userId = req.user?.id;

  if (!userId) 
    return res.status(401).json({ message: 'Unauthorized' });

  try {
    const p = await Project.findOneAndDelete({ _id: req.params.id, owner: userId });
    if (!p) return res.status(404).json({ message: 'Project not found or not allowed' });

    await Task.deleteMany({ project: p._id });
    res.status(201).json({
      message: 'Project deleted successfully.'
    });
  } catch (err: any) {
    res.status(500).json({ message: 'Delete failed', error: err.message });
  }
}

