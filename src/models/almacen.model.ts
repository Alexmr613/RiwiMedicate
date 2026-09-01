import{DataTypes, Model} from "sequelize"
import db from "../config/db.js"

export class Almacen extends Model {}
Almacen.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING, allowNull: false },
  ubicacion: { type: DataTypes.STRING }
}, { sequelize: db, modelName: 'Almacen' });