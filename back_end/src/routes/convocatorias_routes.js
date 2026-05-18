const express = require("express");
const router = express.Router();
const {
    crearConvocatoria,
    obtenerConvocatorias,
    eliminarConvocatoria,
    editarConvocatoria
} = require("../controllers/Convocatorias_controllers");

router.post("/", crearConvocatoria);
router.get("/", obtenerConvocatorias);
router.put("/:id", editarConvocatoria);
router.delete("/:id", eliminarConvocatoria);

module.exports = router;
