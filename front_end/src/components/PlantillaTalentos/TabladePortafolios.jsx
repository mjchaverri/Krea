import React, { useState, useEffect } from 'react'
import Fetch from '../../services/Fetch'
import Swal from 'sweetalert2'
import { normalizarPortafolio, normalizarUsuario, normalizarResena } from '../../utils/normalizers'
import Paginacion from '../Administrador/Paginacion'
import ModalProyecto from '../PerfilUsuario/ModalProyecto'
import CardPortafolioAdmin from '../Administrador/CardPortafolioAdmin'
import '../../styles/EstilosAdmin/CardPortafolioAdmin.css'

const POR_PAGINA = 9

function StatCard({ label, value, sub, icon, iconColor, badge, badgeText, badgeColor }) {
    return (
        <div style={{
            background: '#fff', borderRadius: 16, padding: '20px 24px',
            border: '1px solid #e8edf2', display: 'flex', alignItems: 'center',
            gap: 16, flex: 1, boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
        }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: iconColor + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span className="material-symbols-outlined" style={{ color: iconColor, fontSize: 24 }}>{icon}</span>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                    <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.8, margin: 0 }}>{label}</p>
                    {badge && <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 20, background: badgeColor + '20', color: badgeColor }}>{badgeText}</span>}
                </div>
                <p style={{ fontSize: 28, fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-1px', lineHeight: 1.1 }}>{value}</p>
                {sub && <p style={{ fontSize: 12, color: '#94a3b8', margin: '4px 0 0' }}>{sub}</p>}
            </div>
        </div>
    )
}

const TabladePortafolios = () => {
    const [portafolios, setPortafolios] = useState([])
    const [usuarios, setUsuarios] = useState([])
    const [busqueda, setBusqueda] = useState('')
    const [filtroEstado, setFiltroEstado] = useState('TODOS')
    const [filtroCategoria, setFiltroCategoria] = useState('Todas')
    const [portafolioSeleccionado, setPortafolioSeleccionado] = useState(null)
    const [resenas, setResenas] = useState([])
    const [pagina, setPagina] = useState(1)
    const [vistaGrid, setVistaGrid] = useState(true)

    useEffect(() => {
        async function cargarDatos() {
            const [resP, resU] = await Promise.all([
                Fetch.getData('portafolios?limit=200').catch(() => []),
                Fetch.getData('usuarios?limit=200').catch(() => []),
            ])
            setPortafolios((resP || []).map(normalizarPortafolio))
            setUsuarios((resU || []).map(normalizarUsuario))
        }
        cargarDatos()
    }, [])

    const getNombreUsuario = (portafolio) => {
        if (portafolio.nombreUsuario) return portafolio.nombreUsuario
        const usuario = usuarios.find(u => String(u.id) === String(portafolio.usuarioId))
        return usuario?.Nombre || `Usuario #${portafolio.usuarioId}`
    }

    const getEstado = (portafolio) => portafolio.pdf ? 'Publicado' : 'Pendiente'

    const eliminarPortafolio = async (id) => {
        const { isConfirmed } = await Swal.fire({
            title: '¿Eliminar portafolio?', text: 'Esta acción no se puede deshacer.', icon: 'warning',
            showCancelButton: true, confirmButtonColor: '#ef4444', cancelButtonColor: '#64748b',
            confirmButtonText: 'Sí, eliminar', cancelButtonText: 'Cancelar',
        })
        if (!isConfirmed) return
        Swal.fire({ title: 'Eliminando...', allowOutsideClick: false, didOpen: () => Swal.showLoading() })
        try {
            await Fetch.deleteData(`portafolios/${id}`)
            setPortafolios(prev => prev.filter(p => p.id !== id))
            Swal.fire({ icon: 'success', title: 'Portafolio eliminado', timer: 1500, showConfirmButton: false })
        } catch {
            Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo eliminar el portafolio.' })
        }
    }

    useEffect(() => {
        if (!portafolioSeleccionado) { setResenas([]); return }
        Fetch.getData(`resenas/portafolio/${portafolioSeleccionado.id}`)
            .then(data => setResenas((data || []).map(normalizarResena)))
            .catch(() => setResenas([]))
    }, [portafolioSeleccionado])

    useEffect(() => { setPagina(1) }, [busqueda, filtroEstado, filtroCategoria])

    // Derivados
    const publicados = portafolios.filter(p => p.pdf).length
    const pendientes = portafolios.filter(p => !p.pdf).length

    // Categorías únicas de los portafolios
    const categoriasUnicas = ['Todas', ...Array.from(new Set(portafolios.flatMap(p => p.categorias || []))).sort()]

    const portafoliosFiltrados = portafolios.filter(p => {
        const titulo = (p.titulo || '').toLowerCase()
        const propietario = getNombreUsuario(p).toLowerCase()
        const coincideBusqueda = titulo.includes(busqueda.toLowerCase()) || propietario.includes(busqueda.toLowerCase())
        const estado = getEstado(p)
        const coincideEstado = filtroEstado === 'TODOS' || estado === filtroEstado
        const coincideCategoria = filtroCategoria === 'Todas' || (p.categorias || []).includes(filtroCategoria)
        return coincideBusqueda && coincideEstado && coincideCategoria
    })

    const totalPaginas = Math.max(1, Math.ceil(portafoliosFiltrados.length / POR_PAGINA))
    const portafoliosPagina = portafoliosFiltrados.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA)

    return (
        <div style={{ padding: '28px 32px', minHeight: '100%' }}>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
                <div>
                    <h2 style={{ fontSize: 24, fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-0.5px' }}>Gestión de Portafolios</h2>
                    <p style={{ fontSize: 13, color: '#94a3b8', margin: '6px 0 0' }}>Supervisa y modera los proyectos de la comunidad. Mantén la calidad editorial y el cumplimiento de las normas.</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, padding: '8px 16px' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#10b981' }}>folder_special</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#10b981' }}>{portafolios.length} portafolios en total</span>
                </div>
            </div>

            {/* Stat cards */}
            <div style={{ display: 'flex', gap: 20, marginBottom: 28 }}>
                <StatCard label="Proyectos Destacados" value={publicados.toLocaleString()} icon="star"
                    iconColor="#0ea5e9" sub="Portafolios publicados con PDF"
                    badge={publicados > 0} badgeText={`+${Math.round(publicados / Math.max(portafolios.length, 1) * 100)}% este mes`} badgeColor="#10b981" />
                <StatCard label="Proyectos Pendientes" value={pendientes} icon="pending"
                    iconColor="#f59e0b" sub="Requieren atención"
                    badge={pendientes > 0} badgeText="Revisar" badgeColor="#f59e0b" />
                <StatCard label="Total Activos" value={portafolios.length.toLocaleString()} icon="visibility"
                    iconColor="#a855f7" sub="Portafolios en la plataforma"
                    badge badgeText="Público" badgeColor="#a855f7" />
            </div>

            {/* Filter bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, gap: 12, flexWrap: 'wrap' }}>
                {/* Category tabs */}
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    {categoriasUnicas.slice(0, 5).map(cat => (
                        <button key={cat} onClick={() => setFiltroCategoria(cat)} style={{
                            padding: '7px 14px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 700, transition: 'all 0.15s',
                            background: filtroCategoria === cat ? '#0ea5e9' : '#fff',
                            color: filtroCategoria === cat ? '#fff' : '#64748b',
                            border: `1px solid ${filtroCategoria === cat ? '#0ea5e9' : '#e2e8f0'}`,
                        }}>
                            {cat}
                        </button>
                    ))}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {/* Estado filter */}
                    <div style={{ display: 'flex', gap: 4 }}>
                        {['TODOS', 'Publicado', 'Pendiente'].map(e => (
                            <button key={e} onClick={() => setFiltroEstado(e)} style={{
                                padding: '7px 12px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600, transition: 'all 0.15s',
                                background: filtroEstado === e ? '#f1f5f9' : 'transparent',
                                color: filtroEstado === e ? '#0f172a' : '#94a3b8',
                            }}>
                                {e === 'TODOS' ? 'Todos' : e}
                            </button>
                        ))}
                    </div>

                    {/* Search */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, padding: '7px 12px' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#94a3b8' }}>search</span>
                        <input type="text" value={busqueda} onChange={e => setBusqueda(e.target.value)}
                            placeholder="Buscar portafolios..."
                            style={{ border: 'none', outline: 'none', fontSize: 13, color: '#334155', width: 180, background: 'transparent' }} />
                    </div>

                    {/* View toggle */}
                    <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: 8, padding: 3, gap: 2 }}>
                        {[{ grid: true, icon: 'grid_view' }, { grid: false, icon: 'view_list' }].map(({ grid, icon }) => (
                            <button key={icon} onClick={() => setVistaGrid(grid)} style={{
                                width: 32, height: 28, borderRadius: 6, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                background: vistaGrid === grid ? '#fff' : 'transparent',
                                color: vistaGrid === grid ? '#0ea5e9' : '#94a3b8',
                                boxShadow: vistaGrid === grid ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                            }}>
                                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>{icon}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Card grid or list */}
            {portafoliosPagina.length === 0 ? (
                <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e8edf2', padding: '60px', textAlign: 'center' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 40, color: '#e2e8f0', display: 'block', marginBottom: 12 }}>folder_off</span>
                    <p style={{ color: '#94a3b8', fontSize: 14, margin: 0 }}>No se encontraron portafolios.</p>
                </div>
            ) : vistaGrid ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20, marginBottom: 24 }}>
                    {portafoliosPagina.map(portafolio => (
                        <CardPortafolioAdmin
                            key={portafolio.id}
                            portafolio={portafolio}
                            nombrePropietario={getNombreUsuario(portafolio)}
                            onVer={() => setPortafolioSeleccionado(portafolio)}
                            onEliminar={() => eliminarPortafolio(portafolio.id)}
                        />
                    ))}
                </div>
            ) : (
                /* List view */
                <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e8edf2', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', marginBottom: 24 }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
                                {['PROYECTO', 'PROPIETARIO', 'CATEGORÍAS', 'ESTADO', 'ACCIONES'].map(h => (
                                    <th key={h} style={{ padding: '12px 20px', fontSize: 10, fontWeight: 700, color: '#94a3b8', textAlign: h === 'ACCIONES' ? 'right' : 'left', textTransform: 'uppercase', letterSpacing: 0.8 }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {portafoliosPagina.map(portafolio => {
                                const estado = getEstado(portafolio)
                                const nombrePropietario = getNombreUsuario(portafolio)
                                const publicado = estado === 'Publicado'
                                return (
                                    <tr key={portafolio.id} style={{ borderBottom: '1px solid #f8fafc', transition: 'background 0.1s' }}
                                        onMouseEnter={e => e.currentTarget.style.background = '#fafbfc'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                        <td style={{ padding: '12px 20px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                                <div style={{ width: 40, height: 40, borderRadius: 10, background: '#f1f5f9', overflow: 'hidden', flexShrink: 0 }}>
                                                    {portafolio.imgPortada
                                                        ? <img src={portafolio.imgPortada} alt={portafolio.titulo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                        : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span className="material-symbols-outlined" style={{ fontSize: 18, color: '#cbd5e1' }}>folder_special</span></div>
                                                    }
                                                </div>
                                                <div>
                                                    <p style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', margin: 0 }}>{portafolio.titulo || 'Sin título'}</p>
                                                    <p style={{ fontSize: 12, color: '#94a3b8', margin: 0, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{portafolio.descripcion || '—'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '12px 20px', fontSize: 13, color: '#64748b' }}>{nombrePropietario}</td>
                                        <td style={{ padding: '12px 20px' }}>
                                            {(portafolio.categorias || []).slice(0, 2).map((cat, i) => (
                                                <span key={i} style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 6, background: '#f1f5f9', color: '#64748b', marginRight: 4 }}>{cat}</span>
                                            ))}
                                        </td>
                                        <td style={{ padding: '12px 20px' }}>
                                            <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 20, background: publicado ? '#dcfce7' : '#fef3c7', color: publicado ? '#16a34a' : '#d97706' }}>{estado}</span>
                                        </td>
                                        <td style={{ padding: '12px 20px', textAlign: 'right' }}>
                                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6 }}>
                                                <button onClick={() => setPortafolioSeleccionado(portafolio)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#cbd5e1', padding: '6px', borderRadius: 8, display: 'flex', alignItems: 'center', transition: 'all 0.15s' }}
                                                    onMouseEnter={e => { e.currentTarget.style.background = '#f0f9ff'; e.currentTarget.style.color = '#0ea5e9' }}
                                                    onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#cbd5e1' }}>
                                                    <span className="material-symbols-outlined" style={{ fontSize: 20 }}>visibility</span>
                                                </button>
                                                <button onClick={() => eliminarPortafolio(portafolio.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#cbd5e1', padding: '6px', borderRadius: 8, display: 'flex', alignItems: 'center', transition: 'all 0.15s' }}
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
                </div>
            )}

            {/* Pagination */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 12, color: '#94a3b8' }}>
                    Mostrando {portafoliosPagina.length} de {portafoliosFiltrados.length} portafolios
                </span>
                <Paginacion pagina={pagina} totalPaginas={totalPaginas} onChange={p => setPagina(p)}
                    totalItems={portafoliosFiltrados.length} itemsMostrados={portafoliosPagina.length} />
            </div>

            {/* Modal ver portafolio */}
            {portafolioSeleccionado && (
                <ModalProyecto
                    proyecto={portafolioSeleccionado}
                    resenas={resenas}
                    onClose={() => setPortafolioSeleccionado(null)}
                    onReviewAdded={async () => {
                        const data = await Fetch.getData(`resenas/portafolio/${portafolioSeleccionado.id}`)
                        setResenas((data || []).map(normalizarResena))
                    }}
                />
            )}
        </div>
    )
}

export default TabladePortafolios
