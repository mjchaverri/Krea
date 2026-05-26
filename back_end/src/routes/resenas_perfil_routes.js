const express = require("express")
const router  = express.Router()
const { obtenerResenasPorUsuario, crearResenaPerfil, eliminarResenaPerfil } = require("../controllers/Resenas_perfil_controller")
const verificarToken = require("../middlewares/authMiddleware")
const { validarResenaPerfil } = require("../validators/resenas_perfil_validators")

router.get("/usuario/:id_usuario_receptor",  obtenerResenasPorUsuario)
router.post("/",    verificarToken, validarResenaPerfil, crearResenaPerfil)
router.delete("/:id_resena_perfil", verificarToken, eliminarResenaPerfil)

module.exports = router
