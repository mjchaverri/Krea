import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Fetch from '../../services/Fetch'
import Swal from 'sweetalert2'
import UploadImage from '../PlantillaTalentos/SubirImagen'
import '../../Styles/EstilosRegistros/Registro.css'

const API_UBICACIONES = 'https://ubicaciones.paginasweb.cr'

function Registro() {
    const navigate = useNavigate()

    const [NombreUsuario, setNombreUsuario] = useState("")
    const [Nombre, setNombre]               = useState("")
    const [Correo, setCorreo]               = useState("")
    const [Telefono, setTelefono]           = useState("")
    const [TipoCuenta, setTipoCuenta]       = useState("personal")
    const [Contrasena, setContraseña]       = useState("")
    const [img, setImg]                     = useState("")
    const [showPassword, setShowPassword]   = useState(false)
    const [cargando, setCargando]           = useState(false)

    // Ubicación — IDs para las llamadas a la API, nombres para enviar al backend
    const [provincias, setProvincias]       = useState([])
    const [cantones, setCantones]           = useState([])
    const [distritos, setDistritos]         = useState([])
    const [provinciaId, setProvinciaId]     = useState("")
    const [provinciaNombre, setProvinciaNombre] = useState("")
    const [cantonId, setCantonId]           = useState("")
    const [cantonNombre, setCantonNombre]   = useState("")
    const [distritoNombre, setDistritoNombre] = useState("")

    useEffect(() => {
        fetch(`${API_UBICACIONES}/provincias.json`)
            .then(r => r.json())
            .then(data => setProvincias(Object.entries(data).map(([id, nombre]) => ({ id, nombre }))))
            .catch(console.error)
    }, [])

    const handleProvincia = async (id, nombre) => {
        setProvinciaId(id)
        setProvinciaNombre(nombre)
        setCantonId("")
        setCantonNombre("")
        setDistritoNombre("")
        setCantones([])
        setDistritos([])
        if (!id) return
        try {
            const data = await fetch(`${API_UBICACIONES}/provincia/${id}/cantones.json`).then(r => r.json())
            setCantones(Object.entries(data).map(([cid, nombre]) => ({ id: cid, nombre })))
        } catch (e) { console.error(e) }
    }

    const handleCanton = async (id, nombre) => {
        setCantonId(id)
        setCantonNombre(nombre)
        setDistritoNombre("")
        setDistritos([])
        if (!id) return
        try {
            const data = await fetch(`${API_UBICACIONES}/provincia/${provinciaId}/canton/${id}/distritos.json`).then(r => r.json())
            setDistritos(Object.entries(data).map(([did, nombre]) => ({ id: did, nombre })))
        } catch (e) { console.error(e) }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    async function RegistroUsuarios() {
        if (!NombreUsuario || !Nombre || !Correo || !Telefono || !provinciaNombre || !cantonNombre || !distritoNombre || !Contrasena) {
            Swal.fire({ icon: 'warning', title: 'Campos incompletos', text: 'Debe llenar todos los campos.', confirmButtonColor: '#0ea5e9' })
            return
        }
        if (Contrasena.length < 6) {
            Swal.fire({ icon: 'warning', title: 'Contraseña muy corta', text: 'La contraseña debe tener al menos 6 caracteres.', confirmButtonColor: '#0ea5e9' })
            return
        }
        if (!emailRegex.test(Correo)) {
            Swal.fire({ icon: 'warning', title: 'Correo inválido', text: 'Ingresa un correo electrónico válido.', confirmButtonColor: '#0ea5e9' })
            return
        }

        Swal.fire({ title: 'Registrando cuenta...', allowOutsideClick: false, didOpen: () => Swal.showLoading() })
        setCargando(true)
        try {
            const id_rol = TipoCuenta === 'empresa' ? 3 : 2
            await Fetch.postData('usuarios/register', {
                nombre_usuario:  NombreUsuario,
                nombre_completo: Nombre,
                correo:          Correo,
                contrasena:      Contrasena,
                telefono:        Telefono,
                provincia:       provinciaNombre,
                canton:          cantonNombre,
                distrito:        distritoNombre,
                img_perfil:      img || null,
                id_rol,
            })

            await Swal.fire({ icon: 'success', title: '¡Registro exitoso!', text: 'Ya puedes iniciar sesión.', confirmButtonColor: '#0ea5e9' })
            navigate("/Iniciar")
        } catch (error) {
            const msg = error.errors?.length
                ? error.errors.map(e => e.msg).join('\n')
                : (error.message || 'Error al registrar. Intenta de nuevo.')
            Swal.fire({ icon: 'error', title: 'Error al registrar', text: msg, confirmButtonColor: '#0ea5e9' })
        } finally {
            setCargando(false)
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
                                <input type="text" value={NombreUsuario} onChange={e => setNombreUsuario(e.target.value)} placeholder="usuario123" />
                            </div>
                        </div>
                        <div className='InputGroup'>
                            <label>Nombre completo</label>
                            <div className='InputWithIcon'>
                                <i className="fa-regular fa-user icon"></i>
                                <input type="text" value={Nombre} onChange={e => setNombre(e.target.value)} placeholder="Ej. Juan Pérez" />
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
                                <input type="email" value={Correo} onChange={e => setCorreo(e.target.value)} placeholder="nombre@ejemplo.com" />
                            </div>
                        </div>
                        <div className='InputGroup'>
                            <label>Teléfono</label>
                            <div className='InputWithIcon'>
                                <i className="fa-solid fa-phone icon"></i>
                                <input type="text" value={Telefono} onChange={e => setTelefono(e.target.value)} placeholder="+506 8888-8888" />
                            </div>
                        </div>
                    </div>

                    {/* Ubicación */}
                    <h3 className='SectionTitle'>UBICACIÓN</h3>
                    <div className='InputGrid3'>
                        <div className='InputGroup'>
                            <label>Provincia</label>
                            <div className='SelectWrapper'>
                                <select
                                    value={provinciaId}
                                    onChange={e => {
                                        const opt = e.target.options[e.target.selectedIndex]
                                        handleProvincia(e.target.value, opt.text)
                                    }}
                                >
                                    <option value="">Provincia</option>
                                    {provincias.map(p => (
                                        <option key={p.id} value={p.id}>{p.nombre}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className='InputGroup'>
                            <label>Cantón</label>
                            <div className='SelectWrapper'>
                                <select
                                    value={cantonId}
                                    disabled={!provinciaId}
                                    onChange={e => {
                                        const opt = e.target.options[e.target.selectedIndex]
                                        handleCanton(e.target.value, opt.text)
                                    }}
                                >
                                    <option value="">Cantón</option>
                                    {cantones.map(c => (
                                        <option key={c.id} value={c.id}>{c.nombre}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className='InputGroup'>
                            <label>Distrito</label>
                            <div className='SelectWrapper'>
                                <select
                                    value={distritoNombre}
                                    disabled={!cantonId}
                                    onChange={e => setDistritoNombre(e.target.value)}
                                >
                                    <option value="">Distrito</option>
                                    {distritos.map(d => (
                                        <option key={d.id} value={d.nombre}>{d.nombre}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Configuración de Cuenta */}
                    <h3 className='SectionTitle'>CONFIGURACIÓN DE CUENTA</h3>
                    <div className='InputRow'>
                        <div className='InputGroup'>
                            <label>Tipo de cuenta</label>
                            <div className='ToggleGroup'>
                                <button className={`ToggleBtn ${TipoCuenta === 'personal' ? 'active' : ''}`} onClick={() => setTipoCuenta('personal')}>
                                    Personal
                                </button>
                                <button className={`ToggleBtn ${TipoCuenta === 'empresa' ? 'active' : ''}`} onClick={() => setTipoCuenta('empresa')}>
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
                                    onChange={e => setContraseña(e.target.value)}
                                    placeholder="6+ caracteres"
                                />
                                <i
                                    className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'} toggle-pass`}
                                    onClick={() => setShowPassword(!showPassword)}
                                ></i>
                            </div>
                        </div>
                    </div>

                    <div className='ButtonContainer'>
                        <button className='BotonCrear' onClick={RegistroUsuarios} disabled={cargando}>
                            {cargando ? 'Creando cuenta...' : 'Crear Cuenta'}
                        </button>
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
