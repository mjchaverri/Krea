const { DataTypes, Model } = require("sequelize")
const sequelize = require("../config/db")

class Tipo_convo extends Model {}

Tipo_convo.init({
    id_tipo_convo: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    id_tipo: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'tipos_para_convos', key: 'id_tipo_para_convo' }
    },
    id_convocatoria: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'convocatorias', key: 'id_convocatoria' }
    }
}, {
    sequelize,
    modelName: "Tipo_convo",
    tableName: "tipos_convo",
    timestamps: true
})

module.exports = Tipo_convo
