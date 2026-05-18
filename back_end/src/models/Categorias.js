const {DataTypes , Model } = require("sequelize")

const sequelize = require("../config/db")


class Categorias extends Model {}

Categorias.init({
    id_categoria:{
    type:DataTypes.INTEGER,
    primaryKey:true,
    autoIncrement:true,
    },
nombre:{
    type:DataTypes.STRING,
    allowNull:false
    }

},{
    sequelize,
    modelName:"Categorias",
    tableName:"categorias",
    timestamps:true
})

module.exports = Categorias