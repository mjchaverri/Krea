import React, { useState, useEffect } from 'react'
import Fetch from '../../services/Fetch'
import Swal from 'sweetalert2'
import { normalizarUsuario, normalizarPortafolio, normalizarResena } from '../../utils/normalizers'
import { calcularPromedio } from '../../utils/calcularPromedio'

// ── Sub-modal: perfil completo de un participante ──────────────────────────
function ModalPerfilParticipante({ usuario, onClose, onEliminar }) {
    const [portafolios, setPortafolios] = useState([])
    const [resenas,     setResenas]     = useState([])
    const [cargando,    setCargando]    = useState(true)

    useEffect(() => {
        if (!usuario) return
        Promise.all([
            Fetch.getData(`portafolios?id_usuario=${usuario.id}&limit=50`),
            Fetch.getData(`resenas?limit=200`),
        ]).then(([p, r]) => {
            const ports = (p || []).map(normalizarPortafolio)
            setPortafolios(ports)
            const resenasUsuario = (r || [])
                .map(normalizarResena)
                .filter(re => ports.some(po => String(po.id) === String(re.portafolioId)))
            setResenas(resenasUsuario)
        }).catch(console.error).finally(() => setCargando(false))
    }, [usuario])

    if (!usuario) return null

    const promedio  = calcularPromedio(resenas)
    const ubicacion = [usuario.Provincias, usuario.Canton, usuario.Distrito].filter(Boolean).join(', ')

    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 10001, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', padding: 16 }}>
            <div style={{ background: '#fff', borderRadius: 20, boxShadow: '0 20px 60px rgba(0,0,0,0.2)', width: '100%', maxWidth: 480, maxHeight: '88vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid #f1f5f9', flexShrink: 0 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', margin: 0 }}>Perfil del Participante</h3>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 4 }}>
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div style={{ overflowY: 'auto', flex: 1, padding: '20px 24px' }}>
                    {/* Avatar + info */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                        <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                            {usuario.img
                                ? <img src={usuario.img} alt={usuario.Nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                : <span style={{ fontSize: 22, fontWeight: 800, color: '#0ea5e9' }}>{usuario.Nombre?.charAt(0)}</span>
                            }
                        </div>
                        <div>
                            <p style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', margin: '0 0 2px' }}>{usuario.Nombre}</p>
                            <p style={{ fontSize: 13, color: '#94a3b8', margin: 0 }}>{usuario.Correo}</p>
                            {usuario.Telefono && <p style={{ fontSize: 12, color: '#94a3b8', margin: '2px 0 0' }}>{usuario.Telefono}</p>}
                        </div>
                    </div>

                    {/* Stats grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
                        {[
                            { label: 'Ubicación',          value: ubicacion || '—' },
                            { label: 'Portafolios',         value: cargando ? '…' : portafolios.length },
                            { label: 'Reseñas recibidas',   value: cargando ? '…' : resenas.length },
                            { label: 'Calificación prom.',  value: cargando ? '…' : (resenas.length ? promedio : '—') },
                        ].map(({ label, value }) => (
                            <div key={label} style={{ background: '#f8fafc', borderRadius: 12, padding: '12px 14px', border: '1px solid #f1f5f9' }}>
                                <p style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.8, margin: '0 0 4px' }}>{label}</p>
                                <p style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', margin: 0 }}>{value}</p>
                            </div>
                        ))}
                    </div>

                    {/* Portafolios */}
                    {!cargando && portafolios.length > 0 && (
                        <div>
                            <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.8, margin: '0 0 10px' }}>Portafolios</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                {portafolios.map(p => (
                                    <div key={p.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: 10, padding: '10px 14px' }}>
                                        <div style={{ minWidth: 0 }}>
                                            <p style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.titulo || 'Sin título'}</p>
                                            <p style={{ fontSize: 11, color: '#94a3b8', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.descripcion || 'Sin descripción'}</p>
                                        </div>
                                        <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 20, background: p.pdf ? '#dcfce7' : '#fef3c7', color: p.pdf ? '#16a34a' : '#d97706', flexShrink: 0, marginLeft: 8 }}>
                                            {p.pdf ? 'Publicado' : 'Pendiente'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div style={{ padding: '16px 24px', borderTop: '1px solid #f1f5f9', display: 'flex', gap: 12, flexShrink: 0 }}>
                    <button onClick={onClose} style={{ flex: 1, border: '1px solid #e2e8f0', background: '#fff', color: '#64748b', fontWeight: 600, fontSize: 14, padding: '10px', borderRadius: 10, cursor: 'pointer' }}>
                        Cerrar
                    </button>
                    <button onClick={onEliminar} style={{ flex: 1, background: '#ef4444', color: '#fff', fontWeight: 700, fontSize: 14, padding: '10px', borderRadius: 10, cursor: 'pointer', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>person_remove</span>
                        Eliminar participante
                    </button>
                </div>
            </div>
        </div>
    )
}

// ── Modal principal: detalle de convocatoria ───────────────────────────────
function ModalDetalleConvocatoria({ convocatoria, onClose, onActualizar }) {
    const [modoEdicion,   setModoEdicion]   = useState(false)
    const [form,          setForm]          = useState({
        nombre:       convocatoria.nombre      || '',
        descripcion:  convocatoria.descripcion || '',
        fecha_cierre: convocatoria.fecha_cierre ? convocatoria.fecha_cierre.slice(0, 10) : '',
        id_comunidad: convocatoria.Comunidad?.id_comunidad ?? convocatoria.id_comunidad ?? '',
    })
    const [guardando,     setGuardando]     = useState(false)
    const [participantes, setParticipantes] = useState([])
    const [cargandoPartic, setCargandoPartic] = useState(true)
    const [perfilAbierto, setPerfilAbierto] = useState(null)
    const [comunidades,   setComunidades]   = useState([])
    const [cargandoComs,  setCargandoComs]  = useState(true)

    const hoy    = new Date()
    const activa = convocatoria.fecha_cierre ? new Date(convocatoria.fecha_cierre) >= hoy : true

    useEffect(() => {
        // Cargar participantes
        Fetch.getData(`convocatorias/${convocatoria.id_convocatoria}/participantes`)
            .then(data => setParticipantes(data || []))
            .catch(console.error)
            .finally(() => setCargandoPartic(false))

        // Cargar todas las comunidades para el selector
        Fetch.getData('comunidades?limit=200')
            .then(data => setComunidades(data || []))
            .catch(console.error)
            .finally(() => setCargandoComs(false))
    }, [convocatoria.id_convocatoria, convocatoria.id_usuario])

    const guardarEdicion = async () => {
        if (!form.nombre.trim() || !form.descripcion.trim() || !form.fecha_cierre) {
            Swal.fire({ icon: 'warning', title: 'Completa todos los campos obligatorios', timer: 2000, showConfirmButton: false })
            return
        }
        setGuardando(true)
        Swal.fire({ title: 'Guardando cambios...', allowOutsideClick: false, didOpen: () => Swal.showLoading() })
        try {
            await Fetch.putData(`convocatorias/${convocatoria.id_convocatoria}`, {
                nombre:       form.nombre,
                descripcion:  form.descripcion,
                fecha_cierre: form.fecha_cierre,
                id_comunidad: form.id_comunidad || null,
            })
            Swal.fire({ icon: 'success', title: 'Convocatoria actualizada', timer: 1500, showConfirmButton: false })
            setModoEdicion(false)
            onActualizar?.()
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Error al guardar', text: err.message || 'Intenta de nuevo.' })
        } finally {
            setGuardando(false)
        }
    }

    const cancelarEdicion = () => {
        setModoEdicion(false)
        setForm({
            nombre:       convocatoria.nombre      || '',
            descripcion:  convocatoria.descripcion || '',
            fecha_cierre: convocatoria.fecha_cierre ? convocatoria.fecha_cierre.slice(0, 10) : '',
            id_comunidad: convocatoria.Comunidad?.id_comunidad ?? convocatoria.id_comunidad ?? '',
        })
    }

    const eliminarParticipante = async (participante) => {
        const nombre = participante.Usuario?.nombre_completo || 'este participante'
        const { isConfirmed } = await Swal.fire({
            title: '¿Eliminar participante?',
            html: `Se eliminará a <strong>${nombre}</strong> de esta convocatoria.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
        })
        if (!isConfirmed) return
        Swal.fire({ title: 'Eliminando participante...', allowOutsideClick: false, didOpen: () => Swal.showLoading() })
        try {
            await Fetch.deleteData(`convocatorias/${convocatoria.id_convocatoria}/participantes/${participante.id_usuario}`)
            setParticipantes(prev => prev.filter(p => p.id_usuario !== participante.id_usuario))
            setPerfilAbierto(null)
            Swal.fire({ icon: 'success', title: 'Participante eliminado', timer: 1500, showConfirmButton: false })
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Error', text: err.message || 'No se pudo eliminar.' })
        }
    }

    const usuarioDeParticipante = (p) => normalizarUsuario({
        id_usuario:      p.id_usuario,
        nombre_completo: p.Usuario?.nombre_completo,
        nombre_usuario:  p.Usuario?.nombre_usuario,
        correo:          p.Usuario?.correo      || '',
        telefono:        p.Usuario?.telefono    || '',
        provincia:       p.Usuario?.provincia   || '',
        canton:          p.Usuario?.canton      || '',
        distrito:        p.Usuario?.distrito    || '',
        img_perfil:      p.Usuario?.img_perfil  || '',
        id_rol:          p.Usuario?.id_rol,
    })

    const inputCls = { width: '100%', border: '1px solid #e2e8f0', borderRadius: 10, padding: '10px 14px', fontSize: 14, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }
    const labelCls = { display: 'block', fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }

    return (
        <>
            <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', padding: 16 }}>
                <div style={{ background: '#fff', borderRadius: 20, boxShadow: '0 20px 60px rgba(0,0,0,0.2)', width: '100%', maxWidth: 640, maxHeight: '92vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

                    {/* Header */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid #f1f5f9', flexShrink: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                            <span style={{
                                fontSize: 10, fontWeight: 700, padding: '4px 10px', borderRadius: 20, flexShrink: 0,
                                background: activa ? '#dcfce7' : '#fee2e2',
                                color: activa ? '#16a34a' : '#dc2626',
                            }}>
                                {activa ? 'ACTIVA' : 'CERRADA'}
                            </span>
                            <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {modoEdicion ? 'Editar convocatoria' : convocatoria.nombre}
                            </h3>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                            {!modoEdicion && (
                                <button onClick={() => setModoEdicion(true)} style={{
                                    display: 'flex', alignItems: 'center', gap: 6,
                                    background: '#f0f9ff', color: '#0ea5e9', border: 'none', cursor: 'pointer',
                                    padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 700,
                                }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>edit</span>
                                    Editar
                                </button>
                            )}
                            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 4 }}>
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                    </div>

                    {/* Body */}
                    <div style={{ overflowY: 'auto', flex: 1, padding: '24px' }}>

                        {/* ── Modo edición ── */}
                        {modoEdicion ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                <div>
                                    <label style={labelCls}>Nombre de la convocatoria</label>
                                    <input type="text" value={form.nombre}
                                        onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))}
                                        style={inputCls} />
                                </div>
                                <div>
                                    <label style={labelCls}>Descripción</label>
                                    <textarea rows={5} value={form.descripcion}
                                        onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))}
                                        style={{ ...inputCls, resize: 'vertical' }} />
                                </div>
                                <div>
                                    <label style={labelCls}>Comunidad asignada (opcional)</label>
                                    <select value={form.id_comunidad}
                                        onChange={e => setForm(f => ({ ...f, id_comunidad: e.target.value }))}
                                        style={{ ...inputCls, color: form.id_comunidad ? '#0f172a' : '#94a3b8', background: '#fff' }}>
                                        <option value="">Sin comunidad asignada</option>
                                        {comunidades.map(c => (
                                            <option key={c.id_comunidad} value={c.id_comunidad}>{c.icono} {c.nombre}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label style={labelCls}>Fecha de cierre</label>
                                    <input type="date" value={form.fecha_cierre}
                                        onChange={e => setForm(f => ({ ...f, fecha_cierre: e.target.value }))}
                                        style={inputCls} />
                                </div>
                            </div>

                        ) : (
                            /* ── Modo vista ── */
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

                                {/* Descripción */}
                                <div>
                                    <p style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.8, margin: '0 0 8px' }}>Descripción</p>
                                    <p style={{ fontSize: 14, color: '#334155', lineHeight: 1.7, margin: 0 }}>{convocatoria.descripcion || '—'}</p>
                                </div>

                                {/* Fecha cierre */}
                                <div style={{ background: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: 12, padding: '14px 16px' }}>
                                    <p style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.8, margin: '0 0 4px' }}>Fecha de cierre</p>
                                    <p style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: 0 }}>
                                        {convocatoria.fecha_cierre
                                            ? new Date(convocatoria.fecha_cierre).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
                                            : '—'}
                                    </p>
                                </div>

                                {/* Comunidad asignada */}
                                <div>
                                    <p style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.8, margin: '0 0 10px' }}>
                                        Comunidad asignada
                                    </p>
                                    {(() => {
                                        const com = convocatoria.Comunidad
                                            || comunidades.find(c => String(c.id_comunidad) === String(convocatoria.id_comunidad))
                                        if (cargandoComs) return (
                                            <p style={{ fontSize: 13, color: '#94a3b8', fontStyle: 'italic' }}>Cargando...</p>
                                        )
                                        if (!com) return (
                                            <div style={{ background: '#f8fafc', border: '1px dashed #e2e8f0', borderRadius: 12, padding: '16px', display: 'flex', alignItems: 'center', gap: 10 }}>
                                                <span className="material-symbols-outlined" style={{ color: '#cbd5e1', fontSize: 20 }}>group_off</span>
                                                <span style={{ fontSize: 13, color: '#94a3b8', fontStyle: 'italic' }}>Sin comunidad asignada</span>
                                            </div>
                                        )
                                        return (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: 12, padding: '12px 16px' }}>
                                                <span style={{
                                                    width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                                                    background: com.ColorClaro || '#e0f2fe',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
                                                }}>
                                                    {com.icono || '🌐'}
                                                </span>
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <p style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{com.nombre}</p>
                                                    <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>{com.Categoria?.nombre || 'Sin categoría'}</p>
                                                </div>
                                                <span style={{
                                                    fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 20,
                                                    background: (com.Color || '#0ea5e9') + '25',
                                                    color: com.Color || '#0ea5e9', flexShrink: 0,
                                                }}>
                                                    {com.Categoria?.nombre || 'Comunidad'}
                                                </span>
                                            </div>
                                        )
                                    })()}
                                </div>
                            </div>
                        )}

                        {/* ── Participantes (siempre visible) ── */}
                        <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid #f1f5f9' }}>
                            <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.8, margin: '0 0 12px' }}>
                                Participantes ({participantes.length})
                            </p>

                            {cargandoPartic ? (
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#94a3b8', fontSize: 13 }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>progress_activity</span>
                                    Cargando participantes...
                                </div>
                            ) : participantes.length === 0 ? (
                                <div style={{ background: '#f8fafc', border: '1px dashed #e2e8f0', borderRadius: 12, padding: '24px', textAlign: 'center' }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: 32, color: '#e2e8f0', display: 'block', marginBottom: 8 }}>group_off</span>
                                    <p style={{ fontSize: 13, color: '#94a3b8', margin: 0 }}>Nadie ha participado aún.</p>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                    {participantes.map((p, i) => {
                                        const nombre  = p.Usuario?.nombre_completo || 'Usuario desconocido'
                                        const inicial = nombre.charAt(0).toUpperCase()
                                        return (
                                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: 12, padding: '10px 14px', transition: 'border-color 0.15s' }}
                                                onMouseEnter={e => e.currentTarget.style.borderColor = '#e2e8f0'}
                                                onMouseLeave={e => e.currentTarget.style.borderColor = '#f1f5f9'}>
                                                <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                                                    {p.Usuario?.img_perfil
                                                        ? <img src={p.Usuario.img_perfil} alt={nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                        : <span style={{ fontSize: 14, fontWeight: 800, color: '#0ea5e9' }}>{inicial}</span>
                                                    }
                                                </div>
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <p style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{nombre}</p>
                                                    <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>@{p.Usuario?.nombre_usuario || '—'}</p>
                                                </div>
                                                <button onClick={() => setPerfilAbierto(p)} style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#0ea5e9', color: '#fff', border: 'none', cursor: 'pointer', padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
                                                    <span className="material-symbols-outlined" style={{ fontSize: 14 }}>person</span>
                                                    Ver perfil
                                                </button>
                                                <button onClick={() => eliminarParticipante(p)} title="Eliminar participante" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#cbd5e1', padding: '6px', borderRadius: 8, display: 'flex', alignItems: 'center', transition: 'all 0.15s' }}
                                                    onMouseEnter={e => { e.currentTarget.style.background = '#fef2f2'; e.currentTarget.style.color = '#ef4444' }}
                                                    onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#cbd5e1' }}>
                                                    <span className="material-symbols-outlined" style={{ fontSize: 20 }}>person_remove</span>
                                                </button>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer — solo en modo edición */}
                    {modoEdicion && (
                        <div style={{ padding: '16px 24px', borderTop: '1px solid #f1f5f9', display: 'flex', gap: 12, flexShrink: 0 }}>
                            <button onClick={cancelarEdicion} style={{ flex: 1, border: '1px solid #e2e8f0', background: '#fff', color: '#64748b', fontWeight: 600, fontSize: 14, padding: '10px', borderRadius: 10, cursor: 'pointer' }}>
                                Cancelar
                            </button>
                            <button onClick={guardarEdicion} disabled={guardando} style={{ flex: 1, background: '#0ea5e9', color: '#fff', fontWeight: 700, fontSize: 14, padding: '10px', borderRadius: 10, cursor: 'pointer', border: 'none', opacity: guardando ? 0.7 : 1 }}>
                                {guardando ? 'Guardando...' : 'Guardar cambios'}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Sub-modal perfil */}
            {perfilAbierto && (
                <ModalPerfilParticipante
                    usuario={usuarioDeParticipante(perfilAbierto)}
                    onClose={() => setPerfilAbierto(null)}
                    onEliminar={() => eliminarParticipante(perfilAbierto)}
                />
            )}
        </>
    )
}

export default ModalDetalleConvocatoria
