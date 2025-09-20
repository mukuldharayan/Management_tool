import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export async function register(req: Request, res: Response) {

  const { email, password, name } = req.body as { email: string; password: string; name?: string };

  if (!email || !password) 
    return res.status(400).json({ message: 'Email and password required' });

  try {
    const exists = await User.findOne({ email });
    
    if (exists) 
        return res.status(400).json({ message: 'Email already in use' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashed, name });

    const token = jwt.sign({ id: user._id.toString() }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, email: user.email, name: user.name } });
  } catch (err: any) {
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body as { email: string; password: string };

  if (!email || !password) 
    return res.status(400).json({ message: 'Email and password required' });

  try {
    const user = await User.findOne({ email });

    if (!user) 
        return res.status(400).json({ message: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.password);

    if (!ok) 
        return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id.toString() }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, email: user.email, name: user.name } });
  } catch (err: any) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
}
