import { Medicamento } from "../models/medicamento.model.js";

export const seedMedicamento = async () => {
    await Medicamento.bulkCreate([
        { nombre: "Acetaminofén 500mg", descripcion: "Analgésico y antipirético" },
        { nombre: "Ibuprofeno 400mg", descripcion: "Antiinflamatorio no esteroideo" },
        { nombre: "Amoxicilina 500mg", descripcion: "Antibiótico de amplio espectro" },
        { nombre: "Losartán 50mg", descripcion: "Tratamiento de hipertensión arterial" }
    ]);

    console.log("✅ Medicamento seeded");
};
