const { DataTypes, Model } = require("sequelize")
const sequelize = require("../config/db")

class Comunidades extends Model {}

Comunidades.init({
    id_comunidad: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre: {
        type: DataTypes.STRING(60),
        allowNull: false
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    icono: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    Color: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    ColorClaro: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    banner: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    id_categoria: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'categorias', key: 'id_categoria' }
    },
    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'usuarios', key: 'id_usuario' }
    }
}, {
    sequelize,
    modelName: "Comunidades",
    tableName: "comunidades",
    timestamps: true
})

module.exports = Comunidades
