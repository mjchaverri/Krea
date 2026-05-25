const { body } = require("express-validator")

const validarResenaPerfil = [
    body("id_usuario_receptor")
        .notEmpty().withMessage("El id_usuario_receptor es requerido")
        .isInt({ min: 1 }).withMessage("id_usuario_receptor debe ser un entero positivo"),
    body("calificacion")
        .notEmpty().withMessage("La calificación es requerida")
        .isInt({ min: 1, max: 5 }).withMessage("La calificación debe ser entre 1 y 5"),
    body("comentarios")
        .trim().notEmpty().withMessage("El comentario es requerido"),
]

const validarEditarResenaPerfil = [
    body("calificacion").optional().isInt({ min: 1, max: 5 }).withMessage("La calificación debe ser entre 1 y 5"),
    body("comentarios").optional().trim().notEmpty().withMessage("El comentario no puede estar vacío"),
]

module.exports = { validarResenaPerfil, validarEditarResenaPerfil }
