const { Componentes } = require("../index")
const jwt = require("jsonwebtoken")

const crearComponente = async (req , res ) => {
      try {
        const {tipo, orden} = req.body
        const nuevoCompomente = await Componentes.create({ tipo , orden })
        res.status(201).json( {"componente creado": nuevoCompomente})
      } catch (error) {
        res.status(500).json({"no se pudo crear el componente": error.message})

      }



}
const obtenerComponentes = async (req , res ) => {
     try {
        const componentes = await Componentes.findAll()
        res.status(200).json(componentes)
     } catch (error) {
        res.status(500).json({"no se pudieron obtener los componentes": error.message})
     }
}
const eliminarComponente = async (req , res ) => {
    try {
        const {id_componente} = req.params
        const componenteEncontrado = await Componentes.findByPk(id_componente)
        if(!componenteEncontrado) 
            return res.status(404).json({ message: "Componente no encontrado" })
        await componenteEncontrado.destroy()
        res.status(200).json({"componente eliminado correctamente": componenteEncontrado})
    } catch (error) {
        res.status(500).json({"no se pudo eliminar el componente": error.message})
    }
}

const editarComponente = async (req , res ) => {
    try {
       const {id_componente} = req.params
       const {tipo, orden} = req.body
         const componenteEncontrado = await Componentes.findByPk(id_componente)
         if(!componenteEncontrado)
            return res.status(404).json({ message: "Componente no encontrado" })
         await componenteEncontrado.update({ tipo, orden })
         res.status(200).json({"componente actualizado correctamente": componenteEncontrado})
    } catch (error) {
        res.status(500).json({"no se pudo actualizar el componente": error.message})
    }
}

module.exports = {
    crearComponente,
    obtenerComponentes,
    eliminarComponente,
    editarComponente
}