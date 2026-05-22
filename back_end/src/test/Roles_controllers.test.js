const { crearRol, obtnerRoles, eliminarRol, editarRol } = require('../controllers/Roles_controllers');
const { Roles } = require('../index');
const { validationResult } = require('express-validator');

jest.mock('../index', () => ({
  Roles: {
    create: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
  },
}));

jest.mock('express-validator', () => ({
  validationResult: jest.fn(),
}));

describe('Pruebas de Roles_controllers', () => {
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
    validationResult.mockReturnValue({
      isEmpty: () => true,
      array: () => [],
    });
  });

  //Al crear un rol debe devolver 201 y el rol creado si los datos son correctos
  describe('crearRol', () => {
    it('debe crear un rol con estado 201 exitosamente', async () => {
      req.body = { nombre: 'admin' };
      const mockRol = { id_rol: 1, nombre: 'admin' };
      Roles.create.mockResolvedValue(mockRol);

      await crearRol(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        status: 201,
        message: 'Rol creado correctamente',
        data: mockRol,
      });
    });

    //Al crear un rol debe devolver 400 si la validación falla
    it('debe retornar 400 si los datos son inválidos', async () => {
      validationResult.mockReturnValueOnce({
        isEmpty: () => false,
        array: () => [{ msg: 'El nombre es requerido' }],
      });

      await crearRol(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ status: 400, message: 'Datos inválidos' })
      );
    });
  });

  //Al obtener los roles debe devolver 200 y todos los roles
  describe('obtnerRoles', () => {
    it('debe retornar todos los roles con estado 200', async () => {
      const mockRoles = [{ id_rol: 1, nombre: 'admin' }];
      Roles.findAll.mockResolvedValue(mockRoles);

      await obtnerRoles(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ status: 200, message: 'OK', data: mockRoles });
    });
  });

  //Al eliminar un rol debe devolver 200 y el rol eliminado si existe, si no 404
  describe('eliminarRol', () => {
    it('debe eliminar un rol exitosamente y retornar 200', async () => {
      req.params = { id_rol: 1 };
      const mockRol = { id_rol: 1, nombre: 'admin', destroy: jest.fn().mockResolvedValue() };
      Roles.findByPk.mockResolvedValue(mockRol);

      await eliminarRol(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(mockRol.destroy).toHaveBeenCalled();
    });

    //Al eliminar un rol debe devolver 404 si el rol no existe
    it('debe retornar 404 si el rol no existe', async () => {
      req.params = { id_rol: 999 };
      Roles.findByPk.mockResolvedValue(null);

      await eliminarRol(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ status: 404, message: 'Rol no encontrado' });
    });
  });

  //Al editar un rol debe devolver 200 y el rol actualizado si existe, si no 404
  describe('editarRol', () => {
    it('debe actualizar un rol y retornar 200', async () => {
      req.params = { id_rol: 1 };
      req.body = { nombre: 'superadmin' };
      const mockRol = { id_rol: 1, nombre: 'admin', update: jest.fn().mockResolvedValue() };
      Roles.findByPk.mockResolvedValue(mockRol);

      await editarRol(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(mockRol.update).toHaveBeenCalledWith({ nombre: 'superadmin' });
    });

    //Al editar un rol debe devolver 404 si el rol no existe
    it('debe retornar 404 si el rol no existe al editar', async () => {
      req.params = { id_rol: 999 };
      Roles.findByPk.mockResolvedValue(null);

      await editarRol(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });
});
