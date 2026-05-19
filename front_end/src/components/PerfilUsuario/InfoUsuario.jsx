import React, { useState, useEffect } from "react";
import "../../styles/EstilosPerfilUsuario/InfoUsuarios.css";
import UploadImage from "../PlantillaTalentos/SubirImagen";
import Fetch from "../../services/Fetch";
import { useNavigate } from "react-router-dom";

const API_UBICACIONES = 'https://ubicaciones.paginasweb.cr'

const ROL_INFO = {
    1: { label: "Administrador",   color: "#7c3aed", bg: "#ede9fe" },
    2: { label: "Miembro Personal", color: "#0ea5e9", bg: "#e0f2fe" },
    3: { label: "Cuenta Empresa",   color: "#10b981", bg: "#d1fae5" },
}

function InfoUsuario({ usuario, isOwner = false, onUpdate }) {
    const [editando, setEditando]         = useState(false)
    const [siguiendo, setSiguiendo]       = useState(false)
    const [cargandoSeguir, setCargandoSeguir] = useState(false)
    const [numSeguidores, setNumSeguidores] = useState(0)
    const [numSiguiendo, setNumSiguiendo]   = useState(0)
    const navigate = useNavigate()

    const [form, setForm] = useState({
        Nombre: "", Correo: "", Telefono: "",
        Provincias: "", Canton: "", Distrito: "", img: "", descripcion: ""
    })

    // Ubicaciones
    const [provincias, setProvincias] = useState([])
    const [cantones,   setCantones]   = useState([])
    const [distritos,  setDistritos]  = useState([])
    const [provinciaId, setProvinciaId] = useState("")
    const [cantonId,    setCantonId]    = useState("")

    // Cargar contadores de seguidores/siguiendo y estado de seguimiento
    useEffect(() => {
        if (!usuario?.id) return
        const cargarContadores = async () => {
            try {
                const [resSeguidores, resSiguiendo] = await Promise.all([
                    Fetch.getData(`seguidos/seguidores/${usuario.id}`),
                    Fetch.getData(`seguidos/siguiendo/${usuario.id}`),
                ])
                setNumSeguidores((resSeguidores || []).length)
                setNumSiguiendo((resSiguiendo || []).length)
            } catch { /* silencioso */ }
        }
        cargarContadores()

        if (!isOwner) {
            const token = localStorage.getItem("token")
            if (!token) return
            Fetch.getData(`seguidos/check/${usuario.id}`)
                .then(data => setSiguiendo(data?.siguiendo ?? false))
                .catch(() => {})
        }
    }, [usuario?.id, isOwner])

    useEffect(() => {
        if (!usuario) return
        setForm({
            Nombre:      usuario.Nombre      || "",
            Correo:      usuario.Correo      || "",
            Telefono:    usuario.Telefono    || "",
            Provincias:  usuario.Provincias  || "",
            Canton:      usuario.Canton      || "",
            Distrito:    usuario.Distrito    || "",
            img:         usuario.img         || "",
            descripcion: usuario.descripcion || "",
        })
    }, [usuario?.id])

    // Cargar provincias al entrar en modo edición
    useEffect(() => {
        if (!editando) return
        fetch(`${API_UBICACIONES}/provincias.json`)
            .then(r => r.json())
            .then(data => {
                const lista = Object.entries(data).map(([id, nombre]) => ({ id, nombre }))
                setProvincias(lista)
                const match = lista.find(p => p.nombre === form.Provincias)
                if (match) setProvinciaId(match.id)
            })
            .catch(console.error)
    }, [editando])

    // Cargar cantones cuando cambia provinciaId
    useEffect(() => {
        if (!provinciaId) { setCantones([]); setCantonId(""); return }
        fetch(`${API_UBICACIONES}/provincia/${provinciaId}/cantones.json`)
            .then(r => r.json())
            .then(data => {
                const lista = Object.entries(data).map(([id, nombre]) => ({ id, nombre }))
                setCantones(lista)
                const match = lista.find(c => c.nombre === form.Canton)
                if (match) setCantonId(match.id)
            })
            .catch(console.error)
    }, [provinciaId])

    // Cargar distritos cuando cambia cantonId
    useEffect(() => {
        if (!provinciaId || !cantonId) { setDistritos([]); return }
        fetch(`${API_UBICACIONES}/provincia/${provinciaId}/canton/${cantonId}/distritos.json`)
            .then(r => r.json())
            .then(data => {
                setDistritos(Object.entries(data).map(([id, nombre]) => ({ id, nombre })))
            })
            .catch(console.error)
    }, [cantonId])

    const handleProvincia = (id, nombre) => {
        setProvinciaId(id)
        setCantonId("")
        setCantones([])
        setDistritos([])
        setForm(p => ({ ...p, Provincias: nombre, Canton: "", Distrito: "" }))
    }

    const handleCanton = (id, nombre) => {
        setCantonId(id)
        setDistritos([])
        setForm(p => ({ ...p, Canton: nombre, Distrito: "" }))
    }

    const handleChange = (e) =>
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

    const handleGuardar = async () => {
        try {
            await Fetch.putData(`usuarios/${usuario.id}`, {
                nombre_completo: form.Nombre,
                correo:          form.Correo,
                telefono:        form.Telefono,
                provincia:       form.Provincias,
                canton:          form.Canton,
                distrito:        form.Distrito,
                img_perfil:      form.img,
                descripcion:     form.descripcion || null,
            })
            const stored = JSON.parse(localStorage.getItem("UsuarioActivo") || "{}")
            localStorage.setItem("UsuarioActivo", JSON.stringify({
                ...stored,
                Nombre: form.Nombre, Correo: form.Correo,
                Telefono: form.Telefono, Provincias: form.Provincias,
                Canton: form.Canton, Distrito: form.Distrito,
                img: form.img, descripcion: form.descripcion,
            }))
            setEditando(false)
            if (onUpdate) onUpdate()
        } catch (error) {
            console.error("Error actualizando:", error)
            alert("Error al guardar cambios")
        }
    }

    const handleCancelar = () => {
        setForm({
            Nombre:      usuario.Nombre      || "",
            Correo:      usuario.Correo      || "",
            Telefono:    usuario.Telefono    || "",
            Provincias:  usuario.Provincias  || "",
            Canton:      usuario.Canton      || "",
            Distrito:    usuario.Distrito    || "",
            img:         usuario.img         || "",
            descripcion: usuario.descripcion || "",
        })
        setProvinciaId("")
        setCantonId("")
        setCantones([])
        setDistritos([])
        setEditando(false)
    }

    const handleSeguir = async () => {
        const token = localStorage.getItem("token")
        if (!token) { navigate("/iniciar-sesion"); return }
        setCargandoSeguir(true)
        try {
            if (siguiendo) {
                await Fetch.deleteData(`seguidos/${usuario.id}`)
                setSiguiendo(false)
                setNumSeguidores(n => Math.max(0, n - 1))
            } else {
                await Fetch.postData("seguidos", { id_seguido: usuario.id })
                setSiguiendo(true)
                setNumSeguidores(n => n + 1)
            }
        } catch (err) {
            console.error("Error al seguir/dejar de seguir:", err)
        } finally {
            setCargandoSeguir(false)
        }
    }

    const handleLogout = () => {
        localStorage.removeItem("UsuarioActivo")
        navigate("/")
        window.location.reload()
    }

    if (!usuario) return <p className="perfil-cargando">Cargando perfil...</p>

    const ubicacion = [form.Provincias, form.Canton].filter(Boolean).join(", ")
    const rolInfo   = ROL_INFO[usuario.id_rol] || ROL_INFO[2]
    const esAdmin   = usuario.id_rol === 1

    return (
        <div className="perfil-container">

            {/* ── Foto ── */}
            <div className="perfil-img">
                {form.img
                    ? <img src={form.img} alt={form.Nombre} />
                    : <div className="perfil-avatar-placeholder">
                        <i className="fa-solid fa-user" />
                      </div>
                }
                {isOwner && editando && (
                    <div className="perfil-img-acciones">
                        <UploadImage setImageUrl={(url) => setForm(p => ({ ...p, img: url }))} />
                        {form.img && (
                            <button
                                className="perfil-img-eliminar"
                                onClick={() => setForm(p => ({ ...p, img: "" }))}
                                title="Eliminar foto"
                                type="button"
                            >
                                <i className="fa-solid fa-trash" /> Quitar foto
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* ── Info ── */}
            <div className="perfil-info">

                {/* Nombre + badge rol */}
                <div className="perfil-nombre-row">
                    {editando
                        ? <input className="perfil-input-edit perfil-input-nombre" name="Nombre" value={form.Nombre} onChange={handleChange} />
                        : <h1>{form.Nombre}</h1>
                    }
                    <span className="perfil-rol-badge" style={{ color: rolInfo.color, background: rolInfo.bg }}>
                        {rolInfo.label}
                    </span>
                </div>

                {/* Ubicación */}
                {editando ? (
                    <div className="perfil-inputs-ubicacion">
                        <select
                            className="perfil-select-edit"
                            value={provinciaId}
                            onChange={e => {
                                const opt = e.target.options[e.target.selectedIndex]
                                handleProvincia(e.target.value, opt.text)
                            }}
                        >
                            <option value="">Provincia</option>
                            {provincias.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                        </select>

                        <select
                            className="perfil-select-edit"
                            value={cantonId}
                            disabled={!provinciaId}
                            onChange={e => {
                                const opt = e.target.options[e.target.selectedIndex]
                                handleCanton(e.target.value, opt.text)
                            }}
                        >
                            <option value="">Cantón</option>
                            {cantones.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                        </select>

                        <select
                            className="perfil-select-edit"
                            value={form.Distrito}
                            disabled={!cantonId}
                            onChange={e => setForm(p => ({ ...p, Distrito: e.target.value }))}
                        >
                            <option value="">Distrito</option>
                            {distritos.map(d => <option key={d.id} value={d.nombre}>{d.nombre}</option>)}
                        </select>
                    </div>
                ) : ubicacion ? (
                    <div className="perfil-ubicacion">
                        <i className="fa-solid fa-location-dot" />
                        <span>{ubicacion}</span>
                    </div>
                ) : null}

                {/* Descripción del perfil */}
                {editando ? (
                    <textarea
                        className="perfil-descripcion-edit"
                        name="descripcion"
                        value={form.descripcion}
                        onChange={handleChange}
                        placeholder="Escribe una descripción sobre ti..."
                        rows={3}
                        maxLength={400}
                    />
                ) : form.descripcion ? (
                    <p className="perfil-descripcion">{form.descripcion}</p>
                ) : null}

                {/* Contadores seguidores / siguiendo */}
                <div className="perfil-stats">
                    <span className="perfil-stat">
                        <strong>{numSeguidores}</strong> seguidores
                    </span>
                    <span className="perfil-stat-sep">·</span>
                    <span className="perfil-stat">
                        <strong>{numSiguiendo}</strong> siguiendo
                    </span>
                </div>

                {/* Contacto */}
                <div className="perfil-contacto-basic">
                    {editando ? (
                        <div className="perfil-inputs-contacto">
                            <input className="perfil-input-edit" name="Correo"   value={form.Correo}   onChange={handleChange} placeholder="Correo" type="email" />
                            <input className="perfil-input-edit" name="Telefono" value={form.Telefono} onChange={handleChange} placeholder="Teléfono" />
                        </div>
                    ) : (
                        <>
                            {form.Correo   && <p><i className="fa-regular fa-envelope" /> {form.Correo}</p>}
                            {form.Telefono && <p><i className="fa-solid fa-phone" /> {form.Telefono}</p>}
                        </>
                    )}
                </div>

                {/* ── Botones ── */}
                <div className="perfil-botones">
                    {isOwner ? (
                        editando ? (
                            <>
                                <button className="btn-perfil btn-perfil--primary" onClick={handleGuardar}>
                                    <i className="fa-solid fa-floppy-disk" /> Guardar
                                </button>
                                <button className="btn-perfil btn-perfil--secondary" onClick={handleCancelar}>
                                    Cancelar
                                </button>
                            </>
                        ) : (
                            <>
                                <button className="btn-perfil btn-perfil--primary" onClick={() => setEditando(true)}>
                                    <i className="fa-solid fa-pen" /> Editar perfil
                                </button>
                                {esAdmin && (
                                    <button className="btn-perfil btn-perfil--admin" onClick={() => navigate("/admin")}>
                                        <i className="fa-solid fa-gauge" /> Panel Krea
                                    </button>
                                )}
                                <button className="btn-perfil btn-perfil--danger" onClick={handleLogout}>
                                    Cerrar sesión
                                </button>
                            </>
                        )
                    ) : (
                        <>
                            <a className="btn-perfil btn-perfil--primary" href={`mailto:${form.Correo}`}>
                                <i className="fa-solid fa-envelope" /> Contactar
                            </a>
                            <button
                                className={`btn-perfil ${siguiendo ? 'btn-perfil--siguiendo' : 'btn-perfil--secondary'}`}
                                onClick={handleSeguir}
                                disabled={cargandoSeguir}
                            >
                                <i className={`fa-${siguiendo ? 'solid' : 'regular'} fa-star`} />
                                {cargandoSeguir ? '...' : siguiendo ? 'Siguiendo' : 'Seguir'}
                            </button>
                        </>
                    )}
                </div>

            </div>
        </div>
    )
}

export default InfoUsuario
