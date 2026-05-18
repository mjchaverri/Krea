const { DataTypes, Model } = require("sequelize")

const sequelize = require("../config/db")


class Miembros extends Model {}

Miembros.init({
    id_miembro:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
    },
   Fecha:{
    type:DataTypes.DATE,
    allowNull:false
   },
   
},{
    sequelize,
    modelName:"Miembros",
    tableName:"miembros",
    timestamps:true
})

module.exports = Miembros
