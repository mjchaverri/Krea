const { body } = require("express-validator")

const validarMensaje = [
    body("usuario_nombre")
        .trim().notEmpty().withMessage("El nombre de usuario es requerido"),
    body("texto")
        .trim().notEmpty().withMessage("El mensaje no puede estar vacío"),
    body("id_comunidad")
        .notEmpty().withMessage("El id_comunidad es requerido")
        .isInt({ min: 1 }).withMessage("id_comunidad debe ser un entero positivo"),
]

module.exports = { validarMensaje }
