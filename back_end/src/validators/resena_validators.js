const { body } = require("express-validator")

const validarResena = [
    body("comentarios")
        .trim().notEmpty().withMessage("El comentario es requerido"),
    body("calificacion")
        .notEmpty().withMessage("La calificación es requerida")
        .isInt({ min: 1, max: 5 }).withMessage("La calificación debe ser un entero entre 1 y 5"),
    body("id_usuario")
        .notEmpty().withMessage("El id_usuario es requerido")
        .isInt({ min: 1 }).withMessage("id_usuario debe ser un entero positivo"),
    body("id_portafolio")
        .notEmpty().withMessage("El id_portafolio es requerido")
        .isInt({ min: 1 }).withMessage("id_portafolio debe ser un entero positivo"),
]

const validarEditarResena = [
    body("comentarios").optional().trim().notEmpty().withMessage("El comentario no puede estar vacío"),
    body("calificacion").optional().isInt({ min: 1, max: 5 }).withMessage("La calificación debe ser un entero entre 1 y 5"),
]

module.exports = { validarResena, validarEditarResena }
