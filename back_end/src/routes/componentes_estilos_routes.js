const express = require("express");
const router = express.Router();
const {
    creaarComponente_estilo,
    obtenerComponentes_estilos,
    eliminarComponente_estilo,
    editarComponente_estilo
} = require("../controllers/Componentes_estilos");

router.post("/", creaarComponente_estilo);
router.get("/", obtenerComponentes_estilos);
router.put("/:id", editarComponente_estilo);
router.delete("/:id", eliminarComponente_estilo);

module.exports = router;
