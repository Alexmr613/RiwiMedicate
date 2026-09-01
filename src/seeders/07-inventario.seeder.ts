import { Inventario } from "../models/inventario.model.js";
import { Almacen } from "../models/almacen.model.js";
import { Medicamento } from "../models/medicamento.model.js";

export const seedInventario = async () => {
    const almacenes = await Almacen.findAll();
    const medicamentos = await Medicamento.findAll();

    if (almacenes.length === 0 || medicamentos.length === 0) {
        console.warn("⚠️  No hay Almacenes o Medicamentos para poblar Inventario. Ejecuta primero esos seeders.");
        return;
    }

    await Inventario.bulkCreate([
        { almacen_id: almacenes[0].get("id"), medicamento_id: medicamentos[0].get("id"), cantidad: 100 },
        { almacen_id: almacenes[0].get("id"), medicamento_id: medicamentos[1].get("id"), cantidad: 50 },
        { almacen_id: almacenes[1].get("id"), medicamento_id: medicamentos[2].get("id"), cantidad: 75 },
        { almacen_id: almacenes[2].get("id"), medicamento_id: medicamentos[3].get("id"), cantidad: 30 }
    ]);

    console.log("✅ Inventario seeded");
};
