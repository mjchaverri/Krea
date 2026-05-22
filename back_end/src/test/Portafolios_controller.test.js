const { crearPortafolio, obtenerPortafolios, obtenerPortafoliosPorUsuario, eliminarPortafolio, editarPortafolio } = require('../controllers/Portafolios_controller');
const { Portafolios } = require('../index');
const { validationResult } = require('express-validator');

jest.mock('../index', () => ({
  Portafolios: {
    create: jest.fn(),
    findAndCountAll: jest.fn(),
    findByPk: jest.fn(),
  },
}));

jest.mock('express-validator', () => ({
  validationResult: jest.fn(),
}));

describe('Pruebas de Portafolios_controller', () => {
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

  //Al crear un portafolio debe devolver 201 y el portafolio creado si los datos son correctos
  describe('crearPortafolio', () => {
    it('debe crear un portafolio y retornar 201', async () => {
      req.body = { titulo: 'Mi Arte', descripcion: 'Pintura a óleo', id_usuario: 1 };
      const mockPortafolio = { id_portafolio: 1, ...req.body };
      Portafolios.create.mockResolvedValue(mockPortafolio);

      await crearPortafolio(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        status: 201,
        message: 'Portafolio creado correctamente',
        data: mockPortafolio,
      });
    });

    //Al crear un portafolio debe devolver 400 si falta id_usuario o titulo
    it('debe retornar 400 si la validación de entrada falla', async () => {
      validationResult.mockReturnValueOnce({
        isEmpty: () => false,
        array: () => [{ msg: 'El título es requerido' }],
      });

      await crearPortafolio(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  //Al obtener los portafolios debe devolver 200 y todos los portafolios paginados con el total y las paginas
  describe('obtenerPortafolios', () => {
    it('debe obtener portafolios paginados y buscar por título', async () => {
      req.query = { page: '1', limit: '10', buscar: 'Arte' };
      Portafolios.findAndCountAll.mockResolvedValue({ count: 5, rows: [{ id_portafolio: 1 }] });

      await obtenerPortafolios(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        status: 200,
        data: [{ id_portafolio: 1 }],
      }));
    });
  });

  //Al obtener los portafolios de un usuario debe devolver 200 y todos los portafolios del usuario
  describe('obtenerPortafoliosPorUsuario', () => {
    it('debe obtener portafolios de un usuario específico', async () => {
      req.params = { id_usuario: 1 };
      Portafolios.findAndCountAll.mockResolvedValue({ count: 2, rows: [{ id_portafolio: 1 }] });

      await obtenerPortafoliosPorUsuario(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  //Al eliminar un portafolio debe devolver 200 y el portafolio eliminado si existe, si no 404
  describe('eliminarPortafolio', () => {
    it('debe eliminar un portafolio existente y retornar 200', async () => {
      req.params = { id_portafolio: 1 };
      const mockPortafolio = { destroy: jest.fn().mockResolvedValue() };
      Portafolios.findByPk.mockResolvedValue(mockPortafolio);

      await eliminarPortafolio(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(mockPortafolio.destroy).toHaveBeenCalled();
    });

    //Al eliminar un portafolio debe devolver 404 si el portafolio no existe
    it('debe retornar 404 si el portafolio no existe al eliminar', async () => {
      req.params = { id_portafolio: 999 };
      Portafolios.findByPk.mockResolvedValue(null);

      await eliminarPortafolio(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  //Al editar un portafolio debe devolver 200 y el portafolio actualizado si existe, si no 404
  describe('editarPortafolio', () => {
    it('debe actualizar el portafolio y retornar 200', async () => {
      req.params = { id_portafolio: 1 };
      req.body = { titulo: 'Nuevo Título' };
      const mockPortafolio = { update: jest.fn().mockResolvedValue() };
      Portafolios.findByPk.mockResolvedValue(mockPortafolio);

      await editarPortafolio(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(mockPortafolio.update).toHaveBeenCalledWith({ titulo: 'Nuevo Título', descripcion: undefined, pdf: undefined, img_portada: undefined });
    });
  });
});
