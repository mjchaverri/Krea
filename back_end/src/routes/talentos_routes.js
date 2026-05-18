const express = require("express");
const router = express.Router();
const {
    crearTalento,
    obtenerTalentos,
    eliminarTalento,
    editarTalento
} = require("../controllers/Talentos_controllers");

router.post("/", crearTalento);
router.get("/", obtenerTalentos);
router.put("/:id", editarTalento);
router.delete("/:id", eliminarTalento);

module.exports = router;
