const express = require("express");
const router = express.Router();
const {
    crearComunidad,
    obtenerComunidades,
    eliminarComunidad,
    editarComunidad
} = require("../controllers/comunidades_controllers");

router.post("/", crearComunidad);
router.get("/", obtenerComunidades);
router.put("/:id", editarComunidad);
router.delete("/:id", eliminarComunidad);

module.exports = router;
