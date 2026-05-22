const { Bloques_Componentes } = require("../index");

const crearBloque_componente = async (req, res) => {
    try {
        const { nombre, descripcion } = req.body;
        const nuevoBloque_componente = await Bloques_Componentes.create({
            nombre,
            descripcion
        });
        res.status(201).json({ "bloque componente creado": nuevoBloque_componente });
    } catch (error) {
        res.status(500).json({ "no se pudo crear el bloque componente": error.message });
    }
};

const obtenerBloques_componentes = async (req, res) => {
    try {
        const bloques_componentes_encontrados = await Bloques_Componentes.findAll();
        res.status(200).json(bloques_componentes_encontrados);
    } catch (error) {
        res.status(500).json({ "no se pudieron obtener los bloques componentes": error.message });
    }
};

const eliminarBloque_componente = async (req, res) => {
    try {
        const { id } = req.params;
        const bloque_componenteEncontrado = await Bloques_Componentes.findByPk(id);
        if (!bloque_componenteEncontrado)
            return res.status(404).json({ message: "Bloque componente no encontrado" });
        await bloque_componenteEncontrado.destroy();
        res.status(200).json({ "bloque componente eliminado correctamente": bloque_componenteEncontrado });
    } catch (error) {
        res.status(500).json({ "no se pudo eliminar el bloque componente": error.message });
    }
};

const editarBloque_componente = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion } = req.body;
        const bloque_componenteEncontrado = await Bloques_Componentes.findByPk(id);
        if (!bloque_componenteEncontrado)
            return res.status(404).json({ message: "Bloque componente no encontrado" });
        await bloque_componenteEncontrado.update({ nombre, descripcion });
        res.status(200).json({ "bloque componente actualizado correctamente": bloque_componenteEncontrado });
    } catch (error) {
        res.status(500).json({ "no se pudo actualizar el bloque componente": error.message });
    }
};

module.exports = {
    crearBloque_componente,
    obtenerBloques_componentes,
    eliminarBloque_componente,
    editarBloque_componente
};
