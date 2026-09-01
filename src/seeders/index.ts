import db from "../config/db.js";
import "../models/relations.model.js"; // registra todas las asociaciones antes de sembrar

import { seedDni } from "./01-dni.seeder.js";
import { seedAddress } from "./02-address.seeder.js";
import { seedClinica } from "./03-clinica.seeder.js";
import { seedAlmacen } from "./04-almacen.seeder.js";
import { seedMedicamento } from "./05-medicamento.seeder.js";
import { seedUser } from "./06-user.seeder.js";
import { seedInventario } from "./07-inventario.seeder.js";
import { seedSolicitud } from "./08-solicitud.seeder.js";
import { seedDetalleSolicitud } from "./09-detalleSolicitud.seeder.js";

const runSeeders = async () => {
    try {
        await db.authenticate();
        // force:true recrea las tablas; usa alter:true si quieres conservar datos existentes
        await db.sync({ force: true });

        // El orden importa por las llaves foráneas:
        await seedDni();
        await seedAddress();
        await seedClinica();
        await seedAlmacen();
        await seedMedicamento();
        await seedUser();          // depende de Dni y Clinica
        await seedInventario();    // depende de Almacen y Medicamento
        await seedSolicitud();     // depende de Clinica y Almacen
        await seedDetalleSolicitud(); // depende de Solicitud y Medicamento

        console.log("🌱 Todos los seeders se ejecutaron correctamente");
        process.exit(0);
    } catch (error) {
        console.error("❌ Error ejecutando los seeders:", error);
        process.exit(1);
    }
};

runSeeders();
