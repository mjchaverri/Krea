const { Seguidos, Usuario, Portafolios } = require("../index")

// POST /seguidos  — requiere token
const seguir = async (req, res) => {
    try {
        const id_seguidor = req.usuario.id
        const { id_seguido } = req.body

        if (!id_seguido) {
            return res.status(400).json({ status: 400, message: "id_seguido es requerido" })
        }
        if (Number(id_seguidor) === Number(id_seguido)) {
            return res.status(400).json({ status: 400, message: "No puedes seguirte a ti mismo" })
        }

        const existe = await Seguidos.findOne({ where: { id_seguidor, id_seguido } })
        if (existe) {
            return res.status(409).json({ status: 409, message: "Ya sigues a este usuario" })
        }

        const nuevo = await Seguidos.create({ id_seguidor, id_seguido })
        res.status(201).json({ status: 201, message: "Ahora sigues a este usuario", data: nuevo })
    } catch (error) {
        res.status(500).json({ status: 500, message: error.message })
    }
}

// DELETE /seguidos/:id_seguido  — requiere token
const dejarSeguir = async (req, res) => {
    try {
        const id_seguidor = req.usuario.id
        const { id_seguido } = req.params

        const relacion = await Seguidos.findOne({ where: { id_seguidor, id_seguido } })
        if (!relacion) {
            return res.status(404).json({ status: 404, message: "No sigues a este usuario" })
        }

        await relacion.destroy()
        res.status(200).json({ status: 200, message: "Dejaste de seguir a este usuario" })
    } catch (error) {
        res.status(500).json({ status: 500, message: error.message })
    }
}

// GET /seguidos/seguidores/:id_usuario  — público
const obtenerSeguidores = async (req, res) => {
    try {
        const { id_usuario } = req.params
        const seguidores = await Seguidos.findAll({
            where: { id_seguido: id_usuario },
            include: [{
                model: Usuario,
                as: 'seguidor',
                attributes: ['id_usuario', 'nombre_completo', 'nombre_usuario', 'img_perfil']
            }]
        })
        res.status(200).json({ status: 200, message: "OK", data: seguidores })
    } catch (error) {
        res.status(500).json({ status: 500, message: error.message })
    }
}

// GET /seguidos/siguiendo/:id_usuario  — público
const obtenerSiguiendo = async (req, res) => {
    try {
        const { id_usuario } = req.params
        const siguiendo = await Seguidos.findAll({
            where: { id_seguidor: id_usuario },
            include: [{
                model: Usuario,
                as: 'seguido',
                attributes: ['id_usuario', 'nombre_completo', 'nombre_usuario', 'img_perfil']
            }]
        })
        res.status(200).json({ status: 200, message: "OK", data: siguiendo })
    } catch (error) {
        res.status(500).json({ status: 500, message: error.message })
    }
}

// GET /seguidos/check/:id_seguido  — requiere token
const verificarSeguimiento = async (req, res) => {
    try {
        const id_seguidor = req.usuario.id
        const { id_seguido } = req.params
        const relacion = await Seguidos.findOne({ where: { id_seguidor, id_seguido } })
        res.status(200).json({ status: 200, message: "OK", data: { siguiendo: !!relacion } })
    } catch (error) {
        res.status(500).json({ status: 500, message: error.message })
    }
}

// GET /seguidos/portafolios  — requiere token (portafolios de usuarios que sigo)
const portafoliosDeSeguidos = async (req, res) => {
    try {
        const id_seguidor = req.usuario.id
        const relaciones = await Seguidos.findAll({ where: { id_seguidor } })
        const ids = relaciones.map(r => r.id_seguido)

        if (ids.length === 0) {
            return res.status(200).json({ status: 200, message: "OK", data: [] })
        }

        const { Op } = require("sequelize")
        const portafolios = await Portafolios.findAll({
            where: { id_usuario: { [Op.in]: ids } },
            include: [{ model: Usuario, attributes: ['id_usuario', 'nombre_completo', 'img_perfil'] }],
            order: [['createdAt', 'DESC']]
        })
        res.status(200).json({ status: 200, message: "OK", data: portafolios })
    } catch (error) {
        res.status(500).json({ status: 500, message: error.message })
    }
}

module.exports = {
    seguir,
    dejarSeguir,
    obtenerSeguidores,
    obtenerSiguiendo,
    verificarSeguimiento,
    portafoliosDeSeguidos
}
