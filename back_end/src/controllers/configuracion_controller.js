const { Configuracion } = require("../index")

const obtenerConfig = async (req, res) => {
    try {
        const { clave } = req.params
        const config = await Configuracion.findByPk(clave)
        if (!config) return res.status(404).json({ status: 404, message: "No encontrado", data: null })
        res.json({ status: 200, message: "OK", data: JSON.parse(config.valor || 'null') })
    } catch (error) {
        res.status(500).json({ status: 500, message: error.message })
    }
}

const guardarConfig = async (req, res) => {
    try {
        const { clave } = req.params
        const { valor } = req.body
        await Configuracion.upsert({ clave, valor: JSON.stringify(valor) })
        res.json({ status: 200, message: "Configuración guardada correctamente" })
    } catch (error) {
        res.status(500).json({ status: 500, message: error.message })
    }
}

module.exports = { obtenerConfig, guardarConfig }
