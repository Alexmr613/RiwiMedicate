import sequelize from "./config/db"
import express, { Application } from 'express'
import "./models/relations.model"

const app: Application = express();
const PORT = process.env.PORT || 3000;

const startServer = async (): Promise<void> => {
    try {
      await sequelize.authenticate();
      console.log('Database connected successfully.');
  
      // CAMBIO CLAVE: Usar alter: true en lugar de force: true
      // para no borrar la base de datos en cada reinicio.
      await sequelize.sync({ alter: true });
  
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    } catch (error) {
      console.error('Unable to connect to the database:', error);
    }
  };
  
  startServer();
  