const express = require("express");
const router = express.Router();
const {
    crearBloque_componente,
    obtenerBloques_componentes,
    eliminarBloque_componente,
    editarBloque_componente
} = require("../controllers/bloques_componentes_controllers");

router.post("/", crearBloque_componente);
router.get("/", obtenerBloques_componentes);
router.put("/:id", editarBloque_componente);
router.delete("/:id", eliminarBloque_componente);

module.exports = router;
