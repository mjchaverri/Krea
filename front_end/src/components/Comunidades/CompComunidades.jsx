import React, { useState, useEffect, useRef, useMemo } from 'react'
import '../../styles/Principales/Comunidades.css'
import Fetch from '../../services/Fetch'
import ModalAdminComunidad from './ModalAdminComunidad'

// Normaliza una comunidad del backend al formato que usa el frontend
function normalizarComunidad(c) {
    return {
        id:          c.id_comunidad,
        nombre:      c.nombre,
        descripcion: c.descripcion,
        icono:       c.icono || '🌐',
        color:       c.Color || '#0ea5e9',
        colorClaro:  c.ColorClaro || '#0ea5e922',
        banner:      c.banner || '',
        categoria:   c.Categoria?.nombre || '',
        creadoPor:   c.id_usuario || null,
    }
}

// Normaliza un mensaje del backend al formato del frontend
function normalizarMensaje(m) {
    return {
        id:          m.id_chat_comu,
        comunidadId: m.id_comunidad,
        usuarioId:   null,
        usuarioNombre: m.usuario_nombre,
        texto:       m.texto,
        fecha:       m.Fecha,
        esConvocatoria: false,
    }
}

const CATEGORIAS = [
    'Todas',
    'Diseño y creatividad visual',
    'UX/UI',
    'Desarrollo y tecnología creativa',
    'Multimedia y animación',
    'Fotografía y arte visual',
    'Publicidad y marketing',
    'Arquitectura',
    'Diseño de interiores',
    'Diseño industrial',
    'Educación',
    'Escritura y contenido',
    'Manualidades y arte hecho a mano',
    'Moda y costura',
    'Música y producción sonora',
    'Ilustración',
    'Modelado 3D',
]

/* ─── Avatar con inicial ─── */
function Avatar({ nombre, color, size = 36 }) {
    const bg = color || '#0ea5e9'
    return (
        <div style={{
            width: size, height: size, borderRadius: '50%',
            background: bg, color: '#fff', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: size * 0.38, flexShrink: 0,
            fontFamily: 'Inter, sans-serif'
        }}>
            {nombre?.[0]?.toUpperCase() || '?'}
        </div>
    )
}

/* ─── Tarjeta de convocatoria ─── */
function TarjetaConvocatoria({ item, onParticipar }) {
    return (
        <div className="ch-convo-card">
            <div className="ch-convo-card__source">
                <div className="ch-convo-card__source-avatar">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
                </div>
                <span className="ch-convo-card__source-name">{item.usuarioNombre || 'Comunidad'}</span>
                <span className="ch-convo-card__badge">CONVOCATORIA</span>
            </div>
            {item.banner && (
                <img className="ch-convo-card__img" src={item.banner} alt={item.convocatoriaNombre} />
            )}
            <div className="ch-convo-card__body">
                <h4 className="ch-convo-card__titulo">{item.convocatoriaNombre || 'Nueva convocatoria'}</h4>
                <p className="ch-convo-card__desc">{item.texto}</p>
            </div>
            <div className="ch-convo-card__footer">
                <button className="ch-convo-card__btn" onClick={() => onParticipar(item)}>
                    Participar
                </button>
            </div>
        </div>
    )
}

/* ─── Modal crear convocatoria ─── */
function ModalConvocatoria({ comunidad, usuario, onClose, onCreada }) {
    const [form, setForm] = useState({ nombre: '', descripcion: '' })
    const [guardando, setGuardando] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!form.nombre.trim()) return
        setGuardando(true)
        try {
            const msg = await Fetch.postData('chat-comunidad', {
                usuario_nombre: usuario?.Nombre || usuario?.nombre_usuario || 'Sistema',
                texto:          `📢 ${form.nombre.trim()}\n${form.descripcion.trim()}`,
                id_comunidad:   comunidad.id,
            })
            onCreada(normalizarMensaje(msg))
            onClose()
        } catch (err) {
            console.error(err)
        } finally {
            setGuardando(false)
        }
    }

    return (
        <div className="ch-modal-overlay" onClick={onClose}>
            <div className="ch-modal" onClick={e => e.stopPropagation()}>
                <div className="ch-modal__header">
                    <h3>Nueva convocatoria</h3>
                    <button className="ch-modal__close" onClick={onClose}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                </div>
                <form className="ch-modal__form" onSubmit={handleSubmit}>
                    <div className="ch-modal__campo">
                        <label className="ch-modal__label">Título</label>
                        <input
                            className="ch-modal__input"
                            type="text"
                            placeholder="Ej: Búsqueda de diseñador UX"
                            value={form.nombre}
                            onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))}
                            maxLength={80}
                            required
                        />
                    </div>
                    <div className="ch-modal__campo">
                        <label className="ch-modal__label">Descripción</label>
                        <textarea
                            className="ch-modal__textarea"
                            placeholder="Describe los requisitos o detalles..."
                            value={form.descripcion}
                            onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))}
                            rows={4}
                            maxLength={400}
                        />
                    </div>
                    <button
                        type="submit"
                        className="ch-modal__btn"
                        disabled={guardando || !form.nombre.trim()}
                    >
                        {guardando ? 'Publicando...' : 'Publicar convocatoria'}
                    </button>
                </form>
            </div>
        </div>
    )
}

/* ─── Chat principal ─── */
function ChatComunidad({ comunidad, usuario, onVolver }) {
    const [mensajes, setMensajes] = useState([])
    const [texto, setTexto] = useState('')
    const [enviando, setEnviando] = useState(false)
    const [modalConvo, setModalConvo] = useState(false)
    const mensajesRef = useRef(null)
    const inputRef = useRef(null)

    useEffect(() => {
        const cargar = async () => {
            try {
                const data = await Fetch.getData(`chat-comunidad/${comunidad.id}`)
                setMensajes((data || []).map(normalizarMensaje))
            } catch (err) {
                console.error('Error cargando mensajes:', err)
            }
        }
        cargar()
        const interval = setInterval(cargar, 5000)
        return () => clearInterval(interval)
    }, [comunidad.id])


    const handleEnviar = async (e) => {
        e.preventDefault()
        const textoLimpio = texto.trim()
        if (!textoLimpio || enviando) return
        setEnviando(true)
        try {
            const creado = await Fetch.postData('chat-comunidad', {
                usuario_nombre: usuario?.Nombre || usuario?.nombre_usuario || 'Anónimo',
                texto:          textoLimpio,
                id_comunidad:   comunidad.id,
            })
            setMensajes(prev => [...prev, normalizarMensaje(creado)])
            setTexto('')
            inputRef.current?.focus()
        } catch (err) {
            console.error('Error enviando mensaje:', err)
        } finally {
            setEnviando(false)
        }
    }

    const handleParticipar = (msg) => {
        alert(`¡Te inscribiste en: ${msg.convocatoriaNombre || 'esta convocatoria'}!`)
    }

    const formatHora = (iso) =>
        new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

    const formatFecha = (iso) => {
        const d = new Date(iso)
        const hoy = new Date()
        const ayer = new Date(); ayer.setDate(ayer.getDate() - 1)
        if (d.toDateString() === hoy.toDateString()) return 'Hoy'
        if (d.toDateString() === ayer.toDateString()) return 'Ayer'
        return d.toLocaleDateString('es-CR', { day: 'numeric', month: 'long' })
    }

    const items = useMemo(() => {
        const result = []
        let fechaActual = ''
        mensajes.forEach(msg => {
            const fecha = formatFecha(msg.fecha)
            if (fecha !== fechaActual) { result.push({ tipo: 'sep', fecha }); fechaActual = fecha }
            result.push({ tipo: 'msg', ...msg })
        })
        return result
    }, [mensajes])

    const colores = ['#0ea5e9','#8b5cf6','#f43f5e','#10b981','#f59e0b','#6366f1','#ec4899','#14b8a6']
    const colorUsuario = (id) => colores[(id || 0) % colores.length]

    return (
        <>
            <div className="ch">
                {/* Header */}
                <div className="ch__header">
                    <button className="ch__volver" onClick={onVolver} title="Volver">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                    </button>
                    <div className="ch__header-icon" style={{ background: comunidad.color + '22', color: comunidad.color }}>
                        {comunidad.icono}
                    </div>
                    <div className="ch__header-info">
                        <span className="ch__header-nombre"># {comunidad.nombre}</span>
                        <span className="ch__header-sub">{comunidad.categoria}</span>
                    </div>
                    <div className="ch__header-actions">
                        <span className="ch__online-dot"></span>
                        <span className="ch__online-txt">En vivo</span>
                    </div>
                </div>

                {/* Mensajes */}
                <div className="ch__mensajes" ref={mensajesRef} id="chat-mensajes-area">
                    {items.length === 0 && (
                        <div className="ch__vacio">
                            <span style={{ fontSize: '2.5rem' }}>{comunidad.icono}</span>
                            <h3>¡Sé el primero en hablar!</h3>
                            <p>Inicio de la conversación en <strong>{comunidad.nombre}</strong>.</p>
                        </div>
                    )}
                    {items.map((item, idx) => {
                        if (item.tipo === 'sep') {
                            return (
                                <div key={`sep-${idx}`} className="ch__sep">
                                    <span>{item.fecha}</span>
                                </div>
                            )
                        }
                        if (item.esConvocatoria) {
                            return (
                                <div key={item.id || idx} className="ch__msg-row">
                                    <TarjetaConvocatoria item={item} onParticipar={handleParticipar} />
                                </div>
                            )
                        }
                        const propio = item.usuarioId === usuario?.id
                        return (
                            <div key={item.id || idx} className={`ch__msg-row ${propio ? 'ch__msg-row--propio' : ''}`}>
                                {!propio && <Avatar nombre={item.usuarioNombre} color={colorUsuario(item.usuarioId)} />}
                                <div className="ch__msg-body">
                                    {!propio && (
                                        <div className="ch__msg-meta">
                                            <span className="ch__msg-autor">{item.usuarioNombre}</span>
                                            <span className="ch__msg-hora">{formatHora(item.fecha)}</span>
                                        </div>
                                    )}
                                    <div className={`ch__burbuja ${propio ? 'ch__burbuja--propia' : 'ch__burbuja--ajena'}`}
                                        style={propio ? { background: comunidad.color } : {}}>
                                        {item.texto}
                                    </div>
                                    {propio && <span className="ch__msg-hora ch__msg-hora--propia">{formatHora(item.fecha)}</span>}
                                </div>
                                {propio && <Avatar nombre={usuario.Nombre} color={comunidad.color} />}
                            </div>
                        )
                    })}
                </div>

                {/* Input */}
                <form className="ch__input-area" onSubmit={handleEnviar} id="chat-form">
                    {usuario && (
                        <button
                            type="button"
                            className="ch__btn-plus"
                            onClick={() => setModalConvo(true)}
                            title="Crear convocatoria"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                        </button>
                    )}
                    <input
                        ref={inputRef}
                        id="chat-input-texto"
                        type="text"
                        className="ch__input"
                        placeholder={`Escribe un mensaje en #${comunidad.nombre}...`}
                        value={texto}
                        onChange={e => setTexto(e.target.value)}
                        maxLength={500}
                        autoComplete="off"
                    />
                    <button
                        type="submit"
                        id="chat-btn-enviar"
                        className="ch__btn-enviar"
                        style={{ background: comunidad.color }}
                        disabled={!texto.trim() || enviando}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                    </button>
                </form>
            </div>

            {modalConvo && (
                <ModalConvocatoria
                    comunidad={comunidad}
                    usuario={usuario}
                    onClose={() => setModalConvo(false)}
                    onCreada={(msg) => setMensajes(prev => [...prev, msg])}
                />
            )}
        </>
    )
}

/* ─── Componente principal ─── */
function CompComunidades({
    comunidadActivaExterna = null,
    onComunidadActivaChange = null,
    onMiembrosChange = null,
    categoriaExterna = null,
    onCategoriaChange = null,
}) {
    const [comunidades, setComunidades] = useState([])
    const [miembros, setMiembros] = useState([])
    const [usuario, setUsuario] = useState(null)
    const [cargando, setCargando] = useState(true)
    const [categoriaLocal, setCategoriaLocal] = useState('Todas')
    const categoriaActiva = categoriaExterna ?? categoriaLocal
    const setCategoriaActiva = (cat) => {
        if (onCategoriaChange) onCategoriaChange(cat)
        else setCategoriaLocal(cat)
    }
    const [busqueda, setBusqueda] = useState('')
    const [toast, setToast] = useState(null)
    const [modalCom, setModalCom] = useState(null)
    const [modalAdmin, setModalAdmin] = useState(null)
    const [comunidadChatLocal, setComunidadChatLocal] = useState(null)
    const filtersRef = useRef(null)
    const scrollFilters = (dir) =>
        filtersRef.current?.scrollBy({ left: dir * 240, behavior: 'smooth' })

    const comunidadChat = onComunidadActivaChange ? comunidadActivaExterna : comunidadChatLocal
    const setComunidadChat = (com) => {
        if (onComunidadActivaChange) onComunidadActivaChange(com)
        else setComunidadChatLocal(com)
    }

    useEffect(() => {
        const usuarioGuardado = JSON.parse(localStorage.getItem('UsuarioActivo') || 'null')
        setUsuario(usuarioGuardado)

        const cargar = async () => {
            try {
                const [dataCom, dataMiembros] = await Promise.all([
                    Fetch.getData('comunidades?limit=100'),
                    usuarioGuardado
                        ? Fetch.getData(`miembros/usuario/${usuarioGuardado.id}`)
                        : Promise.resolve([]),
                ])
                setComunidades((dataCom || []).map(normalizarComunidad))
                const miembrosNorm = (dataMiembros || []).map(m => ({
                    id:          m.id_miembro,
                    comunidadId: m.id_comunidad,
                    usuarioId:   m.id_usuario,
                    usuarioNombre: usuarioGuardado?.Nombre || usuarioGuardado?.nombre_usuario || '',
                }))
                actualizarMiembros(miembrosNorm)
            } catch (err) {
                console.error('Error cargando comunidades:', err)
            } finally {
                setCargando(false)
            }
        }
        cargar()
    }, [])

    const comunidadesFiltradas = useMemo(() => {
        return comunidades.filter(c => {
            const coincideCategoria = categoriaActiva === 'Todas' || c.categoria === categoriaActiva
            const coincideBusqueda =
                c.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                c.descripcion.toLowerCase().includes(busqueda.toLowerCase())
            return coincideCategoria && coincideBusqueda
        })
    }, [comunidades, categoriaActiva, busqueda])

    const esMiembro = (comunidadId) => {
        if (!usuario) return false
        return miembros.some(m => m.comunidadId === comunidadId && m.usuarioId === usuario.id)
    }

    const contarMiembros = (comunidadId) =>
        miembros.filter(m => m.comunidadId === comunidadId).length

    const mostrarToast = (mensaje, tipo = 'exito') => {
        setToast({ mensaje, tipo })
        setTimeout(() => setToast(null), 3200)
    }

    const actualizarMiembros = (nuevos) => {
        setMiembros(nuevos)
        if (onMiembrosChange) onMiembrosChange(nuevos)
    }

    const handleUnirse = async (comunidad) => {
        if (!usuario) {
            mostrarToast('Debes iniciar sesión para unirte a una comunidad.', 'error')
            return
        }
        if (esMiembro(comunidad.id)) {
            try {
                await Fetch.deleteData(`miembros/${comunidad.id}/${usuario.id}`)
            } catch (err) {
                console.error('Error al salir:', err)
            }
            actualizarMiembros(miembros.filter(m => !(m.comunidadId === comunidad.id && m.usuarioId === usuario.id)))
            if (comunidadChat?.id === comunidad.id) setComunidadChat(null)
            mostrarToast(`Saliste de "${comunidad.nombre}".`, 'info')
        } else {
            try {
                const nuevo = await Fetch.postData('miembros', {
                    id_comunidad: comunidad.id,
                    id_usuario:   usuario.id,
                })
                const nuevaEntrada = {
                    id:          nuevo?.id_miembro || `${comunidad.id}-${usuario.id}`,
                    comunidadId: comunidad.id,
                    usuarioId:   usuario.id,
                    usuarioNombre: usuario.Nombre || usuario.nombre_usuario,
                }
                actualizarMiembros([...miembros, nuevaEntrada])
                mostrarToast(`¡Te uniste a "${comunidad.nombre}"!`, 'exito')
            } catch (err) {
                console.error('Error al unirse:', err)
                mostrarToast(err.message || 'Error al unirse a la comunidad.', 'error')
            }
        }
        if (modalCom) setModalCom(null)
    }

    const abrirChat = (com) => {
        setComunidadChat(com)
        setModalCom(null)
    }

    if (cargando) {
        return (
            <div className="com-loading">
                <div className="com-spinner"></div>
                <p>Cargando comunidades...</p>
            </div>
        )
    }

    return (
        <div className="com-app">
            {toast && (
                <div className={`com-toast com-toast--${toast.tipo}`}>
                    <span>
                        {toast.tipo === 'exito'
                            ? <i className="fa-solid fa-circle-check" />
                            : toast.tipo === 'info'
                                ? <i className="fa-solid fa-circle-info" />
                                : <i className="fa-solid fa-triangle-exclamation" />
                        }
                    </span>
                    {toast.mensaje}
                </div>
            )}

            {comunidadChat ? (
                <ChatComunidad
                    comunidad={comunidadChat}
                    usuario={usuario}
                    onVolver={() => setComunidadChat(null)}
                />
            ) : (
                <div className="com-wrapper">
                    {/* Hero */}
                    <section className="com-hero">
                        <div className="com-hero__bg"></div>
                        <div className="com-hero__content">
                            <span className="com-hero__badge">✦ Comunidades Krea</span>
                            <h1 className="com-hero__titulo">
                                Encuentra tu<br /><span>tribu creativa.</span>
                            </h1>
                            <p className="com-hero__subtitulo">
                                Únete a comunidades de talento, comparte tu obra, inspírate y
                                crece rodeado de personas que comparten tu pasión.
                            </p>
                            <div className="com-hero__search">
                                <span className="com-hero__search-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                                </span>
                                <input
                                    type="text"
                                    id="busqueda-comunidades"
                                    placeholder="Busca una comunidad..."
                                    value={busqueda}
                                    onChange={e => setBusqueda(e.target.value)}
                                    className="com-hero__input"
                                />
                            </div>
                        </div>
                        <div className="com-hero__shapes">
                            <div className="com-shape com-shape--1"></div>
                            <div className="com-shape com-shape--2"></div>
                            <div className="com-shape com-shape--3"></div>
                        </div>
                    </section>

                    {/* Filtros */}
                    <section className="com-filtros-section">
                        <div className="pp-filters-carousel">
                            <button className="pp-filters-arrow" onClick={() => scrollFilters(-1)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                            </button>
                            <div className="pp-filters" ref={filtersRef}>
                                {CATEGORIAS.map(cat => (
                                    <button
                                        key={cat}
                                        id={`filtro-${cat.toLowerCase()}`}
                                        className={`pp-filter-btn ${categoriaActiva === cat ? 'active' : ''}`}
                                        onClick={() => setCategoriaActiva(cat)}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                            <button className="pp-filters-arrow" onClick={() => scrollFilters(1)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                            </button>
                        </div>
                    </section>

                    {/* Stats */}
                    <section className="com-stats">
                        <div className="com-stat">
                            <span className="com-stat__numero">{comunidades.length}</span>
                            <span className="com-stat__label">Comunidades</span>
                        </div>
                        <div className="com-stat">
                            <span className="com-stat__numero">{miembros.length}</span>
                            <span className="com-stat__label">Miembros activos</span>
                        </div>
                        <div className="com-stat">
                            <span className="com-stat__numero">{CATEGORIAS.length - 1}</span>
                            <span className="com-stat__label">Categorías</span>
                        </div>
                    </section>

                    {/* Grid */}
                    <section className="com-grid-section">
                        {comunidadesFiltradas.length === 0 ? (
                            <div className="com-empty">
                                <span className="com-empty__icon"><i className="fa-solid fa-magnifying-glass" /></span>
                                <h3>No encontramos comunidades</h3>
                                <p>Intenta con otra búsqueda o categoría.</p>
                            </div>
                        ) : (
                            <div className="com-grid">
                                {comunidadesFiltradas.map(com => {
                                    const esUnido = esMiembro(com.id)
                                    const totalMiembros = contarMiembros(com.id)
                                    return (
                                        <article
                                            key={com.id}
                                            className={`com-card ${esUnido ? 'com-card--unido' : ''}`}
                                            id={`comunidad-${com.id}`}
                                        >
                                            <div
                                                className="com-card__banner"
                                                style={{ backgroundImage: `url(${com.banner})` }}
                                            >
                                                <div
                                                    className="com-card__banner-overlay"
                                                    style={{ background: `linear-gradient(135deg, ${com.color}cc, ${com.color}44)` }}
                                                ></div>
                                                <div className="com-card__icono">{com.icono}</div>
                                                {esUnido && (
                                                    <span className="com-card__badge-unido">✓ Unido</span>
                                                )}
                                            </div>

                                            <div className="com-card__body">
                                                <div className="com-card__meta">
                                                    <span
                                                        className="com-card__categoria"
                                                        style={{ background: com.colorClaro, color: com.color }}
                                                    >
                                                        {com.categoria}
                                                    </span>
                                                    <span className="com-card__miembros">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                                                        {totalMiembros} {totalMiembros === 1 ? 'miembro' : 'miembros'}
                                                    </span>
                                                </div>

                                                <h2 className="com-card__nombre">{com.nombre}</h2>
                                                <p className="com-card__descripcion">{com.descripcion}</p>

                                                <div className="com-card__acciones">
                                                    {/* Botón gestionar — solo para el creador (futuro: rol empresa) */}
                                                    {usuario && com.creadoPor === usuario.id && (
                                                        <button
                                                            id={`btn-gestionar-${com.id}`}
                                                            className="com-card__btn-gestionar"
                                                            onClick={() => setModalAdmin(com)}
                                                            title="Gestionar comunidad"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/></svg>
                                                            Gestionar
                                                        </button>
                                                    )}
                                                    {esUnido ? (
                                                        <>
                                                            <button
                                                                id={`btn-chat-${com.id}`}
                                                                className="com-card__btn-chat"
                                                                style={{ background: com.color }}
                                                                onClick={() => abrirChat(com)}
                                                            >
                                                                <i className="fa-regular fa-message" /> Ir al chat
                                                            </button>
                                                            <button
                                                                id={`btn-salir-${com.id}`}
                                                                className="com-card__btn-unirse com-card__btn-unirse--salir"
                                                                onClick={() => handleUnirse(com)}
                                                            >
                                                                Salir
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <button
                                                                className="com-card__btn-ver"
                                                                onClick={() => setModalCom(com)}
                                                                id={`btn-ver-${com.id}`}
                                                            >
                                                                Ver más
                                                            </button>
                                                            <button
                                                                id={`btn-unirse-${com.id}`}
                                                                className="com-card__btn-unirse"
                                                                style={{ background: com.color }}
                                                                onClick={() => handleUnirse(com)}
                                                            >
                                                                Unirse
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </article>
                                    )
                                })}
                            </div>
                        )}
                    </section>

                    {!usuario && (
                        <section className="com-cta">
                            <div className="com-cta__content">
                                <h2>¿Listo para encontrar tu comunidad?</h2>
                                <p>Inicia sesión o regístrate para unirte y chatear con otros talentos.</p>
                                <div className="com-cta__btns">
                                    <a href="/Iniciar" id="cta-iniciar" className="com-cta__btn-primary">Iniciar sesión</a>
                                    <a href="/Registro" id="cta-registro" className="com-cta__btn-secondary">Crear cuenta</a>
                                </div>
                            </div>
                        </section>
                    )}
                </div>
            )}

            {/* Modal gestión comunidad */}
            {modalAdmin && (
                <ModalAdminComunidad
                    comunidad={modalAdmin}
                    usuario={usuario}
                    miembros={miembros}
                    onClose={() => setModalAdmin(null)}
                    onComunidadActualizada={(actualizada) => {
                        setComunidades(prev => prev.map(c => c.id === actualizada.id ? actualizada : c))
                        setModalAdmin(actualizada)
                    }}
                    onMiembroExpulsado={(idMiembro) => {
                        const nuevos = miembros.filter(m => m.id !== idMiembro)
                        actualizarMiembros(nuevos)
                    }}
                    onConvocatoriaCreada={() => mostrarToast('¡Convocatoria publicada!', 'exito')}
                />
            )}

            {/* Modal detalle comunidad */}
            {modalCom && (
                <div className="com-modal-overlay" onClick={() => setModalCom(null)}>
                    <div className="com-modal" onClick={e => e.stopPropagation()}>
                        <div
                            className="com-modal__header"
                            style={{ backgroundImage: `url(${modalCom.banner})` }}
                        >
                            <div
                                className="com-modal__header-overlay"
                                style={{ background: `linear-gradient(135deg, ${modalCom.color}ee, ${modalCom.color}88)` }}
                            ></div>
                            <button className="com-modal__close" onClick={() => setModalCom(null)}>✕</button>
                            <div className="com-modal__header-content">
                                <div className="com-modal__icono-grande">{modalCom.icono}</div>
                                <div>
                                    <h2 className="com-modal__nombre">{modalCom.nombre}</h2>
                                    <span
                                        className="com-modal__categoria"
                                        style={{ background: modalCom.colorClaro, color: modalCom.color }}
                                    >
                                        {modalCom.categoria}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="com-modal__body">
                            <p className="com-modal__descripcion">{modalCom.descripcion}</p>

                            <div className="com-modal__stats">
                                <div className="com-modal__stat">
                                    <strong>{contarMiembros(modalCom.id)}</strong>
                                    <span>Miembros</span>
                                </div>
                                <div className="com-modal__stat">
                                    <strong>{modalCom.categoria}</strong>
                                    <span>Categoría</span>
                                </div>
                            </div>

                            <div className="com-modal__miembros-lista">
                                <h4>Miembros recientes</h4>
                                {miembros.filter(m => m.comunidadId === modalCom.id).length === 0 ? (
                                    <p className="com-modal__sin-miembros">Sé el primero en unirte.</p>
                                ) : (
                                    <ul>
                                        {miembros
                                            .filter(m => m.comunidadId === modalCom.id)
                                            .slice(0, 5)
                                            .map(m => (
                                                <li key={m.id} className="com-modal__miembro-item">
                                                    <div className="com-modal__avatar" style={{ background: modalCom.color }}>
                                                        {m.usuarioNombre?.[0]?.toUpperCase() || '?'}
                                                    </div>
                                                    <span>{m.usuarioNombre}</span>
                                                </li>
                                            ))}
                                    </ul>
                                )}
                            </div>

                            <button
                                id={`modal-btn-unirse-${modalCom.id}`}
                                className={`com-modal__btn-unirse ${esMiembro(modalCom.id) ? 'com-modal__btn-unirse--salir' : ''}`}
                                style={!esMiembro(modalCom.id) ? { background: modalCom.color } : {}}
                                onClick={() => handleUnirse(modalCom)}
                            >
                                {esMiembro(modalCom.id)
                                    ? <><i className="fa-solid fa-right-from-bracket" /> Salir de la comunidad</>
                                    : <><i className="fa-solid fa-right-to-bracket" /> Unirse a la comunidad</>
                                }
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default CompComunidades
