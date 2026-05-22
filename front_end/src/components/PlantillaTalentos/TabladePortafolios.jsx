import React, { useState, useEffect } from 'react'
import Fetch from '../../services/Fetch'
import Swal from 'sweetalert2'
import { normalizarPortafolio, normalizarUsuario } from '../../utils/normalizers'
import Paginacion from '../Administrador/Paginacion'
import ModalProyecto from '../PerfilUsuario/ModalProyecto'

const POR_PAGINA = 8

const TabladePortafolios = () => {
  const [portafolios, setPortafolios] = useState([])
  const [usuarios, setUsuarios] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('TODOS')
  const [portafolioSeleccionado, setPortafolioSeleccionado] = useState(null)
  const [pagina, setPagina] = useState(1)

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

  const getNombreUsuario = (portafolio) => {
    if (portafolio.nombreUsuario) return portafolio.nombreUsuario
    const usuario = usuarios.find(u => String(u.id) === String(portafolio.usuarioId))
    return usuario?.Nombre || `Usuario #${portafolio.usuarioId}`
  }

  const getEstado = (portafolio) => portafolio.pdf ? 'Publicado' : 'Pendiente'

  const eliminarPortafolio = async (id) => {
    const { isConfirmed } = await Swal.fire({
      title: '¿Eliminar portafolio?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
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

  const portafoliosFiltrados = portafolios.filter(p => {
    const titulo = (p.titulo || '').toLowerCase()
    const propietario = getNombreUsuario(p).toLowerCase()
    const coincideBusqueda = titulo.includes(busqueda.toLowerCase()) || propietario.includes(busqueda.toLowerCase())
    const estado = getEstado(p)
    const coincideEstado = filtroEstado === 'TODOS' || estado === filtroEstado
    return coincideBusqueda && coincideEstado
  })

  const totalPaginas = Math.max(1, Math.ceil(portafoliosFiltrados.length / POR_PAGINA))
  const portafoliosPagina = portafoliosFiltrados.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA)

  useEffect(() => { setPagina(1) }, [busqueda, filtroEstado])

  return (
    <div className="max-w-7xl mx-auto p-8 font-display">
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

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Proyecto</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Propietario</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Secciones</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Estado</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {portafoliosPagina.map((portafolio) => {
                const estado = getEstado(portafolio)
                const nombrePropietario = getNombreUsuario(portafolio)
                const iniciales = (portafolio.titulo || 'P').charAt(0).toUpperCase()
                const numSecciones = (portafolio.componentes || []).length

                return (
                  <tr key={portafolio.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
                          {portafolio.pdf
                            ? <span className="material-symbols-outlined text-emerald-600 text-[18px]">folder_special</span>
                            : <span className="text-emerald-600 font-bold text-sm">{iniciales}</span>
                          }
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

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="size-7 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                          <span className="text-primary text-xs font-bold">{nombrePropietario.charAt(0)}</span>
                        </div>
                        <span className="text-sm text-slate-600 dark:text-slate-400">{nombrePropietario}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      {numSecciones === 0
                        ? <span className="text-xs text-slate-400 italic">Sin secciones</span>
                        : <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                            <span className="material-symbols-outlined text-sm">grid_view</span>
                            {numSecciones}
                          </span>
                      }
                    </td>

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

                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setPortafolioSeleccionado(portafolio)}
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

              {portafoliosPagina.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                    No se encontraron portafolios que coincidan con la búsqueda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800">
          <Paginacion
            pagina={pagina}
            totalPaginas={totalPaginas}
            onChange={p => setPagina(p)}
            totalItems={portafoliosFiltrados.length}
            itemsMostrados={portafoliosPagina.length}
          />
        </div>
      </div>

      {portafolioSeleccionado && (
        <ModalProyecto
          proyecto={portafolioSeleccionado}
          resenas={[]}
          onClose={() => setPortafolioSeleccionado(null)}
          onReviewAdded={() => {}}
        />
      )}
    </div>
  )
}

export default TabladePortafolios
