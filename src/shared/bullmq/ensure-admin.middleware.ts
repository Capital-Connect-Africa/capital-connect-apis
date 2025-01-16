import { Request, Response, NextFunction } from 'express';

interface AuthenticatedRequest extends Request {
  user?: {
    roles?: string[];
  };
}

export function ensureAdminMiddleware(req: Request, res: Response, next: NextFunction) {
  // Assume req.user is populated by your authentication system
  const user = (req as AuthenticatedRequest).user;

  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (!user.roles || !user.roles.includes('admin')) {
    return res.status(403).json({ message: 'Access forbidden: Admins only' });
  }

  next();
}