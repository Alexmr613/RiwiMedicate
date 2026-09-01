import { Almacen } from "../models/almacen.model.js";

export const seedAlmacen = async () => {
    await Almacen.bulkCreate([
        { nombre: "Almacén Central", ubicacion: "Bodega 1, Zona Industrial" },
        { nombre: "Almacén Norte", ubicacion: "Bodega 4, Zona Norte" },
        { nombre: "Almacén Sur", ubicacion: "Bodega 7, Zona Sur" }
    ]);

    console.log("✅ Almacen seeded");
};
