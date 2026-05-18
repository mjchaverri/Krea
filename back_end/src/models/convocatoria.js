const {DataTypes , Model } = require('sequelize')

const sequelize = require("../config/db")


class Convocatorias extends Model {}

Convocatorias.init({
    id_convocatoria : {
        type : DataTypes.INTEGER,
        primaryKey : true,
        autoIncrement : true

    },
    nombre : {
        type : DataTypes.STRING(100),
        allowNull : false

    },
    descripcion : {
        type : DataTypes.TEXT,
        allowNull : false

    },
   fecha_cierra : {
    type : DataTypes.DATE,
    allowNull : false

   }

}, {
    sequelize,
    modelName: "Convocatorias",
    tableName: "convocatorias",
    timestamps: true
})

module.exports = Convocatorias;