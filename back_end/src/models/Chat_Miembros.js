const { DataTypes, Model } = require("sequelize")

const sequelize = require("../config/db")

class Chat_Miembros extends Model {}

Chat_Miembros.init({
    id_chat_miembros:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
    },

},{
    sequelize,
    modelName:"Chat_Miembros",
    tableName:"chat_miembros",
    timestamps:true
})

module.exports = Chat_Miembros