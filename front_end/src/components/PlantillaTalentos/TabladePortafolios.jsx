import React, { useState, useEffect } from 'react'
import Fetch from '../../services/Fetch'
import { normalizarPortafolio, normalizarUsuario } from '../../utils/normalizers'
import Lienzo from './Lienzo'
import Estructura1 from './Estructura1'
import Estructura1_1 from './Estructura1_1'
import Estructura1_2 from './Estructura1_2'
import Estructura1_3 from './Estructura1_3'
import Estructura1_4 from './Estructura1_4'
import GrillaDoble from './GrillaDoble'
import GrillaTriple from './GrillaTriple'
import Grilla1_2_Izda from './Grilla1_2_Izda'
import Grilla1_2_Derecha from './Grilla1_2_Derecha'

// Mismo mapa de contenedores que usa ModalProyecto
const CONTENEDORES = {
  Estructura1,
  Estructura1_1,
  Estructura1_2,
  Estructura1_3,
  Estructura1_4,
  GrillaDoble,
  GrillaTriple,
  Grilla1_2_Izda,
  Grilla1_2_Derecha
}

// ─── Modal de previsualización (solo lectura) ────────────────────────────────
function ModalPreviewPortafolio({ portafolio, nombrePropietario, onClose }) {
  // Cerrar con Escape — mismo patrón que ModalProyecto
  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [onClose])

  if (!portafolio) return null

  // Mismo renderizado que ModalProyecto.renderComponentesTooltip()
  const renderComponentes = () => {
    if (!portafolio.componentes || portafolio.componentes.length === 0) {
      return (
        <div style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '48px', marginBottom: '12px', display: 'block' }}>
            folder_open
          </span>
          <p style={{ fontSize: '15px', fontWeight: '500' }}>Este portafolio no tiene estructuras añadidas.</p>
        </div>
      )
    }
    return portafolio.componentes.map((comp, index) => {
      const isObject = typeof comp === 'object' && comp !== null
      const type = isObject ? comp.type : comp
      const initialData = isObject ? comp.data : null

      const Comp = CONTENEDORES[type]
      return Comp ? <Comp key={index} initialData={initialData} /> : null
    })
  }

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,0,0,0.55)',
        backdropFilter: 'blur(10px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        animation: 'fadeInOverlay .3s ease-out'
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#fff',
          width: '90vw', height: '85vh',
          borderRadius: '24px',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
          animation: 'slideUpContent .4s cubic-bezier(0.16,1,0.3,1)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header del modal */}
        <div style={{
          padding: '20px 28px',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: '#f8fafc', flexShrink: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '10px',
              background: 'rgba(16,185,129,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <span className="material-symbols-outlined" style={{ color: '#10b981' }}>folder_special</span>
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>
                {portafolio.titulo || 'Sin título'}
              </h3>
              <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
                Propietario: <strong>{nombrePropietario || 'Desconocido'}</strong>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: '40px', height: '40px', borderRadius: '50%',
              background: '#fff', border: '1px solid #e2e8f0',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: '#64748b', transition: 'all .2s'
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'rotate(90deg)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'rotate(0deg)'}
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Cuerpo del modal — previsualización + info */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* IZQUIERDA: preview del Lienzo — misma técnica que ModalProyecto */}
          <div style={{
            flex: 1.6,
            background: '#f1f5f9',
            borderRight: '1px solid #e2e8f0',
            overflowY: 'auto',
            padding: '32px'
          }}>
            <div style={{ transform: 'scale(0.8)', transformOrigin: 'top center', width: '125%', pointerEvents: 'none' }}>
              <Lienzo
                tituloProyecto={portafolio.titulo}
                descripcionProyecto={portafolio.descripcion}
                childrenEstructura={<>{renderComponentes()}</>}
              />
            </div>
          </div>

          {/* DERECHA: detalles del portafolio */}
          <div style={{ flex: 1, padding: '32px', overflowY: 'auto', background: '#fff' }}>
            <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', marginBottom: '20px' }}>
              Detalles del portafolio
            </h4>

            {/* Descripción */}
            <div style={{ marginBottom: '20px' }}>
              <p style={{ fontSize: '12px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
                Descripción
              </p>
              <p style={{ fontSize: '14px', color: '#475569', lineHeight: '1.6' }}>
                {portafolio.descripcion || 'Sin descripción'}
              </p>
            </div>

            {/* Estructuras usadas */}
            <div style={{ marginBottom: '20px' }}>
              <p style={{ fontSize: '12px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                Estructuras ({portafolio.componentes?.length || 0})
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {(portafolio.componentes || []).length === 0
                  ? <span style={{ fontSize: '13px', color: '#94a3b8' }}>Ninguna</span>
                  : portafolio.componentes.map((c, i) => {
                    const name = typeof c === 'object' && c !== null ? c.type : c
                    return (
                      <span key={i} style={{
                        padding: '4px 10px', borderRadius: '9999px',
                        background: 'rgba(16,185,129,0.1)', color: '#059669',
                        fontSize: '12px', fontWeight: '600'
                      }}>{name}</span>
                    )
                  })
                }
              </div>
            </div>

            {/* PDF */}
            {portafolio.pdf && (
              <div style={{ marginBottom: '20px' }}>
                <p style={{ fontSize: '12px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                  PDF adjunto
                </p>
                <a
                  href={portafolio.pdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    padding: '8px 14px', borderRadius: '8px',
                    background: '#f1f5f9', border: '1px solid #e2e8f0',
                    color: '#0f172a', fontSize: '13px', fontWeight: '600',
                    textDecoration: 'none', transition: 'all .2s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#e2e8f0'}
                  onMouseLeave={e => e.currentTarget.style.background = '#f1f5f9'}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#dc2626' }}>picture_as_pdf</span>
                  Ver PDF
                </a>
              </div>
            )}

            {/* ID de referencia */}
            <div>
              <p style={{ fontSize: '12px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
                ID del portafolio
              </p>
              <code style={{ fontSize: '13px', color: '#64748b', background: '#f1f5f9', padding: '4px 8px', borderRadius: '6px' }}>
                {portafolio.id}
              </code>
            </div>
          </div>
        </div>
      </div>

      {/* Keyframes inline */}
      <style>{`
        @keyframes fadeInOverlay { from { opacity:0 } to { opacity:1 } }
        @keyframes slideUpContent { from { transform:translateY(40px) scale(0.97); opacity:0 } to { transform:translateY(0) scale(1); opacity:1 } }
      `}</style>
    </div>
  )
}

// ─── Componente principal ─────────────────────────────────────────────────────
const TabladePortafolios = () => {
  const [portafolios, setPortafolios] = useState([])
  const [usuarios, setUsuarios] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('TODOS')
  const [portafolioSeleccionado, setPortafolioSeleccionado] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    async function cargarDatos() {
      const [resP, resU] = await Promise.all([
        Fetch.getData('portafolios?limit=100'),
        Fetch.getData('usuarios?limit=100'),
      ])
      setPortafolios((resP || []).map(normalizarPortafolio))
      setUsuarios((resU || []).map(normalizarUsuario))
    }
    cargarDatos()
  }, [])

  // Relacionar usuarioId → nombre, igual que la lógica de ModalProyecto
  const getNombreUsuario = (portafolio) => {
    if (portafolio.nombreUsuario) return portafolio.nombreUsuario
    const usuario = usuarios.find(u => String(u.id) === String(portafolio.usuarioId))
    return usuario?.Nombre || `Usuario #${portafolio.usuarioId}`
  }

  // Determinar estado: si tiene pdf → Publicado, si no → Pendiente
  const getEstado = (portafolio) => portafolio.pdf ? 'Publicado' : 'Pendiente'

  const eliminarPortafolio = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este portafolio?')) {
      try {
        await Fetch.deleteData(`portafolios/${id}`)
        setPortafolios(prev => prev.filter(p => p.id !== id))
      } catch {
        alert('No se pudo eliminar el portafolio. Revisa la conexión al servidor.')
      }
    }
  }

  const verPortafolio = (portafolio) => {
    setPortafolioSeleccionado(portafolio)
    setIsModalOpen(true)
  }

  const cerrarModal = () => {
    setIsModalOpen(false)
    setPortafolioSeleccionado(null)
  }

  // Filtrado — misma estructura que TablaUsuariosAdmin.usuariosFiltrados
  const portafoliosFiltrados = portafolios.filter(p => {
    const titulo = (p.titulo || '').toLowerCase()
    const propietario = getNombreUsuario(p).toLowerCase()
    const coincideBusqueda = titulo.includes(busqueda.toLowerCase()) || propietario.includes(busqueda.toLowerCase())
    const estado = getEstado(p)
    const coincideEstado = filtroEstado === 'TODOS' || estado === filtroEstado
    return coincideBusqueda && coincideEstado
  })

  return (
    <div className="max-w-7xl mx-auto p-8 font-display">
      {/* Header — misma estructura que TablaUsuariosAdmin */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Gestión de Portafolios
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Administra y visualiza todos los portafolios de la plataforma.
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
          <span className="material-symbols-outlined text-emerald-500">folder_special</span>
          <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400">
            {portafolios.length} portafolio{portafolios.length !== 1 ? 's' : ''} en total
          </span>
        </div>
      </div>

      {/* Filtros y búsqueda — misma estructura visual */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col lg:flex-row gap-4 items-center mb-6">
        <div className="relative w-full lg:flex-1">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 focus:ring-primary focus:border-primary text-sm outline-none transition-all"
            placeholder="Buscar por nombre de portafolio o propietario..."
          />
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <div className="flex gap-2">
            {['TODOS', 'Publicado', 'Pendiente'].map((estado) => (
              <button
                key={estado}
                onClick={() => setFiltroEstado(estado)}
                className={`px-4 py-2 text-xs font-bold uppercase rounded-lg transition-colors ${filtroEstado === estado
                    ? 'bg-primary/10 text-primary'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-primary/5'
                  }`}
              >
                {estado}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tabla de datos — misma estructura que TablaUsuariosAdmin */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Proyecto</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Propietario</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Estructuras</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Estado</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {portafoliosFiltrados.map((portafolio) => {
                const estado = getEstado(portafolio)
                const nombrePropietario = getNombreUsuario(portafolio)
                const iniciales = (portafolio.titulo || 'P').charAt(0).toUpperCase()

                return (
                  <tr
                    key={portafolio.id}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    {/* Columna: Proyecto */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
                          {portafolio.pdf ? (
                            <span className="material-symbols-outlined text-emerald-600 text-[18px]">folder_special</span>
                          ) : (
                            <span className="text-emerald-600 font-bold text-sm">{iniciales}</span>
                          )}
                        </div>
                        <div>
                          <span className="text-sm font-semibold text-slate-900 dark:text-white block">
                            {portafolio.titulo || 'Sin título'}
                          </span>
                          <span className="text-xs text-slate-400 truncate max-w-[160px] block">
                            {portafolio.descripcion || 'Sin descripción'}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Columna: Propietario */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="size-7 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                          <span className="text-primary text-xs font-bold">{nombrePropietario.charAt(0)}</span>
                        </div>
                        <span className="text-sm text-slate-600 dark:text-slate-400">{nombrePropietario}</span>
                      </div>
                    </td>

                    {/* Columna: Estructuras */}
                    <td className="px-6 py-4">
                      {(portafolio.componentes || []).length === 0 ? (
                        <span className="text-xs text-slate-400 italic">Sin estructuras</span>
                      ) : (
                        <div className="flex flex-wrap gap-1">
                          {portafolio.componentes.slice(0, 2).map((c, i) => {
                            const name = typeof c === 'object' && c !== null ? c.type : c
                            return (
                              <span
                                key={i}
                                className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                              >
                                {name}
                              </span>
                            )
                          })}
                          {portafolio.componentes.length > 2 && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-500">
                              +{portafolio.componentes.length - 2} más
                            </span>
                          )}
                        </div>
                      )}
                    </td>

                    {/* Columna: Estado — badge con colores igual que el rol en TablaUsuariosAdmin */}
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${estado === 'Publicado'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
                        }`}>
                        <span style={{
                          width: '6px', height: '6px', borderRadius: '50%',
                          background: estado === 'Publicado' ? '#10b981' : '#f59e0b',
                          display: 'inline-block'
                        }} />
                        {estado}
                      </span>
                    </td>

                    {/* Columna: Acciones — misma estructura que TablaUsuariosAdmin */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => verPortafolio(portafolio)}
                          title="Ver portafolio"
                          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-primary transition-colors"
                        >
                          <span className="material-symbols-outlined text-xl">visibility</span>
                        </button>
                        <button
                          onClick={() => eliminarPortafolio(portafolio.id)}
                          title="Eliminar portafolio"
                          className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-slate-400 hover:text-red-500 transition-colors"
                        >
                          <span className="material-symbols-outlined text-xl">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}

              {portafoliosFiltrados.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                    No se encontraron portafolios que coincidan con la búsqueda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación — misma estructura que TablaUsuariosAdmin */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Mostrando <span className="font-medium">{portafoliosFiltrados.length}</span> de <span className="font-medium">{portafolios.length}</span> portafolios
          </p>
          <div className="flex gap-2">
            <button className="px-3 py-1 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded text-slate-400 cursor-not-allowed">
              Anterior
            </button>
            <button className="px-3 py-1 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-colors">
              Siguiente
            </button>
          </div>
        </div>
      </div>

      {/* Modal de previsualización */}
      {isModalOpen && portafolioSeleccionado && (
        <ModalPreviewPortafolio
          portafolio={portafolioSeleccionado}
          nombrePropietario={getNombreUsuario(portafolioSeleccionado)}
          onClose={cerrarModal}
        />
      )}
    </div>
  )
}

export default TabladePortafolios