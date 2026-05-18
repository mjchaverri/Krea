const express = require("express")
const router = express.Router()
const {crearPortafolio, obtenerPortafolios, eliminarPortafolio, editarPortafolio} = require("../controllers/Portafolios_controller")

router.post("/crearPortafolio",crearPortafolio)
router.get("/obtenerPortafolios",obtenerPortafolios)
router.delete("/eliminarPortafolio/:id_portafolio",eliminarPortafolio)
router.put("/editarPortafolio/:id_portafolio",editarPortafolio)

module.exports = router