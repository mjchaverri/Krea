const { crearReporte_convo, obtenerReporte_convo, eliminarReporte_convo, editarReporte_convo } = require('../controllers/Reporte_convo_controller');
const { Reporte_convo } = require('../index');

jest.mock('../index', () => ({
  Reporte_convo: {
    create: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
  },
}));

describe('Pruebas de Reporte_convo_controller', () => {
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
  });

  //Al crear un reporte de convocatoria debe devolver 201 y el reporte de convocatoria creado si los datos son correctos
  describe('crearReporte_convo', () => {
    it('debe crear un reporte de convocatoria y retornar 201', async () => {
      req.body = { id_convocatoria: 1, id_portafolio: 2, id_usuario: 3 };
      const mockReporte = { id_reporte_convo: 1, ...req.body };
      Reporte_convo.create.mockResolvedValue(mockReporte);

      await crearReporte_convo(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ "reporte de convocatoria creado": mockReporte });
    });
  });

  //Al obtener los reportes de convocatoria debe devolver 200 y todos los reportes de convocatoria
  describe('obtenerReporte_convo', () => {
    it('debe obtener todos los reportes de convocatoria', async () => {
      const mockReportes = [{ id_reporte_convo: 1 }];
      Reporte_convo.findAll.mockResolvedValue(mockReportes);

      await obtenerReporte_convo(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        "se han encontrado los siguientes reportes de convocatoria": mockReportes
      });
    });
  });

  //Al eliminar un reporte de convocatoria debe devolver 200 y el reporte de convocatoria eliminado si existe, si no 404
  describe('eliminarReporte_convo', () => {
    it('debe eliminar un reporte existente y retornar 200', async () => {
      req.params = { id_reporte_convo: 1 };
      const mockReporte = { id_reporte_convo: 1, destroy: jest.fn().mockResolvedValue() };
      Reporte_convo.findByPk.mockResolvedValue(mockReporte);

      await eliminarReporte_convo(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(mockReporte.destroy).toHaveBeenCalled();
    });

    //Al eliminar un reporte de convocatoria debe devolver 404 si el reporte no existe
    it('debe retornar 404 si el reporte no existe', async () => {
      req.params = { id_reporte_convo: 999 };
      Reporte_convo.findByPk.mockResolvedValue(null);

      await eliminarReporte_convo(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Reporte de convocatoria no encontrado' });
    });
  });

  //Al editar un reporte de convocatoria debe devolver 200 y el reporte de convocatoria actualizado si existe, si no 404
  describe('editarReporte_convo', () => {
    it('debe actualizar el reporte y retornar 200', async () => {
      req.params = { id_reporte_convo: 1 };
      req.body = { id_convocatoria: 4, id_portafolio: 5, id_usuario: 6 };
      const mockReporte = { id_reporte_convo: 1, update: jest.fn().mockResolvedValue() };
      Reporte_convo.findByPk.mockResolvedValue(mockReporte);

      await editarReporte_convo(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(mockReporte.update).toHaveBeenCalledWith({ id_convocatoria: 4, id_portafolio: 5, id_usuario: 6 });
    });

    //Al editar un reporte de convocatoria debe devolver 404 si el reporte no existe
    it('debe retornar 404 si el reporte no existe al editar', async () => {
      req.params = { id_reporte_convo: 999 };
      Reporte_convo.findByPk.mockResolvedValue(null);

      await editarReporte_convo(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });
});
