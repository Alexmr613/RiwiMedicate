import { Sequelize } from "sequelize";
import dotenv from "dotenv";

// Cargamos el .env aqui mismo para garantizar que las variables ya esten
// disponibles sin importar el orden de imports del archivo que consuma `db`.
// (Antes dependia de que app.ts llamara a dotenv.config() antes de este
// import, pero los imports de ES Modules se evaluan todos primero, asi que
// el Sequelize se construia con process.env todavia vacio -> password
// llegaba undefined al driver pg -> "SASL: client password must be a string")
dotenv.config();

const {
    DATABASE_HOST,
    DATABASE_USER,
    DATABASE_PASSWORD,
    DATABASE_NAME,
    DB_PORT
} = process.env;

if (!DATABASE_HOST || !DATABASE_USER || !DATABASE_PASSWORD || !DATABASE_NAME) {
    throw new Error(
        'Faltan variables de entorno de la base de datos. Revisa tu archivo .env (DATABASE_HOST, DATABASE_USER, DATABASE_PASSWORD, DATABASE_NAME).'
    );
}

const db = new Sequelize(
    DATABASE_NAME,
    DATABASE_USER,
    String(DATABASE_PASSWORD),
    {
        host: DATABASE_HOST,
        port: DB_PORT ? Number(DB_PORT) : 5432,
        dialect: 'postgres'
    }
);

export default db;
