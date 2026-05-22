const { crearMensaje, obtenerMensajesPorComunidad, eliminarMensaje } = require('../controllers/chat_comu_controllers');
const { Chat_Comu } = require('../index');
const { validationResult } = require('express-validator');

jest.mock('../index', () => ({
  Chat_Comu: {
    create: jest.fn(),
    findAndCountAll: jest.fn(),
    findByPk: jest.fn(),
  },
}));

jest.mock('express-validator', () => ({
  validationResult: jest.fn(),
}));

describe('Pruebas de chat_comu_controllers', () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      query: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
    validationResult.mockReturnValue({
      isEmpty: () => true,
      array: () => [],
    });
  });

  //Al crear un mensaje debe devolver 201 y el mensaje creado si no existe
  describe('crearMensaje', () => {
    it('debe crear un mensaje en la comunidad y retornar 201', async () => {
      req.body = { usuario_nombre: 'testuser', texto: 'Hola a todos', id_comunidad: 1 };
      const mockMsg = { id_chat: 1, usuario_nombre: 'testuser', texto: 'Hola a todos', id_comunidad: 1 };
      Chat_Comu.create.mockResolvedValue(mockMsg);

      await crearMensaje(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        status: 201,
        message: 'Mensaje enviado correctamente',
        data: mockMsg,
      });
    });

    //Al crear un mensaje que ya existe debe devolver 400
    it('debe retornar 400 si falla la validación del mensaje', async () => {
      validationResult.mockReturnValueOnce({
        isEmpty: () => false,
        array: () => [{ msg: 'Texto es requerido' }],
      });

      await crearMensaje(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  //Al obtener los mensajes debe devolver 200 y todos los mensajes
  describe('obtenerMensajesPorComunidad', () => {
    it('debe obtener los mensajes paginados', async () => {
      req.params = { id_comunidad: 1 };
      req.query = { page: '1', limit: '10' };
      Chat_Comu.findAndCountAll.mockResolvedValue({ count: 2, rows: [{ id_chat: 1 }] });

      await obtenerMensajesPorComunidad(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 200,
        message: 'OK',
        data: [{ id_chat: 1 }],
        meta: { total: 2, page: 1, limit: 10, pages: 1 },
      });
    });
  });

  //Al eliminar un mensaje debe devolver 200 y el mensaje eliminado si existe, si no 404
  describe('eliminarMensaje', () => {
    it('debe eliminar un mensaje existente', async () => {
      req.params = { id_chat_comu: 1 };
      const mockMsg = { destroy: jest.fn().mockResolvedValue() };
      Chat_Comu.findByPk.mockResolvedValue(mockMsg);

      await eliminarMensaje(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(mockMsg.destroy).toHaveBeenCalled();
    });

    //Al eliminar un mensaje que no existe debe devolver 404
    it('debe retornar 404 si el mensaje no existe', async () => {
      req.params = { id_chat_comu: 999 };
      Chat_Comu.findByPk.mockResolvedValue(null);

      await eliminarMensaje(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });
});
