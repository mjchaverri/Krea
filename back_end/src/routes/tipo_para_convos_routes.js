const express = require("express");
const router = express.Router();
const {
    crearTipo_para_convos,
    obtenerTipos_para_convos,
    eliminarTipo_para_convos,
    editarTipo_para_convos
} = require("../controllers/tipo_para_convos_controllers");

router.post("/", crearTipo_para_convos);
router.get("/", obtenerTipos_para_convos);
router.put("/:id", editarTipo_para_convos);
router.delete("/:id", eliminarTipo_para_convos);

module.exports = router;
