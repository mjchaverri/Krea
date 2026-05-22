const { body } = require("express-validator")

const validarComunidad = [
    body("nombre")
        .trim().notEmpty().withMessage("El nombre es requerido")
        .isLength({ max: 40 }).withMessage("Máximo 40 caracteres"),
    body("descripcion")
        .trim().notEmpty().withMessage("La descripción es requerida")
        .isLength({ max: 60 }).withMessage("Máximo 60 caracteres"),
    body("Color").optional().trim().isLength({ max: 20 }).withMessage("Máximo 20 caracteres"),
    body("ColorClaro").optional().trim().isLength({ max: 20 }).withMessage("Máximo 20 caracteres"),
]

const validarEditarComunidad = [
    body("nombre").optional().trim().isLength({ max: 40 }).withMessage("Máximo 40 caracteres"),
    body("descripcion").optional().trim().isLength({ max: 60 }).withMessage("Máximo 60 caracteres"),
]

module.exports = { validarComunidad, validarEditarComunidad }
