const { body } = require("express-validator")

// Reutilizable para entidades simples: roles, talentos, categorías
const validarNombre = [
    body("nombre")
        .trim().notEmpty().withMessage("El nombre es requerido")
        .isLength({ max: 50 }).withMessage("Máximo 50 caracteres"),
]

module.exports = { validarNombre }
