const {DataTypes , Model} = require('sequelize')

const sequelize = require("../config/db")


class Comunidades extends Model {}

Comunidades.init({
    id_comunidad:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
    },
   nombre:{
    type:DataTypes.STRING,
    allowNull:false
   },
   descripcion:{
    type:DataTypes.TEXT,
    allowNull:false
   },
  icono:{
    type:DataTypes.TEXT,
    allowNull:false
  },
  color:{
    type:DataTypes.TEXT,
    allowNull:false
  },
  Color_claro:{
    type:DataTypes.TEXT,
    allowNull:false
  },
  banner:{
    type:DataTypes.TEXT,
    allowNull:false
  },
 
},{
    sequelize,
    modelName:"Comunidades",
    tableName:"comunidades",
    timestamps:true
})

module.exports = Comunidades