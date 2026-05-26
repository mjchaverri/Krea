const { Resenas_perfil, Usuario } = require("../index")
const { validationResult } = require("express-validator")

const obtenerResenasPorUsuario = async (req, res) => {
    try {
        const { id_usuario_receptor } = req.params
        const page  = Math.max(parseInt(req.query.page)  || 1,  1)
        const limit = Math.min(parseInt(req.query.limit) || 10, 100)
        const offset = (page - 1) * limit

        const { count, rows } = await Resenas_perfil.findAndCountAll({
            where: { id_usuario_receptor },
            include: [{
                model: Usuario,
                as: 'autor',
                attributes: ['id_usuario', 'nombre_completo', 'img_perfil'],
            }],
            limit,
            offset,
            order: [['createdAt', 'DESC']],
        })

        res.status(200).json({
            status: 200,
            message: "OK",
            data: rows,
            meta: { total: count, page, limit, pages: Math.ceil(count / limit) },
        })
    } catch (error) {
        res.status(500).json({ status: 500, message: error.message })
    }
}

const crearResenaPerfil = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ status: 400, message: "Datos inválidos", data: errors.array() })
    }
    try {
        const { id_usuario_receptor, calificacion, comentarios } = req.body
        const id_usuario_autor = req.usuario.id

        if (String(id_usuario_autor) === String(id_usuario_receptor)) {
            return res.status(403).json({ status: 403, message: "No puedes reseñarte a ti mismo." })
        }

        const nueva = await Resenas_perfil.create({
            id_usuario_receptor,
            id_usuario_autor,
            calificacion,
            comentarios,
        })

        const conAutor = await Resenas_perfil.findByPk(nueva.id_resena_perfil, {
            include: [{ model: Usuario, as: 'autor', attributes: ['id_usuario', 'nombre_completo', 'img_perfil'] }],
        })

        res.status(201).json({ status: 201, message: "Reseña creada correctamente", data: conAutor })
    } catch (error) {
        res.status(500).json({ status: 500, message: error.message })
    }
}

const eliminarResenaPerfil = async (req, res) => {
    try {
        const { id_resena_perfil } = req.params
        const resena = await Resenas_perfil.findByPk(id_resena_perfil)
        if (!resena) {
            return res.status(404).json({ status: 404, message: "Reseña no encontrada" })
        }
        const esAdmin  = req.usuario.id_rol === 1
        const esAutor  = String(resena.id_usuario_autor) === String(req.usuario.id)
        if (!esAdmin && !esAutor) {
            return res.status(403).json({ status: 403, message: "No tienes permiso para eliminar esta reseña." })
        }
        await resena.destroy()
        res.status(200).json({ status: 200, message: "Reseña eliminada correctamente" })
    } catch (error) {
        res.status(500).json({ status: 500, message: error.message })
    }
}

const obtenerTodasResenasPerfil = async (req, res) => {
    try {
        const resenas = await Resenas_perfil.findAll({
            order: [['createdAt', 'DESC']],
            include: [
                { model: Usuario, as: 'autor', attributes: ['id_usuario', 'nombre_completo', 'nombre_usuario', 'img_perfil', 'bloqueado'] },
                { model: Usuario, as: 'receptor', attributes: ['id_usuario', 'nombre_completo', 'nombre_usuario', 'img_perfil', 'bloqueado'] },
            ],
        })
        res.status(200).json({ status: 200, message: 'OK', data: resenas })
    } catch (error) {
        res.status(500).json({ status: 500, message: error.message })
    }
}

module.exports = { obtenerResenasPorUsuario, crearResenaPerfil, eliminarResenaPerfil, obtenerTodasResenasPerfil }
