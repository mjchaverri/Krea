   const { Chat_Comu } = require("../index");

// Crear un chat de comunidad
const crearChat = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;
    const nuevoChat = await Chat_Comu.create({ nombre, descripcion });
    res.status(201).json({ "chat creado": nuevoChat });
  } catch (error) {
    res.status(500).json({ "error al crear chat": error.message });
  }
};

// Obtener todos los chats
const obtenerChats = async (req, res) => {
  try {
    const chats = await Chat_Comu.findAll();
    res.status(200).json(chats);
  } catch (error) {
    res.status(500).json({ "error al obtener chats": error.message });
  }
};

// Eliminar un chat
const eliminarChat = async (req, res) => {
  try {
    const { id } = req.params;
    const chat = await Chat_Comu.findByPk(id);
    if (!chat) return res.status(404).json({ "chat no encontrado": "id no existe" });
    await chat.destroy();
    res.status(200).json({ "chat eliminado": chat });
  } catch (error) {
    res.status(500).json({ "error al eliminar chat": error.message });
  }
};

// Editar un chat
const editarChat = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion } = req.body;
    const chat = await Chat_Comu.findByPk(id);
    if (!chat) return res.status(404).json({ "chat no encontrado": "id no existe" });
    await chat.update({ nombre, descripcion });
    res.status(200).json({ "chat actualizado": chat });
  } catch (error) {
    res.status(500).json({ "error al actualizar chat": error.message });
  }
};

module.exports = {
  crearChat,
  obtenerChats,
  eliminarChat,
  editarChat
};
