const { DataTypes, Model } = require("sequelize")
const sequelize = require("../config/db")

class Participante_convo extends Model {}

Participante_convo.init({
    id_participante_convo: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'usuarios', key: 'id_usuario' }
    },
    id_convocatoria: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'convocatorias', key: 'id_convocatoria' }
    }
}, {
    sequelize,
    modelName: "Participante_convo",
    tableName: "participantes_convo",
    timestamps: true
})

module.exports = Participante_convo
