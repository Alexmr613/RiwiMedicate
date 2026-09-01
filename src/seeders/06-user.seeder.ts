import User from "../models/user.model.js";

export const seedUser = async () => {
    await User.bulkCreate([
        {
            name: "Juan",
            lastname: "Martínez",
            email: "juan.martinez@example.com",
            password: "hashed_password_1",
            birthday: "1990-05-14",
            phone: "3001234567",
            status: true,
            role: "admin",
            dni_id: "b3f1a2c4-1111-4a2b-8c3d-000000000001",
            clinica_id: "900123456-1"
        },
        {
            name: "Laura",
            lastname: "Ramírez",
            email: "laura.ramirez@example.com",
            password: "hashed_password_2",
            birthday: "1993-08-22",
            phone: "3009876543",
            status: true,
            role: "gestor de solicitudes",
            dni_id: "b3f1a2c4-1111-4a2b-8c3d-000000000003",
            clinica_id: "900654321-2"
        },
        {
            name: "Pedro",
            lastname: "Salazar",
            email: "pedro.salazar@example.com",
            password: "hashed_password_3",
            birthday: "1988-01-30",
            phone: "3012345678",
            status: true,
            role: "gestor de solicitudes",
            dni_id: "b3f1a2c4-1111-4a2b-8c3d-000000000005",
            clinica_id: "900789456-3"
        }
    ]);

    console.log("✅ User seeded");
};
