const { DataTypes, Model } = require("sequelize")
const sequelize = require("../config/db")

class Chat_Comu extends Model {}

Chat_Comu.init({
    id_chat_comu: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    usuario_nombre: {
        type: DataTypes.STRING(30),
        allowNull: false
    },
    Fecha: {
        type: DataTypes.DATE,
        allowNull: false
    },
    texto: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    id_comunidad: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'comunidades', key: 'id_comunidad' }
    }
}, {
    sequelize,
    modelName: "Chat_Comu",
    tableName: "chat_comu",
    timestamps: true
})

module.exports = Chat_Comu
