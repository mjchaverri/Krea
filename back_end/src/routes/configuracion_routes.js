const express = require("express")
const router = express.Router()
const { obtenerConfig, guardarConfig } = require("../controllers/configuracion_controller")

router.get("/:clave", obtenerConfig)
router.put("/:clave", guardarConfig)

module.exports = router
  