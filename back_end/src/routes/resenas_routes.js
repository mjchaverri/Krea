const express = require("express")
const router  = express.Router()
const { crearResena, obtenerResenas, obtenerResenasPorPortafolio, eliminarResena, editarResena, obtenerTodasResenas } = require("../controllers/Resenas_controllers")
const verificarToken = require("../middlewares/authMiddleware")
const roleMiddleware  = require("../middlewares/roleMiddleware")
const { validarResena, validarEditarResena } = require("../validators/resena_validators")

router.get("/admin/todas", verificarToken, roleMiddleware("admin"), obtenerTodasResenas)
router.get("/",                                obtenerResenas)
router.get("/portafolio/:id_portafolio",       obtenerResenasPorPortafolio)
router.post("/",          verificarToken,      validarResena,        crearResena)
router.put("/:id_resena", verificarToken,      validarEditarResena,  editarResena)
router.delete("/:id_resena", verificarToken,                         eliminarResena)

module.exports = router
