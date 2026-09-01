import Address from "../models/address.model.js";

export const seedAddress = async () => {
    await Address.bulkCreate([
        { city_id: 1, address: "Calle 72 # 45-10" },
        { city_id: 2, address: "Carrera 10 # 20-30" },
        { city_id: 1, address: "Av. Siempre Viva 742" }
    ]);

    console.log("✅ Address seeded");
};
