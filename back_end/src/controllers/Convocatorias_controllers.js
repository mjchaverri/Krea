const { Convocatorias, Participante_convo, Usuario } = require("../index")
const { validationResult } = require("express-validator")
const { Op } = require("sequelize")

const crearConvocatoria = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ status: 400, message: "Datos inválidos", data: errors.array() })
    }
    try {
        const { nombre, descripcion, fecha_cierre, id_usuario } = req.body
        const nuevaConvocatoria = await Convocatorias.create({ nombre, descripcion, fecha_cierre, id_usuario })
        res.status(201).json({ status: 201, message: "Convocatoria creada correctamente", data: nuevaConvocatoria })
    } catch (error) {
        res.status(500).json({ status: 500, message: error.message })
    }
}

const obtenerConvocatorias = async (req, res) => {
    try {
        const page   = Math.max(parseInt(req.query.page)  || 1, 1)
        const limit  = Math.min(parseInt(req.query.limit) || 10, 100)
        const offset = (page - 1) * limit
        const { buscar } = req.query

        const where = buscar
            ? { nombre: { [Op.like]: `%${buscar}%` } }
            : {}

        const { count, rows } = await Convocatorias.findAndCountAll({
            where,
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

const eliminarConvocatoria = async (req, res) => {
    try {
        const { id_convocatoria } = req.params
        const convocatoriaEncontrada = await Convocatorias.findByPk(id_convocatoria)
        if (!convocatoriaEncontrada) {
            return res.status(404).json({ status: 404, message: "Convocatoria no encontrada" })
        }
        await convocatoriaEncontrada.destroy()
        res.status(200).json({ status: 200, message: "Convocatoria eliminada correctamente" })
    } catch (error) {
        res.status(500).json({ status: 500, message: error.message })
    }
}

const editarConvocatoria = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ status: 400, message: "Datos inválidos", data: errors.array() })
    }
    try {
        const { id_convocatoria } = req.params
        const { nombre, descripcion, fecha_cierre } = req.body
        const convocatoriaEncontrada = await Convocatorias.findByPk(id_convocatoria)
        if (!convocatoriaEncontrada) {
            return res.status(404).json({ status: 404, message: "Convocatoria no encontrada" })
        }
        await convocatoriaEncontrada.update({ nombre, descripcion, fecha_cierre })
        res.status(200).json({ status: 200, message: "Convocatoria actualizada correctamente", data: convocatoriaEncontrada })
    } catch (error) {
        res.status(500).json({ status: 500, message: error.message })
    }
}

const obtenerParticipantesDeConvocatoria = async (req, res) => {
    try {
        const { id_convocatoria } = req.params
        const participantes = await Participante_convo.findAll({
            where: { id_convocatoria },
            include: [{ model: Usuario, attributes: ['id_usuario', 'nombre_completo', 'nombre_usuario', 'img_perfil'] }]
        })
        res.status(200).json({ status: 200, message: "OK", data: participantes })
    } catch (error) {
        res.status(500).json({ status: 500, message: error.message })
    }
}

module.exports = { crearConvocatoria, obtenerConvocatorias, eliminarConvocatoria, editarConvocatoria, obtenerParticipantesDeConvocatoria }
