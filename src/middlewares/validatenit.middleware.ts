import { Request, Response, NextFunction } from 'express';
import { Clinica } from '../models/relations.model';

export const validarNitUnico = async (req: Request, res: Response, next: NextFunction) => {
  const { nit } = req.body;
  
  try {
    const clinicaExistente = await Clinica.findOne({ where: { nit } });
    if (clinicaExistente) {
      return res.status(400).json({ error: 'Ya existe una clínica registrada con este NIT.' });
    }
    next();
  } catch (error) {
    res.status(500).json({ error: 'Error validando el NIT.' });
  }
};