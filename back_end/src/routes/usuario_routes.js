const express = require("express");
const router = express.Router();
const {
    crearUsuario,
    LoginUsuario,
    editarUsuario,
    eliminarUsuario
} = require("../controllers/UsuarioController");

router.post("/register", crearUsuario);
router.post("/login", LoginUsuario);
router.put("/:id", editarUsuario);
router.delete("/:id", eliminarUsuario);

module.exports = router;
