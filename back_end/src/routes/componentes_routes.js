const express = require("express");
const router = express.Router();
const {
    crearComponente,
    obtenerComponentes,
    eliminarComponente,
    editarComponente
} = require("../controllers/componentes_controllers");

router.post("/", crearComponente);
router.get("/", obtenerComponentes);
router.put("/:id", editarComponente);
router.delete("/:id", eliminarComponente);

module.exports = router;
