const express = require("express")
const router = express.Router()
const { crearRol, obtnerRoles, eliminarRol, editarRol } = require("../controllers/Roles_controllers")
const { validarNombre } = require("../validators/nombre_validators")

router.get("/",           obtnerRoles)
router.post("/",          validarNombre, crearRol)
router.put("/:id_rol",    validarNombre, editarRol)
router.delete("/:id_rol",               eliminarRol)

module.exports = router
