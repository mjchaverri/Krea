const { DataTypes, Model } = require("sequelize")
const sequelize = require("../config/db")

class Portafolios extends Model {}

Portafolios.init({
    id_portafolio: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    titulo: {
        type: DataTypes.STRING(60),
        allowNull: false
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    pdf: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    img_portada: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    componentes_json: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'usuarios', key: 'id_usuario' }
    }
}, {
    sequelize,
    modelName: "Portafolios",
    tableName: "portafolios",
    timestamps: true
})

module.exports = Portafolios
