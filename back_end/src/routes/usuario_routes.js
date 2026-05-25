const express = require("express")
const router = express.Router()
const {
    obtenerUsuarios,
    crearUsuario,
    LoginUsuario,
    LogoutUsuario,
    editarUsuario,
    obtenerUsuario,
    eliminarUsuario
} = require("../controllers/UsuarioController")
const verificarToken = require("../middlewares/authMiddleware")
const roleMiddleware = require("../middlewares/roleMiddleware")
const { validarCrearUsuario, validarLogin, validarEditarUsuario } = require("../validators/usuario_validators")

/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: Gestión de usuarios
 */

/**
 * @swagger
 * /usuarios/register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags: [Usuarios]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nombre_usuario, nombre_completo, correo, contrasena]
 *             properties:
 *               nombre_usuario:  { type: string, maxLength: 30 }
 *               nombre_completo: { type: string, maxLength: 100 }
 *               correo:          { type: string, format: email }
 *               contrasena:      { type: string, minLength: 6 }
 *               telefono:        { type: string }
 *               id_rol:          { type: integer }
 *     responses:
 *       201: { description: Usuario creado }
 *       400: { description: Datos inválidos }
 */
router.get("/", verificarToken, obtenerUsuarios)
router.post("/register", validarCrearUsuario, crearUsuario)

/**
 * @swagger
 * /usuarios/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Usuarios]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [correo, contrasena]
 *             properties:
 *               correo:     { type: string, format: email }
 *               contrasena: { type: string }
 *     responses:
 *       200: { description: Login exitoso, retorna token JWT }
 *       401: { description: Contraseña incorrecta }
 *       404: { description: Usuario no encontrado }
 */
router.post("/login", validarLogin, LoginUsuario)

/**
 * @swagger
 * /usuarios/logout:
 *   post:
 *     summary: Cerrar sesión (invalida el token)
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: Sesión cerrada }
 *       401: { description: Token requerido }
 */
router.post("/logout", verificarToken, LogoutUsuario)

/**
 * @swagger
 * /usuarios/{id_usuario}:
 *   get:
 *     summary: Obtener un usuario por ID
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_usuario
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Usuario encontrado }
 *       404: { description: Usuario no encontrado }
 *   put:
 *     summary: Editar perfil de usuario
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_usuario
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre_usuario:  { type: string }
 *               nombre_completo: { type: string }
 *               correo:          { type: string }
 *               telefono:        { type: string }
 *               provincia:       { type: string }
 *               canton:          { type: string }
 *               distrito:        { type: string }
 *     responses:
 *       200: { description: Usuario actualizado }
 *   delete:
 *     summary: Eliminar usuario (solo admin)
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_usuario
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Usuario eliminado }
 *       403: { description: Acceso restringido }
 */
router.get("/:id_usuario", verificarToken, obtenerUsuario)
router.put("/:id_usuario", verificarToken, validarEditarUsuario, editarUsuario)
router.delete("/:id_usuario", verificarToken, roleMiddleware("admin"), eliminarUsuario)

module.exports = router
