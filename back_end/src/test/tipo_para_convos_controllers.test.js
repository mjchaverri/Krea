const {
  crearTipo_para_convos,
  obtenerTipos_para_convos,
  eliminarTipo_para_convos,
  editarTipo_para_convos
} = require('../controllers/tipo_para_convos_controllers');
const { Tipos_para_convos } = require('../index');

jest.mock('../index', () => ({
  Tipos_para_convos: {
    create: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
  },
}));

describe('Pruebas de tipo_para_convos_controllers', () => {
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

  describe('crearTipo_para_convos', () => {
    it('debe crear un tipo de convocatoria y retornar 201', async () => {
      req.body = { nombre_tipo_convo: 'Arte' };
      const mockTipo = { id_tipo_para_convo: 1, nombre_tipo_convo: 'Arte' };
      Tipos_para_convos.create.mockResolvedValue(mockTipo);

      await crearTipo_para_convos(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockTipo);
    });

    it('debe retornar 500 si ocurre un error', async () => {
      req.body = { nombre_tipo_convo: 'Arte' };
      Tipos_para_convos.create.mockRejectedValue(new Error('DB error'));

      await crearTipo_para_convos(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('obtenerTipos_para_convos', () => {
    it('debe retornar todos los tipos de convocatoria y retornar 200', async () => {
      const mockTipos = [{ id_tipo_para_convo: 1, nombre_tipo_convo: 'Arte' }];
      Tipos_para_convos.findAll.mockResolvedValue(mockTipos);

      await obtenerTipos_para_convos(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        "se han encontrado los siguientes tipos de convocatoria": mockTipos
      });
    });
  });

  describe('eliminarTipo_para_convos', () => {
    it('debe eliminar un tipo de convocatoria y retornar 200', async () => {
      req.params = { id_tipo_para_convo: 1 };
      const mockTipo = {
        id_tipo_para_convo: 1,
        destroy: jest.fn().mockResolvedValue()
      };
      Tipos_para_convos.findByPk.mockResolvedValue(mockTipo);

      await eliminarTipo_para_convos(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(mockTipo.destroy).toHaveBeenCalled();
    });

    it('debe retornar 404 si el tipo de convocatoria no existe', async () => {
      req.params = { id_tipo_para_convo: 999 };
      Tipos_para_convos.findByPk.mockResolvedValue(null);

      await eliminarTipo_para_convos(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Tipo de convocatoria no encontrado' });
    });
  });

  describe('editarTipo_para_convos', () => {
    it('debe actualizar un tipo de convocatoria y retornar 200', async () => {
      req.params = { id_tipo_para_convo: 1 };
      req.body = { nombre_tipo_convo: 'Cine' };
      const mockTipo = {
        id_tipo_para_convo: 1,
        update: jest.fn().mockResolvedValue()
      };
      Tipos_para_convos.findByPk.mockResolvedValue(mockTipo);

      await editarTipo_para_convos(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(mockTipo.update).toHaveBeenCalledWith({ nombre_tipo_convo: 'Cine' });
    });

    it('debe retornar 404 si el tipo de convocatoria no existe al editar', async () => {
      req.params = { id_tipo_para_convo: 999 };
      Tipos_para_convos.findByPk.mockResolvedValue(null);

      await editarTipo_para_convos(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });
});
