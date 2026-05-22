const { DataTypes, Model } = require("sequelize")
const sequelize = require("../config/db")

class Configuracion extends Model {}

Configuracion.init({
    clave: {
        type: DataTypes.STRING(100),
        primaryKey: true,
        allowNull: false,
    },
    valor: {
        type: DataTypes.TEXT,
        allowNull: true,
    }
}, {
    sequelize,
    modelName: "Configuracion",
    tableName: "configuraciones",
    timestamps: true
})

module.exports = Configuracion
