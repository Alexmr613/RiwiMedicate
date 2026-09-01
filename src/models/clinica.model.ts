import{DataTypes, Model} from "sequelize"
import db from "../config/db.js"


class Clinica extends Model{

    declare nit : string
    declare name : string
   
}
Clinica.init({
    nit:{type: DataTypes.STRING, primaryKey:true, unique:true},
    name:{type: DataTypes.STRING, allowNull:false},
    
},
{sequelize: db})


export default Clinica
