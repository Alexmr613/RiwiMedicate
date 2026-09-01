import {DataTypes, Model } from "sequelize"
import db from "../config/db"

class Address extends Model{

    declare id : number
    declare city_id: number
    declare address: string

}

Address.init({
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true

        
    },
    city_id:{
        type: DataTypes.INTEGER,
        allowNull:false

    },
    address:{

        type: DataTypes.STRING,
        allowNull:false

}},{
    sequelize:db
})

export default Address