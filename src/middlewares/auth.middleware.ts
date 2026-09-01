import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';


export const isAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      error: 'Acceso denegado. Token no proporcionado o formato inválido.' 
    });
  }

  const token = authHeader.split(' ')[1];
  const secretKey = process.env.JWT_SECRET || 'alex123';

  try {
    // Si el token es inválido o expiró, jwt.verify lanza un error
    const decoded = jwt.verify(token as string, secretKey );
    
    // Inyectamos el payload decodificado (que contiene el rol) en la request
    (req as any).user = decoded;
    
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido o expirado.' });
  }
};
// Middleware para verificar rol de Administrador
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  // Asumiendo que el middleware isAuth inyectó el usuario en req.user
  const user = (req as any).user; 
  if (user.rol !== 'admin') {
    return res.status(403).json({ error: 'Acceso denegado. Se requiere rol de Administrador.' });
  }
  next();
};