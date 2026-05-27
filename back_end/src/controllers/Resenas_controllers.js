const { Resenas, Usuario, Portafolios } = require("../index")
const { validationResult } = require("express-validator")

const crearResena = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ status: 400, message: "Datos inválidos", data: errors.array() })
    }
    try {
        const { comentarios, calificacion, id_usuario, id_portafolio } = req.body
        const nuevaResena = await Resenas.create({ comentarios, calificacion, id_usuario, id_portafolio })
        res.status(201).json({ status: 201, message: "Reseña creada correctamente", data: nuevaResena })
    } catch (error) {
        res.status(500).json({ status: 500, message: error.message })
    }
}

const obtenerResenas = async (req, res) => {
    try {
        const page = Math.max(parseInt(req.query.page) || 1, 1)
        const limit = Math.min(parseInt(req.query.limit) || 10, 100)
        const offset = (page - 1) * limit

        const { count, rows } = await Resenas.findAndCountAll({ limit, offset, order: [["createdAt", "DESC"]] })
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

const obtenerResenasPorPortafolio = async (req, res) => {
    try {
        const { id_portafolio } = req.params
        const page = Math.max(parseInt(req.query.page) || 1, 1)
        const limit = Math.min(parseInt(req.query.limit) || 10, 100)
        const offset = (page - 1) * limit

        const { count, rows } = await Resenas.findAndCountAll({ where: { id_portafolio }, limit, offset })
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

const eliminarResena = async (req, res) => {
    try {
        const { id_resena } = req.params
        const resenaEncontrada = await Resenas.findByPk(id_resena)
        if (!resenaEncontrada) {
            return res.status(404).json({ status: 404, message: "Reseña no encontrada" })
        }
        const esAutor = String(resenaEncontrada.id_usuario) === String(req.usuario.id)
        const esAdmin = req.usuario.id_rol === 1
        if (!esAdmin && !esAutor) {
            return res.status(403).json({ status: 403, message: "No tienes permiso para eliminar esta reseña" })
        }
        await resenaEncontrada.destroy()
        res.status(200).json({ status: 200, message: "Reseña eliminada correctamente" })
    } catch (error) {
        res.status(500).json({ status: 500, message: error.message })
    }
}

const editarResena = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ status: 400, message: "Datos inválidos", data: errors.array() })
    }
    try {
        const { id_resena } = req.params
        const { comentarios, calificacion } = req.body
        const resenaEncontrada = await Resenas.findByPk(id_resena)
        if (!resenaEncontrada) {
            return res.status(404).json({ status: 404, message: "Reseña no encontrada" })
        }
        await resenaEncontrada.update({ comentarios, calificacion })
        res.status(200).json({ status: 200, message: "Reseña actualizada correctamente", data: resenaEncontrada })
    } catch (error) {
        res.status(500).json({ status: 500, message: error.message })
    }
}

const obtenerTodasResenas = async (req, res) => {
    try {
        const resenas = await Resenas.findAll({
            order: [['createdAt', 'DESC']],
            include: [
                { model: Usuario, attributes: ['id_usuario', 'nombre_completo', 'nombre_usuario', 'img_perfil', 'bloqueado'] },
                { model: Portafolios, attributes: ['id_portafolio', 'titulo'] },
            ],
        })
        res.status(200).json({ status: 200, message: 'OK', data: resenas })
    } catch (error) {
        res.status(500).json({ status: 500, message: error.message })
    }
}

module.exports = { crearResena, obtenerResenas, obtenerResenasPorPortafolio, eliminarResena, editarResena, obtenerTodasResenas }
