import{DataTypes, Model} from "sequelize"
import db from "../config/db.js"


export class Solicitud extends Model {}
Solicitud.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  estado: { 
    type: DataTypes.ENUM('Pendiente', 'Asignada', 'En Camino', 'Entregada', "Cancelada"), 
    defaultValue: 'Pendiente' 
  },
  fecha: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { sequelize:db, modelName: 'Solicitud' });

export class DetalleSolicitud extends Model {}
DetalleSolicitud.init({
  cantidad_solicitada: { type: DataTypes.INTEGER, allowNull: false }
}, { sequelize:db, modelName: 'DetalleSolicitud' });

