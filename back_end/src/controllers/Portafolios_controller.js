const { Portafolios } = require("../index")
const { validationResult } = require("express-validator")
const { Op } = require("sequelize")

const crearPortafolio = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ status: 400, message: "Datos inválidos", data: errors.array() })
    }
    try {
        const { titulo, descripcion, pdf, img_portada, id_usuario } = req.body
        const nuevoPortafolio = await Portafolios.create({ titulo, descripcion, pdf, img_portada, id_usuario })
        res.status(201).json({ status: 201, message: "Portafolio creado correctamente", data: nuevoPortafolio })
    } catch (error) {
        res.status(500).json({ status: 500, message: error.message })
    }
}

const obtenerPortafolios = async (req, res) => {
    try {
        const page = Math.max(parseInt(req.query.page) || 1, 1)
        const limit = Math.min(parseInt(req.query.limit) || 10, 100)
        const offset = (page - 1) * limit
        const { buscar } = req.query

        const where = buscar
            ? { titulo: { [Op.like]: `%${buscar}%` } }
            : {}

        const { count, rows } = await Portafolios.findAndCountAll({ where, limit, offset, order: [["createdAt", "DESC"]] })
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

const obtenerPortafoliosPorUsuario = async (req, res) => {
    try {
        const { id_usuario } = req.params
        const page = Math.max(parseInt(req.query.page) || 1, 1)
        const limit = Math.min(parseInt(req.query.limit) || 10, 100)
        const offset = (page - 1) * limit

        const { count, rows } = await Portafolios.findAndCountAll({ where: { id_usuario }, limit, offset })
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

const eliminarPortafolio = async (req, res) => {
    try {
        const { id_portafolio } = req.params
        const portafolioEncontrado = await Portafolios.findByPk(id_portafolio)
        if (!portafolioEncontrado) {
            return res.status(404).json({ status: 404, message: "Portafolio no encontrado" })
        }
        const esAdmin = req.usuario.id_rol === 1
        const esPropietario = String(portafolioEncontrado.id_usuario) === String(req.usuario.id)
        if (!esAdmin && !esPropietario) {
            return res.status(403).json({ status: 403, message: "No tienes permiso para eliminar este portafolio." })
        }
        await portafolioEncontrado.destroy()
        res.status(200).json({ status: 200, message: "Portafolio eliminado correctamente" })
    } catch (error) {
        res.status(500).json({ status: 500, message: error.message })
    }
}

const editarPortafolio = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ status: 400, message: "Datos inválidos", data: errors.array() })
    }
    try {
        const { id_portafolio } = req.params
        const { titulo, descripcion, pdf, img_portada } = req.body
        const portafolioEncontrado = await Portafolios.findByPk(id_portafolio)
        if (!portafolioEncontrado) {
            return res.status(404).json({ status: 404, message: "Portafolio no encontrado" })
        }
        await portafolioEncontrado.update({ titulo, descripcion, pdf, img_portada })
        res.status(200).json({ status: 200, message: "Portafolio actualizado correctamente", data: portafolioEncontrado })
    } catch (error) {
        res.status(500).json({ status: 500, message: error.message })
    }
}

module.exports = { crearPortafolio, obtenerPortafolios, obtenerPortafoliosPorUsuario, eliminarPortafolio, editarPortafolio }
