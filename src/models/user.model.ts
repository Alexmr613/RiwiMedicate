import { DataTypes, Model, UUIDV4 } from "sequelize";
import db from "../config/db.js";

class User extends Model {
    declare id: string;
    declare name: string;
    declare lastname: string;
    declare email: string;
    declare password: string;
    declare birthday: string;
    declare phone: string;
    declare status: boolean;
    declare role: "admin" | "gestor de solicitudes";
    declare dni_id: string;
    declare address_user_id: string;
    declare clinica_id: string;
}

User.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    lastname: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    birthday: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    role:{
        type: DataTypes.ENUM("admin", "gestor de solicitudes"),
        
        allowNull: false
    },
    dni_id: {
        type: DataTypes.UUID,
        allowNull: false,
      
    },
    clinica_id: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize: db
});

// Las asociaciones de User viven todas en relations.ts para evitar
// declaraciones duplicadas/alias en conflicto entre archivos.

export default User;