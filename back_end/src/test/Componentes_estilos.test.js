const { creaarComponente_estilo, obtenerComponentes_estilos, eliminarComponente_estilo, editarComponente_estilo } = require('../controllers/Componentes_estilos');
const { Componentes_estilos } = require('../index');

jest.mock('../index', () => ({
  Componentes_estilos: {
    create: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
  },
}));

describe('Pruebas de Componentes_estilos', () => {
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

  //Al crear un componente estilo debe devolver 201 y el componente estilo creado
  describe('creaarComponente_estilo', () => {
    it('debe crear un estilo y retornar 201', async () => {
      req.body = { imagen_fondo: 'fondo.png', color_fondo: '#ffffff' };
      const mockEstilo = { id: 1, imagen_fondo: 'fondo.png', color_fondo: '#ffffff' };
      Componentes_estilos.create.mockResolvedValue(mockEstilo);

      await creaarComponente_estilo(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ "componente estilo creado": mockEstilo });
    });
  });

  //Al obtener los componentes estilos debe devolver 200 y todos los componentes estilos
  describe('obtenerComponentes_estilos', () => {
    it('debe obtener todos los estilos de componentes', async () => {
      const mockEstilos = [{ id: 1 }];
      Componentes_estilos.findAll.mockResolvedValue(mockEstilos);

      await obtenerComponentes_estilos(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockEstilos);
    });
  });

  //Al eliminar un componente estilo debe devolver 200 y el componente estilo eliminado si existe, si no 404
  describe('eliminarComponente_estilo', () => {
    it('debe eliminar un estilo y retornar 200', async () => {
      req.params = { id: 1 };
      const mockEstilo = { id: 1, destroy: jest.fn().mockResolvedValue() };
      Componentes_estilos.findByPk.mockResolvedValue(mockEstilo);

      await eliminarComponente_estilo(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(mockEstilo.destroy).toHaveBeenCalled();
    });

    //Al eliminar un componente estilo que no existe debe devolver 404
    it('debe retornar 404 si el estilo no existe', async () => {
      req.params = { id: 999 };
      Componentes_estilos.findByPk.mockResolvedValue(null);

      await eliminarComponente_estilo(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Componente estilo no encontrado' });
    });
  });

  //Al editar un componente estilo debe devolver 200 y el componente estilo actualizado si existe, si no 404
  describe('editarComponente_estilo', () => {
    it('debe actualizar el estilo y retornar 200', async () => {
      req.params = { id: 1 };
      req.body = { imagen_fondo: 'nuevo_fondo.png', color_fondo: '#000000' };
      const mockEstilo = { id: 1, update: jest.fn().mockResolvedValue() };
      Componentes_estilos.findByPk.mockResolvedValue(mockEstilo);

      await editarComponente_estilo(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(mockEstilo.update).toHaveBeenCalledWith({ imagen_fondo: 'nuevo_fondo.png', color_fondo: '#000000' });
    });

    //Al editar un componente estilo que no existe debe devolver 404
    it('debe retornar 404 si el estilo no existe al editar', async () => {
      req.params = { id: 999 };
      Componentes_estilos.findByPk.mockResolvedValue(null);

      await editarComponente_estilo(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });
});
