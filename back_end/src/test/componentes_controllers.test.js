const { crearComponente, obtenerComponentes, eliminarComponente, editarComponente } = require('../controllers/componentes_controllers');
const { Componentes } = require('../index');

jest.mock('../index', () => ({
  Componentes: {
    create: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
  },
}));

describe('Pruebas de componentes_controllers', () => {
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

  //Al crear un componente debe devolver 201 y el componente creado
  describe('crearComponente', () => {
    it('debe crear un componente y retornar 201', async () => {
      req.body = { tipo: 'header', orden: 1 };
      const mockComp = { id_componente: 1, tipo: 'header', orden: 1 };
      Componentes.create.mockResolvedValue(mockComp);

      await crearComponente(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ "componente creado": mockComp });
    });
  });

  //Al obtener los componentes debe devolver 200 y todos los componentes
  describe('obtenerComponentes', () => {
    it('debe obtener todos los componentes', async () => {
      const mockComps = [{ id_componente: 1 }];
      Componentes.findAll.mockResolvedValue(mockComps);

      await obtenerComponentes(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockComps);
    });
  });

  //Al eliminar un componente debe devolver 200 y el componente eliminado si existe, si no 404
  describe('eliminarComponente', () => {
    it('debe eliminar un componente y retornar 200', async () => {
      req.params = { id_componente: 1 };
      const mockComp = { id_componente: 1, destroy: jest.fn().mockResolvedValue() };
      Componentes.findByPk.mockResolvedValue(mockComp);

      await eliminarComponente(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(mockComp.destroy).toHaveBeenCalled();
    });

    //Al eliminar un componente que no existe debe devolver 404
    it('debe retornar 404 si el componente no existe', async () => {
      req.params = { id_componente: 999 };
      Componentes.findByPk.mockResolvedValue(null);

      await eliminarComponente(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Componente no encontrado' });
    });
  });

  //Al editar un componente debe devolver 200 y el componente actualizado si existe, si no 404
  describe('editarComponente', () => {
    it('debe actualizar el componente y retornar 200', async () => {
      req.params = { id_componente: 1 };
      req.body = { tipo: 'footer', orden: 2 };
      const mockComp = { id_componente: 1, update: jest.fn().mockResolvedValue() };
      Componentes.findByPk.mockResolvedValue(mockComp);

      await editarComponente(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(mockComp.update).toHaveBeenCalledWith({ tipo: 'footer', orden: 2 });
    });

    //Al editar un componente que no existe debe devolver 404
    it('debe retornar 404 si el componente no existe al editar', async () => {
      req.params = { id_componente: 999 };
      Componentes.findByPk.mockResolvedValue(null);

      await editarComponente(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });
});
