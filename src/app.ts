
import path from "node:path";
import express, { Application } from "express";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import userRoutes from './routes/user.route'
import clinicaRoutes from "./routes/clinica.route"
import authRoutes from "./routes/auth.route"

const app: Application = express()


app.use(express.json());

// Documentación interactiva (Swagger / OpenAPI)
const swaggerDocument = YAML.load(path.join(__dirname, "docs", "swagger.yaml"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Montaje de rutas
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/clinica', clinicaRoutes);
app.use("/almacenes", clinicaRoutes)
app.use("/medicamentos", clinicaRoutes)
app.use("/solicitudes", clinicaRoutes)