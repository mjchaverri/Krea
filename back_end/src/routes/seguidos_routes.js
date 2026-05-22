const express = require("express")
const router = express.Router()
const verificarToken = require("../middlewares/authMiddleware")
const {
    seguir,
    dejarSeguir,
    obtenerSeguidores,
    obtenerSiguiendo,
    verificarSeguimiento,
    portafoliosDeSeguidos
} = require("../controllers/seguidos_controller")

router.post("/",                          verificarToken, seguir)
router.delete("/:id_seguido",             verificarToken, dejarSeguir)
router.get("/seguidores/:id_usuario",     obtenerSeguidores)
router.get("/siguiendo/:id_usuario",      obtenerSiguiendo)
router.get("/check/:id_seguido",          verificarToken, verificarSeguimiento)
router.get("/portafolios",                verificarToken, portafoliosDeSeguidos)

module.exports = router
