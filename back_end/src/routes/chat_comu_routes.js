const express = require('express');
const router = express.Router();
const {
  crearChatComu,
  obtenerChatsComu,
  eliminarChatComu,
  editarChatComu
} = require('../controllers/chat_comu_controllers');

// Create a new chat community
router.post('/', crearChatComu);

// Get all chat communities
router.get('/', obtenerChatsComu);

// Delete a chat community by id
router.delete('/:id', eliminarChatComu);

// Update a chat community by id
router.put('/:id', editarChatComu);

module.exports = router;
