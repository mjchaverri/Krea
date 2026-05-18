const {Convocatorias} = require("../index")
const jwt = require("jsonwebtoken")


const crearConvocatoria = async (req , res) =>{
    try {
        const {nombre , descripcion , fecha_cierra} = req.body
        const nuevaConvocatoria = await Convocatorias.create({
            nombre,
            descripcion,
            fecha_cierra
        })
        res.status(201).json({"convocatoria creada": nuevaConvocatoria})
    } catch (error) {
        res.status(500).json({"no se pudo crear la convocatoria": error.message})
    }
}
const obtenerConvocatorias = async (req , res) => {
    try  {
        const convocatorias = await Convocatorias.findAll()
        res.status(200).json({"se han encontrado las siguientes convocatorias": convocatorias})
    } catch (error) {
        res.status(500).json({"no se pudo obtener las convocatorias": error.message})
    
    }
}
const eliminarConvocatoria = async (req , res) => {
    try {
        const {id_convocatoria} = req.params
        const convocatoriaEncontrada = await Convocatorias.findByPk(id_convocatoria)
        if(!convocatoriaEncontrada) {
            return res.status(404).json({"no se encontro la convocatoria": error.message})
        }
        await convocatoriaEncontrada.destroy()
        res.status(200).json({"convocatoria eliminada": convocatoriaEncontrada})
    } catch (error) {
        res.status(500).json({"no se pudo eliminar la convocatoria": error.message})
    }
}
const editarConvocatoria = async (req , res) => {
        try {
            const {id_convocatoria} = req.params
            const {nombre , descripcion , fecha_cierra} = req.body
            const convocatoriaEncontrada = await Convocatorias.findByPk(id_convocatoria)
            if(!convocatoriaEncontrada) {
                return res.status(404).json({"no se encontro la convocatoria": error.message})
            }
            await convocatoriaEncontrada.update({
                nombre,
                descripcion,
                fecha_cierra
            })
            res.status(200).json({"convocatoria actualizada": convocatoriaEncontrada})
        } catch (error) {
            res.status(500).json({"no se pudo actualizar la convocatoria": error.message})
        }
}

module.exports = {
    crearConvocatoria,
    obtenerConvocatorias,
    eliminarConvocatoria,
    editarConvocatoria
}