import { Router } from 'express';
import { isAuth, isAdmin } from '../middlewares/auth.middleware';
import { createStorage, deleteStorage, getStorage, updateStorage} from "../controllers/storage.controller"
import { getClinics, createClinic,updateClinic,deleteClinic, obtenerHistorialPorClinica  } from '../controllers/clinic.controller';
import { createMedicament, deleteMedicament, getMedicament, updateMedicament } from '../controllers/medicamento.controller';
import { crearSolicitud, createSolicitude, deleteSolicitude, obtenerSolicitudesActivas, updateStateSolicitude } from '../controllers/solicitud.controller';

const router = Router();

// -----------------------------------------
// PERMISOS GENERALES (Usuarios Autenticados)
// -----------------------------------------
router.get('/solicitudes/activas', isAuth, obtenerSolicitudesActivas);
router.get('/clinicas/:clinica_id/solicitudes', isAuth, obtenerHistorialPorClinica);
router.post("/solicitudes", isAuth, crearSolicitud)

// -----------------------------------------
// PERMISOS DE ADMINISTRADOR (CRUD Completo)
// -----------------------------------------

// CRUD Clínicas
router.post('/clinicas', isAuth, isAdmin, createClinic);
router.get('/clinicas', isAuth, isAdmin, getClinics);
router.put('/clinicas/:id', isAuth, isAdmin, updateClinic);
router.delete('/clinicas/:id', isAuth, isAdmin, deleteClinic);

// CRUD Almacenes
router.post('/almacenes', isAuth, isAdmin, createStorage);
router.get('/almacenes', isAuth, isAdmin, getStorage);
router.put('/almacenes/:id', isAuth, isAdmin, updateStorage);
router.delete('/almacenes/:id', isAuth, isAdmin, deleteStorage);

// CRUD Medicamentos
router.post('/medicamentos', isAuth, isAdmin, createMedicament);
router.get('/medicamentos', isAuth, isAdmin, getMedicament);
router.put('/medicamentos/:id', isAuth, isAdmin, updateMedicament);
router.delete('/medicamentos/:id', isAuth, isAdmin, deleteMedicament);

// CRUD Solicitudes (Administración de la solicitud per se)
router.post('/solicitudes', isAuth, isAdmin, createSolicitude);
router.put('/solicitudes/:id', isAuth, isAdmin, updateStateSolicitude);
router.delete('/solicitudes/:id', isAuth, isAdmin, deleteSolicitude);

export default router;