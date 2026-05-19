const { DataTypes, Model } = require("sequelize")
const sequelize = require("../config/db")

class Tipos_talentos extends Model {}

Tipos_talentos.init({
    id_tipo_talento: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    id_talento: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'talentos', key: 'id_talento' }
    },
    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'usuarios', key: 'id_usuario' }
    }
}, {
    sequelize,
    modelName: "Tipos_talentos",
    tableName: "tipos_talentos",
    timestamps: true
})

module.exports = Tipos_talentos
