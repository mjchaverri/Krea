const { Reporte_chat, Chat_Comu, Miembros, Baneado_comunidad } = require("../index")

const crearReporteChat = async (req, res) => {
    try {
        const { id_mensaje, id_comunidad, razon } = req.body
        const id_reportador = req.usuario?.id

        if (!id_mensaje || !id_comunidad || !razon?.trim()) {
            return res.status(400).json({ status: 400, message: "Faltan campos requeridos." })
        }

        const mensaje = await Chat_Comu.findByPk(id_mensaje)
        if (!mensaje) {
            return res.status(404).json({ status: 404, message: "Mensaje no encontrado." })
        }

        const reporte = await Reporte_chat.create({
            id_mensaje,
            id_comunidad,
            id_reportador,
            razon:            razon.trim(),
            texto_mensaje:    mensaje.texto,
            autor_mensaje:    mensaje.usuario_nombre,
            id_usuario_autor: mensaje.id_usuario || null,
            estado:           'pendiente',
        })

        res.status(201).json({ status: 201, message: "Reporte enviado correctamente.", data: reporte })
    } catch (error) {
        res.status(500).json({ status: 500, message: error.message })
    }
}

const obtenerReportesChat = async (req, res) => {
    try {
        const reportes = await Reporte_chat.findAll({ order: [["createdAt", "DESC"]] })
        res.status(200).json({ status: 200, message: "OK", data: reportes })
    } catch (error) {
        res.status(500).json({ status: 500, message: error.message })
    }
}

const obtenerReportesPorComunidad = async (req, res) => {
    try {
        const { id_comunidad } = req.params
        const reportes = await Reporte_chat.findAll({
            where: { id_comunidad },
            order: [["createdAt", "DESC"]],
        })
        res.status(200).json({ status: 200, message: "OK", data: reportes })
    } catch (error) {
        res.status(500).json({ status: 500, message: error.message })
    }
}

const actualizarEstadoReporte = async (req, res) => {
    try {
        const { id_reporte_chat } = req.params
        const { estado } = req.body

        if (!['pendiente', 'revisado', 'descartado'].includes(estado)) {
            return res.status(400).json({ status: 400, message: "Estado inválido." })
        }

        const reporte = await Reporte_chat.findByPk(id_reporte_chat)
        if (!reporte) {
            return res.status(404).json({ status: 404, message: "Reporte no encontrado." })
        }

        await reporte.update({ estado })
        res.status(200).json({ status: 200, message: "Estado actualizado.", data: reporte })
    } catch (error) {
        res.status(500).json({ status: 500, message: error.message })
    }
}

const obtenerBaneadosPorComunidad = async (req, res) => {
    try {
        const { id_comunidad } = req.params
        const baneados = await Baneado_comunidad.findAll({ where: { id_comunidad } })
        res.status(200).json({ status: 200, message: "OK", data: baneados })
    } catch (error) {
        res.status(500).json({ status: 500, message: error.message })
    }
}

const desbanearUsuarioComunidad = async (req, res) => {
    try {
        const { id_comunidad, id_usuario } = req.params
        const ban = await Baneado_comunidad.findOne({ where: { id_comunidad, id_usuario } })
        if (!ban) {
            return res.status(404).json({ status: 404, message: "El usuario no está baneado en esta comunidad." })
        }
        await ban.destroy()
        res.status(200).json({ status: 200, message: "Usuario desbaneado correctamente." })
    } catch (error) {
        res.status(500).json({ status: 500, message: error.message })
    }
}

const banearUsuarioComunidad = async (req, res) => {
    try {
        const { id_comunidad, id_usuario } = req.body
        const { razon } = req.body

        if (!id_comunidad || !id_usuario) {
            return res.status(400).json({ status: 400, message: "Faltan campos requeridos." })
        }

        const yaExiste = await Baneado_comunidad.findOne({ where: { id_comunidad, id_usuario } })
        if (yaExiste) {
            return res.status(409).json({ status: 409, message: "El usuario ya está baneado en esta comunidad." })
        }

        // Sacar de la comunidad si es miembro
        await Miembros.destroy({ where: { id_comunidad, id_usuario } })

        const ban = await Baneado_comunidad.create({
            id_comunidad, id_usuario,
            razon:          razon || null,
            nombre_usuario: req.body.nombre_usuario || null,
        })
        res.status(201).json({ status: 201, message: "Usuario baneado correctamente.", data: ban })
    } catch (error) {
        res.status(500).json({ status: 500, message: error.message })
    }
}

module.exports = {
    crearReporteChat,
    obtenerReportesChat,
    obtenerReportesPorComunidad,
    actualizarEstadoReporte,
    banearUsuarioComunidad,
    obtenerBaneadosPorComunidad,
    desbanearUsuarioComunidad,
}
