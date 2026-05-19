const { crearBloque_componente, obtenerBloques_componentes, eliminarBloque_componente, editarBloque_componente } = require('../controllers/bloques_componentes_controllers');
const { Bloques_Componentes } = require('../index');

jest.mock('../index', () => ({
  Bloques_Componentes: {
    create: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
  },
}));

describe('Pruebas de bloques_componentes_controllers', () => {
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

  //Al crear un bloque de componentes debe devolver 201 y el bloque creado
  describe('crearBloque_componente', () => {
    it('debe crear un bloque componente y retornar 201', async () => {
      req.body = { nombre: 'Bloque 1', descripcion: 'Info' };
      const mockBloque = { id: 1, nombre: 'Bloque 1', descripcion: 'Info' };
      Bloques_Componentes.create.mockResolvedValue(mockBloque);

      await crearBloque_componente(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ "bloque componente creado": mockBloque });
    });
  });

  //Al obtener los bloques debe devolver 200 y todos los bloques componentes
  describe('obtenerBloques_componentes', () => {
    it('debe obtener todos los bloques componentes', async () => {
      const mockBloques = [{ id: 1 }];
      Bloques_Componentes.findAll.mockResolvedValue(mockBloques);

      await obtenerBloques_componentes(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockBloques);
    });
  });

  //Al eliminar un bloque de componentes debe devolver 200 y el bloque eliminado si existe, si no 404
  describe('eliminarBloque_componente', () => {
    it('debe eliminar un bloque componente existente', async () => {
      req.params = { id: 1 };
      const mockBloque = { id: 1, destroy: jest.fn().mockResolvedValue() };
      Bloques_Componentes.findByPk.mockResolvedValue(mockBloque);

      await eliminarBloque_componente(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(mockBloque.destroy).toHaveBeenCalled();
    });

    //Al eliminar un bloque de componentes que no existe debe devolver 404
    it('debe retornar 404 si el bloque componente no existe', async () => {
      req.params = { id: 999 };
      Bloques_Componentes.findByPk.mockResolvedValue(null);

      await eliminarBloque_componente(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Bloque componente no encontrado' });
    });
  });

  //Al editar un bloque de componentes debe devolver 200 y el bloque actualizado si existe, si no 404
  describe('editarBloque_componente', () => {
    it('debe actualizar el bloque componente y retornar 200', async () => {
      req.params = { id: 1 };
      req.body = { nombre: 'Bloque Editado', descripcion: 'Nueva Info' };
      const mockBloque = { id: 1, update: jest.fn().mockResolvedValue() };
      Bloques_Componentes.findByPk.mockResolvedValue(mockBloque);

      await editarBloque_componente(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(mockBloque.update).toHaveBeenCalledWith({ nombre: 'Bloque Editado', descripcion: 'Nueva Info' });
    });

    //Al editar un bloque de componentes que no existe debe devolver 404
    it('debe retornar 404 si el bloque componente no existe al editar', async () => {
      req.params = { id: 999 };
      Bloques_Componentes.findByPk.mockResolvedValue(null);

      await editarBloque_componente(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });
});
