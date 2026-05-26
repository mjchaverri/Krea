import { useState, useEffect } from 'react'
import Fetch from '../../services/Fetch'
import Swal from 'sweetalert2'

function ModalResenasPortafolio({ portafolio, onClose }) {
    const [resenas, setResenas] = useState([])
    const [cargando, setCargando] = useState(true)

    useEffect(() => {
        if (!portafolio) return
        setCargando(true)
        Fetch.getData(`resenas/portafolio/${portafolio.id}`)
            .then(data => setResenas(Array.isArray(data) ? data : (data?.data || [])))
            .catch(() => setResenas([]))
            .finally(() => setCargando(false))
    }, [portafolio])

    const promedio = resenas.length
        ? (resenas.reduce((s, r) => s + (r.calificacion || 0), 0) / resenas.length).toFixed(1)
        : null

    const estrellas = (n) => '★'.repeat(n) + '☆'.repeat(5 - n)

    const eliminarResena = async (id_resena, autor) => {
        const { isConfirmed } = await Swal.fire({
            title: '¿Eliminar reseña?',
            html: `Se eliminará la reseña de <strong>${autor}</strong>.`,
            icon: 'warning',
            showCancelButton: true, confirmButtonColor: '#ef4444', cancelButtonColor: '#64748b',
            confirmButtonText: 'Sí, eliminar', cancelButtonText: 'Cancelar',
        })
        if (!isConfirmed) return
        try {
            await Fetch.deleteData(`resenas/${id_resena}`)
            setResenas(prev => prev.filter(r => r.id_resena !== id_resena))
            Swal.fire({ icon: 'success', title: 'Reseña eliminada', timer: 1200, showConfirmButton: false })
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Error', text: err.message })
        }
    }

    const bloquearAutor = async (id_usuario, nombre, bloqueado) => {
        const { isConfirmed } = await Swal.fire({
            title: bloqueado ? '¿Reactivar cuenta?' : '¿Suspender cuenta?',
            html: bloqueado
                ? `La cuenta de <strong>${nombre}</strong> será reactivada.`
                : `La cuenta de <strong>${nombre}</strong> quedará suspendida.`,
            icon: bloqueado ? 'question' : 'warning',
            showCancelButton: true,
            confirmButtonColor: bloqueado ? '#10b981' : '#ef4444',
            cancelButtonColor: '#64748b',
            confirmButtonText: bloqueado ? 'Sí, reactivar' : 'Sí, suspender',
            cancelButtonText: 'Cancelar',
        })
        if (!isConfirmed) return

        if (!bloqueado) {
            // Pedir duración y razón
            const { value: formVals, isConfirmed: ok } = await Swal.fire({
                title: 'Detalles de la suspensión',
                html: `
                    <select id="swal-dur" style="width:100%;padding:10px 14px;border:1px solid #e2e8f0;border-radius:8px;font-size:14px;margin-bottom:12px;outline:none">
                        <option value="1">1 día</option>
                        <option value="3">3 días</option>
                        <option value="7">7 días</option>
                        <option value="30">30 días</option>
                        <option value="0">Permanente</option>
                    </select>
                    <textarea id="swal-razon" placeholder="Motivo (opcional)" style="width:100%;padding:10px 14px;border:1px solid #e2e8f0;border-radius:8px;font-size:13px;resize:vertical;min-height:72px;outline:none;box-sizing:border-box"></textarea>
                `,
                showCancelButton: true, confirmButtonColor: '#ef4444', cancelButtonColor: '#64748b',
                confirmButtonText: 'Suspender', cancelButtonText: 'Cancelar',
                preConfirm: () => ({
                    duracion: document.getElementById('swal-dur').value,
                    razon: document.getElementById('swal-razon').value.trim(),
                }),
            })
            if (!ok) return
            try {
                const duracion = parseInt(formVals.duracion)
                await Fetch.patchData(`usuarios/${id_usuario}/bloquear`, {
                    duracion: duracion > 0 ? duracion : null,
                    razon: formVals.razon || null,
                })
                setResenas(prev => prev.map(r =>
                    r.id_usuario === id_usuario ? { ...r, _bloqueado: true } : r
                ))
                Swal.fire({ icon: 'success', title: 'Cuenta suspendida', timer: 1200, showConfirmButton: false })
            } catch (err) {
                Swal.fire({ icon: 'error', title: 'Error', text: err.message })
            }
        } else {
            try {
                await Fetch.patchData(`usuarios/${id_usuario}/bloquear`, { desbanear: true })
                setResenas(prev => prev.map(r =>
                    r.id_usuario === id_usuario ? { ...r, _bloqueado: false } : r
                ))
                Swal.fire({ icon: 'success', title: 'Cuenta reactivada', timer: 1200, showConfirmButton: false })
            } catch (err) {
                Swal.fire({ icon: 'error', title: 'Error', text: err.message })
            }
        }
    }

    if (!portafolio) return null

    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)', padding: 16 }}
            onClick={onClose}>
            <div style={{ background: '#fff', borderRadius: 20, boxShadow: '0 24px 64px rgba(0,0,0,0.18)', width: '100%', maxWidth: 560, maxHeight: '85vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', fontFamily: "'Inter', sans-serif" }}
                onClick={e => e.stopPropagation()}>

                {/* Header */}
                <div style={{ padding: '20px 24px 14px', borderBottom: '1px solid #f1f5f9', flexShrink: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                        <div>
                            <h3 style={{ fontSize: 15, fontWeight: 800, color: '#0f172a', margin: '0 0 2px' }}>
                                Reseñas — {portafolio.titulo || 'Portafolio'}
                            </h3>
                            <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>
                                {resenas.length} reseña{resenas.length !== 1 ? 's' : ''}
                                {promedio && ` · Promedio ${promedio} ★`}
                            </p>
                        </div>
                        <button onClick={onClose} style={{ background: '#f1f5f9', border: 'none', borderRadius: 8, width: 30, height: 30, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', flexShrink: 0 }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>close</span>
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div style={{ overflowY: 'auto', flex: 1, padding: '16px 24px' }}>
                    {cargando ? (
                        <p style={{ color: '#94a3b8', textAlign: 'center', padding: '32px 0' }}>Cargando reseñas...</p>
                    ) : resenas.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '48px 0' }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 40, color: '#e2e8f0', display: 'block', marginBottom: 12 }}>star_border</span>
                            <p style={{ color: '#94a3b8', fontSize: 14, margin: 0 }}>Este portafolio no tiene reseñas.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {resenas.map(r => {
                                const nombreAutor = r.Usuario?.nombre_completo || r.nombre_usuario || `Usuario #${r.id_usuario}`
                                const imgAutor = r.Usuario?.img_perfil || null
                                const estaBloqueado = r._bloqueado ?? r.Usuario?.bloqueado ?? false
                                return (
                                    <div key={r.id_resena} style={{ background: '#f8fafc', border: '1px solid #e8edf2', borderRadius: 12, padding: '14px 16px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                                        {/* Avatar */}
                                        <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                                            {imgAutor
                                                ? <img src={imgAutor} alt={nombreAutor} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                : <span style={{ fontSize: 13, fontWeight: 800, color: '#0ea5e9' }}>{nombreAutor.charAt(0).toUpperCase()}</span>
                                            }
                                        </div>

                                        {/* Contenido */}
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2, flexWrap: 'wrap' }}>
                                                <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{nombreAutor}</span>
                                                {estaBloqueado && <span style={{ fontSize: 10, fontWeight: 700, padding: '1px 7px', borderRadius: 10, background: '#fef2f2', color: '#dc2626' }}>SUSPENDIDO</span>}
                                                <span style={{ fontSize: 13, color: '#f59e0b', marginLeft: 'auto' }}>{estrellas(r.calificacion)}</span>
                                            </div>
                                            <p style={{ fontSize: 13, color: '#374151', margin: '0 0 6px', lineHeight: 1.5 }}>{r.comentarios}</p>
                                            <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>
                                                {r.createdAt ? new Date(r.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
                                            </p>
                                        </div>

                                        {/* Acciones */}
                                        <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                                            <button
                                                onClick={() => bloquearAutor(r.id_usuario, nombreAutor, estaBloqueado)}
                                                title={estaBloqueado ? 'Reactivar cuenta' : 'Suspender cuenta del autor'}
                                                style={{ width: 30, height: 30, borderRadius: 7, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: estaBloqueado ? '#10b981' : '#94a3b8', transition: 'all 0.15s' }}
                                                onMouseEnter={e => { e.currentTarget.style.background = estaBloqueado ? '#f0fdf4' : '#fef3c7'; e.currentTarget.style.color = estaBloqueado ? '#10b981' : '#f59e0b' }}
                                                onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = estaBloqueado ? '#10b981' : '#94a3b8' }}
                                            >
                                                <span className="material-symbols-outlined" style={{ fontSize: 15 }}>{estaBloqueado ? 'lock_open' : 'block'}</span>
                                            </button>
                                            <button
                                                onClick={() => eliminarResena(r.id_resena, nombreAutor)}
                                                title="Eliminar reseña"
                                                style={{ width: 30, height: 30, borderRadius: 7, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', transition: 'all 0.15s' }}
                                                onMouseEnter={e => { e.currentTarget.style.background = '#fef2f2'; e.currentTarget.style.color = '#ef4444' }}
                                                onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#94a3b8' }}
                                            >
                                                <span className="material-symbols-outlined" style={{ fontSize: 15 }}>delete</span>
                                            </button>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ModalResenasPortafolio
