const { DataTypes, Model } = require("sequelize")
const sequelize = require("../config/db")

class Convocatorias extends Model {}

Convocatorias.init({
    id_convocatoria: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre: {
        type: DataTypes.STRING(30),
        allowNull: false
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    fecha_cierre: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'usuarios', key: 'id_usuario' }
    },
    id_comunidad: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'comunidades', key: 'id_comunidad' }
    }
}, {
    sequelize,
    modelName: "Convocatorias",
    tableName: "convocatorias",
    timestamps: true
})

module.exports = Convocatorias
