const { Reporte_convo } = require("../index")
const jwt = require("jsonwebtoken")

//Controlador para crear un reporte de convocatoria en la base de datos
const crearReporte_convo = async (req, res) => {
    try {
        const { id_convocatoria, id_portafolio, id_usuario } = req.body
        const nuevoReporte_convo = await Reporte_convo.create({
            id_convocatoria,
            id_portafolio,
            id_usuario
        })
        res.status(201).json({ "reporte de convocatoria creado": nuevoReporte_convo })
    } catch (error) {
        res.status(500).json({ "no se pudo crear el reporte de convocatoria": error.message })
    }
}

//Controlador para obtener todos los reportes de convocatoria de la base de datos
const obtenerReporte_convo = async (req, res) => {
    try {
        const reporte_convo = await Reporte_convo.findAll()
        res.status(200).json({ "se han encontrado los siguientes reportes de convocatoria": reporte_convo })
    } catch (error) {
        res.status(500).json({ "no se pudo obtener los reportes de convocatoria": error.message })
    }
}

//Controlador para eliminar un reporte de convocatoria de la base de datos
const eliminarReporte_convo = async (req, res) => {
    try {
        const { id_reporte_convo } = req.params
        const reporte_convoEncontrado = await Reporte_convo.findByPk(id_reporte_convo)
        if (!reporte_convoEncontrado) {
            return res.status(404).json({ "no se encontro el reporte de convocatoria": error.message })
        }
        await reporte_convoEncontrado.destroy()
        res.status(200).json({ "reporte de convocatoria eliminado": reporte_convoEncontrado })
    } catch (error) {
        res.status(500).json({ "no se pudo eliminar el reporte de convocatoria": error.message })
    }
}

//Controlador para editar un reporte de convocatoria en la base de datos
const editarReporte_convo = async (req, res) => {
    try {
        const { id_reporte_convo } = req.params
        const { id_convocatoria, id_portafolio, id_usuario } = req.body
        const reporte_convoEncontrado = await Reporte_convo.findByPk(id_reporte_convo)
        if (!reporte_convoEncontrado) {
            return res.status(404).json({ "no se encontro el reporte de convocatoria": error.message })
        }
        await reporte_convoEncontrado.update({
            id_convocatoria,
            id_portafolio,
            id_usuario
        })
        res.status(200).json({ "reporte de convocatoria actualizado": reporte_convoEncontrado })
    } catch (error) {
        res.status(500).json({ "no se pudo actualizar el reporte de convocatoria": error.message })
    }
}

module.exports = {
    crearReporte_convo,
    obtenerReporte_convo,
    eliminarReporte_convo,
    editarReporte_convo
}