const { body } = require("express-validator")

const validarCrearUsuario = [
    body("nombre_usuario")
        .trim().notEmpty().withMessage("El nombre de usuario es requerido")
        .isLength({ max: 30 }).withMessage("Máximo 30 caracteres"),
    body("nombre_completo")
        .trim().notEmpty().withMessage("El nombre completo es requerido")
        .isLength({ max: 100 }).withMessage("Máximo 100 caracteres"),
    body("correo")
        .trim().notEmpty().withMessage("El correo es requerido")
        .isEmail().withMessage("Debe ser un correo válido"),
    body("contrasena")
        .notEmpty().withMessage("La contraseña es requerida")
        .isLength({ min: 6 }).withMessage("Mínimo 6 caracteres"),
    body("telefono").optional().isMobilePhone().withMessage("Teléfono inválido"),
]

const validarLogin = [
    body("correo").trim().notEmpty().withMessage("El correo es requerido").isEmail().withMessage("Debe ser un correo válido"),
    body("contrasena").notEmpty().withMessage("La contraseña es requerida"),
]

const validarEditarUsuario = [
    body("nombre_usuario").optional({ checkFalsy: true }).trim().isLength({ max: 30 }).withMessage("Máximo 30 caracteres"),
    body("nombre_completo").optional({ checkFalsy: true }).trim().isLength({ max: 100 }).withMessage("Máximo 100 caracteres"),
    body("correo").optional({ checkFalsy: true }).trim().isEmail().withMessage("Debe ser un correo válido"),
    body("telefono").optional({ checkFalsy: true }).isMobilePhone('any').withMessage("Teléfono inválido"),
]

module.exports = { validarCrearUsuario, validarLogin, validarEditarUsuario }
