const { crearResena, obtenerResenas, obtenerResenasPorPortafolio, eliminarResena, editarResena } = require('../controllers/Resenas_controllers');
const { Resenas } = require('../index');
const { validationResult } = require('express-validator');

jest.mock('../index', () => ({
  Resenas: {
    create: jest.fn(),
    findAndCountAll: jest.fn(),
    findByPk: jest.fn(),
  },
}));

jest.mock('express-validator', () => ({
  validationResult: jest.fn(),
}));

describe('Pruebas de Resenas_controllers', () => {
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

  //Al crear una reseña debe devolver 201 y la reseña creada si los datos son correctos
  describe('crearResena', () => {
    it('debe crear una reseña con estado 201', async () => {
      req.body = { comentarios: 'Excelente', calificacion: 5, id_usuario: 1, id_portafolio: 2 };
      const mockResena = { id_resena: 1, ...req.body };
      Resenas.create.mockResolvedValue(mockResena);

      await crearResena(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        status: 201,
        message: 'Reseña creada correctamente',
        data: mockResena,
      });
    });

    //Al crear una reseña debe devolver 400 si la validación falla
    it('debe retornar 400 si la validación falla', async () => {
      validationResult.mockReturnValueOnce({
        isEmpty: () => false,
        array: () => [{ msg: 'Calificación inválida' }],
      });

      await crearResena(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  //Al obtener las reseñas debe devolver 200 y todas las reseñas paginadas con el total y las paginas
  describe('obtenerResenas', () => {
    it('debe retornar reseñas con paginación', async () => {
      req.query = { page: '2', limit: '5' };
      Resenas.findAndCountAll.mockResolvedValue({ count: 15, rows: [{ id_resena: 1 }] });

      await obtenerResenas(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 200,
        message: 'OK',
        data: [{ id_resena: 1 }],
        meta: { total: 15, page: 2, limit: 5, pages: 3 },
      });
    });
  });

  //Al obtener las reseñas de un portafolio debe devolver 200 y todas las reseñas de ese portafolio
  describe('obtenerResenasPorPortafolio', () => {
    it('debe retornar reseñas por portafolio', async () => {
      req.params = { id_portafolio: 2 };
      Resenas.findAndCountAll.mockResolvedValue({ count: 5, rows: [{ id_resena: 1 }] });

      await obtenerResenasPorPortafolio(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        status: 200,
        data: [{ id_resena: 1 }],
      }));
    });
  });

  //Al eliminar una reseña debe devolver 200 y la reseña eliminada si existe, si no 404
  describe('eliminarResena', () => {
    it('debe eliminar una reseña existente', async () => {
      req.params = { id_resena: 1 };
      const mockResena = { destroy: jest.fn().mockResolvedValue() };
      Resenas.findByPk.mockResolvedValue(mockResena);

      await eliminarResena(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(mockResena.destroy).toHaveBeenCalled();
    });

    //Al eliminar una reseña debe devolver 404 si la reseña no existe
    it('debe retornar 404 si no existe la reseña', async () => {
      req.params = { id_resena: 999 };
      Resenas.findByPk.mockResolvedValue(null);

      await eliminarResena(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  //Al editar una reseña debe devolver 200 y la reseña actualizada si existe, si no 404
  describe('editarResena', () => {
    it('debe editar una reseña y retornar 200', async () => {
      req.params = { id_resena: 1 };
      req.body = { comentarios: 'Bueno', calificacion: 4 };
      const mockResena = { update: jest.fn().mockResolvedValue() };
      Resenas.findByPk.mockResolvedValue(mockResena);

      await editarResena(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(mockResena.update).toHaveBeenCalledWith({ comentarios: 'Bueno', calificacion: 4 });
    });
  });
});
