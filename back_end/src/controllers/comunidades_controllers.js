const { Comunidades, Categorias } = require("../../index")
const { validationResult } = require("express-validator")

const crearComunidad = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ status: 400, message: "Datos inválidos", data: errors.array() })
    }
    try {
        const { nombre, descripcion, icono, Color, ColorClaro, banner, id_categoria } = req.body
        const nuevaComunidad = await Comunidades.create({ nombre, descripcion, icono, Color, ColorClaro, banner, id_categoria: id_categoria || null })
        res.status(201).json({ status: 201, message: "Comunidad creada correctamente", data: nuevaComunidad })
    } catch (error) {
        res.status(500).json({ status: 500, message: error.message })
    }
}

const obtenerComunidades = async (req, res) => {
    try {
        const page = Math.max(parseInt(req.query.page) || 1, 1)
        const limit = Math.min(parseInt(req.query.limit) || 10, 100)
        const offset = (page - 1) * limit

        const { count, rows } = await Comunidades.findAndCountAll({
            include: [{ model: Categorias, attributes: ["nombre"] }],
            limit,
            offset,
            order: [["createdAt", "DESC"]]
        })
        res.status(200).json({
            status: 200,
            message: "OK",
            data: rows,
            meta: { total: count, page, limit, pages: Math.ceil(count / limit) }
        })
    } catch (error) {
        res.status(500).json({ status: 500, message: error.message })
    }
}

const eliminarComunidad = async (req, res) => {
    try {
        const { id_comunidad } = req.params
        const comunidadEncontrada = await Comunidades.findByPk(id_comunidad)
        if (!comunidadEncontrada) {
            return res.status(404).json({ status: 404, message: "Comunidad no encontrada" })
        }
        await comunidadEncontrada.destroy()
        res.status(200).json({ status: 200, message: "Comunidad eliminada correctamente" })
    } catch (error) {
        res.status(500).json({ status: 500, message: error.message })
    }
}

const editarComunidad = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ status: 400, message: "Datos inválidos", data: errors.array() })
    }
    try {
        const { id_comunidad } = req.params
        const { nombre, descripcion, icono, Color, ColorClaro, banner, id_categoria } = req.body
        const comunidadEncontrada = await Comunidades.findByPk(id_comunidad)
        if (!comunidadEncontrada) {
            return res.status(404).json({ status: 404, message: "Comunidad no encontrada" })
        }
        await comunidadEncontrada.update({ nombre, descripcion, icono, Color, ColorClaro, banner, id_categoria })
        res.status(200).json({ status: 200, message: "Comunidad actualizada correctamente", data: comunidadEncontrada })
    } catch (error) {
        res.status(500).json({ status: 500, message: error.message })
    }
}

module.exports = { crearComunidad, obtenerComunidades, eliminarComunidad, editarComunidad }
