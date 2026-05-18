const express = require("express");
const router = express.Router();
const {
    crearCategoria,
    obtenerCategorias,
    eliminarCategoria,
    editarCategoria
} = require("../controllers/categorias_controllers");

router.post("/", crearCategoria);
router.get("/", obtenerCategorias);
router.put("/:id", editarCategoria);
router.delete("/:id", eliminarCategoria);

module.exports = router;
