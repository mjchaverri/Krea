const express = require("express")
const router = express.Router()
const { crearTalento, obtenerTalentos, eliminarTalento, editarTalento } = require("../controllers/Talentos_controllers")
const { validarNombre } = require("../validators/nombre_validators")

router.get("/",              obtenerTalentos)
router.post("/",             validarNombre, crearTalento)
router.put("/:id_talento",   validarNombre, editarTalento)
router.delete("/:id_talento",              eliminarTalento)

module.exports = router
