const { Categorias } = require("../../index")
const { validationResult } = require("express-validator")

const crearCategoria = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ status: 400, message: "Datos inválidos", data: errors.array() })
    }
    try {
        const { nombre } = req.body
        const nuevaCategoria = await Categorias.create({ nombre })
        res.status(201).json({ status: 201, message: "Categoría creada correctamente", data: nuevaCategoria })
    } catch (error) {
        res.status(500).json({ status: 500, message: error.message })
    }
}

const obtenerCategorias = async (req, res) => {
    try {
        const categorias = await Categorias.findAll()
        res.status(200).json({ status: 200, message: "OK", data: categorias })
    } catch (error) {
        res.status(500).json({ status: 500, message: error.message })
    }
}

const eliminarCategoria = async (req, res) => {
    try {
        const { id } = req.params
        const categoriaEncontrada = await Categorias.findByPk(id)
        if (!categoriaEncontrada) {
            return res.status(404).json({ status: 404, message: "Categoría no encontrada" })
        }
        await categoriaEncontrada.destroy()
        res.status(200).json({ status: 200, message: "Categoría eliminada correctamente" })
    } catch (error) {
        res.status(500).json({ status: 500, message: error.message })
    }
}

const editarCategoria = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ status: 400, message: "Datos inválidos", data: errors.array() })
    }
    try {
        const { id } = req.params
        const { nombre } = req.body
        const categoriaEncontrada = await Categorias.findByPk(id)
        if (!categoriaEncontrada) {
            return res.status(404).json({ status: 404, message: "Categoría no encontrada" })
        }
        await categoriaEncontrada.update({ nombre })
        res.status(200).json({ status: 200, message: "Categoría actualizada correctamente", data: categoriaEncontrada })
    } catch (error) {
        res.status(500).json({ status: 500, message: error.message })
    }
}

module.exports = { crearCategoria, obtenerCategorias, eliminarCategoria, editarCategoria }
