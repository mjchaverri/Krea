const { Talentos } = require("../index")
const { validationResult } = require("express-validator")

const crearTalento = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ status: 400, message: "Datos inválidos", data: errors.array() })
    }
    try {
        const { nombre } = req.body
        const nuevoTalento = await Talentos.create({ nombre })
        res.status(201).json({ status: 201, message: "Talento creado correctamente", data: nuevoTalento })
    } catch (error) {
        res.status(500).json({ status: 500, message: error.message })
    }
}

const obtenerTalentos = async (req, res) => {
    try {
        const talentos = await Talentos.findAll()
        res.status(200).json({ status: 200, message: "OK", data: talentos })
    } catch (error) {
        res.status(500).json({ status: 500, message: error.message })
    }
}

const eliminarTalento = async (req, res) => {
    try {
        const { id_talento } = req.params
        const talentoEncontrado = await Talentos.findByPk(id_talento)
        if (!talentoEncontrado) {
            return res.status(404).json({ status: 404, message: "Talento no encontrado" })
        }
        await talentoEncontrado.destroy()
        res.status(200).json({ status: 200, message: "Talento eliminado correctamente" })
    } catch (error) {
        res.status(500).json({ status: 500, message: error.message })
    }
}

const editarTalento = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ status: 400, message: "Datos inválidos", data: errors.array() })
    }
    try {
        const { id_talento } = req.params
        const { nombre } = req.body
        const talentoEncontrado = await Talentos.findByPk(id_talento)
        if (!talentoEncontrado) {
            return res.status(404).json({ status: 404, message: "Talento no encontrado" })
        }
        await talentoEncontrado.update({ nombre })
        res.status(200).json({ status: 200, message: "Talento actualizado correctamente", data: talentoEncontrado })
    } catch (error) {
        res.status(500).json({ status: 500, message: error.message })
    }
}

module.exports = { crearTalento, obtenerTalentos, eliminarTalento, editarTalento }
