const { body } = require("express-validator")

const validarPortafolio = [
    body("titulo")
        .trim().notEmpty().withMessage("El título es requerido")
        .isLength({ max: 100 }).withMessage("Máximo 100 caracteres"),
    body("descripcion").optional().trim(),
    body("id_usuario")
        .notEmpty().withMessage("El id_usuario es requerido")
        .isInt({ min: 1 }).withMessage("id_usuario debe ser un entero positivo"),
]

const validarEditarPortafolio = [
    body("titulo").optional().trim().isLength({ max: 100 }).withMessage("Máximo 100 caracteres"),
    body("descripcion").optional().trim(),
]

module.exports = { validarPortafolio, validarEditarPortafolio }
