const { DataTypes, Model } = require("sequelize")
const sequelize = require("../config/db")

class Baneado_comunidad extends Model {}

Baneado_comunidad.init({
    id_ban: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    id_comunidad: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'comunidades', key: 'id_comunidad' }
    },
    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'usuarios', key: 'id_usuario' }
    },
    razon: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    nombre_usuario: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
}, {
    sequelize,
    modelName: "Baneado_comunidad",
    tableName: "baneados_comunidad",
    timestamps: true,
})

module.exports = Baneado_comunidad
