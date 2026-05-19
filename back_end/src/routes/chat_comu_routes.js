const express = require("express")
const router  = express.Router()
const { crearMensaje, obtenerMensajesPorComunidad, eliminarMensaje } = require("../controllers/chat_comu_controllers")
const verificarToken = require("../middlewares/authMiddleware")
const { validarMensaje } = require("../validators/chat_validators")

router.get("/:id_comunidad",    verificarToken,              obtenerMensajesPorComunidad)
router.post("/",                verificarToken, validarMensaje, crearMensaje)
router.delete("/:id_chat_comu", verificarToken,              eliminarMensaje)

module.exports = router
