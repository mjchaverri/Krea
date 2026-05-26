import React, { useState } from 'react'
import { useNavigate } from "react-router-dom"
import Fetch from '../../services/Fetch'
import Swal from 'sweetalert2'
import '../../styles/Principales/InicioSesion.css'

function IniciarSesion() {
    const [correo, setCorreo] = useState("")
    const [contrasena, setContrasena] = useState("")
    const navigate = useNavigate()

    async function validarInicio() {
        if (!correo || !contrasena) {
            Swal.fire({ icon: 'warning', title: 'Campos requeridos', text: 'Debes ingresar correo y contraseña.', confirmButtonColor: '#0ea5e9' })
            return
        }
        Swal.fire({ title: 'Iniciando sesión...', allowOutsideClick: false, didOpen: () => Swal.showLoading() })
        try {
            const data = await Fetch.postData('usuarios/login', { correo, contrasena })

            localStorage.setItem('token', data.token)
            localStorage.setItem('UsuarioActivo', JSON.stringify({
                id: data.usuario.id_usuario,
                nombre_usuario: data.usuario.nombre_usuario,
                Nombre: data.usuario.nombre_completo,
                Correo: data.usuario.correo,
                img: data.usuario.img_perfil,
                id_rol: data.usuario.id_rol,
                Roles: data.usuario.id_rol === 1 ? 'Admin' : 'Usuario'
            }))
            localStorage.setItem('idUsuario', data.usuario.id_usuario)

            if (data.usuario.id_rol === 1) {
                localStorage.setItem('rol', 'Admin')
                await Swal.fire({ icon: 'success', title: '¡Bienvenido!', text: 'Ingreso exitoso.', confirmButtonColor: '#0ea5e9', timer: 1500, showConfirmButton: false })
                navigate("/Admin")
            } else {
                await Swal.fire({ icon: 'success', title: '¡Bienvenido!', text: 'Ingreso exitoso.', confirmButtonColor: '#0ea5e9', timer: 1500, showConfirmButton: false })
                navigate("/principal")
            }
        } catch (error) {
            Swal.fire({ icon: 'error', title: 'Error al iniciar sesión', text: error.message || 'Correo o contraseña incorrectos.', confirmButtonColor: '#0ea5e9' })
        }
    }

    return (
        <div className='MainLoginContainer'>
            <div className='BackgroundDecoration'>
                <button className='BotonVolver' onClick={() => navigate("/")}>
                    ← Volver al Inicio
                </button>
                <div className='DecorationContent'>
                    <h1 className='TituloBienvenido'>Hola de nuevo en <span className='BrandName'>Krea</span></h1>
                    <p>Inicia sesión para continuar mostrando tu talento al mundo.</p>
                </div>
            </div>

            <div className='CardLogin'>
                <div className='DivForm'>
                    <h2 className='TituloPrincipal'><strong>Iniciar sesión</strong></h2>
                    <div className='ParrafoForm'>
                        <h6 className='SubtituloForm'>Inicia sesión para mostrar tu talento</h6>

                        <form onSubmit={e => { e.preventDefault(); validarInicio() }} style={{ margin: 0, padding: 0, display: 'contents' }}>
                        <div className='InputGroup'>
                            <label>Correo electrónico</label>
                            <input
                                type="email"
                                value={correo}
                                onChange={e => setCorreo(e.target.value)}
                                placeholder="tu@correo.com"
                            />
                        </div>

                        <div className='InputGroup'>
                            <label>Contraseña</label>
                            <input
                                type="password"
                                value={contrasena}
                                onChange={e => setContrasena(e.target.value)}
                                placeholder="********"
                            />
                        </div>

                        <button type="submit" className='BotonEntrar'>
                            Entrar ahora
                        </button>
                        </form>

                        <div className='RegistroPrompt'>
                            <h6>¿No tienes cuenta?
                                <a className='link_registro' href="/Registro"> Regístrate Aquí</a>
                            </h6>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default IniciarSesion
