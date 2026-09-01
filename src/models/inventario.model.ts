import{DataTypes, Model} from "sequelize"
import db from "../config/db.js"

export class Inventario extends Model {}
Inventario.init({
  cantidad: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 }
}, { sequelize:db, modelName: 'Inventario' });