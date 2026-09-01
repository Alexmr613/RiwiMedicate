import { Request, Response } from 'express';
import { Almacen } from '../models/relations.model';

export const createStorage = async (req: Request, res: Response) => {
  try {
    const almacen = await Almacen.create(req.body);
    res.status(201).json(almacen);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el almacén.' });
  }
};

export const getStorage = async (req: Request, res: Response) => {
  try {
    const almacenes = await Almacen.findAll();
    res.json(almacenes);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los almacenes.' });
  }
};

export const updateStorage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const [actualizados] = await Almacen.update(req.body, { where: { id } });
    if (actualizados === 0) return res.status(404).json({ error: 'Almacén no encontrado.' });
    res.json({ mensaje: 'Almacén actualizado correctamente.' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el almacén.' });
  }
};

export const deleteStorage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const eliminados = await Almacen.destroy({ where: { id } });
    if (eliminados === 0) return res.status(404).json({ error: 'Almacén no encontrado.' });
    res.json({ mensaje: 'Almacén eliminado correctamente.' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el almacén.' });
  }
};