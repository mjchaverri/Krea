import React, { useState } from 'react'
import { useEffect } from 'react'
import Fetch from '../../services/Fetch'
import { useNavigate } from "react-router-dom";
import '../../styles/Principales/InicioSesion.css'



function IniciarSesion() {
    const [Correo, setCorreo] = useState("")
    const [contrasena, setContrasena] = useState("")
    const [Rol, setRol] = useState("")
    const navigate = useNavigate()
    const [usuarios, setUsuarios] = useState([])
    useEffect(() => {

        async function traerUsuarios() {
            const lista = await Fetch.getData("usuarios")
            setUsuarios(lista)


        }
        traerUsuarios()
    }, [])
    function validarInicio() {
        const usuarioValido = usuarios.find((usuario) => usuario.Correo == Correo && usuario.Contrasena == contrasena)
        if (usuarioValido) {
            alert("Ingreso Exitoso")
            localStorage.setItem("UsuarioActivo", JSON.stringify(usuarioValido));
            localStorage.setItem("idUsuario", usuarioValido.id);
            if (usuarioValido.Roles === "Admin") {
                navigate("/Admin")
                localStorage.setItem("rol", usuarioValido.Roles);
            } else {
                navigate("/principal")
            }
        } else {
            alert("El usuario no existe")
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
                    <h2 className='TituloPrincipal'> <strong>Iniciar sesión</strong> </h2>
                    <div className='ParrafoForm'>
                        <h6 className='SubtituloForm'>Inicia sesión para mostrar tu talento</h6>

                        <div className='InputGroup'>
                            <label>Correo electrónico</label>
                            <input type="email" value={Correo} onChange={(evento) => setCorreo(evento.target.value)} placeholder="tu@correo.com" />
                        </div>

                        <div className='InputGroup'>
                            <label>Contraseña</label>
                            <input type="password" value={contrasena} onChange={(evento) => setContrasena(evento.target.value)} placeholder="********" />
                        </div>

                        <button className='BotonEntrar' onClick={validarInicio}>Entrar ahora </button>

                        <div className='RegistroPrompt'>
                            <h6>¿No tienes cuenta?
                                <a className='link_registro' href="/Registro">Regístrate Aquí</a>
                            </h6>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default IniciarSesion