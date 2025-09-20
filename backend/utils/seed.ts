import dotenv from 'dotenv';
dotenv.config();

import connectDB from '../config/db.js';
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import Project from '../models/Project.js';
import Task from '../models/Task.js';


async function seed() {
  await connectDB();

  const email = 'test@example.com';
  const plainPassword = 'Test@123';

  let user = await User.findOne({ email });
  if (!user) {
    const hashed = await bcrypt.hash(plainPassword, 10);
    user = await User.create({
      email,
      password: hashed,
      name: 'Test User'
    });
    console.log(`Created user: ${email}`);
  } else {
    console.log(`User already exists: ${email}`);
  }

  const projectsData = [
    { title: 'Website Revamp', description: 'New design and content', status: 'active' },
    { title: 'Mobile App', description: 'Build cross-platform app', status: 'active' }
  ];

  for (const p of projectsData) {
    let project = await Project.findOne({ title: p.title, owner: user._id });
    if (!project) {
      project = await Project.create({ ...p, owner: user._id });
      console.log(`Created project: ${project.title}`);
    } else {
      console.log(`Project exists: ${project.title}`);
    }

    const existingTasks = await Task.find({ project: project._id });
    if (existingTasks.length < 3) {
      const tasksToCreate = [
        { title: `${project.title} - Task 1`, description: 'First task', status: 'todo' },
        { title: `${project.title} - Task 2`, description: 'Second task', status: 'in-progress' },
        { title: `${project.title} - Task 3`, description: 'Third task', status: 'todo' }
      ];
      for (const t of tasksToCreate) {
        await Task.create({
          ...t,
          project: project._id,
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        });
      }
      console.log(`Created 3 tasks for project: ${project.title}`);
    } else {
      console.log(`Project ${project.title} already has ${existingTasks.length} tasks`);
    }
  }

  console.log('Seeding complete.');
  process.exit(0);
}

seed().catch(err => {
  console.error('Error in seeding:', err);
  process.exit(1);
});
