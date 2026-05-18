const { Portafolios } = require("../index")
const jwt = require("jsonwebtoken")

//Controlador para crear un portafolio en la base de datos
const crearPortafolio = async (req , res) => {
    try {
        const {nombre , descripcion , id_usuario} = req.body
        const nuevoPortafolio = await Portafolios.create({
            nombre,
            descripcion,
            id_usuario
        })
        res.status(201).json({"portafolio creado": nuevoPortafolio})
    } catch (error) {
        res.status(500).json({"no se pudo crear el portafolio": error.message})
    }
}

//Controlador para obtener todos los portafolios de la base de datos
const obtenerPortafolios = async (req , res) => {
    try  {
        const portafolios = await Portafolios.findAll()
        res.status(200).json({"se han encontrado los siguientes portafolios": portafolios})
    } catch (error) {
        res.status(500).json({"no se pudo obtener los portafolios": error.message})
    
    }
}

//Controlador para eliminar un portafolio de la base de datos
const eliminarPortafolio = async (req , res) => {
    try {
        const {id_portafolio} = req.params
        const portafolioEncontrado = await Portafolios.findByPk(id_portafolio)
        if(!portafolioEncontrado) {
            return res.status(404).json({"no se encontro el portafolio": error.message})
        }
        await portafolioEncontrado.destroy()
        res.status(200).json({"portafolio eliminado": portafolioEncontrado})
    } catch (error) {
        res.status(500).json({"no se pudo eliminar el portafolio": error.message})
    }
}

//Controlador para editar un portafolio en la base de datos
const editarPortafolio = async (req , res) => {
        try {
            const {id_portafolio} = req.params
            const {nombre , descripcion , id_usuario} = req.body
            const portafolioEncontrado = await Portafolios.findByPk(id_portafolio)
            if(!portafolioEncontrado) {
                return res.status(404).json({"no se encontro el portafolio": error.message})
            }
            await portafolioEncontrado.update({
                nombre,
                descripcion,
                id_usuario
            })
            res.status(200).json({"portafolio actualizado": portafolioEncontrado})
        } catch (error) {
            res.status(500).json({"no se pudo actualizar el portafolio": error.message})
        }
}

module.exports = {
    crearPortafolio,
    obtenerPortafolios,
    eliminarPortafolio,
    editarPortafolio
}