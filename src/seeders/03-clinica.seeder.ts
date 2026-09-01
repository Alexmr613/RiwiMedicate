import Clinica from "../models/clinica.model.js";

export const seedClinica = async () => {
    await Clinica.bulkCreate([
        { nit: "900123456-1", name: "Clínica San Rafael" },
        { nit: "900654321-2", name: "Clínica Los Andes" },
        { nit: "900789456-3", name: "Clínica del Norte" }
    ]);

    console.log("✅ Clinica seeded");
};
