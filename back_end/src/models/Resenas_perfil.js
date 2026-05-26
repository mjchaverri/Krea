const { DataTypes, Model } = require("sequelize")
const sequelize = require("../config/db")

class Resenas_perfil extends Model {}

Resenas_perfil.init({
    id_resena_perfil: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    id_usuario_receptor: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'usuarios', key: 'id_usuario' }
    },
    id_usuario_autor: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'usuarios', key: 'id_usuario' }
    },
    calificacion: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    comentarios: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
}, {
    sequelize,
    modelName: "Resenas_perfil",
    tableName: "resenas_perfil",
    timestamps: true,
})

module.exports = Resenas_perfil
