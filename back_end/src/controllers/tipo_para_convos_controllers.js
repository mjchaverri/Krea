const { Tipos_para_convos } = require("../index")

const jwt = require("jsonwebtoken")

// Controlador para crear un nuevo tipo de convocatoria
const crearTipo_para_convos = async (req, res) => {
    try {
        const {nombre_tipo_convo} = req.body

        const nuevoTipo_para_convos = await Tipos_para_convos.create({
            nombre_tipo_convo
        })

        res.status(201).json(nuevoTipo_para_convos)
    } catch (error) {
        res.status(500).json({ "no se pudo crear el tipo de convocatoria": error.message })
    }

}
const obtenerTipos_para_convos = async (req, res) => {
     try {
     const tipos_para_convos = await Tipos_para_convos.findAll()
        res.status(200).json({"se han encontrado los siguientes tipos de convocatoria": tipos_para_convos})
     } catch (error) {
        res.status(500).json({"no se pudo obtener los tipos de convocatoria": error.message})
     }
}
const eliminarTipo_para_convos = async (req, res) => {
   try {
    const {id_tipo_para_convo} = req.params
    const tipo_para_convoEncontrado = await Tipos_para_convos.findByPk(id_tipo_para_convo)
    if(!tipo_para_convoEncontrado) {
        return res.status(404).json({ message: "Tipo de convocatoria no encontrado" })
   }
   await tipo_para_convoEncontrado.destroy()
    res.status(200).json({"tipo de convocatoria eliminado correctamente": tipo_para_convoEncontrado})
    } catch (error) {
        res.status(500).json({"no se pudo eliminar el tipo de convocatoria": error.message})
   }

}
const editarTipo_para_convos = async (req, res) => {
    try{
        const {id_tipo_para_convo} = req.params
        const {nombre_tipo_convo} = req.body
        const tipo_para_convoEncontrado = await Tipos_para_convos.findByPk(id_tipo_para_convo)
        if(!tipo_para_convoEncontrado) {
            return res.status(404).json({ message: "Tipo de convocatoria no encontrado" })
        }
        await tipo_para_convoEncontrado.update({nombre_tipo_convo})
        res.status(200).json({"tipo de convocatoria actualizado correctamente": tipo_para_convoEncontrado})
    } catch (error) {
        res.status(500).json({"no se pudo actualizar el tipo de convocatoria": error.message})
    }
}

module.exports = {
    crearTipo_para_convos,
    obtenerTipos_para_convos,
    eliminarTipo_para_convos,
    editarTipo_para_convos
}


