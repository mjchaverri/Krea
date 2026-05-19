const { crearTalento, obtenerTalentos, eliminarTalento, editarTalento } = require('../controllers/Talentos_controllers');
const { Talentos } = require('../index');
const { validationResult } = require('express-validator');

jest.mock('../index', () => ({
  Talentos: {
    create: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
  },
}));

jest.mock('express-validator', () => ({
  validationResult: jest.fn(),
}));

describe('Pruebas de Talentos_controllers', () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
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

  describe('crearTalento', () => {
    it('debe crear un talento y retornar 201', async () => {
      req.body = { nombre: 'Pintura' };
      const mockTalento = { id_talento: 1, nombre: 'Pintura' };
      Talentos.create.mockResolvedValue(mockTalento);

      await crearTalento(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        status: 201,
        message: 'Talento creado correctamente',
        data: mockTalento,
      });
    });

    it('debe retornar 400 si los datos de talento son inválidos', async () => {
      validationResult.mockReturnValueOnce({
        isEmpty: () => false,
        array: () => [{ msg: 'El nombre es inválido' }],
      });

      await crearTalento(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('obtenerTalentos', () => {
    it('debe retornar todos los talentos y retornar 200', async () => {
      const mockTalentos = [{ id_talento: 1, nombre: 'Pintura' }];
      Talentos.findAll.mockResolvedValue(mockTalentos);

      await obtenerTalentos(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ status: 200, message: 'OK', data: mockTalentos });
    });
  });

  describe('eliminarTalento', () => {
    it('debe eliminar un talento y retornar 200', async () => {
      req.params = { id_talento: 1 };
      const mockTalento = { id_talento: 1, nombre: 'Pintura', destroy: jest.fn().mockResolvedValue() };
      Talentos.findByPk.mockResolvedValue(mockTalento);

      await eliminarTalento(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(mockTalento.destroy).toHaveBeenCalled();
    });

    it('debe retornar 404 si el talento no existe al eliminar', async () => {
      req.params = { id_talento: 999 };
      Talentos.findByPk.mockResolvedValue(null);

      await eliminarTalento(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('editarTalento', () => {
    it('debe editar un talento y retornar 200', async () => {
      req.params = { id_talento: 1 };
      req.body = { nombre: 'Escultura' };
      const mockTalento = { id_talento: 1, nombre: 'Pintura', update: jest.fn().mockResolvedValue() };
      Talentos.findByPk.mockResolvedValue(mockTalento);

      await editarTalento(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(mockTalento.update).toHaveBeenCalledWith({ nombre: 'Escultura' });
    });
  });
});
