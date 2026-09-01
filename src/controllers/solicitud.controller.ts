import { Request, Response } from 'express';
import sequelize from '../config/db'; // Importa tu instancia de conexión
import { Solicitud, DetalleSolicitud, Clinica, Medicamento,Almacen } from '../models/relations.model';
import { Op } from 'sequelize';
export const createSolicitude = async (req: Request, res: Response) => {
  const t = await sequelize.transaction();
  
  try {
    const { clinica_id, almacen_id, medicamentos } = req.body;
    
    // 1. Crear la cabecera de la solicitud
    const nuevaSolicitud = await Solicitud.create(
      { clinica_id, almacen_id, estado: 'Pendiente' },
      { transaction: t }
    );

    // 2. Preparar el array para la tabla intermedia
    const detalles = medicamentos.map((med: any) => ({
      solicitud_id: nuevaSolicitud.dataValues.id,
      medicamento_id: med.medicamento_id,
      cantidad_solicitada: med.cantidad
    }));

    // 3. Insertar los detalles masivamente
    await DetalleSolicitud.bulkCreate(detalles, { transaction: t });
    
    await t.commit(); // Confirma los cambios en la BD
    res.status(201).json({ mensaje: 'Solicitud creada con éxito.', solicitud: nuevaSolicitud });
  } catch (error) {
    await t.rollback(); // Revierte si algo falla
    res.status(500).json({ error: 'Error al crear la solicitud completa.' });
  }
};

export const updateStateSolicitude = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { estado } = req.body; // El middleware ya validó que el estado sea correcto

    const [actualizadas] = await Solicitud.update({ estado }, { where: { id } });
    if (actualizadas === 0) return res.status(404).json({ error: 'Solicitud no encontrada.' });
    
    res.json({ mensaje: `Solicitud actualizada al estado: ${estado}` });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la solicitud.' });
  }
};

export const deleteSolicitude = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const eliminadas = await Solicitud.destroy({ where: { id } });
    if (eliminadas === 0) return res.status(404).json({ error: 'Solicitud no encontrada.' });
    res.json({ mensaje: 'Solicitud eliminada.' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la solicitud.' });
  }
};

export const obtenerSolicitudesActivas = async (req: Request, res: Response) => {
    try {
      const activas = await Solicitud.findAll({
        where: {
          estado: { 
            [Op.notIn]: ['Entregada', 'Cancelada'] // Ajusta según tus estados finales
          }
        },
        include: [
          { model: Clinica, attributes: ['nombre'] },
          { model: Almacen, attributes: ['nombre'] }
        ],
        order: [['fecha', 'DESC']]
      });
      
      res.json(activas);
    } catch (error) {
      res.status(500).json({ error: 'Error al consultar las solicitudes activas.' });
    }
  };
  export const crearSolicitud = async (req: Request, res: Response) => {
    const t = await sequelize.transaction();
    
    try {
      // Los campos solicitados según los requerimientos
      const { 
        clinica_id, 
        almacen_id, 
        estado_inicial = 'Pendiente', 
        medicamentos // Array de { medicamento_id, cantidad }
      } = req.body;
      
      // 1. Registrar la clínica solicitante, almacén y estado inicial
      const nuevaSolicitud = await Solicitud.create(
        { 
          clinica_id, 
          almacen_id, 
          estado: estado_inicial 
        },
        { transaction: t }
      );
  
      // 2. Registrar el medicamento y cantidad solicitada
      const detalles = medicamentos.map((med: any) => ({
        solicitud_id: nuevaSolicitud.dataValues.id,
        medicamento_id: med.medicamento_id,
        cantidad_solicitada: med.cantidad
      }));
  
      await DetalleSolicitud.bulkCreate(detalles, { transaction: t });
      
      await t.commit();
      res.status(201).json({ 
        mensaje: 'Solicitud registrada con éxito.', 
        solicitud: nuevaSolicitud 
      });
    } catch (error) {
      await t.rollback();
      res.status(500).json({ error: 'Error al registrar la solicitud.' });
    }
  };