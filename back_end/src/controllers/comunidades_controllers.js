const { Comunidades } = require("../index");

const crearComunidad = async (req, res) => {
    try {
        const { nombre, descripcion } = req.body;
        const nuevaComunidad = await Comunidades.create({
            nombre,
            descripcion
        });
        res.status(201).json({ "comunidad creada": nuevaComunidad });
    } catch (error) {
        res.status(500).json({ "no se pudo crear la comunidad": error.message });
    }
};

const obtenerComunidades = async (req, res) => {
    try {
        const comunidades_encontradas = await Comunidades.findAll();
        res.status(200).json(comunidades_encontradas);
    } catch (error) {
        res.status(500).json({ "no se pudieron obtener las comunidades": error.message });
    }
};

const eliminarComunidad = async (req, res) => {
    try {
        const { id } = req.params;
        const comunidadEncontrada = await Comunidades.findByPk(id);
        if (!comunidadEncontrada)
            return res.status(404).json({ "no se encontro la comunidad": "id no existe" });
        await comunidadEncontrada.destroy();
        res.status(200).json({ "comunidad eliminada correctamente": comunidadEncontrada });
    } catch (error) {
        res.status(500).json({ "no se pudo eliminar la comunidad": error.message });
    }
};

const editarComunidad = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion } = req.body;
        const comunidadEncontrada = await Comunidades.findByPk(id);
        if (!comunidadEncontrada)
            return res.status(404).json({ "no se encontro la comunidad": "id no existe" });
        await comunidadEncontrada.update({ nombre, descripcion });
        res.status(200).json({ "comunidad actualizada correctamente": comunidadEncontrada });
    } catch (error) {
        res.status(500).json({ "no se pudo actualizar la comunidad": error.message });
    }
};

module.exports = {
    crearComunidad,
    obtenerComunidades,
    eliminarComunidad,
    editarComunidad
};
