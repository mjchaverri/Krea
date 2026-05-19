const { Roles } = require("../index")
const { validationResult } = require("express-validator")

const crearRol = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ status: 400, message: "Datos inválidos", data: errors.array() })
    }
    try {
        const { nombre } = req.body
        const nuevoRol = await Roles.create({ nombre })
        res.status(201).json({ status: 201, message: "Rol creado correctamente", data: nuevoRol })
    } catch (error) {
        res.status(500).json({ status: 500, message: error.message })
    }
}

const obtnerRoles = async (req, res) => {
    try {
        const roles = await Roles.findAll()
        res.status(200).json({ status: 200, message: "OK", data: roles })
    } catch (error) {
        res.status(500).json({ status: 500, message: error.message })
    }
}

const eliminarRol = async (req, res) => {
    try {
        const { id_rol } = req.params
        const rolEncontrado = await Roles.findByPk(id_rol)
        if (!rolEncontrado) {
            return res.status(404).json({ status: 404, message: "Rol no encontrado" })
        }
        await rolEncontrado.destroy()
        res.status(200).json({ status: 200, message: "Rol eliminado correctamente" })
    } catch (error) {
        res.status(500).json({ status: 500, message: error.message })
    }
}

const editarRol = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ status: 400, message: "Datos inválidos", data: errors.array() })
    }
    try {
        const { id_rol } = req.params
        const { nombre } = req.body
        const rolEncontrado = await Roles.findByPk(id_rol)
        if (!rolEncontrado) {
            return res.status(404).json({ status: 404, message: "Rol no encontrado" })
        }
        await rolEncontrado.update({ nombre })
        res.status(200).json({ status: 200, message: "Rol actualizado correctamente", data: rolEncontrado })
    } catch (error) {
        res.status(500).json({ status: 500, message: error.message })
    }
}

module.exports = { crearRol, obtnerRoles, eliminarRol, editarRol }
