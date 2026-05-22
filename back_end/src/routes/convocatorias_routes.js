const express = require("express")
const router  = express.Router()
const { crearConvocatoria, obtenerConvocatorias, eliminarConvocatoria, editarConvocatoria, obtenerParticipantesDeConvocatoria } = require("../controllers/Convocatorias_controllers")
const verificarToken = require("../middlewares/authMiddleware")
const roleMiddleware = require("../middlewares/roleMiddleware")
const { validarConvocatoria, validarEditarConvocatoria } = require("../validators/convocatoria_validators")

/**
 * @swagger
 * tags:
 *   name: Convocatorias
 *   description: Gestión de convocatorias
 */

/**
 * @swagger
 * /convocatorias:
 *   get:
 *     summary: Listar convocatorias (con paginación y búsqueda)
 *     tags: [Convocatorias]
 *     security: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *       - in: query
 *         name: buscar
 *         description: Busca convocatorias por nombre
 *         schema: { type: string }
 *     responses:
 *       200: { description: Lista de convocatorias con meta de paginación }
 *   post:
 *     summary: Crear convocatoria (empresa o admin)
 *     tags: [Convocatorias]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nombre, descripcion, fecha_cierre, id_usuario]
 *             properties:
 *               nombre:       { type: string }
 *               descripcion:  { type: string }
 *               fecha_cierre: { type: string, format: date }
 *               id_usuario:   { type: integer }
 *     responses:
 *       201: { description: Convocatoria creada }
 *       403: { description: Acceso restringido }
 */
router.get("/",  obtenerConvocatorias)
router.post("/", verificarToken, roleMiddleware("empresa", "admin"), validarConvocatoria, crearConvocatoria)

/**
 * @swagger
 * /convocatorias/{id_convocatoria}:
 *   put:
 *     summary: Editar convocatoria (empresa o admin)
 *     tags: [Convocatorias]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_convocatoria
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Convocatoria actualizada }
 *   delete:
 *     summary: Eliminar convocatoria (empresa o admin)
 *     tags: [Convocatorias]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_convocatoria
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Convocatoria eliminada }
 */
router.get("/:id_convocatoria/participantes", verificarToken, roleMiddleware("admin"), obtenerParticipantesDeConvocatoria)
router.put("/:id_convocatoria",    verificarToken, roleMiddleware("empresa", "admin"), validarEditarConvocatoria, editarConvocatoria)
router.delete("/:id_convocatoria", verificarToken, roleMiddleware("empresa", "admin"), eliminarConvocatoria)

module.exports = router
