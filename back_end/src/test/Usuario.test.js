const { crearUsuario, LoginUsuario, editarUsuario, obtenerUsuario } = require('../controllers/UsuarioController');
const { Usuario } = require('../index');
const { validationResult } = require('express-validator');

// Mock de Sequelize y los modelos de ../index
jest.mock('../index', () => ({
    Usuario: {
        create: jest.fn(),
        findOne: jest.fn(),
        findByPk: jest.fn(),
    },
}));

// Mock de express-validator
jest.mock('express-validator', () => ({
    validationResult: jest.fn(),
}));

// Mock de bcrypt
jest.mock('bcrypt', () => ({
    hash: jest.fn().mockResolvedValue('hashedPassword'),
    compare: jest.fn(),
}));

// Mock de jsonwebtoken
jest.mock('jsonwebtoken', () => ({
    sign: jest.fn().mockReturnValue('mockedToken'),
}));

describe('Pruebas de UsuarioController - Estados y Errores (201, 400, 401, 404)', () => {
    let req;
    let res;

    beforeEach(() => {
        req = {
            body: {},
            params: {},
            query: {},
            headers: {},
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        jest.clearAllMocks();

        // Por defecto, las validaciones pasan sin errores
        validationResult.mockReturnValue({
            isEmpty: () => true,
            array: () => [],
        });
    });

    //Al crear un usuario debe devolver 201 y el usuario creado si los datos son correctos
    describe('crearUsuario (Registrar Usuario)', () => {
        it('debe responder con estado 201 cuando el usuario se crea correctamente', async () => {
            req.body = {
                nombre_usuario: 'testuser',
                nombre_completo: 'Usuario de Prueba',
                correo: 'test@example.com',
                contrasena: 'password123',
            };

            const mockSavedUser = {
                id_usuario: 1,
                nombre_usuario: 'testuser',
                nombre_completo: 'Usuario de Prueba',
                correo: 'test@example.com',
                toJSON: jest.fn().mockReturnValue({
                    id_usuario: 1,
                    nombre_usuario: 'testuser',
                    nombre_completo: 'Usuario de Prueba',
                    correo: 'test@example.com',
                }),
            };

            Usuario.create.mockResolvedValue(mockSavedUser);

            await crearUsuario(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    status: 201,
                    message: 'Usuario creado correctamente',
                    data: expect.any(Object),
                })
            );
        });

        //Al crear un usuario debe devolver 400 si los datos son incorrectos
        it('debe responder con estado 400 cuando los datos de entrada son inválidos (Error de Validación)', async () => {
            // Simular error de validación (por ejemplo, correo faltante)
            validationResult.mockReturnValueOnce({
                isEmpty: () => false,
                array: () => [
                    { msg: 'El correo es requerido', path: 'correo', location: 'body' }
                ],
            });

            req.body = {
                nombre_usuario: 'testuser',
                nombre_completo: 'Usuario de Prueba',
                contrasena: 'password123',
                // Falta correo
            };

            await crearUsuario(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                status: 400,
                message: 'Datos inválidos',
                data: expect.arrayContaining([
                    expect.objectContaining({ msg: 'El correo es requerido' })
                ]),
            });
        });
    });

    //Al iniciar sesion debe devolver 400 si los campos del login fallan la validación
    describe('LoginUsuario (Inicio de Sesión)', () => {
        it('debe responder con estado 400 si los campos del login fallan la validación', async () => {
            validationResult.mockReturnValueOnce({
                isEmpty: () => false,
                array: () => [
                    { msg: 'La contraseña es requerida', path: 'contrasena', location: 'body' }
                ],
            });

            req.body = {
                correo: 'test@example.com',
                // Falta contraseña
            };

            await LoginUsuario(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    status: 400,
                    message: 'Datos inválidos',
                })
            );
        });

        //Al iniciar sesion debe devolver 401 cuando la contraseña es incorrecta
        it('debe responder con estado 401 cuando la contraseña es incorrecta (Credenciales Inválidas)', async () => {
            req.body = {
                correo: 'test@example.com',
                contrasena: 'password_incorrecta',
            };

            const mockUser = {
                id_usuario: 1,
                correo: 'test@example.com',
                contrasena: 'hashedPasswordInDb',
            };

            // El usuario existe en la base de datos
            Usuario.findOne.mockResolvedValue(mockUser);
            // Pero la comparación de contraseñas de bcrypt falla (retorna false)
            const bcrypt = require('bcrypt');
            bcrypt.compare.mockResolvedValue(false);

            await LoginUsuario(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({
                status: 401,
                message: 'Contraseña incorrecta',
            });
        });

        //Al iniciar sesion debe devolver 404 cuando el correo no está registrado
        it('debe responder con estado 404 cuando el correo no está registrado', async () => {
            req.body = {
                correo: 'no_registrado@example.com',
                contrasena: 'password123',
            };

            // Falla la búsqueda del usuario (retorna null)
            Usuario.findOne.mockResolvedValue(null);

            await LoginUsuario(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                status: 404,
                message: 'Usuario no encontrado',
            });
        });
    });

    //Al editar un usuario debe devolver 400 si los datos son incorrectos
    describe('editarUsuario (Modificar Perfil)', () => {
        it('debe responder con estado 400 si los datos provistos para editar fallan la validación', async () => {
            validationResult.mockReturnValueOnce({
                isEmpty: () => false,
                array: () => [
                    { msg: 'Máximo 30 caracteres', path: 'nombre_usuario', location: 'body' }
                ],
            });

            req.params = { id_usuario: 1 };
            req.body = {
                nombre_usuario: 'nombre_de_usuario_demasiado_largo_que_supera_el_limite',
            };

            await editarUsuario(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    status: 400,
                    message: 'Datos inválidos',
                })
            );
        });

        //Al editar un usuario debe devolver 404 si el usuario no existe
        it('debe responder con estado 404 si se intenta editar un usuario que no existe', async () => {
            req.params = { id_usuario: 999 };
            req.body = {
                nombre_completo: 'Nuevo Nombre',
            };

            Usuario.findByPk.mockResolvedValue(null);

            await editarUsuario(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                status: 404,
                message: 'Usuario no encontrado',
            });
        });
    });
});
