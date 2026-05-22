const express = require("express")
const router  = express.Router()
const { crearComunidad, obtenerComunidades, eliminarComunidad, editarComunidad } = require("../controllers/comunidades_controllers")
const verificarToken = require("../middlewares/authMiddleware")
const roleMiddleware = require("../middlewares/roleMiddleware")
const { validarComunidad, validarEditarComunidad } = require("../validators/comunidad_validators")

/**
 * @swagger
 * tags:
 *   name: Comunidades
 *   description: Gestión de comunidades
 */

/**
 * @swagger
 * /comunidades:
 *   get:
 *     summary: Listar comunidades (con paginación)
 *     tags: [Comunidades]
 *     security: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200: { description: Lista de comunidades }
 *   post:
 *     summary: Crear comunidad (empresa o admin)
 *     tags: [Comunidades]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nombre, descripcion]
 *             properties:
 *               nombre:      { type: string, maxLength: 40 }
 *               descripcion: { type: string, maxLength: 60 }
 *               icono:       { type: string }
 *               Color:       { type: string }
 *               ColorClaro:  { type: string }
 *               banner:      { type: string }
 *               id_categoria: { type: integer }
 *     responses:
 *       201: { description: Comunidad creada }
 */
router.get("/",  obtenerComunidades)
router.post("/", verificarToken, roleMiddleware("empresa", "admin"), validarComunidad, crearComunidad)

/**
 * @swagger
 * /comunidades/{id_comunidad}:
 *   put:
 *     summary: Editar comunidad (empresa o admin)
 *     tags: [Comunidades]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_comunidad
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Comunidad actualizada }
 *   delete:
 *     summary: Eliminar comunidad (empresa o admin)
 *     tags: [Comunidades]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_comunidad
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Comunidad eliminada }
 */
router.put("/:id_comunidad",    verificarToken, roleMiddleware("empresa", "admin"), validarEditarComunidad, editarComunidad)
router.delete("/:id_comunidad", verificarToken, roleMiddleware("empresa", "admin"),                        eliminarComunidad)

module.exports = router
