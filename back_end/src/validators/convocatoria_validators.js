const { body } = require("express-validator")

const validarConvocatoria = [
    body("nombre")
        .trim().notEmpty().withMessage("El nombre es requerido")
        .isLength({ max: 100 }).withMessage("Máximo 100 caracteres"),
    body("descripcion")
        .trim().notEmpty().withMessage("La descripción es requerida"),
    body("fecha_cierre")
        .notEmpty().withMessage("La fecha de cierre es requerida")
        .isDate().withMessage("Debe ser una fecha válida (YYYY-MM-DD)"),
    body("id_usuario")
        .notEmpty().withMessage("El id_usuario es requerido")
        .isInt({ min: 1 }).withMessage("id_usuario debe ser un entero positivo"),
]

const validarEditarConvocatoria = [
    body("nombre").optional().trim().isLength({ max: 100 }).withMessage("Máximo 100 caracteres"),
    body("descripcion").optional().trim().notEmpty().withMessage("La descripción no puede estar vacía"),
    body("fecha_cierre").optional().isDate().withMessage("Debe ser una fecha válida (YYYY-MM-DD)"),
]

module.exports = { validarConvocatoria, validarEditarConvocatoria }
