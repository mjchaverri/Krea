const { crearConvocatoria, obtenerConvocatorias, eliminarConvocatoria, editarConvocatoria } = require('../controllers/Convocatorias_controllers');
const { Convocatorias } = require('../index');
const { validationResult } = require('express-validator');

jest.mock('../index', () => ({
  Convocatorias: {
    create: jest.fn(),
    findAndCountAll: jest.fn(),
    findByPk: jest.fn(),
  },
}));

jest.mock('express-validator', () => ({
  validationResult: jest.fn(),
}));

describe('Pruebas de Convocatorias_controllers', () => {
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

  //Al crear una convocatoria debe devolver 201 y la convocatoria creada
  describe('crearConvocatoria', () => {
    it('debe crear una convocatoria y retornar 201', async () => {
      req.body = { nombre: 'Convocatoria Arte', descripcion: 'Pintura', fecha_cierre: '2026-12-31', id_usuario: 1 };
      const mockConvo = { id_convocatoria: 1, ...req.body };
      Convocatorias.create.mockResolvedValue(mockConvo);

      await crearConvocatoria(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        status: 201,
        message: 'Convocatoria creada correctamente',
        data: mockConvo,
      });
    });

    //Al crear una convocatoria que ya existe debe devolver 400
    it('debe retornar 400 si la validación falla', async () => {
      validationResult.mockReturnValueOnce({
        isEmpty: () => false,
        array: () => [{ msg: 'El nombre es inválido' }],
      });

      await crearConvocatoria(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  //Al obtener las convocatorias debe devolver 200 y todas las convocatorias paginadas
  describe('obtenerConvocatorias', () => {
    it('debe obtener convocatorias paginadas con filtro de búsqueda', async () => {
      req.query = { page: '1', limit: '10', buscar: 'Arte' };
      Convocatorias.findAndCountAll.mockResolvedValue({ count: 10, rows: [{ id_convocatoria: 1 }] });

      await obtenerConvocatorias(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        status: 200,
        data: [{ id_convocatoria: 1 }],
      }));
    });
  });

  //Al eliminar una convocatoria debe devolver 200 y la convocatoria eliminada si existe, si no 404
  describe('eliminarConvocatoria', () => {
    it('debe eliminar una convocatoria existente', async () => {
      req.params = { id_convocatoria: 1 };
      const mockConvo = { destroy: jest.fn().mockResolvedValue() };
      Convocatorias.findByPk.mockResolvedValue(mockConvo);

      await eliminarConvocatoria(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(mockConvo.destroy).toHaveBeenCalled();
    });

    //Al eliminar una convocatoria que no existe debe devolver 404
    it('debe retornar 404 si la convocatoria no existe', async () => {
      req.params = { id_convocatoria: 999 };
      Convocatorias.findByPk.mockResolvedValue(null);

      await eliminarConvocatoria(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  //Al editar una convocatoria debe devolver 200 y la convocatoria actualizada si existe, si no 404
  describe('editarConvocatoria', () => {
    it('debe actualizar la convocatoria y retornar 200', async () => {
      req.params = { id_convocatoria: 1 };
      req.body = { nombre: 'Nuevo Nombre', descripcion: 'Nueva Desc', fecha_cierre: '2026-11-30' };
      const mockConvo = { update: jest.fn().mockResolvedValue() };
      Convocatorias.findByPk.mockResolvedValue(mockConvo);

      await editarConvocatoria(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(mockConvo.update).toHaveBeenCalledWith({ nombre: 'Nuevo Nombre', descripcion: 'Nueva Desc', fecha_cierre: '2026-11-30' });
    });
  });
});
