import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/user.model';

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Debe proporcionar email y contraseña.' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas.' });
    }

    const passwordValida = await bcrypt.compare(password, user.get('password') as string);
    if (!passwordValida) {
      return res.status(401).json({ error: 'Credenciales inválidas.' });
    }

    if (user.get('status') === false) {
      return res.status(403).json({ error: 'El usuario se encuentra inactivo.' });
    }

    const payload = {
      id: user.get('id'),
      rol: user.get('role')
    };

    const secretKey = process.env.JWT_SECRET || 'alex123';
    const token = jwt.sign(payload, secretKey, { expiresIn: '8h' });

    return res.json({
      token,
      usuario: {
        id: user.get('id'),
        name: user.get('name'),
        email: user.get('email'),
        role: user.get('role')
      }
    });
  } catch (error) {
    return res.status(500).json({ error: 'Error al iniciar sesión.' });
  }
};