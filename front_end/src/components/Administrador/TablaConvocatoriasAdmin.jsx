import React, { useState, useEffect } from 'react'
import Fetch from '../../services/Fetch'
import { normalizarUsuario } from '../../utils/normalizers'
import Swal from 'sweetalert2'
import Paginacion from './Paginacion'

const FORM_VACIO = { nombre: '', descripcion: '', fecha_cierre: '' }
const POR_PAGINA = 8

function TablaConvocatoriasAdmin() {
    const [convocatorias, setConvocatorias] = useState([])
    const [usuarios, setUsuarios]           = useState([])
    const [cargando, setCargando]           = useState(true)
    const [expandida, setExpandida]         = useState(null)
    const [participantes, setParticipantes] = useState({})
    const [cargandoPartic, setCargandoPartic] = useState(null)

    const [modalAbierto, setModalAbierto] = useState(false)
    const [form, setForm]                 = useState(FORM_VACIO)
    const [guardando, setGuardando]       = useState(false)
    const [pagina, setPagina]             = useState(1)

    const cerrarModal = async () => {
        const sucio = form.nombre || form.descripcion || form.fecha_cierre
        if (sucio) {
            const { isConfirmed } = await Swal.fire({
                title: '¿Descartar cambios?',
                text: 'Los datos ingresados se perderán.',
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Sí, descartar',
                cancelButtonText: 'Seguir editando',
                confirmButtonColor: '#64748b',
            })
            if (!isConfirmed) return
        }
        setModalAbierto(false)
        setForm(FORM_VACIO)
    }

    const cargarConvocatorias = async () => {
        const data = await Fetch.getData("convocatorias?limit=100")
        setConvocatorias(data || [])
    }

    useEffect(() => {
        async function cargar() {
            try {
                const [resC, resU] = await Promise.all([
                    Fetch.getData("convocatorias?limit=100"),
                    Fetch.getData("usuarios?limit=200"),
                ])
                setConvocatorias(resC || [])
                setUsuarios((resU || []).map(normalizarUsuario))
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
            html: `Se eliminará <strong>${nombre}</strong> y todos sus participantes. Esta acción no se puede deshacer.`,
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
            await Fetch.deleteData(`convocatorias/${id}`)
            setConvocatorias(prev => prev.filter(c => c.id_convocatoria !== id))
            Swal.fire({ icon: 'success', title: 'Convocatoria eliminada', timer: 1500, showConfirmButton: false })
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Error', text: err.message || 'No se pudo eliminar la convocatoria.' })
        }
    }

    const getCreador = (id_usuario) => {
        const u = usuarios.find(u => String(u.id) === String(id_usuario))
        return u?.Nombre || '—'
    }

    const toggleExpandir = async (id) => {
        if (expandida === id) { setExpandida(null); return }
        setExpandida(id)
        if (!participantes[id]) {
            setCargandoPartic(id)
            try {
                const data = await Fetch.getData(`convocatorias/${id}/participantes`)
                setParticipantes(prev => ({ ...prev, [id]: data || [] }))
            } catch (err) {
                console.error(err)
            } finally {
                setCargandoPartic(null)
            }
        }
    }

    const handleCrear = async (e) => {
        e.preventDefault()
        const errores = []
        if (!form.nombre.trim()) errores.push('Nombre de la convocatoria')
        if (!form.descripcion.trim()) errores.push('Descripción')
        if (!form.fecha_cierre) errores.push('Fecha de cierre')
        if (errores.length > 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Campos incompletos',
                html: `<ul style="text-align:left;padding-left:1.2rem">${errores.map(e => `<li>${e}</li>`).join('')}</ul>`,
            })
            return
        }
        const usuario = JSON.parse(localStorage.getItem('UsuarioActivo') || '{}')
        if (!usuario.id) {
            Swal.fire({ icon: 'error', title: 'Sin sesión', text: 'No hay sesión activa.' })
            return
        }
        setGuardando(true)
        Swal.fire({ title: 'Creando convocatoria...', allowOutsideClick: false, didOpen: () => Swal.showLoading() })
        try {
            await Fetch.postData('convocatorias', {
                nombre:       form.nombre,
                descripcion:  form.descripcion,
                fecha_cierre: form.fecha_cierre,
                id_usuario:   usuario.id,
            })
            setModalAbierto(false)
            setForm(FORM_VACIO)
            await cargarConvocatorias()
            Swal.fire({ icon: 'success', title: 'Convocatoria creada', timer: 1500, showConfirmButton: false })
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Error', text: err.message || 'Error al crear la convocatoria.' })
        } finally {
            setGuardando(false)
        }
    }

    const totalPaginas = Math.max(1, Math.ceil(convocatorias.length / POR_PAGINA))
    const convocatoriasPagina = convocatorias.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA)

    const hoy = new Date()
    const estadoConvo = (fecha_cierre) => {
        if (!fecha_cierre) return null
        return new Date(fecha_cierre) >= hoy
            ? { label: 'Activa',  cls: 'bg-emerald-100 text-emerald-700' }
            : { label: 'Cerrada', cls: 'bg-red-100 text-red-700' }
    }

    return (
        <div className="max-w-7xl mx-auto p-8">
            {/* Encabezado */}
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Convocatorias</h2>
                    <p className="text-slate-500 mt-1">Lista de todas las convocatorias y sus participantes.</p>
                </div>
                <button
                    onClick={() => setModalAbierto(true)}
                    className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors shadow-sm"
                >
                    <span className="material-symbols-outlined text-base">add</span>
                    Crear convocatoria
                </button>
            </div>

            {/* Tabla */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Nombre</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Creada por</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Cierre</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Estado</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Participantes</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {cargando ? (
                            <tr><td colSpan="6" className="px-6 py-10 text-center text-slate-400">Cargando...</td></tr>
                        ) : convocatorias.length === 0 ? (
                            <tr><td colSpan="6" className="px-6 py-10 text-center text-slate-400 italic">No hay convocatorias registradas.</td></tr>
                        ) : convocatoriasPagina.map(c => {
                            const estado  = estadoConvo(c.fecha_cierre)
                            const abierta = expandida === c.id_convocatoria
                            return (
                                <React.Fragment key={c.id_convocatoria}>
                                    <tr className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <p className="font-semibold text-slate-900 text-sm">{c.nombre}</p>
                                            <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{c.descripcion}</p>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">{getCreador(c.id_usuario)}</td>
                                        <td className="px-6 py-4 text-sm text-slate-500">{c.fecha_cierre || '—'}</td>
                                        <td className="px-6 py-4">
                                            {estado && (
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${estado.cls}`}>
                                                    {estado.label}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                className="text-sky-600 font-semibold text-sm flex items-center gap-1 bg-transparent border-none cursor-pointer"
                                                onClick={() => toggleExpandir(c.id_convocatoria)}
                                            >
                                                <i className={`fa-solid fa-chevron-${abierta ? 'up' : 'down'} text-xs`} />
                                                {abierta ? 'Ocultar' : 'Ver lista'}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => eliminarConvocatoria(c.id_convocatoria, c.nombre)}
                                                className="p-2 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-500 transition-colors"
                                                title="Eliminar convocatoria"
                                            >
                                                <span className="material-symbols-outlined text-xl">delete</span>
                                            </button>
                                        </td>
                                    </tr>

                                    {abierta && (
                                        <tr>
                                            <td colSpan="6" className="bg-slate-50/70 px-10 py-5 border-b border-slate-100">
                                                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Participantes</p>
                                                {cargandoPartic === c.id_convocatoria ? (
                                                    <p className="text-slate-400 text-sm">Cargando participantes...</p>
                                                ) : (participantes[c.id_convocatoria] || []).length === 0 ? (
                                                    <p className="text-slate-400 text-sm italic">Nadie ha participado en esta convocatoria.</p>
                                                ) : (
                                                    <div className="flex flex-wrap gap-2">
                                                        {(participantes[c.id_convocatoria] || []).map((p, i) => (
                                                            <span key={i} className="flex items-center gap-2 bg-white border border-slate-200 rounded-full px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm">
                                                                <span className="size-5 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center font-bold text-[10px] shrink-0">
                                                                    {p.Usuario?.nombre_completo?.charAt(0) || '?'}
                                                                </span>
                                                                {p.Usuario?.nombre_completo || 'Usuario desconocido'}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            )
                        })}
                    </tbody>
                </table>
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-200">
                    <Paginacion
                        pagina={pagina}
                        totalPaginas={totalPaginas}
                        onChange={p => setPagina(p)}
                        totalItems={convocatorias.length}
                        itemsMostrados={convocatoriasPagina.length}
                    />
                </div>
            </div>

            {/* Modal crear convocatoria */}
            {modalAbierto && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
                        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
                            <h3 className="text-lg font-bold text-slate-900">Nueva convocatoria</h3>
                            <button
                                onClick={cerrarModal}
                                className="text-slate-400 hover:text-slate-600 transition-colors bg-transparent border-none cursor-pointer"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <form onSubmit={handleCrear} className="px-6 py-5 space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Nombre</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Ej. Búsqueda de talentos 2026"
                                    value={form.nombre}
                                    onChange={e => setForm(p => ({ ...p, nombre: e.target.value }))}
                                    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Descripción</label>
                                <textarea
                                    required
                                    rows={3}
                                    placeholder="Describe los detalles y requisitos..."
                                    value={form.descripcion}
                                    onChange={e => setForm(p => ({ ...p, descripcion: e.target.value }))}
                                    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 resize-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Fecha de cierre</label>
                                <input
                                    type="date"
                                    required
                                    min={new Date().toISOString().split('T')[0]}
                                    value={form.fecha_cierre}
                                    onChange={e => setForm(p => ({ ...p, fecha_cierre: e.target.value }))}
                                    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={cerrarModal}
                                    className="flex-1 border border-slate-200 text-slate-600 font-semibold text-sm py-2.5 rounded-lg hover:bg-slate-50 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={guardando}
                                    className="flex-1 bg-sky-600 hover:bg-sky-700 disabled:opacity-60 text-white font-semibold text-sm py-2.5 rounded-lg transition-colors"
                                >
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
