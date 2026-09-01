import { Request, Response } from 'express';
import User from '../models/user.model';
import Dni from '../models/dni.model';
import Clinica from '../models/clinica.model';

export const getUsers = async (_req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      include: [
        {model:Clinica, as:"clinica" },
        { model: Dni, as: 'dni' }
      ]
    });

    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener usuarios',
      error: error instanceof Error ? error.message : error
    });
  }
};

export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] },
      include: [
        {  },
        { model: Dni, as: 'dni' }
      ]
    });

    if (!user) {
      res.status(404).json({ success: false, message: `Usuario con ID ${id} no encontrado` });
      return;
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener el usuario',
      error: error instanceof Error ? error.message : error
    });
  }
};

export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      name,
      lastname,
      email,
      password,
      birthday,
      phone,
      status,
      role,
      dni_id,
      address_user_id
    } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      res.status(400).json({ success: false, message: 'El email ya se encuentra registrado' });
      return;
    }

    const newUser = await User.create({
      name,
      lastname,
      email,
      password,
      birthday,
      phone,
      status: status ?? true,
      role,
      dni_id,
      address_user_id
    });

    const userResponse = await User.findByPk(newUser.id, {
      attributes: { exclude: ['password'] },
      include: [
        {  },
        { model: Dni, as: 'dni' }
      ]
    });

    res.status(201).json({ success: true, message: 'Usuario creado exitosamente', data: userResponse });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al crear el usuario',
      error: error instanceof Error ? error.message : error
    });
  }
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const {
      name,
      lastname,
      email,
      password,
      birthday,
      phone,
      status,
      role,
      dni_id,
      address_user_id
    } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      res.status(404).json({ success: false, message: `Usuario con ID ${id} no encontrado` });
      return;
    }

    if (email && email !== user.email) {
      const emailTaken = await User.findOne({ where: { email } });
      if (emailTaken) {
        res.status(400).json({ success: false, message: 'El correo electrónico ya está en uso' });
        return;
      }
    }

    await user.update({
      name: name ?? user.name,
      lastname: lastname ?? user.lastname,
      email: email ?? user.email,
      password: password ?? user.password,
      birthday: birthday ?? user.birthday,
      phone: phone ?? user.phone,
      status: status !== undefined ? status : user.status,
      role: role ?? user.role,
      dni_id: dni_id ?? user.dni_id,
      address_user_id: address_user_id ?? user.address_user_id
    });

    const updatedUser = await User.findByPk(id, {
      attributes: { exclude: ['password'] },
      include: [
        {  },
        { model: Dni, as: 'dni' }
      ]
    });

    res.status(200).json({ success: true, message: 'Usuario actualizado exitosamente', data: updatedUser });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al actualizar el usuario',
      error: error instanceof Error ? error.message : error
    });
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const user = await User.findByPk(id);

    if (!user) {
      res.status(404).json({ success: false, message: `Usuario con ID ${id} no encontrado` });
      return;
    }

    await user.destroy();
    res.status(200).json({ success: true, message: `Usuario con ID ${id} eliminado correctamente` });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar el usuario',
      error: error instanceof Error ? error.message : error
    });
  }
};
