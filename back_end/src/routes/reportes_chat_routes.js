const express = require("express")
const router = express.Router()
const {
    crearReporteChat,
    obtenerReportesChat,
    obtenerReportesPorComunidad,
    actualizarEstadoReporte,
    banearUsuarioComunidad,
    obtenerBaneadosPorComunidad,
    desbanearUsuarioComunidad,
} = require("../controllers/reporte_chat_controller")
const verificarToken = require("../middlewares/authMiddleware")
const roleMiddleware = require("../middlewares/roleMiddleware")

// Cualquier usuario autenticado puede reportar
router.post("/", verificarToken, crearReporteChat)

// Empresa y admin pueden ver reportes por comunidad
router.get("/comunidad/:id_comunidad", verificarToken, roleMiddleware("empresa", "admin"), obtenerReportesPorComunidad)

// Solo admin ve todos los reportes
router.get("/", verificarToken, roleMiddleware("admin"), obtenerReportesChat)

// Empresa y admin pueden actualizar estado, banear y desbanear
router.put("/:id_reporte_chat/estado",                    verificarToken, roleMiddleware("empresa", "admin"), actualizarEstadoReporte)
router.post("/banear",                                    verificarToken, roleMiddleware("empresa", "admin"), banearUsuarioComunidad)
router.get("/baneados/:id_comunidad",                     verificarToken, roleMiddleware("empresa", "admin"), obtenerBaneadosPorComunidad)
router.delete("/baneados/:id_comunidad/:id_usuario",      verificarToken, roleMiddleware("empresa", "admin"), desbanearUsuarioComunidad)

module.exports = router
