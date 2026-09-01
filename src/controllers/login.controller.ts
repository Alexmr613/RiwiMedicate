import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';
// import { Usuario } from '../models'; // Modelo hipotético de usuarios

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Lógica para buscar el usuario y validar la contraseña (ej. con bcrypt)
   const user = await User.findOne({ where: { email } });
  // si falla la validación -> return res.status(401)...

  // Definir los datos a encriptar en el token
  const payload = {
    id: user?.id, // Reemplazar con user.id
    rol: user?.role // Reemplazar con user.rol
  };

  const secretKey = process.env.JWT_SECRET || 'alex123';
  
  // Generar token con expiración de 8 horas
  const token = jwt.sign(payload, secretKey, { expiresIn: '8h' });

  return res.json({ token });
};