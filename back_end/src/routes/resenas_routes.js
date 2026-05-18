const express = require("express");
const router = express.Router();
const {
    crearResena,
    obtenerResenas,
    eliminarResena,
    editarResena
} = require("../controllers/Resenas_controllers");

router.post("/", crearResena);
router.get("/", obtenerResenas);
router.put("/:id", editarResena);
router.delete("/:id", eliminarResena);

module.exports = router;
