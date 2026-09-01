import{DataTypes, Model} from "sequelize"
import db from "../config/db.js"

export class Medicamento extends Model {}
Medicamento.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING, allowNull: false },
  descripcion: { type: DataTypes.TEXT }
}, { sequelize:db, modelName: 'Medicamento' });