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

  //Al crear un tipo de convocatoria debe devolver 201 y el tipo de convocatoria creado si los datos son correctos
  describe('crearTipo_para_convos', () => {
    it('debe crear un tipo de convocatoria y retornar 201', async () => {
      req.body = { nombre_tipo_convo: 'Arte' };
      const mockTipo = { id_tipo_para_convo: 1, nombre_tipo_convo: 'Arte' };
      Tipos_para_convos.create.mockResolvedValue(mockTipo);

      await crearTipo_para_convos(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockTipo);
    });

    //Al crear un tipo de convocatoria debe devolver 500 si ocurre un error
    it('debe retornar 500 si ocurre un error', async () => {
      req.body = { nombre_tipo_convo: 'Arte' };
      Tipos_para_convos.create.mockRejectedValue(new Error('DB error'));

      await crearTipo_para_convos(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  //Al obtener los tipos de convocatoria debe devolver 200 y todos los tipos de convocatoria
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

  //Al eliminar un tipo de convocatoria debe devolver 200 y el tipo de convocatoria eliminado si existe, si no 404
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

    //Al eliminar un tipo de convocatoria debe devolver 404 si el tipo de convocatoria no existe
    it('debe retornar 404 si el tipo de convocatoria no existe', async () => {
      req.params = { id_tipo_para_convo: 999 };
      Tipos_para_convos.findByPk.mockResolvedValue(null);

      await eliminarTipo_para_convos(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Tipo de convocatoria no encontrado' });
    });
  });

  //Al editar un tipo de convocatoria debe devolver 200 y el tipo de convocatoria editado si existe, si no 404
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

    //Al editar un tipo de convocatoria debe devolver 404 si el tipo de convocatoria no existe
    it('debe retornar 404 si el tipo de convocatoria no existe al editar', async () => {
      req.params = { id_tipo_para_convo: 999 };
      Tipos_para_convos.findByPk.mockResolvedValue(null);

      await editarTipo_para_convos(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });
});
