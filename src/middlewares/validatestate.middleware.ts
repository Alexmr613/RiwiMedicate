import { Response, Request, NextFunction } from "express";
export const validarEstadoSolicitud = (req: Request, res: Response, next: NextFunction) => {
    const { estado } = req.body;
    const estadosPermitidos = ['Pendiente', 'Asignada', 'En Camino', 'Entregada'];
  
    if (estado && !estadosPermitidos.includes(estado)) {
      return res.status(400).json({ 
        error: `Estado no permitido. Opciones válidas: ${estadosPermitidos.join(', ')}` 
      });
    }
  
    next();
  };