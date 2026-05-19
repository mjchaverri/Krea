const { crearComunidad, obtenerComunidades, eliminarComunidad, editarComunidad } = require('../controllers/comunidades_controllers');
const { Comunidades } = require('../index');
const { validationResult } = require('express-validator');

jest.mock('../index', () => ({
  Comunidades: {
    create: jest.fn(),
    findAndCountAll: jest.fn(),
    findByPk: jest.fn(),
  },
  Categorias: {},
}));

jest.mock('express-validator', () => ({
  validationResult: jest.fn(),
}));

describe('Pruebas de comunidades_controllers', () => {
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

  //Al crear una comunidad debe devolver 201 y la comunidad creada
  describe('crearComunidad', () => {
    it('debe crear una comunidad y retornar 201', async () => {
      req.body = { nombre: 'Comunidad Arte', descripcion: 'Grupo de Pintores', id_categoria: 1 };
      const mockComunidad = { id_comunidad: 1, ...req.body };
      Comunidades.create.mockResolvedValue(mockComunidad);

      await crearComunidad(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        status: 201,
        message: 'Comunidad creada correctamente',
        data: mockComunidad,
      });
    });

    //Al crear una comunidad que ya existe debe devolver 400
    it('debe retornar 400 si la validación falla', async () => {
      validationResult.mockReturnValueOnce({
        isEmpty: () => false,
        array: () => [{ msg: 'El nombre es inválido' }],
      });

      await crearComunidad(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  //Al obtener las comunidades debe devolver 200 y todas las comunidades paginadas
  describe('obtenerComunidades', () => {
    it('debe obtener las comunidades paginadas', async () => {
      req.query = { page: '1', limit: '5' };
      Comunidades.findAndCountAll.mockResolvedValue({ count: 10, rows: [{ id_comunidad: 1 }] });

      await obtenerComunidades(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 200,
        message: 'OK',
        data: [{ id_comunidad: 1 }],
        meta: { total: 10, page: 1, limit: 5, pages: 2 },
      });
    });
  });
//Al eliminar una comunidad debe devolver 200 y la comunidad eliminada si existe, si no 404
  describe('eliminarComunidad', () => {
    it('debe eliminar una comunidad existente y retornar 200', async () => {
      req.params = { id_comunidad: 1 };
      const mockComunidad = { destroy: jest.fn().mockResolvedValue() };
      Comunidades.findByPk.mockResolvedValue(mockComunidad);

      await eliminarComunidad(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(mockComunidad.destroy).toHaveBeenCalled();
    });

    //Al eliminar una comunidad que no existe debe devolver 404
    it('debe retornar 404 si la comunidad no existe al eliminar', async () => {
      req.params = { id_comunidad: 999 };
      Comunidades.findByPk.mockResolvedValue(null);

      await eliminarComunidad(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  //Al editar una comunidad debe devolver 200 y la comunidad actualizada si existe, si no 404
  describe('editarComunidad', () => {
    it('debe actualizar la comunidad y retornar 200', async () => {
      req.params = { id_comunidad: 1 };
      req.body = { nombre: 'Nueva Comunidad' };
      const mockComunidad = { update: jest.fn().mockResolvedValue() };
      Comunidades.findByPk.mockResolvedValue(mockComunidad);

      await editarComunidad(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(mockComunidad.update).toHaveBeenCalledWith({
        nombre: 'Nueva Comunidad',
        descripcion: undefined,
        icono: undefined,
        Color: undefined,
        ColorClaro: undefined,
        banner: undefined,
        id_categoria: undefined
      });
    });
  });
});
