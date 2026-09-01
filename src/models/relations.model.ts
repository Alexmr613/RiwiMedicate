import Clinica from "./clinica.model";
import {Solicitud ,DetalleSolicitud} from "./sa.model"
import { Medicamento } from "./medicamento.model";
import { Almacen } from "./almacen.model";
import { Inventario } from "./inventario.model";
import User from "./user.model";
import Address from "./address.model";
import Dni from "./dni.model";

User.belongsTo(Dni, { foreignKey: "dni_id"  });
Dni.hasOne(User, { foreignKey: "dni_id" });

User.belongsTo(Address, { foreignKey: "address_user_id" });
Address.hasOne(User, { foreignKey: "address_user_id" });

Clinica.hasMany(Solicitud, { foreignKey: 'clinica_id' });
Solicitud.belongsTo(Clinica, { foreignKey: 'clinica_id' });

// Un usuario pertenece a una clínica
User.belongsTo(Clinica, { foreignKey: 'clinica_id' });
Clinica.hasOne(User, { foreignKey: 'user_id' })

// Un almacén recibe muchas solicitudes
Almacen.hasMany(Solicitud, { foreignKey: 'almacen_id' });
Solicitud.belongsTo(Almacen, { foreignKey: 'almacen_id' });

// Relación N:M entre Almacen y Medicamento (Inventario)
Almacen.belongsToMany(Medicamento, { through: Inventario, foreignKey: 'almacen_id' });
Medicamento.belongsToMany(Almacen, { through: Inventario, foreignKey: 'medicamento_id' });

// Relación N:M entre Solicitud y Medicamento (Detalles de lo que se pide)
Solicitud.belongsToMany(Medicamento, { through: DetalleSolicitud, foreignKey: 'solicitud_id' });
Medicamento.belongsToMany(Solicitud, { through: DetalleSolicitud, foreignKey: 'medicamento_id' });



export{
    Clinica,
    Solicitud,
    Almacen,
    Inventario,
    Medicamento,
    DetalleSolicitud,
    User,
    Address,
    Dni
}