const { Miembros, Comunidades, Usuario } = require("../index")

const unirseComunidad = async (req, res) => {
    try {
        const { id_comunidad, id_usuario } = req.body
        if (!id_comunidad || !id_usuario) {
            return res.status(400).json({ status: 400, message: "id_comunidad e id_usuario son requeridos" })
        }
        const existe = await Miembros.findOne({ where: { id_comunidad, id_usuario } })
        if (existe) {
            return res.status(409).json({ status: 409, message: "Ya eres miembro de esta comunidad" })
        }
        const nuevo = await Miembros.create({ id_comunidad, id_usuario, Fecha: new Date() })
        res.status(201).json({ status: 201, message: "Te uniste a la comunidad", data: nuevo })
    } catch (error) {
        res.status(500).json({ status: 500, message: error.message })
    }
}

const salirComunidad = async (req, res) => {
    try {
        const { id_comunidad, id_usuario } = req.params
        const miembro = await Miembros.findOne({ where: { id_comunidad, id_usuario } })
        if (!miembro) {
            return res.status(404).json({ status: 404, message: "No eres miembro de esta comunidad" })
        }
        await miembro.destroy()
        res.status(200).json({ status: 200, message: "Saliste de la comunidad" })
    } catch (error) {
        res.status(500).json({ status: 500, message: error.message })
    }
}

const obtenerMiembrosPorComunidad = async (req, res) => {
    try {
        const { id_comunidad } = req.params
        const miembros = await Miembros.findAll({
            where: { id_comunidad },
            include: [{ model: Usuario, attributes: ['id_usuario', 'nombre_completo', 'nombre_usuario', 'img_perfil'] }],
        })
        res.status(200).json({ status: 200, message: "OK", data: miembros })
    } catch (error) {
        res.status(500).json({ status: 500, message: error.message })
    }
}

const obtenerMiembrosPorUsuario = async (req, res) => {
    try {
        const { id_usuario } = req.params
        const miembros = await Miembros.findAll({ where: { id_usuario } })
        res.status(200).json({ status: 200, message: "OK", data: miembros })
    } catch (error) {
        res.status(500).json({ status: 500, message: error.message })
    }
}

module.exports = { unirseComunidad, salirComunidad, obtenerMiembrosPorComunidad, obtenerMiembrosPorUsuario }
