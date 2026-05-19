const express = require("express")
const router  = express.Router()
const { crearPortafolio, obtenerPortafolios, obtenerPortafoliosPorUsuario, eliminarPortafolio, editarPortafolio } = require("../controllers/Portafolios_controller")
const verificarToken = require("../middlewares/authMiddleware")
const { validarPortafolio, validarEditarPortafolio } = require("../validators/portafolio_validators")

/**
 * @swagger
 * tags:
 *   name: Portafolios
 *   description: Gestión de portafolios de usuarios
 */

/**
 * @swagger
 * /portafolios:
 *   get:
 *     summary: Listar portafolios (paginación y búsqueda por título)
 *     tags: [Portafolios]
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
 *         description: Busca portafolios por título
 *         schema: { type: string }
 *     responses:
 *       200: { description: Lista de portafolios }
 *   post:
 *     summary: Crear portafolio
 *     tags: [Portafolios]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [titulo, id_usuario]
 *             properties:
 *               titulo:      { type: string }
 *               descripcion: { type: string }
 *               pdf:         { type: string }
 *               img_portada: { type: string }
 *               id_usuario:  { type: integer }
 *     responses:
 *       201: { description: Portafolio creado }
 */
router.get("/",  obtenerPortafolios)
router.post("/", verificarToken, validarPortafolio, crearPortafolio)

/**
 * @swagger
 * /portafolios/usuario/{id_usuario}:
 *   get:
 *     summary: Obtener portafolios de un usuario
 *     tags: [Portafolios]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id_usuario
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Portafolios del usuario }
 */
router.get("/usuario/:id_usuario", obtenerPortafoliosPorUsuario)

/**
 * @swagger
 * /portafolios/{id_portafolio}:
 *   put:
 *     summary: Editar portafolio
 *     tags: [Portafolios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_portafolio
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Portafolio actualizado }
 *   delete:
 *     summary: Eliminar portafolio
 *     tags: [Portafolios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_portafolio
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Portafolio eliminado }
 */
router.put("/:id_portafolio",    verificarToken, validarEditarPortafolio, editarPortafolio)
router.delete("/:id_portafolio", verificarToken,                          eliminarPortafolio)

module.exports = router
