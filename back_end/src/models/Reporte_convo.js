const { DataTypes, Model } = require("sequelize")
const sequelize = require("../config/db")

class Reporte_convo extends Model {}

Reporte_convo.init({
    id_reporte_convo: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    resultado: {
        type: DataTypes.STRING(30),
        allowNull: false
    },
    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'usuarios', key: 'id_usuario' }
    },
    id_participante_convo: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'participantes_convo', key: 'id_participante_convo' }
    }
}, {
    sequelize,
    modelName: "Reporte_convo",
    tableName: "reportes_convo",
    timestamps: true
})

module.exports = Reporte_convo
