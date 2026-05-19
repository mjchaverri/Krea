const { crearCategoria, obtenerCategorias, eliminarCategoria, editarCategoria } = require('../controllers/categorias_controllers');
const { Categorias } = require('../index');
const { validationResult } = require('express-validator');

jest.mock('../index', () => ({
  Categorias: {
    create: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
  },
}));

jest.mock('express-validator', () => ({
  validationResult: jest.fn(),
}));

describe('Pruebas de categorias_controllers', () => {
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

  //Al crear una categoría debe devolver 201 y la categoría creada si no existe
  describe('crearCategoria', () => {
    it('debe crear una categoría y retornar 201', async () => {
      req.body = { nombre: 'Música' };
      const mockCat = { id: 1, nombre: 'Música' };
      Categorias.create.mockResolvedValue(mockCat);

      await crearCategoria(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        status: 201,
        message: 'Categoría creada correctamente',
        data: mockCat,
      });
    });

    //Al crear una categoría que ya existe debe devolver 400
    it('debe retornar 400 si la validación falla', async () => {
      validationResult.mockReturnValueOnce({
        isEmpty: () => false,
        array: () => [{ msg: 'El nombre es inválido' }],
      });

      await crearCategoria(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  //Al obtener las categorías debe devolver 200 y todas las categorías
  describe('obtenerCategorias', () => {
    it('debe retornar todas las categorías', async () => {
      const mockCats = [{ id: 1, nombre: 'Música' }];
      Categorias.findAll.mockResolvedValue(mockCats);

      await obtenerCategorias(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ status: 200, message: 'OK', data: mockCats });
    });
  });

  //Al eliminar una categoría debe devolver 200 y la categoría eliminada si existe, si no 404
  describe('eliminarCategoria', () => {
    it('debe eliminar una categoría existente', async () => {
      req.params = { id: 1 };
      const mockCat = { id: 1, destroy: jest.fn().mockResolvedValue() };
      Categorias.findByPk.mockResolvedValue(mockCat);

      await eliminarCategoria(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(mockCat.destroy).toHaveBeenCalled();
    });

    //Al eliminar una categoría que no existe debe devolver 404
    it('debe retornar 404 si la categoría no existe', async () => {
      req.params = { id: 999 };
      Categorias.findByPk.mockResolvedValue(null);

      await eliminarCategoria(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  //Al editar una categoría debe devolver 200 y la categoría actualizada si existe, si no 404
  describe('editarCategoria', () => {
    it('debe actualizar una categoría y retornar 200', async () => {
      req.params = { id: 1 };
      req.body = { nombre: 'Danza' };
      const mockCat = { id: 1, nombre: 'Música', update: jest.fn().mockResolvedValue() };
      Categorias.findByPk.mockResolvedValue(mockCat);

      await editarCategoria(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(mockCat.update).toHaveBeenCalledWith({ nombre: 'Danza' });
    });
  });
});
