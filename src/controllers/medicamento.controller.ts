import { Request, Response } from 'express';
import { Medicamento } from '../models/relations.model';

export const createMedicament = async (req: Request, res: Response) => {
  try {
    const medicamento = await Medicamento.create(req.body);
    res.status(201).json(medicamento);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el medicamento.' });
  }
};

export const getMedicament = async (req: Request, res: Response) => {
  try {
    const medicamentos = await Medicamento.findAll();
    res.json(medicamentos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los medicamentos.' });
  }
};

export const updateMedicament = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const [actualizados] = await Medicamento.update(req.body, { where: { id } });
    if (actualizados === 0) return res.status(404).json({ error: 'Medicamento no encontrado.' });
    res.json({ mensaje: 'Medicamento actualizado correctamente.' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el medicamento.' });
  }
};

export const deleteMedicament = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const eliminados = await Medicamento.destroy({ where: { id } });
    if (eliminados === 0) return res.status(404).json({ error: 'Medicamento no encontrado.' });
    res.json({ mensaje: 'Medicamento eliminado correctamente.' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el medicamento.' });
  }
};