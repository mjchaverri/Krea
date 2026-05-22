import React, { useState, useEffect } from 'react'
import Fetch from '../../services/Fetch'
import { normalizarUsuario } from '../../utils/normalizers'
import Swal from 'sweetalert2'
import Paginacion from './Paginacion'
import ModalDetalleConvocatoria from './ModalDetalleConvocatoria'

const FORM_VACIO = { nombre: '', descripcion: '', fecha_cierre: '', id_comunidad: '' }
const POR_PAGINA = 8

function StatCard({ label, value, sub, icon, iconColor, badge, badgeText, badgeColor }) {
    return (
        <div style={{
            background: '#fff', borderRadius: 16, padding: '20px 24px',
            border: '1px solid #e8edf2', display: 'flex', alignItems: 'center',
            gap: 16, flex: 1, boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
        }}>
            <div style={{
                width: 48, height: 48, borderRadius: 14, background: iconColor + '20',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
                <span className="material-symbols-outlined" style={{ color: iconColor, fontSize: 24 }}>{icon}</span>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                    <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.8, margin: 0 }}>{label}</p>
                    {badge && <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 20, background: badgeColor + '20', color: badgeColor, flexShrink: 0 }}>{badgeText}</span>}
                </div>
                <p style={{ fontSize: 28, fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-1px', lineHeight: 1.1 }}>{value}</p>
                {sub && <p style={{ fontSize: 12, color: '#94a3b8', margin: '4px 0 0' }}>{sub}</p>}
            </div>
        </div>
    )
}

function TablaConvocatoriasAdmin() {
    const [convocatorias, setConvocatorias] = useState([])
    const [usuarios,      setUsuarios]      = useState([])
    const [cargando,      setCargando]      = useState(true)
    const [filtroEstado,  setFiltroEstado]  = useState('todas')
    const [modalAbierto,  setModalAbierto]  = useState(false)
    const [form,          setForm]          = useState(FORM_VACIO)
    const [guardando,     setGuardando]     = useState(false)
    const [pagina,        setPagina]        = useState(1)
    const [convocatoriaDetalle, setConvocatoriaDetalle] = useState(null)
    const [busqueda, setBusqueda] = useState('')
    const [comunidades, setComunidades] = useState([])

    const cerrarModal = async () => {
        const sucio = form.nombre || form.descripcion || form.fecha_cierre
        if (sucio) {
            const { isConfirmed } = await Swal.fire({
                title: '¿Descartar cambios?', text: 'Los datos ingresados se perderán.', icon: 'question',
                showCancelButton: true, confirmButtonText: 'Sí, descartar',
                cancelButtonText: 'Seguir editando', confirmButtonColor: '#64748b',
            })
            if (!isConfirmed) return
        }
        setModalAbierto(false)
        setForm(FORM_VACIO)
    }

    const cargarConvocatorias = async () => {
        const data = await Fetch.getData('convocatorias?limit=100')
        setConvocatorias(data || [])
    }

    useEffect(() => {
        async function cargar() {
            try {
                const [resC, resU, resComm] = await Promise.all([
                    Fetch.getData('convocatorias?limit=100'),
                    Fetch.getData('usuarios?limit=200'),
                    Fetch.getData('comunidades?limit=200'),
                ])
                setConvocatorias(resC || [])
                setUsuarios((resU || []).map(normalizarUsuario))
                setComunidades(resComm || [])
            } catch (err) {
                console.error(err)
            } finally {
                setCargando(false)
            }
        }
        cargar()
    }, [])

    const eliminarConvocatoria = async (id, nombre) => {
        const { isConfirmed } = await Swal.fire({
            title: '¿Eliminar convocatoria?',
            html: `Se eliminará <strong>${nombre}</strong> y todos sus participantes.`,
            icon: 'warning', showCancelButton: true,
            confirmButtonColor: '#ef4444', cancelButtonColor: '#64748b',
            confirmButtonText: 'Sí, eliminar', cancelButtonText: 'Cancelar',
        })
        if (!isConfirmed) return
        Swal.fire({ title: 'Eliminando...', allowOutsideClick: false, didOpen: () => Swal.showLoading() })
        try {
            await Fetch.deleteData(`convocatorias/${id}`)
            setConvocatorias(prev => prev.filter(c => c.id_convocatoria !== id))
            Swal.fire({ icon: 'success', title: 'Convocatoria eliminada', timer: 1500, showConfirmButton: false })
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Error', text: err.message || 'No se pudo eliminar.' })
        }
    }

    const getCreador = (id_usuario) => {
        const u = usuarios.find(u => String(u.id) === String(id_usuario))
        return u?.Nombre || '—'
    }

    const handleCrear = async (e) => {
        e.preventDefault()
        const errores = []
        if (!form.nombre.trim()) errores.push('Nombre')
        if (!form.descripcion.trim()) errores.push('Descripción')
        if (!form.fecha_cierre) errores.push('Fecha de cierre')
        if (errores.length > 0) {
            Swal.fire({ icon: 'warning', title: 'Campos incompletos', html: `<ul style="text-align:left;padding-left:1.2rem">${errores.map(e => `<li>${e}</li>`).join('')}</ul>` })
            return
        }
        const usuario = JSON.parse(localStorage.getItem('UsuarioActivo') || '{}')
        if (!usuario.id) { Swal.fire({ icon: 'error', title: 'Sin sesión' }); return }
        setGuardando(true)
        Swal.fire({ title: 'Creando...', allowOutsideClick: false, didOpen: () => Swal.showLoading() })
        try {
            await Fetch.postData('convocatorias', {
            nombre: form.nombre,
            descripcion: form.descripcion,
            fecha_cierre: form.fecha_cierre,
            id_usuario: usuario.id,
            id_comunidad: form.id_comunidad || null,
        })
            setModalAbierto(false)
            setForm(FORM_VACIO)
            await cargarConvocatorias()
            Swal.fire({ icon: 'success', title: 'Convocatoria creada', timer: 1500, showConfirmButton: false })
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Error', text: err.message })
        } finally {
            setGuardando(false)
        }
    }

    // Derivados
    const hoy = new Date()
    const esActiva = (c) => c.fecha_cierre && new Date(c.fecha_cierre) >= hoy
    const convActivas  = convocatorias.filter(esActiva)
    const convCerradas = convocatorias.filter(c => !esActiva(c))
    const convPorEstado = filtroEstado === 'activas' ? convActivas : filtroEstado === 'cerradas' ? convCerradas : convocatorias
    const convFiltradas = busqueda.trim()
        ? convPorEstado.filter(c => c.nombre?.toLowerCase().includes(busqueda.toLowerCase()))
        : convPorEstado
    const totalPaginas = Math.max(1, Math.ceil(convFiltradas.length / POR_PAGINA))
    const convPagina   = convFiltradas.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA)
    const mayorDemanda = [...convActivas].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)).slice(0, 2)

    const FILTROS = [
        { id: 'todas',    label: 'Todas' },
        { id: 'activas',  label: 'Activas' },
        { id: 'cerradas', label: 'Cerradas' },
    ]

    return (
        <div style={{ padding: '28px 32px', minHeight: '100%' }}>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
                <div>
                    <h2 style={{ fontSize: 24, fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-0.5px' }}>Gestión de Convocatorias</h2>
                    <p style={{ fontSize: 13, color: '#94a3b8', margin: '6px 0 0' }}>Supervisa tus ofertas activas, analiza el rendimiento de tus vacantes y destaca las posiciones críticas para atraer al mejor talento creativo.</p>
                </div>
                <button onClick={() => setModalAbierto(true)} style={{
                    display: 'flex', alignItems: 'center', gap: 8, background: '#0ea5e9', color: '#fff',
                    border: 'none', cursor: 'pointer', padding: '10px 20px', borderRadius: 10,
                    fontSize: 13, fontWeight: 700, boxShadow: '0 2px 8px rgba(14,165,233,0.3)', flexShrink: 0, whiteSpace: 'nowrap',
                }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>
                    Nueva Convocatoria
                </button>
            </div>

            {/* Stat cards */}
            {!cargando && (
                <div style={{ display: 'flex', gap: 20, marginBottom: 28 }}>
                    <StatCard label="Total Convocatorias" value={convocatorias.length} icon="campaign"
                        iconColor="#0ea5e9" sub="Registradas en la plataforma" />
                    <StatCard label="Convocatorias Activas" value={convActivas.length} icon="check_circle"
                        iconColor="#10b981" badge={convActivas.length > 0} badgeText="En curso" badgeColor="#10b981" />
                    <StatCard label="Convocatorias Cerradas" value={convCerradas.length} icon="lock"
                        iconColor="#94a3b8" sub="Fuera de fecha de cierre" />

                    {/* Mayor demanda */}
                    <div style={{
                        background: 'linear-gradient(135deg, #0ea5e9, #0284c7)', borderRadius: 16, padding: '20px 24px',
                        flex: 1, boxShadow: '0 4px 16px rgba(14,165,233,0.3)',
                    }}>
                        <p style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: 0.8, margin: '0 0 12px' }}>MAYOR ACTIVIDAD</p>
                        {mayorDemanda.length === 0
                            ? <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, margin: 0 }}>Sin convocatorias activas</p>
                            : mayorDemanda.map((c, i) => (
                                <div key={c.id_convocatoria} style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                    background: 'rgba(255,255,255,0.15)', borderRadius: 8, padding: '7px 10px', marginBottom: i === 0 ? 8 : 0,
                                }}>
                                    <span style={{ fontSize: 12, fontWeight: 600, color: '#fff', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginRight: 8 }}>
                                        {c.nombre}
                                    </span>
                                    <span style={{ fontSize: 10, fontWeight: 700, color: '#bae6fd', background: 'rgba(255,255,255,0.15)', borderRadius: 6, padding: '2px 7px', flexShrink: 0 }}>Activa</span>
                                </div>
                            ))
                        }
                    </div>
                </div>
            )}

            {/* Tabla card */}
            <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e8edf2', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                {/* Tabs header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderBottom: '1px solid #f1f5f9', flexWrap: 'wrap', gap: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginRight: 8 }}>Convocatorias Recientes</span>
                        {FILTROS.map(f => (
                            <button key={f.id} onClick={() => { setFiltroEstado(f.id); setPagina(1); setBusqueda('') }} style={{
                                padding: '6px 14px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, transition: 'all 0.15s',
                                background: filtroEstado === f.id ? '#0ea5e9' : '#f1f5f9',
                                color: filtroEstado === f.id ? '#fff' : '#64748b',
                            }}>
                                {f.label}
                            </button>
                        ))}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: '7px 12px' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#94a3b8' }}>search</span>
                        <input
                            type="text"
                            placeholder="Filtrar por vacante..."
                            value={busqueda}
                            onChange={e => { setBusqueda(e.target.value); setPagina(1) }}
                            style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 12, color: '#0f172a', fontWeight: 600, width: 180 }}
                        />
                        {busqueda && (
                            <button onClick={() => { setBusqueda(''); setPagina(1) }} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', color: '#94a3b8' }}>
                                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>close</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Table */}
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
                            {['VACANTE', 'EMPRESA / CREADOR', 'FECHA CIERRE', 'ESTADO', 'ACCIONES'].map(h => (
                                <th key={h} style={{ padding: '12px 20px', fontSize: 10, fontWeight: 700, color: '#94a3b8', textAlign: h === 'ACCIONES' ? 'right' : 'left', textTransform: 'uppercase', letterSpacing: 0.8 }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {cargando ? (
                            <tr><td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>Cargando...</td></tr>
                        ) : convPagina.length === 0 ? (
                            <tr><td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: '#94a3b8', fontStyle: 'italic' }}>No hay convocatorias en esta categoría.</td></tr>
                        ) : convPagina.map(c => {
                            const activa = esActiva(c)
                            const fechaStr = c.fecha_cierre ? new Date(c.fecha_cierre).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'
                            const creador = getCreador(c.id_usuario)
                            return (
                                <tr key={c.id_convocatoria} style={{ borderBottom: '1px solid #f8fafc', transition: 'background 0.1s' }}
                                    onMouseEnter={e => e.currentTarget.style.background = '#fafbfc'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>

                                    <td style={{ padding: '14px 20px' }}>
                                        <p style={{ fontSize: 14, fontWeight: 700, color: '#0ea5e9', margin: '0 0 3px' }}>{c.nombre}</p>
                                        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                                            <span style={{ fontSize: 11, color: '#94a3b8' }}>{c.ubicacion || 'Remoto'}</span>
                                        </div>
                                    </td>

                                    <td style={{ padding: '14px 20px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <div style={{ width: 32, height: 32, borderRadius: 8, background: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                <span style={{ fontSize: 13, fontWeight: 800, color: '#0ea5e9' }}>{creador.charAt(0)}</span>
                                            </div>
                                            <span style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{creador}</span>
                                        </div>
                                    </td>

                                    <td style={{ padding: '14px 20px', fontSize: 13, color: '#64748b' }}>{fechaStr}</td>

                                    <td style={{ padding: '14px 20px' }}>
                                        <span style={{
                                            fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 20,
                                            background: activa ? '#dcfce7' : '#f1f5f9',
                                            color: activa ? '#16a34a' : '#64748b',
                                        }}>
                                            {activa ? 'Abierto' : 'Cerrado'}
                                        </span>
                                    </td>

                                    <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, alignItems: 'center' }}>
                                            <button onClick={() => setConvocatoriaDetalle(c)} style={{
                                                display: 'flex', alignItems: 'center', gap: 6,
                                                background: '#0ea5e9', color: '#fff', border: 'none', cursor: 'pointer',
                                                padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 700, transition: 'background 0.15s',
                                            }}
                                                onMouseEnter={e => e.currentTarget.style.background = '#0284c7'}
                                                onMouseLeave={e => e.currentTarget.style.background = '#0ea5e9'}>
                                                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>search</span>
                                                Inspeccionar
                                            </button>
                                            <button onClick={() => eliminarConvocatoria(c.id_convocatoria, c.nombre)} style={{
                                                background: 'none', border: 'none', cursor: 'pointer', color: '#cbd5e1', padding: '6px', borderRadius: 8,
                                                display: 'flex', alignItems: 'center', transition: 'all 0.15s',
                                            }}
                                                onMouseEnter={e => { e.currentTarget.style.background = '#fef2f2'; e.currentTarget.style.color = '#ef4444' }}
                                                onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#cbd5e1' }}>
                                                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>delete</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>

                {/* Footer pagination */}
                <div style={{ padding: '14px 24px', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 12, color: '#94a3b8' }}>
                        Mostrando {convPagina.length} de {convFiltradas.length} convocatorias
                    </span>
                    <Paginacion pagina={pagina} totalPaginas={totalPaginas} onChange={p => setPagina(p)}
                        totalItems={convFiltradas.length} itemsMostrados={convPagina.length} />
                </div>
            </div>

            {/* Modal inspeccionar */}
            {convocatoriaDetalle && (
                <ModalDetalleConvocatoria convocatoria={convocatoriaDetalle} onClose={() => setConvocatoriaDetalle(null)} onActualizar={cargarConvocatorias} />
            )}

            {/* Modal crear */}
            {modalAbierto && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', padding: 16 }}>
                    <div style={{ background: '#fff', borderRadius: 20, boxShadow: '0 20px 60px rgba(0,0,0,0.15)', width: '100%', maxWidth: 480 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid #f1f5f9' }}>
                            <h3 style={{ fontSize: 17, fontWeight: 800, color: '#0f172a', margin: 0 }}>Nueva convocatoria</h3>
                            <button onClick={cerrarModal} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 4 }}>
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <form onSubmit={handleCrear} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                            {/* Nombre */}
                            <div>
                                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>Nombre</label>
                                <input type="text" required placeholder="Ej. Búsqueda de talentos 2026"
                                    value={form.nombre} onChange={e => setForm(p => ({ ...p, nombre: e.target.value }))}
                                    style={{ width: '100%', border: '1px solid #e2e8f0', borderRadius: 10, padding: '10px 14px', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
                            </div>
                            {/* Descripción */}
                            <div>
                                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>Descripción</label>
                                <textarea required rows={3} placeholder="Describe los detalles y requisitos..."
                                    value={form.descripcion} onChange={e => setForm(p => ({ ...p, descripcion: e.target.value }))}
                                    style={{ width: '100%', border: '1px solid #e2e8f0', borderRadius: 10, padding: '10px 14px', fontSize: 14, outline: 'none', resize: 'none', boxSizing: 'border-box' }} />
                            </div>
                            {/* Comunidad */}
                            <div>
                                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>Comunidad (opcional)</label>
                                <select value={form.id_comunidad} onChange={e => setForm(p => ({ ...p, id_comunidad: e.target.value }))}
                                    style={{ width: '100%', border: '1px solid #e2e8f0', borderRadius: 10, padding: '10px 14px', fontSize: 14, outline: 'none', background: '#fff', color: form.id_comunidad ? '#0f172a' : '#94a3b8', boxSizing: 'border-box' }}>
                                    <option value="">Sin comunidad asignada</option>
                                    {comunidades.map(c => (
                                        <option key={c.id_comunidad} value={c.id_comunidad}>{c.icono} {c.nombre}</option>
                                    ))}
                                </select>
                            </div>
                            {/* Fecha de cierre */}
                            <div>
                                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>Fecha de cierre</label>
                                <input type="date" required min={new Date().toISOString().split('T')[0]}
                                    value={form.fecha_cierre} onChange={e => setForm(p => ({ ...p, fecha_cierre: e.target.value }))}
                                    style={{ width: '100%', border: '1px solid #e2e8f0', borderRadius: 10, padding: '10px 14px', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
                            </div>
                            <div style={{ display: 'flex', gap: 12, paddingTop: 8 }}>
                                <button type="button" onClick={cerrarModal} style={{ flex: 1, border: '1px solid #e2e8f0', background: '#fff', color: '#64748b', fontWeight: 600, fontSize: 14, padding: '10px', borderRadius: 10, cursor: 'pointer' }}>Cancelar</button>
                                <button type="submit" disabled={guardando} style={{ flex: 1, background: '#0ea5e9', color: '#fff', fontWeight: 700, fontSize: 14, padding: '10px', borderRadius: 10, cursor: 'pointer', border: 'none', opacity: guardando ? 0.6 : 1 }}>
                                    {guardando ? 'Guardando...' : 'Crear convocatoria'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default TablaConvocatoriasAdmin
