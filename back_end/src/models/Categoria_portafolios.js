const { DataTypes, Model } = require("sequelize")

const sequelize = require("../config/db")


class Categoria_portafolios extends Model { }

Categoria_portafolios.init({
    id_categoria_portafolio: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
   
},{
    sequelize,
    modelName: "Categoria_portafolios",
    tableName: "categoria_portafolios",
    timestamps: true
})

module.exports = Categoria_portafolios
