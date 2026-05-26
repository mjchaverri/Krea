import React, { useState, useEffect } from 'react'
import Fetch from '../../services/Fetch'
import Swal from 'sweetalert2'

function StatCard({ label, value, icon, iconColor, sub }) {
    return (
        <div style={{
            background: '#fff', borderRadius: 16, padding: '20px 24px',
            border: '1px solid #e8edf2', display: 'flex', alignItems: 'center',
            gap: 16, flex: 1, boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
        }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: iconColor + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span className="material-symbols-outlined" style={{ color: iconColor, fontSize: 24 }}>{icon}</span>
            </div>
            <div>
                <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.8, margin: 0 }}>{label}</p>
                <p style={{ fontSize: 28, fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-1px' }}>{value}</p>
                {sub && <p style={{ fontSize: 12, color: '#94a3b8', margin: '2px 0 0' }}>{sub}</p>}
            </div>
        </div>
    )
}

function Avatar({ nombre, img, size = 36 }) {
    return (
        <div style={{ width: size, height: size, borderRadius: '50%', background: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
            {img
                ? <img src={img} alt={nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <span style={{ fontSize: size * 0.38, fontWeight: 800, color: '#0ea5e9' }}>{(nombre || '?').charAt(0).toUpperCase()}</span>
            }
        </div>
    )
}

function TablaResenasAdmin() {
    const [resenas, setResenas] = useState([])
    const [cargando, setCargando] = useState(true)
    const [busqueda, setBusqueda] = useState('')

    useEffect(() => {
        Fetch.getData('resenas-perfil/admin/todas')
            .then(d => setResenas(Array.isArray(d) ? d : (d?.data || [])))
            .catch(() => {})
            .finally(() => setCargando(false))
    }, [])

    const totalSuspendidos = new Set(
        resenas.filter(r => r.autor?.bloqueado).map(r => r.autor?.id_usuario)
    ).size

    const promedioCalif = resenas.length
        ? (resenas.reduce((s, r) => s + (r.calificacion || 0), 0) / resenas.length).toFixed(1)
        : '—'

    const estrellas = (n) => '★'.repeat(n) + '☆'.repeat(5 - n)

    const bloquearCuenta = async (id_usuario, nombre, bloqueado) => {
        if (!bloqueado) {
            const { value: formVals, isConfirmed } = await Swal.fire({
                title: `Suspender a ${nombre}`,
                html: `
                    <select id="swal-dur" style="width:100%;padding:10px 14px;border:1px solid #e2e8f0;border-radius:8px;font-size:14px;margin-bottom:12px;outline:none">
                        <option value="1">1 día</option>
                        <option value="3">3 días</option>
                        <option value="7">7 días</option>
                        <option value="30">30 días</option>
                        <option value="0">Permanente</option>
                    </select>
                    <textarea id="swal-razon" placeholder="Motivo de la suspensión (opcional)" style="width:100%;padding:10px 14px;border:1px solid #e2e8f0;border-radius:8px;font-size:13px;resize:vertical;min-height:80px;outline:none;box-sizing:border-box"></textarea>
                `,
                icon: 'warning',
                showCancelButton: true, confirmButtonColor: '#ef4444', cancelButtonColor: '#64748b',
                confirmButtonText: 'Suspender', cancelButtonText: 'Cancelar',
                preConfirm: () => ({
                    duracion: document.getElementById('swal-dur').value,
                    razon: document.getElementById('swal-razon').value.trim(),
                }),
            })
            if (!isConfirmed) return
            try {
                const duracion = parseInt(formVals.duracion)
                await Fetch.patchData(`usuarios/${id_usuario}/bloquear`, {
                    duracion: duracion > 0 ? duracion : null,
                    razon: formVals.razon || null,
                })
                actualizarBloqueo(id_usuario, true)
                Swal.fire({ icon: 'success', title: 'Cuenta suspendida', timer: 1500, showConfirmButton: false })
            } catch (err) {
                Swal.fire({ icon: 'error', title: 'Error', text: err.message })
            }
        } else {
            const { isConfirmed } = await Swal.fire({
                title: '¿Reactivar cuenta?',
                html: `La cuenta de <strong>${nombre}</strong> volverá a estar activa.`,
                icon: 'question',
                showCancelButton: true, confirmButtonColor: '#10b981', cancelButtonColor: '#64748b',
                confirmButtonText: 'Sí, reactivar', cancelButtonText: 'Cancelar',
            })
            if (!isConfirmed) return
            try {
                await Fetch.patchData(`usuarios/${id_usuario}/bloquear`, { desbanear: true })
                actualizarBloqueo(id_usuario, false)
                Swal.fire({ icon: 'success', title: 'Cuenta reactivada', timer: 1500, showConfirmButton: false })
            } catch (err) {
                Swal.fire({ icon: 'error', title: 'Error', text: err.message })
            }
        }
    }

    const actualizarBloqueo = (id_usuario, nuevoBloqueado) => {
        setResenas(prev => prev.map(r => ({
            ...r,
            autor:    r.autor?.id_usuario    === id_usuario ? { ...r.autor,    bloqueado: nuevoBloqueado } : r.autor,
            receptor: r.receptor?.id_usuario === id_usuario ? { ...r.receptor, bloqueado: nuevoBloqueado } : r.receptor,
        })))
    }

    const eliminarResena = async (id_resena_perfil) => {
        const { isConfirmed } = await Swal.fire({
            title: '¿Eliminar reseña?', text: 'Esta acción no se puede deshacer.', icon: 'warning',
            showCancelButton: true, confirmButtonColor: '#ef4444', cancelButtonColor: '#64748b',
            confirmButtonText: 'Sí, eliminar', cancelButtonText: 'Cancelar',
        })
        if (!isConfirmed) return
        try {
            await Fetch.deleteData(`resenas-perfil/${id_resena_perfil}`)
            setResenas(prev => prev.filter(r => r.id_resena_perfil !== id_resena_perfil))
            Swal.fire({ icon: 'success', title: 'Reseña eliminada', timer: 1500, showConfirmButton: false })
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Error', text: err.message })
        }
    }

    const resenasFiltradas = resenas.filter(r => {
        if (!busqueda) return true
        const t = busqueda.toLowerCase()
        return (
            r.autor?.nombre_completo?.toLowerCase().includes(t) ||
            r.receptor?.nombre_completo?.toLowerCase().includes(t) ||
            r.comentarios?.toLowerCase().includes(t)
        )
    })

    return (
        <div style={{ padding: '28px 32px', minHeight: '100%' }}>

            {/* Header */}
            <div style={{ marginBottom: 28 }}>
                <h2 style={{ fontSize: 24, fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-0.5px' }}>Reseñas de Perfiles</h2>
                <p style={{ fontSize: 13, color: '#94a3b8', margin: '6px 0 0' }}>
                    Modera las reseñas entre usuarios. Las reseñas de portafolios se gestionan desde la sección de Portafolios.
                </p>
            </div>

            {/* Stats */}
            {!cargando && (
                <div style={{ display: 'flex', gap: 20, marginBottom: 28 }}>
                    <StatCard label="Total de reseñas" value={resenas.length} icon="reviews" iconColor="#0ea5e9" />
                    <StatCard label="Calificación promedio" value={promedioCalif} icon="star" iconColor="#f59e0b" sub="Sobre 5 estrellas" />
                    <StatCard label="Autores suspendidos" value={totalSuspendidos} icon="block" iconColor="#ef4444" />
                </div>
            )}

            {/* Buscador */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '10px 16px', marginBottom: 20, maxWidth: 400, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#94a3b8' }}>search</span>
                <input type="text" value={busqueda} onChange={e => setBusqueda(e.target.value)}
                    placeholder="Buscar por usuario o contenido..."
                    style={{ border: 'none', outline: 'none', fontSize: 13, color: '#334155', flex: 1, background: 'transparent' }} />
                {busqueda && <button onClick={() => setBusqueda('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>close</span>
                </button>}
            </div>

            {cargando ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200, color: '#94a3b8' }}>
                    <span className="material-symbols-outlined" style={{ marginRight: 8 }}>progress_activity</span>
                    Cargando reseñas...
                </div>
            ) : resenasFiltradas.length === 0 ? (
                <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e8edf2', padding: '60px', textAlign: 'center' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 40, color: '#e2e8f0', display: 'block', marginBottom: 12 }}>reviews</span>
                    <p style={{ color: '#94a3b8', fontSize: 14, margin: 0 }}>
                        {busqueda ? 'No hay reseñas que coincidan con la búsqueda.' : 'No hay reseñas de perfiles.'}
                    </p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {resenasFiltradas.map(r => (
                        <div key={r.id_resena_perfil} style={{
                            background: '#fff', border: '1px solid #e8edf2', borderRadius: 14,
                            padding: '16px 20px', display: 'flex', gap: 16, alignItems: 'flex-start',
                            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                        }}>
                            <Avatar nombre={r.autor?.nombre_completo} img={r.autor?.img_perfil} />

                            <div style={{ flex: 1, minWidth: 0 }}>
                                {/* Autor → Receptor */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 6 }}>
                                    <span style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>
                                        {r.autor?.nombre_completo || 'Desconocido'}
                                    </span>
                                    {r.autor?.bloqueado && (
                                        <span style={{ fontSize: 10, fontWeight: 700, padding: '1px 7px', borderRadius: 10, background: '#fef2f2', color: '#dc2626' }}>SUSPENDIDO</span>
                                    )}
                                    <span className="material-symbols-outlined" style={{ fontSize: 14, color: '#94a3b8' }}>arrow_forward</span>
                                    <span style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>
                                        {r.receptor?.nombre_completo || 'Desconocido'}
                                    </span>
                                    <span style={{ color: '#f59e0b', fontSize: 13, marginLeft: 'auto' }}>{estrellas(r.calificacion)}</span>
                                </div>

                                <p style={{ fontSize: 13, color: '#374151', margin: '0 0 6px', lineHeight: 1.5 }}>{r.comentarios}</p>

                                <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>
                                    {r.createdAt ? new Date(r.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                                </p>
                            </div>

                            {/* Acciones */}
                            <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                                <button
                                    onClick={() => bloquearCuenta(r.autor?.id_usuario, r.autor?.nombre_completo, r.autor?.bloqueado)}
                                    title={r.autor?.bloqueado ? 'Reactivar cuenta del autor' : 'Suspender cuenta del autor'}
                                    style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: r.autor?.bloqueado ? '#10b981' : '#94a3b8', transition: 'all 0.15s' }}
                                    onMouseEnter={e => { e.currentTarget.style.background = r.autor?.bloqueado ? '#f0fdf4' : '#fef3c7'; e.currentTarget.style.color = r.autor?.bloqueado ? '#10b981' : '#f59e0b' }}
                                    onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = r.autor?.bloqueado ? '#10b981' : '#94a3b8' }}
                                >
                                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>{r.autor?.bloqueado ? 'lock_open' : 'block'}</span>
                                </button>
                                <button
                                    onClick={() => eliminarResena(r.id_resena_perfil)}
                                    title="Eliminar reseña"
                                    style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', transition: 'all 0.15s' }}
                                    onMouseEnter={e => { e.currentTarget.style.background = '#fef2f2'; e.currentTarget.style.color = '#ef4444' }}
                                    onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#94a3b8' }}
                                >
                                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>delete</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default TablaResenasAdmin
