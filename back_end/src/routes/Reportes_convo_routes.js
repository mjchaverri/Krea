const express = require("express")
const router = express.Router()
const {crearReporte_convo, obtenerReporte_convo, eliminarReporte_convo, editarReporte_convo} = require("../controllers/Reporte_convo_controller")

router.post("/crearReporte_convo",crearReporte_convo)
router.get("/obtenerReporte_convo",obtenerReporte_convo)
router.delete("/eliminarReporte_convo/:id_reporte_convo",eliminarReporte_convo)
router.put("/editarReporte_convo/:id_reporte_convo",editarReporte_convo)

module.exports = router