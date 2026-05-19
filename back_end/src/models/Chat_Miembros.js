const { DataTypes, Model } = require("sequelize")
const sequelize = require("../config/db")

class Chat_Miembros extends Model {}

Chat_Miembros.init({
    id_chat_miembro: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    id_chat: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'chat_comu', key: 'id_chat_comu' }
    },
    id_miembro: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'miembros', key: 'id_miembro' }
    }
}, {
    sequelize,
    modelName: "Chat_Miembros",
    tableName: "chat_miembros",
    timestamps: true
})

module.exports = Chat_Miembros
