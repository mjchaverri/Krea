const { unirseComunidad, salirComunidad, obtenerMiembrosPorComunidad, obtenerMiembrosPorUsuario } = require('../controllers/miembros_controller');
const { Miembros } = require('../index');

jest.mock('../index', () => ({
  Miembros: {
    create: jest.fn(),
    findOne: jest.fn(),
    findAll: jest.fn(),
  },
  Comunidades: {},
  Usuario: {},
}));

describe('Pruebas de miembros_controller', () => {
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

  //Al unirse a una comunidad debe devolver 201 y el miembro ingresa a la comunidad
  describe('unirseComunidad', () => {
    it('debe unirse a una comunidad exitosamente y retornar 201', async () => {
      req.body = { id_comunidad: 1, id_usuario: 2 };
      Miembros.findOne.mockResolvedValue(null);
      const mockMiembro = { id: 1, id_comunidad: 1, id_usuario: 2 };
      Miembros.create.mockResolvedValue(mockMiembro);

      await unirseComunidad(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        status: 201,
        message: 'Te uniste a la comunidad',
        data: mockMiembro,
      });
    });

    //Al unirse a una comunidad debe devolver 400 si falta id_comunidad o id_usuario
    it('debe retornar 400 si falta id_comunidad o id_usuario', async () => {
      req.body = { id_comunidad: 1 }; // Falta id_usuario

      await unirseComunidad(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        status: 400,
        message: 'id_comunidad e id_usuario son requeridos',
      });
    });

    //Al unirse a una comunidad debe devolver 409 si ya es miembro de la comunidad
    it('debe retornar 409 si ya es miembro de la comunidad', async () => {
      req.body = { id_comunidad: 1, id_usuario: 2 };
      Miembros.findOne.mockResolvedValue({ id: 1 });

      await unirseComunidad(req, res);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({
        status: 409,
        message: 'Ya eres miembro de esta comunidad',
      });
    });
  });

  //Al salir de la comunidad debe devolver 200 y el miembro sale de la comunidad
  describe('salirComunidad', () => {
    it('debe salir de la comunidad y retornar 200', async () => {
      req.params = { id_comunidad: 1, id_usuario: 2 };
      const mockMiembro = { destroy: jest.fn().mockResolvedValue() };
      Miembros.findOne.mockResolvedValue(mockMiembro);

      await salirComunidad(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(mockMiembro.destroy).toHaveBeenCalled();
    });

    //Al salir de una comunidad debe devolver 404 si el usuario no es miembro
    it('debe retornar 404 si el usuario no es miembro', async () => {
      req.params = { id_comunidad: 1, id_usuario: 2 };
      Miembros.findOne.mockResolvedValue(null);

      await salirComunidad(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  //Al obtener los miembros de una comunidad debe devolver 200 y los miembros de la comunidad
  describe('obtenerMiembrosPorComunidad', () => {
    it('debe retornar los miembros con estado 200', async () => {
      req.params = { id_comunidad: 1 };
      const mockMiembros = [{ id: 1 }];
      Miembros.findAll.mockResolvedValue(mockMiembros);

      await obtenerMiembrosPorComunidad(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 200,
        message: 'OK',
        data: mockMiembros,
      });
    });
  });

  //Al obtener los miembros de un usuario debe devolver 200 y las comunidades del usuario
  describe('obtenerMiembrosPorUsuario', () => {
    it('debe retornar las comunidades del usuario con estado 200', async () => {
      req.params = { id_usuario: 2 };
      const mockMiembros = [{ id: 1 }];
      Miembros.findAll.mockResolvedValue(mockMiembros);

      await obtenerMiembrosPorUsuario(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });
  });
});
