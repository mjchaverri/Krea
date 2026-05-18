const express = require("express")

const router = express.Router()

const {
    crearUsuario,
    LoginUsuario,
     editarUsuario,
     eliminarUsuario
} = require("../controllers/UsuarioController.js")

router.post("/crear", crearUsuario)

router.post("/login", LoginUsuario)

router.put("/editar/:id_usuario", editarUsuario)

router.delete("/eliminar/:id_usuario", eliminarUsuario)

module.exports = router;
