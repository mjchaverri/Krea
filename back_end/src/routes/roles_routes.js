const express = require("express");
const router = express.Router();
const {
    crearRol,
    obtnerRoles,
    eliminarRol,
    editarRol
} = require("../controllers/Roles_controllers");

router.post("/", crearRol);
router.get("/", obtnerRoles);
router.put("/:id", editarRol);
router.delete("/:id", eliminarRol);

module.exports = router;
