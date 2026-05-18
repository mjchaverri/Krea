const { Categorias } = require("../index");

const crearCategoria = async (req, res) => {
    try {
        const { nombre } = req.body;
        const nuevaCategoria = await Categorias.create({
            nombre
        });
        res.status(201).json({ "categoria creada": nuevaCategoria });
    } catch (error) {
        res.status(500).json({ "no se pudo crear la categoria": error.message });
    }
};

const obtenerCategorias = async (req, res) => {
    try {
        const categorias_encontradas = await Categorias.findAll();
        res.status(200).json(categorias_encontradas);
    } catch (error) {
        res.status(500).json({ "no se pudieron obtener las categorias": error.message });
    }
};

const eliminarCategoria = async (req, res) => {
    try {
        const { id } = req.params;
        const categoriaEncontrada = await Categorias.findByPk(id);
        if (!categoriaEncontrada)
            return res.status(404).json({ "no se encontro la categoria": "id no existe" });
        await categoriaEncontrada.destroy();
        res.status(200).json({ "categoria eliminada correctamente": categoriaEncontrada });
    } catch (error) {
        res.status(500).json({ "no se pudo eliminar la categoria": error.message });
    }
};

const editarCategoria = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre } = req.body;
        const categoriaEncontrada = await Categorias.findByPk(id);
        if (!categoriaEncontrada)
            return res.status(404).json({ "no se encontro la categoria": "id no existe" });
        await categoriaEncontrada.update({ nombre });
        res.status(200).json({ "categoria actualizada correctamente": categoriaEncontrada });
    } catch (error) {
        res.status(500).json({ "no se pudo actualizar la categoria": error.message });
    }
};

module.exports = {
    crearCategoria,
    obtenerCategorias,
    eliminarCategoria,
    editarCategoria
};
