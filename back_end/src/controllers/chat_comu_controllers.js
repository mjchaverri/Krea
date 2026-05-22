

const { Chat_Comu } = require("../index")
const { validationResult } = require("express-validator")


const crearMensaje = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: 400, message: "Datos inválidos", data: errors.array() })
  }
  try {
    const { usuario_nombre, texto, id_comunidad } = req.body
    const nuevoMensaje = await Chat_Comu.create({ usuario_nombre, Fecha: new Date(), texto, id_comunidad })
    res.status(201).json({ status: 201, message: "Mensaje enviado correctamente", data: nuevoMensaje })
  } catch (error) {
    res.status(500).json({ status: 500, message: error.message })
  }
}

const obtenerMensajesPorComunidad = async (req, res) => {
  try {
    const { id_comunidad } = req.params
    const page = Math.max(parseInt(req.query.page) || 1, 1)
    const limit = Math.min(parseInt(req.query.limit) || 20, 100)
    const offset = (page - 1) * limit

    const { count, rows } = await Chat_Comu.findAndCountAll({
      where: { id_comunidad },
      order: [["Fecha", "ASC"]],
      limit,
      offset
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

const eliminarMensaje = async (req, res) => {
  try {
    const { id_chat_comu } = req.params
    const mensaje = await Chat_Comu.findByPk(id_chat_comu)
    if (!mensaje) return res.status(404).json({ status: 404, message: "Mensaje no encontrado" })
    await mensaje.destroy()
    res.status(200).json({ status: 200, message: "Mensaje eliminado correctamente" })
  } catch (error) {
    res.status(500).json({ status: 500, message: error.message })
  }
}

module.exports = { crearMensaje, obtenerMensajesPorComunidad, eliminarMensaje }
