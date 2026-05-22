const { DataTypes, Model } = require("sequelize")
const sequelize = require("../config/db")

class Seguidos extends Model {}

Seguidos.init({
    id_relacion: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    id_seguidor: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'usuarios', key: 'id_usuario' }
    },
    id_seguido: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'usuarios', key: 'id_usuario' }
    }
}, {
    sequelize,
    modelName: "Seguidos",
    tableName: "seguidos",
    timestamps: true,
    indexes: [{ unique: true, fields: ['id_seguidor', 'id_seguido'] }]
})

module.exports = Seguidos
