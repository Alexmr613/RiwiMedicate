import { DetalleSolicitud, Solicitud } from "../models/sa.model.js";
import { Medicamento } from "../models/medicamento.model.js";

export const seedDetalleSolicitud = async () => {
    const solicitudes = await Solicitud.findAll();
    const medicamentos = await Medicamento.findAll();

    if (solicitudes.length === 0 || medicamentos.length === 0) {
        console.warn("⚠️  No hay Solicitudes o Medicamentos para poblar DetalleSolicitud. Ejecuta primero esos seeders.");
        return;
    }

    await DetalleSolicitud.bulkCreate([
        { solicitud_id: solicitudes[0].get("id"), medicamento_id: medicamentos[0].get("id"), cantidad_solicitada: 20 },
        { solicitud_id: solicitudes[0].get("id"), medicamento_id: medicamentos[1].get("id"), cantidad_solicitada: 10 },
        { solicitud_id: solicitudes[1].get("id"), medicamento_id: medicamentos[2].get("id"), cantidad_solicitada: 15 },
        { solicitud_id: solicitudes[2].get("id"), medicamento_id: medicamentos[3].get("id"), cantidad_solicitada: 5 }
    ]);

    console.log("✅ DetalleSolicitud seeded");
};
