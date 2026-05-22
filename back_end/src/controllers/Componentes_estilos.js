const { Componentes_estilos } = require("../../index")
const jwt = require("jsonwebtoken")

const creaarComponente_estilo = async (req, res) => {
    try {
        const { imagen_fondo, color_fondo } = req.body
        const nuevoComponente_estilo = await Componentes_estilos.create({
            imagen_fondo,
            color_fondo
        })
        res.status(201).json({ "componente estilo creado": nuevoComponente_estilo })
    } catch (error) {
        res.status(500).json({ "no se pudo crear el componente estilo": error.message })
    }
}


const obtenerComponentes_estilos = async (req, res) => {
    try {
        const componentes_estilos = await Componentes_estilos.findAll()
        res.status(200).json(componentes_estilos)
    } catch (error) {
        res.status(500).json({ "no se pudieron obtener los componentes estilo": error.message })
    }
}
 const eliminarComponente_estilo = async (req , res ) => {
       try {
        const {id} = req.params
        const componente_estiloEncontrado = await Componentes_estilos.findByPk(id)
        if(!componente_estiloEncontrado)
            return res.status(404).json({ message: "Componente estilo no encontrado" })
        await componente_estiloEncontrado.destroy()
        res.status(200).json({"componente estilo eliminado correctamente": componente_estiloEncontrado})
       } catch (error) {
        res.status(500).json({"no se pudo eliminar el componente estilo": error.message})
       }





 }

 

const editarComponente_estilo = async (req, res) => {
    try {
        const { id } = req.params
        const { imagen_fondo, color_fondo } = req.body
        const componente_estiloEncontrado = await Componentes_estilos.findByPk(id)
        if (!componente_estiloEncontrado)
            return res.status(404).json({ "no se encontro el componente estilo": error.message })
        await componente_estiloEncontrado.update({ imagen_fondo, color_fondo })
        res.status(200).json({ "componente estilo actualizado correctamente": componente_estiloEncontrado })
    } catch (error) {
        res.status(500).json({ "no se pudo actualizar el componente estilo": error.message })
    }

}

module.exports = {
    creaarComponente_estilo,
    obtenerComponentes_estilos,
    eliminarComponente_estilo,
    editarComponente_estilo
}

