const { seguir, dejarSeguir, obtenerSeguidores, obtenerSiguiendo, verificarSeguimiento, portafoliosDeSeguidos } = require('../controllers/seguidos_controller');
const { Seguidos, Portafolios } = require('../index');

jest.mock('../index', () => ({
  Seguidos: {
    create: jest.fn(),
    findOne: jest.fn(),
    findAll: jest.fn(),
  },
  Usuario: {},
  Portafolios: {
    findAll: jest.fn(),
  },
}));

describe('Pruebas de seguidos_controller', () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      usuario: { id: 1 },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  //Al seguir a un usuario debe devolver 201 y el usuario seguido si los datos son correctos
  describe('seguir', () => {
    it('debe seguir a un usuario exitosamente y retornar 201', async () => {
      req.body = { id_seguido: 2 };
      Seguidos.findOne.mockResolvedValue(null);
      const mockSeguido = { id: 1, id_seguidor: 1, id_seguido: 2 };
      Seguidos.create.mockResolvedValue(mockSeguido);

      await seguir(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        status: 201,
        message: 'Ahora sigues a este usuario',
        data: mockSeguido,
      });
    });

    //Al seguir a un usuario debe devolver 400 si id_seguido es requerido
    it('debe retornar 400 si id_seguido es requerido', async () => {
      req.body = {};

      await seguir(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    //Al seguir a un usuario debe devolver 400 si se intenta seguir a sí mismo
    it('debe retornar 400 si se intenta seguir a sí mismo', async () => {
      req.body = { id_seguido: 1 };

      await seguir(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        status: 400,
        message: 'No puedes seguirte a ti mismo',
      });
    });

    //Al seguir a un usuario debe devolver 409 si ya lo sigue
    it('debe retornar 409 si ya lo sigue', async () => {
      req.body = { id_seguido: 2 };
      Seguidos.findOne.mockResolvedValue({ id: 1 });

      await seguir(req, res);

      expect(res.status).toHaveBeenCalledWith(409);
    });
  });

  //Al dejar de seguir a un usuario debe devolver 200 y la relacion eliminada si existe, si no 404
  describe('dejarSeguir', () => {
    it('debe dejar de seguir y retornar 200', async () => {
      req.params = { id_seguido: 2 };
      const mockRelacion = { destroy: jest.fn().mockResolvedValue() };
      Seguidos.findOne.mockResolvedValue(mockRelacion);

      await dejarSeguir(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(mockRelacion.destroy).toHaveBeenCalled();
    });

    //Al dejar de seguir a un usuario debe devolver 404 si no sigue al usuario
    it('debe retornar 404 si no sigue al usuario', async () => {
      req.params = { id_seguido: 2 };
      Seguidos.findOne.mockResolvedValue(null);

      await dejarSeguir(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  //Al verificar si sigue a un usuario debe devolver true si lo sigue debe retornar un 200 
  describe('verificarSeguimiento', () => {
    it('debe retornar true si lo sigue', async () => {
      req.params = { id_seguido: 2 };
      Seguidos.findOne.mockResolvedValue({ id: 1 });

      await verificarSeguimiento(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 200,
        message: 'OK',
        data: { siguiendo: true },
      });
    });
  });

  //Al obtener los portafolios de los seguidos debe devolver 200 y los portafolios si existen
  describe('portafoliosDeSeguidos', () => {
    it('debe retornar portafolios de seguidos', async () => {
      Seguidos.findAll.mockResolvedValue([{ id_seguido: 2 }]);
      const mockPortafolios = [{ id_portafolio: 1, title: 'Portfolio' }];
      Portafolios.findAll.mockResolvedValue(mockPortafolios);

      await portafoliosDeSeguidos(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 200,
        message: 'OK',
        data: mockPortafolios,
      });
    });

    it('debe retornar arreglo vacío si no sigue a nadie', async () => {
      Seguidos.findAll.mockResolvedValue([]);

      await portafoliosDeSeguidos(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 200,
        message: 'OK',
        data: [],
      });
    });
  });
});
