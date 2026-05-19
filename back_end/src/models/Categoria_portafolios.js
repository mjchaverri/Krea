const { DataTypes, Model } = require("sequelize")
const sequelize = require("../config/db")

class Categoria_portafolios extends Model {}

Categoria_portafolios.init({
    id_categoria_portafolio: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    id_categoria: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'categorias', key: 'id_categoria' }
    },
    id_portafolio: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'portafolios', key: 'id_portafolio' }
    }
}, {
    sequelize,
    modelName: "Categoria_portafolios",
    tableName: "categoria_portafolios",
    timestamps: true
})

module.exports = Categoria_portafolios
