import React, { useState } from 'react'
import Fetch from '../../services/Fetch'
import { useNavigate } from 'react-router-dom'
import UploadImage from '../PlantillaTalentos/SubirImagen'
import '../../Styles/EstilosRegistros/Registro.css'

function Registro() {
    const navigate = useNavigate()
    const volver = () => {
        navigate("/")
    }

    const [NombreUsuario, setNombreUsuario] = useState("")
    const [Nombre, setNombre] = useState("")
    const [Correo, setCorreo] = useState("")
    const [Telefono, setTelefono] = useState("")
    const [Provincias, setProvincia] = useState("")
    const [Canton, setCanton] = useState("")
    const [Distrito, setDistrito] = useState("")
    const [TipoCuenta, setTipoCuenta] = useState("Personal")
    const [Contrasena, setContraseña] = useState("")
    const [img, setImg] = useState("")
    const [showPassword, setShowPassword] = useState(false)

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    async function RegistroUsuarios() {
        if (!NombreUsuario || !Nombre || !Correo || !Telefono || !Provincias || !Canton || !Distrito || !Contrasena) {
            alert("Debe de llenar todo los campos");
            return;
        }

        const objUsuarios = {
            NombreUsuario: NombreUsuario,
            Nombre: Nombre,
            Correo: Correo,
            email: Correo,
            telefono: Telefono,
            Provincias: Provincias,
            Canton: Canton,
            Distrito: Distrito,
            Roles: TipoCuenta,
            Contrasena: Contrasena,
            img: img || 'https://via.placeholder.com/150'
        }

        if (Contrasena.length < 8) {
            alert("La contraseña debe tener al menos 8 caracteres")
            return;
        }
        if (!emailRegex.test(Correo)) {
            alert("Correo inválido");
            return;
        }

        const UsuarioAlmacenado = await Fetch.postData(objUsuarios, "usuarios")
        if (UsuarioAlmacenado) {
            alert("Registro exitoso")
            if (UsuarioAlmacenado.id) {
                localStorage.setItem('idUsuario', UsuarioAlmacenado.id)
            }
            navigate("/")
        }
    }

    return (
        <div className='MainRegistroContainer'>
            <div className='BackgroundDecoration'>
                <button className='BotonVolver' onClick={() => navigate("/")}>
                    ← Volver al Inicio
                </button>
                <div className='DecorationContent'>
                    <h1 className='TituloBienvenido'>Bienvenido a <span className='BrandName'>Krea</span></h1>
                    <p>Únete a nuestra comunidad de talentos y muestra al mundo lo que puedes hacer.</p>
                </div>
            </div>

            <div className='CardRegistro'>
                <div className='RegistroHeader'>
                    <h1 className='TituloRegistro'>Crea tu cuenta</h1>
                    <p className='SubtituloRegistro'>Completa tus datos para empezar tu viaje en Krea</p>
                </div>

                <div className='FormRegistro'>
                    {/* Foto de Perfil */}
                    <div className='ProfileUploadSection'>
                        <label htmlFor="profile-upload" className='CircularUpload'>
                            <UploadImage setImageUrl={setImg} id="profile-upload" />
                            {img ? (
                                <img src={img} alt="Perfil" className='ImgPerfilPreview' />
                            ) : (
                                <div className='PlaceholderIcon'>
                                    <i className="fa-solid fa-camera-retro"></i>
                                </div>
                            )}
                            <div className='EditPhotoButton'>
                                <i className="fa-solid fa-pencil"></i>
                            </div>
                        </label>
                        <label className='LabelFoto'>FOTO DE PERFIL</label>
                    </div>

                    {/* Información Personal */}
                    <h3 className='SectionTitle'>INFORMACIÓN PERSONAL</h3>
                    <div className='InputRow'>
                        <div className='InputGroup'>
                            <label>Nombre de usuario</label>
                            <div className='InputWithIcon'>
                                <i className="fa-solid fa-at icon"></i>
                                <input 
                                    type="text" 
                                    value={NombreUsuario} 
                                    onChange={(e) => setNombreUsuario(e.target.value)} 
                                    placeholder="usuario123" 
                                />
                            </div>
                        </div>
                        <div className='InputGroup'>
                            <label>Nombre completo</label>
                            <div className='InputWithIcon'>
                                <i className="fa-regular fa-user icon"></i>
                                <input 
                                    type="text" 
                                    value={Nombre} 
                                    onChange={(e) => setNombre(e.target.value)} 
                                    placeholder="Ej. Juan Pérez" 
                                />
                            </div>
                        </div>
                    </div>

                    {/* Contacto */}
                    <h3 className='SectionTitle'>CONTACTO</h3>
                    <div className='InputRow'>
                        <div className='InputGroup'>
                            <label>Correo electrónico</label>
                            <div className='InputWithIcon'>
                                <i className="fa-regular fa-envelope icon"></i>
                                <input 
                                    type="email" 
                                    value={Correo} 
                                    onChange={(e) => setCorreo(e.target.value)} 
                                    placeholder="nombre@ejemplo.com" 
                                />
                            </div>
                        </div>
                        <div className='InputGroup'>
                            <label>Teléfono</label>
                            <div className='InputWithIcon'>
                                <i className="fa-solid fa-phone icon"></i>
                                <input 
                                    type="text" 
                                    value={Telefono} 
                                    onChange={(e) => setTelefono(e.target.value)} 
                                    placeholder="+506 8888-8888" 
                                />
                            </div>
                        </div>
                    </div>

                    {/* Ubicación */}
                    <h3 className='SectionTitle'>UBICACIÓN</h3>
                    <div className='InputGrid3'>
                        <div className='InputGroup'>
                            <label>Provincia</label>
                            <div className='SelectWrapper'>
                                <select value={Provincias} onChange={(e) => setProvincia(e.target.value)}>
                                    <option value="" disabled>Provincia</option>
                                    <option value="San José">San José</option>
                                    <option value="Alajuela">Alajuela</option>
                                    <option value="Cartago">Cartago</option>
                                    <option value="Heredia">Heredia</option>
                                    <option value="Guanacaste">Guanacaste</option>
                                    <option value="Puntarenas">Puntarenas</option>
                                    <option value="Limón">Limón</option>
                                </select>
                                <i className="fa-solid fa-chevron-down select-icon"></i>
                            </div>
                        </div>
                        <div className='InputGroup'>
                            <label>Cantón</label>
                            <div className='SelectWrapper'>
                                <input 
                                    type="text" 
                                    value={Canton} 
                                    onChange={(e) => setCanton(e.target.value)} 
                                    placeholder="Cantón" 
                                />
                                <i className="fa-solid fa-chevron-down select-icon"></i>
                            </div>
                        </div>
                        <div className='InputGroup'>
                            <label>Distrito</label>
                            <div className='SelectWrapper'>
                                <input 
                                    type="text" 
                                    value={Distrito} 
                                    onChange={(e) => setDistrito(e.target.value)} 
                                    placeholder="Distrito" 
                                />
                                <i className="fa-solid fa-chevron-down select-icon"></i>
                            </div>
                        </div>
                    </div>

                    {/* Configuración de Cuenta */}
                    <h3 className='SectionTitle'>CONFIGURACIÓN DE CUENTA</h3>
                    <div className='InputRow'>
                        <div className='InputGroup'>
                            <label>Tipo de cuenta</label>
                            <div className='ToggleGroup'>
                                <button 
                                    className={`ToggleBtn ${TipoCuenta === 'Personal' ? 'active' : ''}`}
                                    onClick={() => setTipoCuenta('Personal')}
                                >
                                    Personal
                                </button>
                                <button 
                                    className={`ToggleBtn ${TipoCuenta === 'Empresa' ? 'active' : ''}`}
                                    onClick={() => setTipoCuenta('Empresa')}
                                >
                                    Empresa
                                </button>
                            </div>
                        </div>
                        <div className='InputGroup'>
                            <label>Contraseña</label>
                            <div className='InputWithIcon'>
                                <i className="fa-solid fa-lock icon"></i>
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    value={Contrasena} 
                                    onChange={(e) => setContraseña(e.target.value)} 
                                    placeholder="8+ caracteres" 
                                />
                                <i 
                                    className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'} toggle-pass`}
                                    onClick={() => setShowPassword(!showPassword)}
                                ></i>
                            </div>
                        </div>
                    </div>

                    <div className='ButtonContainer'>
                        <button className='BotonCrear' onClick={RegistroUsuarios}>Crear Cuenta</button>
                        <div className='LoginPrompt'>
                            <span>¿Ya tienes una cuenta? 
                                <span className='link_login' onClick={() => navigate("/Iniciar")}> Inicia Sesión Aquí</span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Registro