const {DataTypes , Model } = require("sequelize")

const sequelize = require("../config/db")


class Bloques_Componentes extends Model {}


Bloques_Componentes.init ({
     id_bloque_componente : {
        type : DataTypes.INTEGER,
        primaryKey : true,
        autoIncrement : true
     },
     nombre_bloque : {
        type : DataTypes.STRING(50),
        allowNull : false
     },
      Texto_bloque : {
        type : DataTypes.TEXT,
        allowNull : false
      },
      color : {
        type : DataTypes.TEXT,
        allowNull : false
      },
       color_fondo : {
        type : DataTypes.TEXT,
        allowNull : false
       },
       imagen_bloque : {
        type : DataTypes.TEXT,
        allowNull : false
       },
       font_size : {
        type : DataTypes.STRING(20),
        allowNull : false

       },
       bold : {
        type : DataTypes.BOOLEAN,
        allowNull : false

       },
         italic : {
        type : DataTypes.BOOLEAN,
        allowNull : false
        },
        alingn : {
            type : DataTypes.STRING(20),
            allowNull : false
        }


       },{
    sequelize,
    modelName: "Bloques_Componentes",
    tableName: "bloques_componentes",
    timestamps: true
       } )


module.exports = Bloques_Componentes