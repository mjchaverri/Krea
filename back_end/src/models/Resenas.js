const { DataTypes, Model } = require("sequelize")
const sequelize = require("../config/db")

class Resenas extends Model {}

Resenas.init({
    id_resena: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    comentarios: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    calificacion: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'usuarios', key: 'id_usuario' }
    },
    id_portafolio: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'portafolios', key: 'id_portafolio' }
    }
}, {
    sequelize,
    modelName: "Resenas",
    tableName: "resenas",
    timestamps: true
})

module.exports = Resenas
