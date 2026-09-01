import { Request, Response, NextFunction } from 'express';
import { Medicamento } from '../models/relations.model';

export const validarCantidadesSueltas = (req: Request, res: Response, next: NextFunction) => {
    const { medicamentos } = req.body; // Array de { medicamento_id, cantidad }
  
    if (!medicamentos || medicamentos.length === 0) {
      return res.status(400).json({ error: 'Debe incluir al menos un medicamento.' });
    }
  
    const cantidadInvalida = medicamentos.some((med: any) => med.cantidad <= 0);
    if (cantidadInvalida) {
      return res.status(400).json({ error: 'Todas las cantidades solicitadas deben ser mayores a cero.' });
    }
  
    next();
  };