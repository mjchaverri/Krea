const { Router } = require("express")
const { unirseComunidad, salirComunidad, obtenerMiembrosPorComunidad, obtenerMiembrosPorUsuario } = require("../controllers/miembros_controller")
const verificarToken = require("../middlewares/authMiddleware")

const router = Router()

router.post("/",                                  verificarToken, unirseComunidad)
router.delete("/:id_comunidad/:id_usuario",       verificarToken, salirComunidad)
router.get("/comunidad/:id_comunidad",            obtenerMiembrosPorComunidad)
router.get("/usuario/:id_usuario",                verificarToken, obtenerMiembrosPorUsuario)

module.exports = router
