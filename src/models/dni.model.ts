import { DataTypes, Model } from "sequelize";
import db from "../config/db.js";
class Dni extends Model{

    declare id : string
    declare type_identification: string
    declare  number: string

}

Dni.init(
    {
        id:{
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        type_identification:{
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false

        },
        number:{
            type: DataTypes.STRING,
            allowNull: false

        }

    },{
        sequelize: db
    }
)

export default Dni