const { DataTypes, Model } = require("sequelize")
const sequelize = require("../config/db")

class Reporte_chat extends Model {}

Reporte_chat.init({
    id_reporte_chat: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    id_mensaje: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'chat_comu', key: 'id_chat_comu' }
    },
    id_comunidad: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'comunidades', key: 'id_comunidad' }
    },
    id_reportador: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'usuarios', key: 'id_usuario' }
    },
    razon: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    texto_mensaje: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    autor_mensaje: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    id_usuario_autor: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'usuarios', key: 'id_usuario' }
    },
    estado: {
        type: DataTypes.ENUM('pendiente', 'revisado', 'descartado'),
        defaultValue: 'pendiente',
        allowNull: false,
    },
}, {
    sequelize,
    modelName: "Reporte_chat",
    tableName: "reportes_chat",
    timestamps: true,
})

module.exports = Reporte_chat
