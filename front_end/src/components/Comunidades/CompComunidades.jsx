import React, { useState, useEffect, useRef, useMemo } from 'react'
import '../../styles/Principales/Comunidades.css'
import Fetch from '../../services/Fetch'
import Swal from 'sweetalert2'
import ModalAdminComunidad from './ModalAdminComunidad'

// Normaliza una comunidad del backend al formato que usa el frontend
function normalizarComunidad(c) {
    return {
        id:            c.id_comunidad,
        nombre:        c.nombre,
        descripcion:   c.descripcion,
        icono:         c.icono || '🌐',
        color:         c.Color || '#0ea5e9',
        colorClaro:    c.ColorClaro || '#0ea5e922',
        banner:        c.banner || '',
        categoria:     c.Categoria?.nombre || '',
        creadoPor:     c.id_usuario || null,
        totalMiembros: parseInt(c.total_miembros) || 0,
    }
}

// Normaliza un mensaje del backend al formato del frontend
function normalizarMensaje(m) {
    const texto = m.texto || ''
    let esConvocatoria = false
    let convoData = null

    if (texto.startsWith('📢{')) {
        try {
            convoData = JSON.parse(texto.slice(2))
            esConvocatoria = true
        } catch { /* mensaje malformado, tratar como texto normal */ }
    } else if (texto.startsWith('📢 ')) {
        // Formato legado: "📢 titulo\ndescripcion"
        const lineas = texto.slice(3).split('\n')
        convoData = { t: lineas[0] || '', d: lineas.slice(1).join('\n') }
        esConvocatoria = true
    }

    return {
        id:             m.id_chat_comu,
        comunidadId:    m.id_comunidad,
        usuarioId:      null,
        usuarioNombre:  m.usuario_nombre,
        texto,
        fecha:          m.Fecha,
        esConvocatoria,
        convoId:        convoData?.id || null,
        convoTitulo:    convoData?.t || '',
        convoDesc:      convoData?.d || '',
        convoCierre:    convoData?.c || null,
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

/* ─── Helpers localStorage participaciones ─── */
function getParticipadas(userId) {
    try { return new Set(JSON.parse(localStorage.getItem(`convo_participadas_${userId}`) || '[]')); }
    catch { return new Set(); }
}
function saveParticipada(userId, convoId) {
    const set = getParticipadas(userId);
    set.add(convoId);
    localStorage.setItem(`convo_participadas_${userId}`, JSON.stringify([...set]));
}

/* ─── Tarjeta de convocatoria ─── */
function TarjetaConvocatoria({ item, comunidad, usuario, onEliminada }) {
    const [cerrada, setCerrada] = useState(() => {
        if (!item.convoCierre) return false
        return item.convoCierre <= new Date().toISOString().slice(0, 10)
    })
    const puedeGestionar = usuario && (usuario.id_rol === 1 || usuario.id_rol === 3)

    const userId = usuario?.id || usuario?.id_usuario
    const [yaParticipa, setYaParticipa] = useState(() => {
        if (!userId || !item.convoId) return false
        return getParticipadas(userId).has(item.convoId)
    })

    useEffect(() => {
        if (!item.convoId) return
        const onParticipada  = (e) => { if (e.detail?.convoId === item.convoId) setYaParticipa(true) }
        const onCerradaEvt  = (e) => { if (e.detail?.convoId === item.convoId) setCerrada(true) }
        const onEliminadaEvt = (e) => { if (e.detail?.convoId === item.convoId) onEliminada?.(item.id) }
        window.addEventListener('convo-participada', onParticipada)
        window.addEventListener('convo-cerrada',     onCerradaEvt)
        window.addEventListener('convo-eliminada',   onEliminadaEvt)
        return () => {
            window.removeEventListener('convo-participada', onParticipada)
            window.removeEventListener('convo-cerrada',     onCerradaEvt)
            window.removeEventListener('convo-eliminada',   onEliminadaEvt)
        }
    }, [item.convoId])

    const cierreTexto = item.convoCierre
        ? new Date(item.convoCierre + 'T12:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })
        : null

    const handleVerMas = () => {
        Swal.fire({
            title: item.convoTitulo,
            html: `
                ${item.convoDesc ? `<p style="text-align:left;font-size:14px;color:#374151;line-height:1.6;margin:0 0 16px">${item.convoDesc}</p>` : ''}
                ${cierreTexto ? `<div style="display:flex;align-items:center;gap:6px;font-size:13px;color:#64748b">📅 Cierre: <strong>${cierreTexto}</strong></div>` : ''}
            `,
            confirmButtonText: 'Cerrar',
            confirmButtonColor: '#0ea5e9',
        })
    }

    const marcarParticipando = () => {
        if (userId && item.convoId) saveParticipada(userId, item.convoId)
        setYaParticipa(true)
    }

    const handleParticipar = async () => {
        if (!usuario) {
            Swal.fire({ icon: 'info', title: 'Inicia sesión', text: 'Debes iniciar sesión para participar.', confirmButtonColor: '#0ea5e9' })
            return
        }
        if (cerrada) {
            Swal.fire({ icon: 'warning', title: 'Convocatoria cerrada', text: 'Esta convocatoria ya no acepta participantes.', confirmButtonColor: '#0ea5e9' })
            return
        }
        if (!item.convoId) {
            marcarParticipando()
            Swal.fire({ icon: 'success', title: '¡Inscripción registrada!', text: `Te anotamos en: ${item.convoTitulo}`, confirmButtonColor: '#0ea5e9' })
            return
        }
        try {
            await Fetch.postData(`convocatorias/${item.convoId}/participar`, {})
            marcarParticipando()
            Swal.fire({ icon: 'success', title: '¡Inscripción exitosa!', text: `Te inscribiste en: ${item.convoTitulo}`, confirmButtonColor: '#0ea5e9', timer: 2000, showConfirmButton: false })
        } catch (err) {
            const msg = err.message || ''
            if (msg.toLowerCase().includes('ya estás') || err.status === 409) {
                marcarParticipando()
                Swal.fire({ icon: 'info', title: 'Ya participas', text: 'Ya estás inscrito en esta convocatoria.', confirmButtonColor: '#0ea5e9' })
            } else {
                Swal.fire({ icon: 'error', title: 'Error', text: msg, confirmButtonColor: '#0ea5e9' })
            }
        }
    }

    const handleVerParticipantes = async () => {
        if (!item.convoId) {
            Swal.fire({ icon: 'info', title: 'Sin datos', text: 'Esta convocatoria no tiene ID registrado.', confirmButtonColor: '#0ea5e9' })
            return
        }
        Swal.fire({ title: 'Cargando participantes...', didOpen: () => Swal.showLoading(), allowOutsideClick: false })
        try {
            const data = await Fetch.getData(`convocatorias/${item.convoId}/participantes`)
            const participantes = Array.isArray(data) ? data : (data?.data || [])
            if (participantes.length === 0) {
                Swal.fire({ icon: 'info', title: 'Sin participantes aún', text: 'Nadie se ha inscrito en esta convocatoria todavía.', confirmButtonColor: '#0ea5e9' })
                return
            }
            const html = participantes.map(p => {
                const u = p.Usuario || p
                const nombre = u.nombre_completo || u.nombre_usuario || 'Usuario'
                const id = u.id_usuario
                const img = u.img_perfil
                const avatar = img
                    ? `<img src="${img}" style="width:38px;height:38px;border-radius:50%;object-fit:cover;flex-shrink:0;border:2px solid #e2e8f0">`
                    : `<div style="width:38px;height:38px;border-radius:50%;background:#0ea5e9;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:1rem;flex-shrink:0">${nombre[0]?.toUpperCase() || '?'}</div>`
                return `<a href="/perfil/${id}" style="display:flex;align-items:center;gap:10px;padding:9px 10px;border-radius:8px;text-decoration:none;color:#0f172a;margin-bottom:4px;transition:background 0.15s" onmouseover="this.style.background='#f1f5f9'" onmouseout="this.style.background='transparent'">${avatar}<span style="font-size:0.875rem;font-weight:500">${nombre}</span><span style="margin-left:auto;font-size:0.75rem;color:#94a3b8">Ver perfil →</span></a>`
            }).join('')
            Swal.fire({
                title: `Participantes <span style="font-size:1rem;color:#64748b;font-weight:400">(${participantes.length})</span>`,
                html: `<div style="text-align:left;max-height:320px;overflow-y:auto;padding-right:4px">${html}</div>`,
                confirmButtonText: 'Cerrar',
                confirmButtonColor: '#0ea5e9',
            })
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Error', text: err.message, confirmButtonColor: '#0ea5e9' })
        }
    }

    const handleCerrar = async () => {
        if (!item.convoId) { setCerrada(true); return }
        const { isConfirmed } = await Swal.fire({
            title: '¿Cerrar convocatoria?',
            text: 'Ya no se aceptarán nuevos participantes.',
            icon: 'question', showCancelButton: true,
            confirmButtonColor: '#f59e0b', cancelButtonColor: '#64748b',
            confirmButtonText: 'Sí, cerrar', cancelButtonText: 'Cancelar',
        })
        if (!isConfirmed) return
        try {
            await Fetch.putData(`convocatorias/${item.convoId}`, { fecha_cierre: new Date().toISOString().slice(0, 10) })
            setCerrada(true)
            window.dispatchEvent(new CustomEvent('convo-cerrada', { detail: { convoId: item.convoId } }))
            Swal.fire({ icon: 'success', title: 'Convocatoria cerrada', timer: 1500, showConfirmButton: false })
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Error', text: err.message, confirmButtonColor: '#0ea5e9' })
        }
    }

    const handleEliminar = async () => {
        const { isConfirmed } = await Swal.fire({
            title: '¿Eliminar convocatoria?', text: 'Esta acción no se puede deshacer.', icon: 'warning',
            showCancelButton: true, confirmButtonColor: '#ef4444', cancelButtonColor: '#64748b',
            confirmButtonText: 'Sí, eliminar', cancelButtonText: 'Cancelar',
        })
        if (!isConfirmed) return
        try {
            if (item.convoId) await Fetch.deleteData(`convocatorias/${item.convoId}`)
            if (item.id) await Fetch.deleteData(`chat-comunidad/${item.id}`)
            onEliminada?.(item.id)
            window.dispatchEvent(new CustomEvent('convo-eliminada', { detail: { convoId: item.convoId } }))
            Swal.fire({ icon: 'success', title: 'Convocatoria eliminada', timer: 1500, showConfirmButton: false })
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Error', text: err.message, confirmButtonColor: '#0ea5e9' })
        }
    }

    return (
        <div className="ch-convo-card" style={cerrada ? { opacity: 0.7 } : {}}>
            <div className="ch-convo-card__header">
                <div className="ch-convo-card__source-row">
                    <span className="ch-convo-card__dot" style={{ background: cerrada ? '#94a3b8' : (comunidad?.color || '#0ea5e9') }} />
                    <span className="ch-convo-card__source-label">
                        {comunidad?.nombre || item.usuarioNombre || 'Comunidad'}
                        {comunidad?.categoria ? ` • ${comunidad.categoria}` : ''}
                    </span>
                    {cerrada && <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#94a3b8', background: '#f1f5f9', padding: '1px 6px', borderRadius: 10, marginLeft: 'auto' }}>CERRADA</span>}
                    {puedeGestionar && !cerrada && (
                        <div style={{ display: 'flex', gap: 4, marginLeft: 'auto' }}>
                            <button onClick={handleCerrar} title="Cerrar convocatoria" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#f59e0b', padding: 2, display: 'flex', borderRadius: 4 }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                            </button>
                            <button onClick={handleEliminar} title="Eliminar convocatoria" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: 2, display: 'flex', borderRadius: 4 }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                            </button>
                        </div>
                    )}
                    {puedeGestionar && cerrada && (
                        <button onClick={handleEliminar} title="Eliminar convocatoria" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: 2, display: 'flex', borderRadius: 4, marginLeft: 4 }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                        </button>
                    )}
                </div>
                <h4 className="ch-convo-card__titulo">{item.convoTitulo || 'Nueva convocatoria'}</h4>
                {item.convoDesc && (
                    <p className="ch-convo-card__desc">{item.convoDesc}</p>
                )}
            </div>

            {cierreTexto && (
                <div className="ch-convo-card__meta">
                    <span className="ch-convo-card__meta-item">
                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                        Cierre: {cierreTexto}
                    </span>
                </div>
            )}

            <div className="ch-convo-card__footer">
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    <button className="ch-convo-card__btn ch-convo-card__btn--ver" onClick={handleVerMas}>
                        Ver más
                    </button>
                    {puedeGestionar && item.convoId && (
                        <button className="ch-convo-card__btn ch-convo-card__btn--ver" onClick={handleVerParticipantes}
                            style={{ color: '#7c3aed', borderColor: '#ede9fe', background: '#f5f3ff' }}>
                            Ver inscritos
                        </button>
                    )}
                    <button
                        className="ch-convo-card__btn ch-convo-card__btn--participar"
                        onClick={handleParticipar}
                        disabled={cerrada || yaParticipa}
                        style={
                            yaParticipa
                                ? { background: '#10b981', cursor: 'default', opacity: 0.9 }
                                : cerrada
                                    ? { opacity: 0.4, cursor: 'not-allowed' }
                                    : {}
                        }
                    >
                        {yaParticipa ? '✓ Inscrito' : 'Participar'}
                    </button>
                </div>
            </div>
        </div>
    )
}

/* ─── Modal crear convocatoria ─── */
function ModalConvocatoria({ comunidad, usuario, onClose, onCreada }) {
    const [form, setForm] = useState({ nombre: '', descripcion: '', cierre: '' })
    const [guardando, setGuardando] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!form.nombre.trim() || !form.cierre) return
        setGuardando(true)
        try {
            const idUsuario = usuario?.id || usuario?.id_usuario
            // Crear el registro real de convocatoria
            const convo = await Fetch.postData('convocatorias', {
                nombre:       form.nombre.trim(),
                descripcion:  form.descripcion.trim(),
                fecha_cierre: form.cierre,
                id_usuario:   idUsuario,
                id_comunidad: comunidad.id,
            })
            const idConvo = convo?.id_convocatoria || convo?.id
            // Postear mensaje al chat con referencia
            const payload = { id: idConvo, t: form.nombre.trim(), d: form.descripcion.trim(), c: form.cierre }
            const msg = await Fetch.postData('chat-comunidad', {
                usuario_nombre: usuario?.Nombre || usuario?.nombre_usuario || 'Sistema',
                texto:          `📢${JSON.stringify(payload)}`,
                id_comunidad:   comunidad.id,
            })
            onCreada(normalizarMensaje(msg))
            onClose()
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Error', text: err.message, confirmButtonColor: '#0ea5e9' })
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
                        <input className="ch-modal__input" type="text" placeholder="Ej: Búsqueda de diseñador UX"
                            value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))}
                            maxLength={80} required />
                    </div>
                    <div className="ch-modal__campo">
                        <label className="ch-modal__label">Descripción</label>
                        <textarea className="ch-modal__textarea" placeholder="Describe los requisitos o detalles..."
                            value={form.descripcion} onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))}
                            rows={3} maxLength={300} />
                    </div>
                    <div className="ch-modal__campo">
                        <label className="ch-modal__label">Fecha de cierre</label>
                        <input className="ch-modal__input" type="date" value={form.cierre}
                            min={new Date().toISOString().slice(0, 10)}
                            onChange={e => setForm(f => ({ ...f, cierre: e.target.value }))} required />
                    </div>
                    <button type="submit" className="ch-modal__btn"
                        disabled={guardando || !form.nombre.trim() || !form.cierre}>
                        {guardando ? 'Publicando...' : 'Publicar convocatoria'}
                    </button>
                </form>
            </div>
        </div>
    )
}

/* ─── Chat principal ─── */
function ChatComunidad({ comunidad, usuario, onVolver, onSalir, onVerDetalles }) {
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

    const esCreadoPor = comunidad.creadoPor === usuario?.id
    const esAdmin = usuario?.id_rol === 1
    const puedeBorrarMensajes = esCreadoPor || esAdmin
    const puedeReportar = !!usuario

    const handleEliminarMensaje = async (item) => {
        const { isConfirmed } = await Swal.fire({
            title: '¿Eliminar mensaje?',
            html: `<em style="font-size:13px;color:#64748b">"${item.texto.slice(0, 80)}${item.texto.length > 80 ? '…' : ''}"</em>`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444', cancelButtonColor: '#64748b',
            confirmButtonText: 'Sí, eliminar', cancelButtonText: 'Cancelar',
        })
        if (!isConfirmed) return
        try {
            await Fetch.deleteData(`chat-comunidad/${item.id}`)
            setMensajes(prev => prev.filter(m => m.id !== item.id))
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Error', text: err.message })
        }
    }

    const handleReportar = async (item) => {
        const { value: razon, isConfirmed } = await Swal.fire({
            title: 'Reportar mensaje',
            html: `<p style="font-size:0.85rem;color:#64748b;margin-bottom:8px">Mensaje de <strong>${item.usuarioNombre}</strong>:<br/><em>"${item.texto.slice(0, 120)}${item.texto.length > 120 ? '...' : ''}"</em></p>`,
            input: 'textarea',
            inputPlaceholder: 'Describe por qué este mensaje es inapropiado...',
            inputAttributes: { maxlength: 400 },
            showCancelButton: true,
            confirmButtonText: 'Enviar reporte',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#94a3b8',
            inputValidator: (v) => !v?.trim() ? 'Debes escribir una razón.' : null,
            customClass: { container: 'swal-high-z' },
        })
        if (!isConfirmed || !razon?.trim()) return
        try {
            await Fetch.postData('reportes-chat', {
                id_mensaje:   item.id,
                id_comunidad: comunidad.id,
                razon:        razon.trim(),
            })
            Swal.fire({ icon: 'success', title: 'Reporte enviado', text: 'El administrador revisará este mensaje.', confirmButtonColor: '#0ea5e9' })
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Error', text: err.message || 'No se pudo enviar el reporte.', confirmButtonColor: '#0ea5e9' })
        }
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
                        <button className="ch__header-btn" onClick={onVerDetalles} title="Ver detalles de la comunidad">
                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                        </button>
                        <button className="ch__header-btn ch__header-btn--salir" onClick={onSalir} title="Salir de la comunidad">
                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                        </button>
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
                                    <TarjetaConvocatoria item={item} comunidad={comunidad} usuario={usuario} onEliminada={(msgId) => setMensajes(prev => prev.filter(m => m.id !== msgId))} />
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
                                {!propio && puedeReportar && (
                                    <button
                                        className="ch__msg-report-btn"
                                        title="Reportar mensaje"
                                        onClick={() => handleReportar(item)}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>
                                    </button>
                                )}
                                {puedeBorrarMensajes && (
                                    <button
                                        className="ch__msg-report-btn ch__msg-delete-btn"
                                        title="Eliminar mensaje"
                                        onClick={() => handleEliminarMensaje(item)}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d1="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                                    </button>
                                )}
                            </div>
                        )
                    })}
                </div>

                {/* Input */}
                <form className="ch__input-area" onSubmit={handleEnviar} id="chat-form">
                    {usuario && (usuario.id_rol === 1 || usuario.id_rol === 3) && (
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
    onMisComunidadesChange = null,
    onComunidadesAdminChange = null,
    pedidoEdicion = null,
    onPedidoEdicionConsumed = null,
    categoriaExterna = null,
    onCategoriaChange = null,
    abrirComunidadId = null,
}) {
    const [comunidades, setComunidades] = useState([])
    const [miembros, setMiembros] = useState([])
    const [usuario, setUsuario] = useState(null)
    const [cargando, setCargando] = useState(true)
    const [categoriaLocal, setCategoriaLocal] = useState('Todas')
    const [vistaComunidades, setVistaComunidades] = useState('todas')
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

    // Emitir comunidades del usuario al padre cada vez que cambien membresías
    useEffect(() => {
        if (!onMisComunidadesChange || !usuario) return
        const misComs = comunidades.filter(c =>
            miembros.some(m => m.comunidadId === c.id && m.usuarioId === usuario.id)
        )
        onMisComunidadesChange(misComs)
    }, [miembros, comunidades, usuario])

    // Emitir comunidades que el usuario administra (creó)
    useEffect(() => {
        if (!onComunidadesAdminChange || !usuario) return
        const adminComs = comunidades.filter(c => c.creadoPor === usuario.id)
        onComunidadesAdminChange(adminComs)
    }, [comunidades, usuario])

    // Abrir modal admin cuando el sidebar solicita editar una comunidad
    useEffect(() => {
        if (!pedidoEdicion) return
        const comunidadReal = comunidades.find(c => c.id === pedidoEdicion.id) || pedidoEdicion
        setModalAdmin(comunidadReal)
        onPedidoEdicionConsumed?.()
    }, [pedidoEdicion])

    // Auto-abrir chat cuando se llega desde una notificación
    useEffect(() => {
        if (!abrirComunidadId || comunidades.length === 0 || comunidadChat) return
        const target = comunidades.find(c => c.id === abrirComunidadId)
        if (target) abrirChat(target)
    }, [abrirComunidadId, comunidades])

    const comunidadesFiltradas = useMemo(() => {
        return comunidades.filter(c => {
            const coincideCategoria = categoriaActiva === 'Todas' || c.categoria === categoriaActiva
            const coincideBusqueda =
                c.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                c.descripcion.toLowerCase().includes(busqueda.toLowerCase())
            const coincideVista = vistaComunidades === 'todas' || (usuario &&
                miembros.some(m => m.comunidadId === c.id && m.usuarioId === usuario.id))
            return coincideCategoria && coincideBusqueda && coincideVista
        })
    }, [comunidades, categoriaActiva, busqueda, vistaComunidades, miembros, usuario])

    const esMiembro = (comunidadId) => {
        if (!usuario) return false
        return miembros.some(m => m.comunidadId === comunidadId && m.usuarioId === usuario.id)
    }

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
            const { isConfirmed } = await Swal.fire({
                title: `¿Salir de "${comunidad.nombre}"?`,
                text: 'Ya no podrás ver el chat ni las convocatorias de esta comunidad.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí, salir',
                cancelButtonText: 'Cancelar',
                confirmButtonColor: '#ef4444',
                cancelButtonColor: '#94a3b8',
            })
            if (!isConfirmed) return
            try {
                await Fetch.deleteData(`miembros/${comunidad.id}/${usuario.id}`)
            } catch (err) {
                console.error('Error al salir:', err)
            }
            actualizarMiembros(miembros.filter(m => !(m.comunidadId === comunidad.id && m.usuarioId === usuario.id)))
            setComunidades(prev => prev.map(c => c.id === comunidad.id ? { ...c, totalMiembros: Math.max(0, c.totalMiembros - 1) } : c))
            if (comunidadChat?.id === comunidad.id) setComunidadChat(null)
            mostrarToast(`Saliste de "${comunidad.nombre}".`, 'info')
        } else {
            const { isConfirmed } = await Swal.fire({
                title: `¿Unirte a "${comunidad.nombre}"?`,
                text: 'Podrás participar en el chat y ver las convocatorias de esta comunidad.',
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Sí, unirme',
                cancelButtonText: 'Cancelar',
                confirmButtonColor: comunidad.color || '#0ea5e9',
                cancelButtonColor: '#94a3b8',
            })
            if (!isConfirmed) return
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
                setComunidades(prev => prev.map(c => c.id === comunidad.id ? { ...c, totalMiembros: c.totalMiembros + 1 } : c))
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
        window.scrollTo({ top: 0, behavior: 'instant' })
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
                    onVerDetalles={() => setModalCom(comunidadChat)}
                    onSalir={() => handleUnirse(comunidadChat)}
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

                    {/* Tabs: todas las comunidades / solo las mías */}
                    <section className="com-tabs-section">
                        <div className="com-tabs">
                            <button
                                className={`com-tab ${vistaComunidades === 'todas' ? 'com-tab--activa' : ''}`}
                                onClick={() => setVistaComunidades('todas')}
                            >
                                Todas las comunidades
                            </button>
                            <button
                                className={`com-tab ${vistaComunidades === 'mias' ? 'com-tab--activa' : ''}`}
                                onClick={() => setVistaComunidades('mias')}
                                disabled={!usuario}
                                title={!usuario ? 'Inicia sesión para ver tus comunidades' : undefined}
                            >
                                Mis comunidades
                                {usuario && miembros.length > 0 && (
                                    <span className="com-tab__badge">{miembros.length}</span>
                                )}
                            </button>
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
                                    const totalMiembros = com.totalMiembros
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
                                                                Ir al chat
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
                    onMiembroExpulsado={(idUsuario) => {
                        const nuevos = miembros.filter(m => !(m.comunidadId === modalAdmin.id && m.usuarioId === idUsuario))
                        actualizarMiembros(nuevos)
                    }}
                    onConvocatoriaCreada={() => mostrarToast('¡Convocatoria publicada!', 'exito')}
                    onMensajeChatEliminado={() => mostrarToast('Mensaje eliminado.', 'info')}
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
                                    <strong>{modalCom.totalMiembros}</strong>
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
