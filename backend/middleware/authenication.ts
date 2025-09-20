import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: { id: string; [key: string]: any };
}

export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const JWT_SECRET = process.env.JWT_SECRET || 'secret'; 

  if (!JWT_SECRET) {
    return res.status(500).json({ message: 'JWT_SECRET not defined in environment' });
  }

  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ message: 'Authorization header missing' });

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ message: 'Authorization header malformed' });
  }

  const token = parts[1].trim();
  if (!token) return res.status(401).json({ message: 'Token missing' });

  try {
    const decoded = jwt.verify(token.trim(), JWT_SECRET) as { id: string; [key: string]: any };
    req.user = decoded;
    next();
  } catch (err: any) {
    console.error('JWT verification error:', err.message);
    return res.status(403).json({ message: 'Invalid or expired token', error: err.message });
  }
};
