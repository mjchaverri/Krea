require("dotenv").config()
const { Usuario } = require("../index")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

// Blacklist en memoria para tokens invalidados (logout)
const tokenBlacklist = new Set()

const obtenerUsuarios = async (req, res) => {
    try {
        const page  = Math.max(parseInt(req.query.page)  || 1, 1)
        const limit = Math.min(parseInt(req.query.limit) || 20, 100)
        const offset = (page - 1) * limit
        const { count, rows } = await Usuario.findAndCountAll({
            attributes: { exclude: ['contrasena'] },
            limit,
            offset,
            order: [['createdAt', 'DESC']]
        })
        res.status(200).json({
            status: 200,
            message: 'OK',
            data: rows,
            meta: { total: count, page, limit, pages: Math.ceil(count / limit) }
        })
    } catch (error) {
        res.status(500).json({ status: 500, message: error.message })
    }
}

const crearUsuario = async (req, res) => {
    try {
        const { nombre_usuario, nombre_completo, correo, contrasena, telefono, img_perfil, id_rol } = req.body

        const contrasenaEncriptada = await bcrypt.hash(contrasena, 10)

        const nuevoUsuario = await Usuario.create({
            nombre_usuario,
            nombre_completo,
            correo,
            contrasena: contrasenaEncriptada,
            telefono,
            img_perfil,
            id_rol: id_rol || null
        })

        const { contrasena: _, ...usuarioSinClave } = nuevoUsuario.toJSON()
        res.status(201).json({ status: 201, message: "Usuario creado correctamente", data: usuarioSinClave })
    } catch (error) {
        res.status(500).json({ status: 500, message: error.message })
    }
}

const LoginUsuario = async (req, res) => {
    try {
        const { correo, contrasena } = req.body

        const usuarioEncontrado = await Usuario.findOne({ where: { correo } })

        if (!usuarioEncontrado) {
            return res.status(404).json({ status: 404, message: "Usuario no encontrado" })
        }

        const validarClave = await bcrypt.compare(contrasena, usuarioEncontrado.contrasena)

        if (!validarClave) {
            return res.status(401).json({ status: 401, message: "Contraseña incorrecta" })
        }

        const token = jwt.sign(
            { id: usuarioEncontrado.id_usuario, correo: usuarioEncontrado.correo, id_rol: usuarioEncontrado.id_rol },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || "8h" }
        )

        res.status(200).json({
            status: 200,
            message: "Login exitoso",
            data: {
                token,
                usuario: {
                    id_usuario:      usuarioEncontrado.id_usuario,
                    nombre_usuario:  usuarioEncontrado.nombre_usuario,
                    nombre_completo: usuarioEncontrado.nombre_completo,
                    correo:          usuarioEncontrado.correo,
                    img_perfil:      usuarioEncontrado.img_perfil,
                    id_rol:          usuarioEncontrado.id_rol
                }
            }
        })

    } catch (error) {
        res.status(500).json({ status: 500, message: error.message })
    }
}

const LogoutUsuario = (req, res) => {
    const authHeader = req.headers["authorization"]
    const token = authHeader && authHeader.split(" ")[1]

    if (token) tokenBlacklist.add(token)

    res.status(200).json({ status: 200, message: "Sesión cerrada correctamente" })
}

const editarUsuario = async (req, res) => {
    try {
        const { id_usuario } = req.params
        const { nombre_usuario, nombre_completo, correo, telefono, provincia, canton, distrito, img_perfil } = req.body

        const usuarioEncontrado = await Usuario.findByPk(id_usuario)
        if (!usuarioEncontrado) {
            return res.status(404).json({ status: 404, message: "Usuario no encontrado" })
        }

        await usuarioEncontrado.update({ nombre_usuario, nombre_completo, correo, telefono, provincia, canton, distrito, img_perfil })

        const { contrasena: _, ...usuarioSinClave } = usuarioEncontrado.toJSON()
        res.status(200).json({ status: 200, message: "Usuario actualizado", data: usuarioSinClave })
    } catch (error) {
        res.status(500).json({ status: 500, message: "Error al editar el usuario" })
    }
}

const obtenerUsuario = async (req, res) => {
    try {
        const { id_usuario } = req.params
        const usuarioEncontrado = await Usuario.findByPk(id_usuario, {
            attributes: { exclude: ['contrasena'] }
        })
        if (!usuarioEncontrado) {
            return res.status(404).json({ status: 404, message: "Usuario no encontrado" })
        }
        res.status(200).json({ status: 200, message: "OK", data: usuarioEncontrado })
    } catch (error) {
        res.status(500).json({ status: 500, message: error.message })
    }
}

const eliminarUsuario = async (req, res) => {
    try {
        const { id_usuario } = req.params
        const usuarioEncontrado = await Usuario.findByPk(id_usuario)

        if (!usuarioEncontrado) {
            return res.status(404).json({ status: 404, message: "Usuario no encontrado" })
        }
        await usuarioEncontrado.destroy()
        res.status(200).json({ status: 200, message: "Usuario eliminado correctamente" })

    } catch (error) {
        res.status(500).json({ status: 500, message: "Error al eliminar el usuario" })
    }
}

module.exports = {
    obtenerUsuarios,
    crearUsuario,
    LoginUsuario,
    LogoutUsuario,
    editarUsuario,
    obtenerUsuario,
    eliminarUsuario,
    tokenBlacklist
}
