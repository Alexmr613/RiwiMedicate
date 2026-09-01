import Dni from "../models/dni.model.js";

export const seedDni = async () => {
    await Dni.bulkCreate([
        {
            id: "b3f1a2c4-1111-4a2b-8c3d-000000000001",
            type_identification: "b3f1a2c4-2222-4a2b-8c3d-000000000002",
            number: "1001234567"
        },
        {
            id: "b3f1a2c4-1111-4a2b-8c3d-000000000003",
            type_identification: "b3f1a2c4-2222-4a2b-8c3d-000000000004",
            number: "1002345678"
        },
        {
            id: "b3f1a2c4-1111-4a2b-8c3d-000000000005",
            type_identification: "b3f1a2c4-2222-4a2b-8c3d-000000000006",
            number: "1003456789"
        }
    ]);

    console.log("✅ Dni seeded");
};
