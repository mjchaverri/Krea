import { useState, useEffect } from 'react'
import Fetch from '../../services/Fetch'
import Swal from 'sweetalert2'
import '../../styles/Principales/AdminComunidad.css'

const ICONOS = ['🎨', '🎵', '💻', '📸', '✍️', '🎭', '🎬', '🏛️', '🌿', '🎧', '🖌️', '📐', '🧵', '🎙️', '🖼️', '🎮']
const COLORES = ['#0ea5e9', '#8b5cf6', '#f43f5e', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#6366f1', '#14b8a6', '#f97316']
const CATEGORIAS = [
    'Diseño y creatividad visual', 'UX/UI', 'Desarrollo y tecnología creativa',
    'Multimedia y animación', 'Fotografía y arte visual', 'Publicidad y marketing',
    'Arquitectura', 'Diseño de interiores', 'Diseño industrial', 'Educación',
    'Escritura y contenido', 'Manualidades y arte hecho a mano', 'Moda y costura',
    'Música y producción sonora', 'Ilustración', 'Modelado 3D',
]

function TabEditar({ comunidad, onGuardado }) {
    const [form, setForm] = useState({
        nombre: comunidad.nombre || '',
        descripcion: comunidad.descripcion || '',
        categoria: comunidad.categoria || CATEGORIAS[0],
        icono: comunidad.icono || '🎨',
        color: comunidad.color || '#0ea5e9',
        banner: comunidad.banner || '',
    })
    const [bannerPreview, setBannerPreview] = useState(comunidad.banner || '')
    const [guardando, setGuardando] = useState(false)
    const [ok, setOk] = useState(false)

    const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

    const handleBanner = (e) => {
        const file = e.target.files?.[0]
        if (!file) return
        const url = URL.createObjectURL(file)
        setBannerPreview(url)
        set('banner', url)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setGuardando(true)
        try {
            const id = comunidad.id_comunidad || comunidad.id
            const actualizada = await Fetch.putData(`comunidades/${id}`, {
                ...form,
                colorClaro: form.color + '22',
            })
            setOk(true)
            setTimeout(() => setOk(false), 2500)
            onGuardado?.(actualizada)
        } catch (err) { console.error(err) }
        finally { setGuardando(false) }
    }

    return (
        <form className="adm-form" onSubmit={handleSubmit}>
            {/* Preview */}
            <div className="adm-preview" style={{ background: form.color + '18', borderColor: form.color + '44' }}>
                <span className="adm-preview__icono" style={{ background: form.color + '30', color: form.color }}>{form.icono}</span>
                <div>
                    <p className="adm-preview__nombre">{form.nombre || 'Nombre'}</p>
                    <p className="adm-preview__cat">{form.categoria}</p>
                </div>
            </div>

            {/* Banner */}
            <div className="adm-campo">
                <label className="adm-label">Imagen de portada</label>
                <label className="adm-banner" style={bannerPreview ? { backgroundImage: `url(${bannerPreview})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}>
                    {!bannerPreview
                        ? <span className="adm-banner__placeholder">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                            <span>Subir portada</span>
                          </span>
                        : <span className="adm-banner__change">Cambiar imagen</span>
                    }
                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleBanner} />
                </label>
            </div>

            <div className="adm-campo">
                <label className="adm-label">Nombre</label>
                <input className="adm-input" type="text" value={form.nombre} onChange={e => set('nombre', e.target.value)} maxLength={60} required />
            </div>
            <div className="adm-campo">
                <label className="adm-label">Descripción</label>
                <textarea className="adm-textarea" value={form.descripcion} onChange={e => set('descripcion', e.target.value)} rows={3} maxLength={200} required />
            </div>
            <div className="adm-campo">
                <label className="adm-label">Categoría</label>
                <select className="adm-select" value={form.categoria} onChange={e => set('categoria', e.target.value)}>
                    {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>
            <div className="adm-campo">
                <label className="adm-label">Ícono</label>
                <div className="adm-iconos">
                    {ICONOS.map(ic => (
                        <button key={ic} type="button" className={`adm-icono-btn ${form.icono === ic ? 'adm-icono-btn--activo' : ''}`} onClick={() => set('icono', ic)}>{ic}</button>
                    ))}
                </div>
            </div>
            <div className="adm-campo">
                <label className="adm-label">Color</label>
                <div className="adm-colores">
                    {COLORES.map(col => (
                        <button key={col} type="button" className={`adm-color-btn ${form.color === col ? 'adm-color-btn--activo' : ''}`} style={{ background: col }} onClick={() => set('color', col)} />
                    ))}
                </div>
            </div>

            <button type="submit" className="adm-btn-submit" style={{ background: form.color }} disabled={guardando}>
                {ok ? '✓ Guardado' : guardando ? 'Guardando...' : 'Guardar cambios'}
            </button>
        </form>
    )
}

function TabMiembros({ comunidad, miembros, onExpulsar }) {
    const miembrosDeCom = miembros.filter(m => m.comunidadId === comunidad.id)
    const [expulsando, setExpulsando] = useState(null)
    const [baneados, setBaneados] = useState([])
    const [desbaneando, setDesbaneando] = useState(null)

    useEffect(() => {
        const id = comunidad.id_comunidad || comunidad.id
        Fetch.getData(`reportes-chat/baneados/${id}`)
            .then(data => setBaneados(Array.isArray(data) ? data : (data?.data || [])))
            .catch(() => {})
    }, [comunidad.id])

    const handleExpulsar = async (m) => {
        const { isConfirmed } = await Swal.fire({
            title: `¿Expulsar a ${m.usuarioNombre}?`,
            text: 'Esta persona será removida de la comunidad.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, expulsar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#94a3b8',
        })
        if (!isConfirmed) return
        setExpulsando(m.id)
        try {
            onExpulsar?.(m.id)
        } catch (err) { console.error(err) }
        finally { setExpulsando(null) }
    }

    const handleDesbanear = async (ban) => {
        const { isConfirmed } = await Swal.fire({
            title: `¿Desbanear a ${ban.nombre_usuario || 'este usuario'}?`,
            text: 'Podrá volver a unirse a la comunidad.',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí, desbanear',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#10b981',
            cancelButtonColor: '#94a3b8',
        })
        if (!isConfirmed) return
        setDesbaneando(ban.id_ban)
        try {
            const id = comunidad.id_comunidad || comunidad.id
            await Fetch.deleteData(`reportes-chat/baneados/${id}/${ban.id_usuario}`)
            setBaneados(prev => prev.filter(b => b.id_ban !== ban.id_ban))
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Error', text: err.message, confirmButtonColor: '#0ea5e9' })
        } finally {
            setDesbaneando(null)
        }
    }

    return (
        <div className="adm-miembros">
            <p className="adm-miembros__count">{miembrosDeCom.length} miembro{miembrosDeCom.length !== 1 ? 's' : ''}</p>
            {miembrosDeCom.length === 0 ? (
                <p className="adm-empty">Esta comunidad no tiene miembros aún.</p>
            ) : (
                <ul className="adm-miembros__lista">
                    {miembrosDeCom.map(m => (
                        <li key={m.id} className="adm-miembro-item">
                            <div className="adm-miembro-avatar" style={{ background: comunidad.color }}>
                                {m.usuarioNombre?.[0]?.toUpperCase() || '?'}
                            </div>
                            <span className="adm-miembro-nombre">{m.usuarioNombre}</span>
                            <button
                                className="adm-btn-expulsar"
                                onClick={() => handleExpulsar(m)}
                                disabled={expulsando === m.id}
                                title="Expulsar de la comunidad"
                            >
                                {expulsando === m.id
                                    ? <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                                    : <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="18" y1="8" x2="23" y2="13"/><line x1="23" y1="8" x2="18" y2="13"/></svg>
                                }
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            {baneados.length > 0 && (
                <div className="adm-baneados">
                    <p className="adm-baneados__titulo">Baneados ({baneados.length})</p>
                    <ul className="adm-miembros__lista">
                        {baneados.map(ban => (
                            <li key={ban.id_ban} className="adm-miembro-item adm-miembro-item--baneado">
                                <div className="adm-miembro-avatar" style={{ background: '#ef4444' }}>
                                    {ban.nombre_usuario?.[0]?.toUpperCase() || '?'}
                                </div>
                                <span className="adm-miembro-nombre">{ban.nombre_usuario || `Usuario #${ban.id_usuario}`}</span>
                                <button
                                    className="adm-btn-desbanear"
                                    onClick={() => handleDesbanear(ban)}
                                    disabled={desbaneando === ban.id_ban}
                                    title="Desbanear"
                                >
                                    {desbaneando === ban.id_ban
                                        ? <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                                        : <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/></svg>
                                    }
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}

function TabConvocatoria({ comunidad, usuario, onCreada }) {
    const [form, setForm] = useState({ nombre: '', descripcion: '', cierre: '' })
    const [guardando, setGuardando] = useState(false)
    const [ok, setOk] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!form.nombre.trim() || !form.cierre) return
        setGuardando(true)
        try {
            const idComunidad = comunidad.id_comunidad || comunidad.id
            const idUsuario   = usuario.id || usuario.id_usuario
            // Crear registro real de convocatoria
            const convo = await Fetch.postData('convocatorias', {
                nombre:       form.nombre.trim(),
                descripcion:  form.descripcion.trim(),
                fecha_cierre: form.cierre,
                id_usuario:   idUsuario,
                id_comunidad: idComunidad,
            })
            const idConvo = convo?.id_convocatoria || convo?.id
            // Publicar en el chat con la misma estructura
            const payload = { id: idConvo, t: form.nombre.trim(), d: form.descripcion.trim(), c: form.cierre }
            await Fetch.postData('chat-comunidad', {
                id_comunidad:   idComunidad,
                usuario_nombre: usuario.Nombre || usuario.nombre_completo || 'Usuario',
                texto:          `📢${JSON.stringify(payload)}`,
            })
            onCreada?.()
            setOk(true)
            setForm({ nombre: '', descripcion: '', cierre: '' })
            setTimeout(() => setOk(false), 2500)
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Error', text: err.message, confirmButtonColor: '#0ea5e9' })
        } finally { setGuardando(false) }
    }

    return (
        <form className="adm-form" onSubmit={handleSubmit}>
            <p className="adm-convo-hint">La convocatoria aparecerá como una tarjeta especial en el chat de la comunidad.</p>
            <div className="adm-campo">
                <label className="adm-label">Título de la convocatoria</label>
                <input className="adm-input" type="text" placeholder="Ej: Búsqueda de diseñador UX"
                    value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} maxLength={80} required />
            </div>
            <div className="adm-campo">
                <label className="adm-label">Descripción</label>
                <textarea className="adm-textarea" placeholder="Requisitos, fechas, detalles..."
                    value={form.descripcion} onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))} rows={3} maxLength={400} />
            </div>
            <div className="adm-campo">
                <label className="adm-label">Fecha de cierre</label>
                <input className="adm-input" type="date" value={form.cierre}
                    min={new Date().toISOString().slice(0, 10)}
                    onChange={e => setForm(f => ({ ...f, cierre: e.target.value }))} required />
            </div>
            <button type="submit" className="adm-btn-submit" style={{ background: comunidad.color }}
                disabled={guardando || !form.nombre.trim() || !form.cierre}>
                {ok ? '✓ Convocatoria publicada' : guardando ? 'Publicando...' : 'Publicar convocatoria'}
            </button>
        </form>
    )
}

function TabReportes({ comunidad, miembros, onMensajeEliminado, onUsuarioExpulsado }) {
    const [reportes, setReportes] = useState([])
    const [cargando, setCargando] = useState(true)

    useEffect(() => {
        const id = comunidad.id_comunidad || comunidad.id
        Fetch.getData(`reportes-chat/comunidad/${id}`)
            .then(data => setReportes(Array.isArray(data) ? data : (data?.data || [])))
            .catch(() => {})
            .finally(() => setCargando(false))
    }, [comunidad.id])

    const pendientes = reportes.filter(r => r.estado === 'pendiente')

    const actualizarEstado = async (reporte, estado) => {
        try {
            await Fetch.putData(`reportes-chat/${reporte.id_reporte_chat}/estado`, { estado })
            setReportes(prev => prev.map(r => r.id_reporte_chat === reporte.id_reporte_chat ? { ...r, estado } : r))
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Error', text: err.message, confirmButtonColor: '#0ea5e9' })
        }
    }

    const handleDescartar = async (reporte) => {
        const { isConfirmed } = await Swal.fire({
            title: '¿Descartar reporte?',
            text: 'El mensaje se mantendrá y el reporte se marcará como descartado.',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Descartar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#94a3b8',
            cancelButtonColor: '#64748b',
        })
        if (!isConfirmed) return
        await actualizarEstado(reporte, 'descartado')
    }

    const handleEliminarMensaje = async (reporte) => {
        const { isConfirmed } = await Swal.fire({
            title: '¿Eliminar este mensaje?',
            html: `<p style="font-size:0.85rem;color:#64748b"><em>"${reporte.texto_mensaje?.slice(0, 100) || ''}"</em></p>`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#94a3b8',
        })
        if (!isConfirmed) return
        try {
            await Fetch.deleteData(`chat-comunidad/${reporte.id_mensaje}`)
            await actualizarEstado(reporte, 'revisado')
            onMensajeEliminado?.(reporte.id_mensaje)
            Swal.fire({ icon: 'success', title: 'Mensaje eliminado', timer: 1500, showConfirmButton: false })
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Error', text: err.message, confirmButtonColor: '#0ea5e9' })
        }
    }

    const handleExpulsar = async (reporte) => {
        if (!reporte.id_usuario_autor) {
            Swal.fire({ icon: 'info', title: 'Sin información', text: 'No se puede identificar al usuario de este mensaje.', confirmButtonColor: '#0ea5e9' })
            return
        }
        const { isConfirmed } = await Swal.fire({
            title: `¿Sacar a ${reporte.autor_mensaje} de la comunidad?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, sacar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#94a3b8',
        })
        if (!isConfirmed) return
        try {
            const id = comunidad.id_comunidad || comunidad.id
            await Fetch.deleteData(`miembros/${id}/${reporte.id_usuario_autor}`)
            await actualizarEstado(reporte, 'revisado')
            onUsuarioExpulsado?.(reporte.id_usuario_autor)
            Swal.fire({ icon: 'success', title: `${reporte.autor_mensaje} fue expulsado`, timer: 1500, showConfirmButton: false })
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Error', text: err.message, confirmButtonColor: '#0ea5e9' })
        }
    }

    const handleBanear = async (reporte) => {
        if (!reporte.id_usuario_autor) {
            Swal.fire({ icon: 'info', title: 'Sin información', text: 'No se puede identificar al usuario de este mensaje.', confirmButtonColor: '#0ea5e9' })
            return
        }
        const { isConfirmed } = await Swal.fire({
            title: `¿Banear a ${reporte.autor_mensaje}?`,
            text: 'Se le expulsará y no podrá volver a unirse a esta comunidad.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, banear',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#7c2d12',
            cancelButtonColor: '#94a3b8',
        })
        if (!isConfirmed) return
        try {
            const id = comunidad.id_comunidad || comunidad.id
            await Fetch.postData('reportes-chat/banear', {
                id_comunidad:   id,
                id_usuario:     reporte.id_usuario_autor,
                razon:          reporte.razon,
                nombre_usuario: reporte.autor_mensaje,
            })
            await actualizarEstado(reporte, 'revisado')
            onUsuarioExpulsado?.(reporte.id_usuario_autor)
            Swal.fire({ icon: 'success', title: `${reporte.autor_mensaje} fue baneado`, timer: 1500, showConfirmButton: false })
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Error', text: err.message, confirmButtonColor: '#0ea5e9' })
        }
    }

    if (cargando) return <p className="adm-empty">Cargando reportes...</p>

    return (
        <div className="adm-reportes">
            {pendientes.length === 0 ? (
                <p className="adm-empty">No hay reportes pendientes. ✓</p>
            ) : (
                <ul className="adm-reportes__lista">
                    {pendientes.map(r => (
                        <li key={r.id_reporte_chat} className="adm-reporte-item">
                            <div className="adm-reporte-autor">{r.autor_mensaje}</div>
                            <p className="adm-reporte-texto">"{r.texto_mensaje?.slice(0, 120)}{r.texto_mensaje?.length > 120 ? '...' : ''}"</p>
                            <p className="adm-reporte-razon"><strong>Razón:</strong> {r.razon}</p>
                            <div className="adm-reporte-acciones">
                                <button className="adm-reporte-btn adm-reporte-btn--descartar" onClick={() => handleDescartar(r)}>Descartar</button>
                                <button className="adm-reporte-btn adm-reporte-btn--eliminar" onClick={() => handleEliminarMensaje(r)}>Eliminar mensaje</button>
                                <button className="adm-reporte-btn adm-reporte-btn--sacar" onClick={() => handleExpulsar(r)}>Sacar</button>
                                <button className="adm-reporte-btn adm-reporte-btn--banear" onClick={() => handleBanear(r)}>Banear</button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

function ModalAdminComunidad({ comunidad, usuario, miembros, onClose, onComunidadActualizada, onMiembroExpulsado, onConvocatoriaCreada, onMensajeChatEliminado }) {
    const [tab, setTab] = useState('editar')

    const puedeConvocar  = usuario?.id_rol === 1 || usuario?.id_rol === 3
    const puedeReportes  = usuario?.id_rol === 1 || usuario?.id_rol === 3
    const TABS = [
        { id: 'editar',       label: 'Editar comunidad' },
        { id: 'miembros',     label: `Miembros (${miembros.filter(m => m.comunidadId === comunidad.id).length})` },
        ...(puedeConvocar  ? [{ id: 'convocatoria', label: 'Nueva convocatoria' }] : []),
        ...(puedeReportes  ? [{ id: 'reportes',     label: 'Reportes' }]           : []),
    ]

    return (
        <div className="adm-overlay" onClick={onClose}>
            <div className="adm-modal" onClick={e => e.stopPropagation()}>
                <div className="adm-modal__header">
                    <div className="adm-modal__title-group">
                        <span className="adm-modal__icono" style={{ background: comunidad.color + '22', color: comunidad.color }}>{comunidad.icono}</span>
                        <div>
                            <h2 className="adm-modal__titulo">Gestionar comunidad</h2>
                            <p className="adm-modal__sub">{comunidad.nombre}</p>
                        </div>
                    </div>
                    <button className="adm-modal__close" onClick={onClose}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                </div>

                <div className="adm-tabs">
                    {TABS.map(t => (
                        <button key={t.id} className={`adm-tab ${tab === t.id ? 'adm-tab--activo' : ''}`} onClick={() => setTab(t.id)}
                            style={tab === t.id ? { borderBottomColor: comunidad.color, color: comunidad.color } : {}}>
                            {t.label}
                        </button>
                    ))}
                </div>

                <div className="adm-modal__body">
                    {tab === 'editar' && (
                        <TabEditar comunidad={comunidad} onGuardado={onComunidadActualizada} />
                    )}
                    {tab === 'miembros' && (
                        <TabMiembros comunidad={comunidad} miembros={miembros} onExpulsar={onMiembroExpulsado} />
                    )}
                    {tab === 'convocatoria' && (
                        <TabConvocatoria comunidad={comunidad} usuario={usuario} onCreada={onConvocatoriaCreada} />
                    )}
                    {tab === 'reportes' && (
                        <TabReportes
                            comunidad={comunidad}
                            miembros={miembros}
                            onMensajeEliminado={onMensajeChatEliminado}
                            onUsuarioExpulsado={onMiembroExpulsado}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}

export default ModalAdminComunidad
