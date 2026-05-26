import React, { useState, useEffect, useCallback } from 'react'
import '../../styles/EstilosSidebar/SidebarComunidades.css'
import Fetch from '../../services/Fetch'
import Swal from 'sweetalert2'

const ICONOS = ['🎨', '🎵', '💻', '📸', '✍️', '🎭', '🎬', '🏛️', '🌿', '🎧', '🖌️', '📐', '🧵', '🎙️', '🖼️', '🎮']
const COLORES = ['#0ea5e9', '#8b5cf6', '#f43f5e', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#6366f1', '#14b8a6', '#f97316']

function SidebarComunidades({
    misComunidades = [],
    comunidadesAdmin = [],
    comunidadActiva = null,
    usuario = null,
    onSeleccionar,
    onExplorar,
    onComunidadCreada,
    onEditarComunidad,
}) {
    const [modalAbierto, setModalAbierto] = useState(false)
    const [guardando, setGuardando] = useState(false)
    const [categorias, setCategorias] = useState([])
    const [form, setForm] = useState({
        nombre: '', descripcion: '', id_categoria: '',
        icono: ICONOS[0], color: COLORES[0], banner: '',
    })
    const [bannerPreview, setBannerPreview] = useState('')
    const [subiendoBanner, setSubiendoBanner] = useState(false)

    // ── Dropdown de convocatorias por comunidad ──
    const [abiertos, setAbiertos] = useState(new Set())
    const [convosPor, setConvosPor] = useState({}) // { [id_comunidad]: { lista, cargando } }

    const toggleConvos = async (com) => {
        const id = com.id
        if (abiertos.has(id)) {
            setAbiertos(prev => { const s = new Set(prev); s.delete(id); return s })
            return
        }
        setAbiertos(prev => new Set([...prev, id]))
        if (convosPor[id]) return // ya cargadas
        setConvosPor(prev => ({ ...prev, [id]: { lista: [], cargando: true } }))
        try {
            const data = await Fetch.getData(`convocatorias?id_comunidad=${id}&limit=100`)
            const lista = Array.isArray(data) ? data : (data?.data || [])
            setConvosPor(prev => ({ ...prev, [id]: { lista, cargando: false } }))
        } catch {
            setConvosPor(prev => ({ ...prev, [id]: { lista: [], cargando: false } }))
        }
    }

    const hoy = new Date().toISOString().slice(0, 10)

    const handleVerInscritos = async (convo) => {
        Swal.fire({ title: 'Cargando inscritos...', didOpen: () => Swal.showLoading(), allowOutsideClick: false })
        try {
            const data = await Fetch.getData(`convocatorias/${convo.id_convocatoria}/participantes`)
            const lista = Array.isArray(data) ? data : (data?.data || [])
            if (lista.length === 0) {
                Swal.fire({ icon: 'info', title: 'Sin inscritos', text: 'Nadie se ha inscrito todavía.', confirmButtonColor: '#0ea5e9' })
                return
            }
            const html = lista.map(p => {
                const u = p.Usuario || p
                const nombre = u.nombre_completo || u.nombre_usuario || 'Usuario'
                const id = u.id_usuario
                const img = u.img_perfil
                const avatar = img
                    ? `<img src="${img}" style="width:36px;height:36px;border-radius:50%;object-fit:cover;flex-shrink:0;border:2px solid #e2e8f0">`
                    : `<div style="width:36px;height:36px;border-radius:50%;background:#0ea5e9;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:1rem;flex-shrink:0">${nombre[0]?.toUpperCase() || '?'}</div>`
                return `<a href="/perfil/${id}" style="display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:8px;text-decoration:none;color:#0f172a;margin-bottom:2px" onmouseover="this.style.background='#f1f5f9'" onmouseout="this.style.background='transparent'">${avatar}<span style="font-size:0.875rem;font-weight:500">${nombre}</span><span style="margin-left:auto;font-size:0.75rem;color:#94a3b8">Ver perfil →</span></a>`
            }).join('')
            Swal.fire({
                title: `Inscritos (${lista.length})`,
                html: `<div style="text-align:left;max-height:320px;overflow-y:auto">${html}</div>`,
                confirmButtonText: 'Cerrar',
                confirmButtonColor: '#0ea5e9',
            })
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Error', text: err.message, confirmButtonColor: '#0ea5e9' })
        }
    }

    const cerrarEnLista = useCallback((convoId) => {
        setConvosPor(prev => {
            const next = { ...prev }
            for (const comId in next) {
                next[comId] = {
                    ...next[comId],
                    lista: next[comId].lista.map(c =>
                        c.id_convocatoria === convoId ? { ...c, fecha_cierre: hoy } : c
                    )
                }
            }
            return next
        })
    }, [hoy])

    const eliminarDeLista = useCallback((convoId) => {
        setConvosPor(prev => {
            const next = { ...prev }
            for (const comId in next) {
                next[comId] = {
                    ...next[comId],
                    lista: next[comId].lista.filter(c => c.id_convocatoria !== convoId)
                }
            }
            return next
        })
    }, [])

    // Escuchar eventos del chat
    useEffect(() => {
        const onCerrada   = (e) => cerrarEnLista(e.detail?.convoId)
        const onEliminada = (e) => eliminarDeLista(e.detail?.convoId)
        window.addEventListener('convo-cerrada',   onCerrada)
        window.addEventListener('convo-eliminada', onEliminada)
        return () => {
            window.removeEventListener('convo-cerrada',   onCerrada)
            window.removeEventListener('convo-eliminada', onEliminada)
        }
    }, [cerrarEnLista, eliminarDeLista])

    const handleCerrarConvo = async (convo, comId) => {
        const { isConfirmed } = await Swal.fire({
            title: '¿Cerrar convocatoria?', text: 'Ya no aceptará nuevos inscritos.',
            icon: 'question', showCancelButton: true,
            confirmButtonColor: '#f59e0b', cancelButtonColor: '#94a3b8',
            confirmButtonText: 'Sí, cerrar', cancelButtonText: 'Cancelar',
        })
        if (!isConfirmed) return
        try {
            await Fetch.putData(`convocatorias/${convo.id_convocatoria}`, { fecha_cierre: hoy })
            cerrarEnLista(convo.id_convocatoria)
            window.dispatchEvent(new CustomEvent('convo-cerrada', { detail: { convoId: convo.id_convocatoria } }))
            Swal.fire({ icon: 'success', title: 'Convocatoria cerrada', timer: 1500, showConfirmButton: false })
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Error', text: err.message, confirmButtonColor: '#0ea5e9' })
        }
    }

    const handleEliminarConvo = async (convo, comId) => {
        const { isConfirmed } = await Swal.fire({
            title: '¿Eliminar convocatoria?', text: 'Esta acción no se puede deshacer.',
            icon: 'warning', showCancelButton: true,
            confirmButtonColor: '#ef4444', cancelButtonColor: '#94a3b8',
            confirmButtonText: 'Sí, eliminar', cancelButtonText: 'Cancelar',
        })
        if (!isConfirmed) return
        try {
            await Fetch.deleteData(`convocatorias/${convo.id_convocatoria}`)
            eliminarDeLista(convo.id_convocatoria)
            window.dispatchEvent(new CustomEvent('convo-eliminada', { detail: { convoId: convo.id_convocatoria } }))
            Swal.fire({ icon: 'success', title: 'Eliminada', timer: 1200, showConfirmButton: false })
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Error', text: err.message, confirmButtonColor: '#0ea5e9' })
        }
    }

    useEffect(() => {
        Fetch.getData('categorias').then(data => {
            const lista = Array.isArray(data) ? data : (data?.data || [])
            setCategorias(lista)
            if (lista.length > 0) setForm(f => ({ ...f, id_categoria: lista[0].id_categoria }))
        }).catch(() => {})
    }, [])

    const handleChange = (campo, valor) => setForm(prev => ({ ...prev, [campo]: valor }))

    const handleBanner = async (e) => {
        const file = e.target.files?.[0]
        if (!file) return
        setBannerPreview(URL.createObjectURL(file))
        setSubiendoBanner(true)
        try {
            const data = new FormData()
            data.append('file', file)
            data.append('upload_preset', 'imagenes')
            const res = await fetch('https://api.cloudinary.com/v1_1/dyy1yqvbv/image/upload', { method: 'POST', body: data })
            const result = await res.json()
            handleChange('banner', result.secure_url)
        } catch {
            Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo subir la imagen.' })
            setBannerPreview('')
            handleChange('banner', '')
        } finally {
            setSubiendoBanner(false)
        }
    }

    const handleCrear = async (e) => {
        e.preventDefault()
        if (!form.nombre.trim() || !form.descripcion.trim()) return
        setGuardando(true)
        try {
            const nueva = await Fetch.postData('comunidades', {
                nombre:       form.nombre.trim(),
                descripcion:  form.descripcion.trim(),
                icono:        form.icono,
                Color:        form.color,
                ColorClaro:   form.color + '22',
                banner:       form.banner || null,
                id_categoria: form.id_categoria || null,
            })
            const catNombre = categorias.find(c => c.id_categoria === form.id_categoria)?.nombre || ''
            const normalizada = {
                id:          nueva.id_comunidad,
                nombre:      nueva.nombre,
                descripcion: nueva.descripcion,
                icono:       nueva.icono || form.icono,
                color:       nueva.Color || form.color,
                colorClaro:  nueva.ColorClaro || form.color + '22',
                banner:      nueva.banner || '',
                categoria:   catNombre,
            }
            onComunidadCreada?.(normalizada)
            setModalAbierto(false)
            setBannerPreview('')
            setForm({ nombre: '', descripcion: '', id_categoria: categorias[0]?.id_categoria || '', icono: ICONOS[0], color: COLORES[0], banner: '' })
        } catch (err) {
            console.error(err)
            Swal.fire({ icon: 'error', title: 'Error', text: err.message || 'No se pudo crear la comunidad.', confirmButtonColor: '#0ea5e9' })
        } finally {
            setGuardando(false)
        }
    }

    return (
        <>
            <aside className="sb" id="sidebar-comunidades">
                <div className="sb__scroll">

                    {/* DISCOVERY */}
                    <div className="sb__section">
                        <p className="sb__section-label">Discovery</p>
                        <ul className="sb__nav">
                            <li>
                                <button
                                    className={`sb__nav-item ${!comunidadActiva ? 'sb__nav-item--activo' : ''}`}
                                    onClick={() => { onExplorar?.(); onCategoria?.('Todas') }}
                                >
                                    <span className="sb__nav-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                                    </span>
                                    Todas las comunidades
                                </button>
                            </li>
                        </ul>
                    </div>

                    {/* MIS COMUNIDADES */}
                    <div className="sb__section">
                        <p className="sb__section-label">Mis comunidades</p>
                        {!usuario ? (
                            <p className="sb__empty-txt">Inicia sesión para ver tus comunidades.</p>
                        ) : misComunidades.length === 0 ? (
                            <p className="sb__empty-txt">Aún no te has unido a ninguna.</p>
                        ) : (
                            <ul className="sb__nav">
                                {misComunidades.map(com => (
                                    <li key={com.id}>
                                        <button
                                            className={`sb__nav-item ${comunidadActiva?.id === com.id ? 'sb__nav-item--activo' : ''}`}
                                            onClick={() => onSeleccionar?.(com)}
                                        >
                                            <span className="sb__nav-icon sb__nav-icon--emoji" style={{ background: com.color + '22' }}>
                                                {com.icono}
                                            </span>
                                            {com.nombre}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* MIS COMUNIDADES ADMINISTRADAS — solo roles 1 y 3 */}
                    {usuario && (usuario.id_rol === 1 || usuario.id_rol === 3) && (
                        <div className="sb__section">
                            <p className="sb__section-label">Administradas</p>
                            {comunidadesAdmin.length === 0 ? (
                                <p className="sb__empty-txt">No has creado ninguna comunidad.</p>
                            ) : (
                                <ul className="sb__nav">
                                    {comunidadesAdmin.map(com => {
                                        const abierto = abiertos.has(com.id)
                                        const estado = convosPor[com.id]
                                        const convos = estado?.lista || []
                                        const activas = convos.filter(c => c.fecha_cierre > hoy)
                                        const cerradas = convos.filter(c => c.fecha_cierre <= hoy)

                                        return (
                                            <li key={com.id} className="sb__nav-admin-row" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 0 }}>
                                                {/* Fila comunidad */}
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                                    <button
                                                        className={`sb__nav-item sb__nav-item--admin ${comunidadActiva?.id === com.id ? 'sb__nav-item--activo' : ''}`}
                                                        style={{ flex: 1 }}
                                                        onClick={() => onSeleccionar?.(com)}
                                                    >
                                                        <span className="sb__nav-icon sb__nav-icon--emoji" style={{ background: com.color + '22' }}>
                                                            {com.icono}
                                                        </span>
                                                        {com.nombre}
                                                    </button>
                                                    {/* Toggle convocatorias */}
                                                    <button
                                                        className="sb__nav-edit-btn"
                                                        title={abierto ? 'Ocultar convocatorias' : 'Ver convocatorias'}
                                                        onClick={() => toggleConvos(com)}
                                                        style={{ color: abierto ? com.color : '#94a3b8' }}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'transform 0.2s', transform: abierto ? 'rotate(180deg)' : 'none' }}><polyline points="6 9 12 15 18 9"/></svg>
                                                    </button>
                                                    <button
                                                        className="sb__nav-edit-btn"
                                                        title="Editar comunidad"
                                                        onClick={() => onEditarComunidad?.(com)}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                                                    </button>
                                                </div>

                                                {/* Dropdown convocatorias */}
                                                {abierto && (
                                                    <div className="sb__convo-panel">
                                                        {estado?.cargando ? (
                                                            <p className="sb__convo-empty">Cargando...</p>
                                                        ) : convos.length === 0 ? (
                                                            <p className="sb__convo-empty">Sin convocatorias.</p>
                                                        ) : (
                                                            <>
                                                                {activas.length > 0 && (
                                                                    <>
                                                                        <p className="sb__convo-group-label">Activas</p>
                                                                        {activas.map(c => (
                                                                            <div key={c.id_convocatoria} className="sb__convo-item">
                                                                                <span className="sb__convo-dot" style={{ background: com.color }} />
                                                                                <span className="sb__convo-nombre" title={c.nombre}>{c.nombre}</span>
                                                                                <div className="sb__convo-btns">
                                                                                    <button className="sb__convo-btn sb__convo-btn--inscritos" title="Ver inscritos" onClick={() => handleVerInscritos(c)}>
                                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                                                                                    </button>
                                                                                    <button className="sb__convo-btn sb__convo-btn--cerrar" title="Cerrar convocatoria" onClick={() => handleCerrarConvo(c, com.id)}>
                                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                                                                                    </button>
                                                                                    <button className="sb__convo-btn sb__convo-btn--eliminar" title="Eliminar" onClick={() => handleEliminarConvo(c, com.id)}>
                                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                                                                                    </button>
                                                                                </div>
                                                                            </div>
                                                                        ))}
                                                                    </>
                                                                )}
                                                                {cerradas.length > 0 && (
                                                                    <>
                                                                        <p className="sb__convo-group-label" style={{ color: '#94a3b8' }}>Cerradas</p>
                                                                        {cerradas.map(c => (
                                                                            <div key={c.id_convocatoria} className="sb__convo-item sb__convo-item--cerrada">
                                                                                <span className="sb__convo-dot" style={{ background: '#cbd5e1' }} />
                                                                                <span className="sb__convo-nombre" title={c.nombre}>{c.nombre}</span>
                                                                                <div className="sb__convo-btns">
                                                                                    <button className="sb__convo-btn sb__convo-btn--inscritos" title="Ver inscritos" onClick={() => handleVerInscritos(c)}>
                                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                                                                                    </button>
                                                                                    <button className="sb__convo-btn sb__convo-btn--eliminar" title="Eliminar" onClick={() => handleEliminarConvo(c, com.id)}>
                                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                                                                                    </button>
                                                                                </div>
                                                                            </div>
                                                                        ))}
                                                                    </>
                                                                )}
                                                            </>
                                                        )}
                                                    </div>
                                                )}
                                            </li>
                                        )
                                    })}
                                </ul>
                            )}
                        </div>
                    )}

                    {/* CTA card — oculto para rol personal */}
                    {usuario?.id_rol !== 2 && <div className="sb__cta">
                        <p className="sb__cta-titulo">¿No encuentras tu nicho?</p>
                        <p className="sb__cta-desc">Crea tu propia comunidad y reúne a personas con tu misma pasión.</p>
                        {usuario ? (
                            <button className="sb__cta-btn" onClick={() => setModalAbierto(true)} id="btn-abrir-crear-comunidad">
                                Crear comunidad
                            </button>
                        ) : (
                            <a href="/Iniciar" className="sb__cta-btn">Iniciar sesión</a>
                        )}
                    </div>}

                </div>
            </aside>

            {/* Modal crear comunidad */}
            {modalAbierto && (
                <div className="sb-modal-overlay" onClick={() => setModalAbierto(false)}>
                    <div className="sb-modal" onClick={e => e.stopPropagation()}>
                        <div className="sb-modal__header">
                            <h2 className="sb-modal__titulo">Nueva comunidad</h2>
                            <button className="sb-modal__close" onClick={() => setModalAbierto(false)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                            </button>
                        </div>
                        <form className="sb-modal__form" onSubmit={handleCrear}>
                            <div className="sb-modal__preview" style={{ background: form.color + '18', borderColor: form.color + '44' }}>
                                <span className="sb-modal__preview-icono" style={{ background: form.color + '30', color: form.color }}>{form.icono}</span>
                                <div>
                                    <p className="sb-modal__preview-nombre">{form.nombre || 'Nombre de la comunidad'}</p>
                                    <p className="sb-modal__preview-cat">{categorias.find(c => c.id_categoria === form.id_categoria)?.nombre || ''}</p>
                                </div>
                            </div>

                            <div className="sb-modal__campo">
                                <label className="sb-modal__label">Imagen de portada</label>
                                <label className="sb-modal__banner-upload" style={bannerPreview ? { backgroundImage: `url(${bannerPreview})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}>
                                    {subiendoBanner
                                        ? <span className="sb-modal__banner-placeholder"><span style={{ fontSize: 13 }}>Subiendo imagen...</span></span>
                                        : !bannerPreview
                                            ? <span className="sb-modal__banner-placeholder">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                                                <span>Subir portada</span>
                                            </span>
                                            : <span className="sb-modal__banner-change">Cambiar imagen</span>
                                    }
                                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleBanner} disabled={subiendoBanner} />
                                </label>
                            </div>

                            <div className="sb-modal__campo">
                                <label className="sb-modal__label">Nombre</label>
                                <input type="text" className="sb-modal__input" placeholder="Ej: Diseñadores UX/UI" value={form.nombre} onChange={e => handleChange('nombre', e.target.value)} maxLength={60} required />
                            </div>
                            <div className="sb-modal__campo">
                                <label className="sb-modal__label">Descripción</label>
                                <textarea className="sb-modal__textarea" placeholder="¿De qué trata esta comunidad?" value={form.descripcion} onChange={e => handleChange('descripcion', e.target.value)} maxLength={200} rows={3} required />
                            </div>
                            <div className="sb-modal__campo">
                                <label className="sb-modal__label">Categoría</label>
                                <select className="sb-modal__select" value={form.id_categoria} onChange={e => handleChange('id_categoria', Number(e.target.value))}>
                                    {categorias.map(cat => <option key={cat.id_categoria} value={cat.id_categoria}>{cat.nombre}</option>)}
                                </select>
                            </div>
                            <div className="sb-modal__campo">
                                <label className="sb-modal__label">Ícono</label>
                                <div className="sb-modal__iconos">
                                    {ICONOS.map(ic => (
                                        <button key={ic} type="button" className={`sb-modal__icono-btn ${form.icono === ic ? 'sb-modal__icono-btn--activo' : ''}`} onClick={() => handleChange('icono', ic)}>{ic}</button>
                                    ))}
                                </div>
                            </div>
                            <div className="sb-modal__campo">
                                <label className="sb-modal__label">Color</label>
                                <div className="sb-modal__colores">
                                    {COLORES.map(col => (
                                        <button key={col} type="button" className={`sb-modal__color-btn ${form.color === col ? 'sb-modal__color-btn--activo' : ''}`} style={{ background: col }} onClick={() => handleChange('color', col)} />
                                    ))}
                                </div>
                            </div>
                            <button type="submit" id="btn-crear-comunidad" className="sb-modal__btn-submit" style={{ background: form.color }} disabled={guardando || subiendoBanner || !form.nombre.trim()}>
                                {subiendoBanner ? 'Subiendo imagen...' : guardando ? 'Creando...' : 'Crear comunidad'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    )
}

export default SidebarComunidades
