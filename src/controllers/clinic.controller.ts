import { Request, Response } from 'express';

import {Clinica, Almacen,Medicamento,Solicitud} from '../models/relations.model';


export const createClinic = async (req: Request, res: Response) => {
  try {
    const clinica = await Clinica.create(req.body); // El NIT se valida en el middleware previo
    res.status(201).json(clinica);
  } catch (error) {
    res.status(500).json({ error: 'Error interno al crear la clínica.' });
  }
};

export const getClinics = async (req: Request, res: Response) => {
  try {
    const clinicas = await Clinica.findAll();
    res.json(clinicas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las clínicas.' });
  }
};

export const updateClinic = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const [actualizadas] = await Clinica.update(req.body, { where: { id } });
    if (actualizadas === 0) return res.status(404).json({ error: 'Clínica no encontrada.' });
    res.json({ mensaje: 'Clínica actualizada correctamente.' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la clínica.' });
  }
};

export const deleteClinic = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const eliminadas = await Clinica.destroy({ where: { id } });
    if (eliminadas === 0) return res.status(404).json({ error: 'Clínica no encontrada.' });
    res.json({ mensaje: 'Clínica eliminada correctamente.' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la clínica.' });
  }
};


//ROl Gestor de solicitudes

export const obtenerHistorialPorClinica = async (req: Request, res: Response) => {
    try {
      const { clinica_id } = req.params;
      
      const historial = await Solicitud.findAll({
        where: { clinica_id },
        include: [
          { model: Almacen, attributes: ['nombre', 'ubicacion'] },
          { 
            model: Medicamento, 
            attributes: ['nombre'],
            through: { attributes: ['cantidad_solicitada'] } // Trae la cantidad de la tabla intermedia
          }
        ],
        order: [['fecha', 'DESC']]
      });
      
      res.json(historial);
    } catch (error) {
      res.status(500).json({ error: 'Error al consultar el historial de la clínica.' });
    }
  };