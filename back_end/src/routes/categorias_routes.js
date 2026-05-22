const express = require("express")
const router = express.Router()
const { crearCategoria, obtenerCategorias, eliminarCategoria, editarCategoria } = require("../controllers/categorias_controllers")
const { validarNombre } = require("../validators/nombre_validators")

router.get("/",        obtenerCategorias)
router.post("/",       validarNombre, crearCategoria)
router.put("/:id",     validarNombre, editarCategoria)
router.delete("/:id",               eliminarCategoria)

module.exports = router
