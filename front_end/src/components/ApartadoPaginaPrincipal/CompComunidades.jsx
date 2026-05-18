import React, { useState, useEffect, useRef, useMemo } from 'react'
import '../../styles/Principales/Comunidades.css'
import Fetch from '../../services/Fetch'

const CATEGORIAS = ['Todas', 'Arte', 'Música', 'Tecnología', 'Fotografía', 'Literatura', 'Diseño', 'Danza', 'Moda']

/* ─── Sub-componente: Chat de comunidad ─── */
function ChatComunidad({ comunidad, usuario, onVolver }) {
    const [mensajes, setMensajes] = useState([])
    const [texto, setTexto] = useState('')
    const [enviando, setEnviando] = useState(false)
    const bottomRef = useRef(null)
    const inputRef = useRef(null)

    // Cargar mensajes al entrar
    useEffect(() => {
        const cargar = async () => {
            const todos = await Fetch.getData('mensajes_comunidad')
            const delChat = (todos || []).filter(m => m.comunidadId === comunidad.id)
            setMensajes(delChat)
        }
        cargar()
        // Polling cada 5 segundos para simular tiempo real
        const interval = setInterval(cargar, 5000)
        return () => clearInterval(interval)
    }, [comunidad.id])

    // Scroll al fondo cuando hay nuevos mensajes
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [mensajes])

    const handleEnviar = async (e) => {
        e.preventDefault()
        const textoLimpio = texto.trim()
        if (!textoLimpio || enviando) return

        setEnviando(true)
        const nuevoMsg = {
            comunidadId: comunidad.id,
            usuarioId: usuario.id,
            usuarioNombre: usuario.Nombre,
            texto: textoLimpio,
            fecha: new Date().toISOString()
        }

        try {
            const creado = await Fetch.postData(nuevoMsg, 'mensajes_comunidad')
            setMensajes(prev => [...prev, creado])
            setTexto('')
            inputRef.current?.focus()
        } catch {
            /* silencioso */
        } finally {
            setEnviando(false)
        }
    }

    const formatHora = (iso) => {
        const d = new Date(iso)
        return d.toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit' })
    }

    const formatFecha = (iso) => {
        const d = new Date(iso)
        const hoy = new Date()
        const ayer = new Date(); ayer.setDate(ayer.getDate() - 1)
        if (d.toDateString() === hoy.toDateString()) return 'Hoy'
        if (d.toDateString() === ayer.toDateString()) return 'Ayer'
        return d.toLocaleDateString('es-CR', { day: 'numeric', month: 'long' })
    }

    // Agrupar mensajes por fecha para separadores
    const mensajesConSeparador = useMemo(() => {
        const result = []
        let fechaActual = ''
        mensajes.forEach(msg => {
            const fecha = formatFecha(msg.fecha)
            if (fecha !== fechaActual) {
                result.push({ tipo: 'separador', fecha })
                fechaActual = fecha
            }
            result.push({ tipo: 'mensaje', ...msg })
        })
        return result
    }, [mensajes])

    const esPropio = (msg) => msg.usuarioId === usuario.id
    
    const handleParticipar = async (msg) => {
        if (!usuario) {
            alert('Debes iniciar sesión para participar')
            return
        }
        try {
            const peticionParticipacion = {
                idConvocatoria: msg.convocatoriaId,
                usuarioNombre: usuario.Nombre,
                convocatoriaNombre: msg.convocatoriaNombre,
                respuesta: "Participar",
                fecha: new Date().toLocaleString()
            }
            await Fetch.postData(peticionParticipacion, 'respuestas_convocatorias')
            alert(`¡Te has inscrito a la convocatoria: ${msg.convocatoriaNombre}!`)
        } catch(e) {
            console.error(e)
            alert("Hubo un error al inscribirte.")
        }
    }

    return (
        <div className="chat-container">
            {/* Header del chat */}
            <div className="chat-header" style={{ borderBottom: `3px solid #0DB9F2` }}>
                <button
                    className="chat-header__volver"
                    onClick={onVolver}
                    title="Volver a comunidades"
                >
                    ←
                </button>
                <div
                    className="chat-header__icono"
                    style={{ background: comunidad.color }}
                >
                    {comunidad.icono}
                </div>
                <div className="chat-header__info">
                    <h2 className="chat-header__nombre">{comunidad.nombre}</h2>
                    <span
                        className="chat-header__cat"
                        style={{ color: comunidad.color }}
                    >
                        {comunidad.categoria}
                    </span>
                </div>
                <span className="chat-header__online">
                    🟢 Chat en vivo
                </span>
            </div>

            {/* Área de mensajes */}
            <div className="chat-mensajes" id="chat-mensajes-area">
                {mensajesConSeparador.length === 0 && (
                    <div className="chat-vacio">
                        <span className="chat-vacio__icono">{comunidad.icono}</span>
                        <h3>¡Sé el primero en hablar!</h3>
                        <p>Este es el inicio de la conversación en <strong>{comunidad.nombre}</strong>.</p>
                    </div>
                )}

                {mensajesConSeparador.map((item, idx) => {
                    if (item.tipo === 'separador') {
                        return (
                            <div key={`sep-${idx}`} className="chat-separador">
                                <span>{item.fecha}</span>
                            </div>
                        )
                    }

                    const propio = esPropio(item)
                    return (
                        <div
                            key={item.id || idx}
                            className={`chat-burbuja ${propio ? 'chat-burbuja--propia' : 'chat-burbuja--ajena'} ${item.esConvocatoria ? 'chat-burbuja--convocatoria' : ''}`}
                        >
                            {!propio && !item.esConvocatoria && (
                                <div
                                    className="chat-avatar"
                                    style={{ background: 'linear-gradient(135deg, #0DB9F2, #0EA5E9)' }}
                                    title={item.usuarioNombre}
                                >
                                    {item.usuarioNombre?.[0]?.toUpperCase() || '?'}
                                </div>
                            )}
                            
                            {!propio && item.esConvocatoria && (
                                <div className="chat-avatar chat-avatar--sistema" title="Sistema">
                                    📢
                                </div>
                            )}

                            <div className="chat-burbuja__contenido">
                                {!propio && (
                                    <span className="chat-burbuja__autor">{item.usuarioNombre}</span>
                                )}
                                
                                {item.esConvocatoria ? (
                                    <div className="chat-tarjeta-convocatoria">
                                        <div className="tarjeta-convo-header">
                                            <span className="tarjeta-convo-badge">NUEVA CONVOCATORIA</span>
                                        </div>
                                        <div className="tarjeta-convo-body">
                                            <p>{item.texto}</p>
                                        </div>
                                        <div className="tarjeta-convo-footer">
                                            <button 
                                                className="btn-participar-convo" 
                                                onClick={() => handleParticipar(item)}
                                                style={{ background: 'linear-gradient(135deg, #0DB9F2, #0EA5E9)' }}
                                            >
                                                ¡Participar!
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div
                                        className="chat-burbuja__texto"
                                        style={propio ? { background: 'linear-gradient(135deg, #0DB9F2, #0EA5E9)' } : {}}
                                    >
                                        {item.texto}
                                    </div>
                                )}
                                <span className="chat-burbuja__hora">
                                    {new Date(item.fecha).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>
                    )
                })}
                <div ref={bottomRef} />
            </div>

            {/* Input de mensaje */}
            <form className="chat-input-area" onSubmit={handleEnviar} id="chat-form">
                <input
                    ref={inputRef}
                    id="chat-input-texto"
                    type="text"
                    className="chat-input"
                    placeholder={`Escribe un mensaje en ${comunidad.nombre}...`}
                    value={texto}
                    onChange={e => setTexto(e.target.value)}
                    maxLength={500}
                    autoComplete="off"
                />
                <button
                    type="submit"
                    id="chat-btn-enviar"
                    className="chat-btn-enviar"
                    style={{ background: 'linear-gradient(135deg, #0DB9F2, #0EA5E9)' }}
                    disabled={!texto.trim() || enviando}
                >
                    {enviando ? '⏳' : '➤'}
                </button>
            </form>
        </div>
    )
}

/* ─── Componente principal ─── */
function CompComunidades({
    comunidadActivaExterna = null,
    onComunidadActivaChange = null,
    onMiembrosChange = null
}) {
    const [comunidades, setComunidades] = useState([])
    const [miembros, setMiembros] = useState([])
    const [usuario, setUsuario] = useState(null)
    const [cargando, setCargando] = useState(true)
    const [categoriaActiva, setCategoriaActiva] = useState('Todas')
    const [busqueda, setBusqueda] = useState('')
    const [toast, setToast] = useState(null)
    const [modalCom, setModalCom] = useState(null)
    const [comunidadChatLocal, setComunidadChatLocal] = useState(null)

    // Chat controlado externamente si viene de PaginaComunidades, o local si se usa solo
    const comunidadChat = onComunidadActivaChange ? comunidadActivaExterna : comunidadChatLocal
    const setComunidadChat = (com) => {
        if (onComunidadActivaChange) onComunidadActivaChange(com)
        else setComunidadChatLocal(com)
    }


    useEffect(() => {
        const usuarioGuardado = JSON.parse(localStorage.getItem('UsuarioActivo') || 'null')
        setUsuario(usuarioGuardado)

        const cargar = async () => {
            const [coms, mbs] = await Promise.all([
                Fetch.getData('comunidades'),
                Fetch.getData('miembros_comunidades')
            ])
            setComunidades(coms || [])
            setMiembros(mbs || [])
            setCargando(false)
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
            const entrada = miembros.find(
                m => m.comunidadId === comunidad.id && m.usuarioId === usuario.id
            )
            if (entrada) {
                await Fetch.deleteData('miembros_comunidades', entrada.id)
                actualizarMiembros(miembros.filter(m => m.id !== entrada.id))
                if (comunidadChat?.id === comunidad.id) setComunidadChat(null)
                mostrarToast(`Saliste de "${comunidad.nombre}".`, 'info')
            }
        } else {
            const nuevaEntrada = {
                comunidadId: comunidad.id,
                usuarioId: usuario.id,
                usuarioNombre: usuario.Nombre,
                fecha: new Date().toISOString()
            }
            const creada = await Fetch.postData(nuevaEntrada, 'miembros_comunidades')
            actualizarMiembros([...miembros, creada])
            mostrarToast(`¡Te uniste a "${comunidad.nombre}"! 🎉`, 'exito')
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
            {/* Toast */}
            {toast && (
                <div className={`com-toast com-toast--${toast.tipo}`}>
                    <span>{toast.tipo === 'exito' ? '✅' : toast.tipo === 'info' ? 'ℹ️' : '⚠️'}</span>
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
                        /* ── Vista EXPLORADOR ── */
                        <div className="com-wrapper">
                            {/* Hero */}
                            <section className="com-hero">
                                <div className="com-hero__bg"></div>
                                <div className="com-hero__content">
                                    <span className="com-hero__badge">✦ Comunidades KREA</span>
                                    <h1 className="com-hero__titulo">Encuentra tu tribu creativa</h1>
                                    <p className="com-hero__subtitulo">
                                        Únete a comunidades de talento, comparte tu obra, inspírate y
                                        crece rodeado de personas que comparten tu pasión.
                                    </p>
                                    <div className="com-hero__search">
                                        <span className="com-hero__search-icon">🔍</span>
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
                                <div className="com-filtros">
                                    {CATEGORIAS.map(cat => (
                                        <button
                                            key={cat}
                                            id={`filtro-${cat.toLowerCase()}`}
                                            className={`com-filtro-btn ${categoriaActiva === cat ? 'com-filtro-btn--activo' : ''}`}
                                            onClick={() => setCategoriaActiva(cat)}
                                        >
                                            {cat}
                                        </button>
                                    ))}
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
                                        <span className="com-empty__icon">🔎</span>
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
                                                    {/* Banner */}
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

                                                    {/* Body */}
                                                    <div className="com-card__body">
                                                        <div className="com-card__meta">
                                                            <span
                                                                className="com-card__categoria"
                                                                style={{ background: com.colorClaro, color: com.color }}
                                                            >
                                                                {com.categoria}
                                                            </span>
                                                            <span className="com-card__miembros">
                                                                👥 {totalMiembros} {totalMiembros === 1 ? 'miembro' : 'miembros'}
                                                            </span>
                                                        </div>

                                                        <h2 className="com-card__nombre">{com.nombre}</h2>
                                                        <p className="com-card__descripcion">{com.descripcion}</p>

                                                        <div className="com-card__acciones">
                                                            {esUnido ? (
                                                                <>
                                                                    <button
                                                                        id={`btn-chat-${com.id}`}
                                                                        className="com-card__btn-chat"
                                                                        style={{ background: com.color }}
                                                                        onClick={() => abrirChat(com)}
                                                                    >
                                                                        💬 Ir al chat
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

                            {/* CTA */}
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
                                {esMiembro(modalCom.id) ? '🚪 Salir de la comunidad' : '🚀 Unirse a la comunidad'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default CompComunidades