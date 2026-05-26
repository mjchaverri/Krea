const { DataTypes, Model } = require("sequelize")
const sequelize = require("../config/db")

class Usuario extends Model {}

Usuario.init({
    id_usuario: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre_usuario: {
        type: DataTypes.STRING(30),
        allowNull: false,
        unique: true
    },
    nombre_completo: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    correo: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
    },
    telefono: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    provincia: {
        type: DataTypes.STRING(40),
        allowNull: true
    },
    canton: {
        type: DataTypes.STRING(40),
        allowNull: true
    },
    distrito: {
        type: DataTypes.STRING(40),
        allowNull: true
    },
    contrasena: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    img_perfil: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    id_rol: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'roles', key: 'id_rol' }
    },
    bloqueado: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
    },
    fecha_ban_expira: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
    },
    razon_ban: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
    }
}, {
    sequelize,
    modelName: "Usuario",
    tableName: "usuarios",
    timestamps: true
})

module.exports = Usuario
