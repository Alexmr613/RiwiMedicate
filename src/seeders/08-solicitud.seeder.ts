import { Solicitud } from "../models/sa.model.js";
import Clinica from "../models/clinica.model.js";
import { Almacen } from "../models/almacen.model.js";

export const seedSolicitud = async () => {
    const clinicas = await Clinica.findAll();
    const almacenes = await Almacen.findAll();

    if (clinicas.length === 0 || almacenes.length === 0) {
        console.warn("⚠️  No hay Clinicas o Almacenes para poblar Solicitud. Ejecuta primero esos seeders.");
        return;
    }

    await Solicitud.bulkCreate([
        { estado: "Pendiente", clinica_id: clinicas[0].get("nit"), almacen_id: almacenes[0].get("id") },
        { estado: "Asignada", clinica_id: clinicas[1].get("nit"), almacen_id: almacenes[1].get("id") },
        { estado: "En Camino", clinica_id: clinicas[2].get("nit"), almacen_id: almacenes[2].get("id") },
        { estado: "Entregada", clinica_id: clinicas[0].get("nit"), almacen_id: almacenes[1].get("id") }
    ]);

    console.log("✅ Solicitud seeded");
};
