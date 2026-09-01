
import  express,{Application}  from "express";
import userRoutes from './routes/user.route'
import clinicaRoutes from "./routes/clinica.route"

const app: Application = express()


app.use(express.json());

// Montaje de rutas
app.use('/api/users', userRoutes);
app.use('/api/clinica', clinicaRoutes);
app.use("/almacenes", clinicaRoutes)
app.use("/medicamentos", clinicaRoutes)
app.use("/solicitudes", clinicaRoutes)