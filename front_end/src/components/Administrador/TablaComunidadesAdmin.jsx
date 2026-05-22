import React, { useState, useEffect } from 'react'
import Fetch from '../../services/Fetch'
import Swal from 'sweetalert2'
import '../../styles/EstilosSidebar/SidebarComunidades.css'
import Paginacion from './Paginacion'

const POR_PAGINA = 8

const ICONOS = ['🎨', '🎵', '💻', '📸', '✍️', '🎭', '🎬', '🏛️', '🌿', '🎧', '🖌️', '📐', '🧵', '🎙️', '🖼️', '🎮']
const COLORES = ['#0ea5e9', '#8b5cf6', '#f43f5e', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#6366f1', '#14b8a6', '#f97316']

const FORM_VACIO = {
    nombre: '', descripcion: '', id_categoria: '',
    icono: ICONOS[0], color: COLORES[0], banner: '',
}

function TablaComunidadesAdmin() {
    const [comunidades, setComunidades] = useState([])
    const [categorias, setCategorias]   = useState([])
    const [cargando, setCargando]       = useState(true)
    const [expandida, setExpandida]     = useState(null)
    const [miembros, setMiembros]       = useState({})
    const [cargandoMiemb, setCargandoMiemb] = useState(null)

    // Modal crear
    const [modalAbierto, setModalAbierto] = useState(false)
    const [form, setForm]                 = useState(FORM_VACIO)
    const [bannerPreview, setBannerPreview] = useState('')
    const [guardando, setGuardando]       = useState(false)

    // Modal editar
    const [comunidadEditando, setComunidadEditando] = useState(null)
    const [formEditar, setFormEditar]               = useState(FORM_VACIO)
    const [bannerPreviewEditar, setBannerPreviewEditar] = useState('')
    const [guardandoEditar, setGuardandoEditar]     = useState(false)

    // Modal detalle
    const [comunidadDetalle, setComunidadDetalle]   = useState(null)

    const [pagina, setPagina] = useState(1)

    const cerrarModal = async () => {
        const sucio = form.nombre || form.descripcion
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
        setBannerPreview('')
    }

    const abrirEditar = (c) => {
        setFormEditar({
            nombre:       c.nombre || '',
            descripcion:  c.descripcion || '',
            id_categoria: c.id_categoria || c.Categoria?.id_categoria || '',
            icono:        c.icono || ICONOS[0],
            color:        c.Color || COLORES[0],
            banner:       c.banner || '',
        })
        setBannerPreviewEditar(c.banner || '')
        setComunidadEditando(c)
    }

    const cerrarEditar = async () => {
        const { isConfirmed } = await Swal.fire({
            title: '¿Cancelar edición?',
            text: 'Los cambios no guardados se perderán.',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí, cancelar',
            cancelButtonText: 'Seguir editando',
            confirmButtonColor: '#64748b',
        })
        if (!isConfirmed) return
        setComunidadEditando(null)
        setFormEditar(FORM_VACIO)
        setBannerPreviewEditar('')
    }

    const handleBannerEditar = async (e) => {
        const file = e.target.files?.[0]
        if (!file) return
        setBannerPreviewEditar(URL.createObjectURL(file))
        setSubiendoBannerEditar(true)
        try {
            const data = new FormData()
            data.append('file', file)
            data.append('upload_preset', 'imagenes')
            const res = await fetch('https://api.cloudinary.com/v1_1/dyy1yqvbv/image/upload', { method: 'POST', body: data })
            const result = await res.json()
            setFormEditar(prev => ({ ...prev, banner: result.secure_url }))
        } catch {
            Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo subir la imagen.' })
            setBannerPreviewEditar('')
            setFormEditar(prev => ({ ...prev, banner: '' }))
        } finally {
            setSubiendoBannerEditar(false)
        }
    }

    const handleEditar = async (e) => {
        e.preventDefault()
        const errores = []
        if (!formEditar.nombre.trim()) errores.push('Nombre de la comunidad')
        if (!formEditar.descripcion.trim()) errores.push('Descripción')
        if (errores.length > 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Campos incompletos',
                html: `<ul style="text-align:left;padding-left:1.2rem">${errores.map(e => `<li>${e}</li>`).join('')}</ul>`,
            })
            return
        }
        setGuardandoEditar(true)
        Swal.fire({ title: 'Guardando cambios...', allowOutsideClick: false, didOpen: () => Swal.showLoading() })
        try {
            await Fetch.putData(`comunidades/${comunidadEditando.id_comunidad}`, {
                nombre:       formEditar.nombre.trim(),
                descripcion:  formEditar.descripcion.trim(),
                icono:        formEditar.icono,
                Color:        formEditar.color,
                ColorClaro:   formEditar.color + '22',
                banner:       formEditar.banner || null,
                id_categoria: formEditar.id_categoria ? parseInt(formEditar.id_categoria) : null,
            })
            setComunidadEditando(null)
            setFormEditar(FORM_VACIO)
            setBannerPreviewEditar('')
            await cargarComunidades()
            Swal.fire({ icon: 'success', title: 'Comunidad actualizada', timer: 1500, showConfirmButton: false })
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Error', text: err.message || 'Error al actualizar la comunidad.' })
        } finally {
            setGuardandoEditar(false)
        }
    }

    const handleChange = (campo, valor) => setForm(prev => ({ ...prev, [campo]: valor }))

    const [subiendoBanner, setSubiendoBanner] = useState(false)
    const [subiendoBannerEditar, setSubiendoBannerEditar] = useState(false)

    const handleBanner = async (e) => {
        const file = e.target.files?.[0]
        if (!file) return
        setBannerPreview(URL.createObjectURL(file))
        setSubiendoBanner(true)
        try {
            const data = new FormData()
            data.append('file', file)
            data.append('upload_preset', 'imagenes')
            const res = await fetch('https://api.cloudinary.com/v1_1/dyy1yqvbv/image/upload', { method: 'POST', body: data })
            const result = await res.json()
            handleChange('banner', result.secure_url)
        } catch {
            Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo subir la imagen.' })
            setBannerPreview('')
            handleChange('banner', '')
        } finally {
            setSubiendoBanner(false)
        }
    }

    const cargarComunidades = async () => {
        const data = await Fetch.getData("comunidades?limit=100")
        setComunidades(data || [])
    }

    useEffect(() => {
        Promise.all([
            cargarComunidades(),
            Fetch.getData('categorias').then(data => setCategorias(data || [])).catch(() => {}),
        ]).finally(() => setCargando(false))
    }, [])

    const totalPaginas = Math.max(1, Math.ceil(comunidades.length / POR_PAGINA))
    const comunidadesPagina = comunidades.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA)

    const eliminarComunidad = async (id, nombre) => {
        const { isConfirmed } = await Swal.fire({
            title: '¿Eliminar comunidad?',
            html: `Se eliminará <strong>${nombre}</strong> y todos sus miembros. Esta acción no se puede deshacer.`,
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
            await Fetch.deleteData(`comunidades/${id}`)
            setComunidades(prev => prev.filter(c => c.id_comunidad !== id))
            Swal.fire({ icon: 'success', title: 'Comunidad eliminada', timer: 1500, showConfirmButton: false })
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Error', text: err.message || 'No se pudo eliminar la comunidad.' })
        }
    }

    const toggleExpandir = async (id) => {
        if (expandida === id) { setExpandida(null); return }
        setExpandida(id)
        if (!miembros[id]) {
            setCargandoMiemb(id)
            try {
                const data = await Fetch.getData(`miembros/comunidad/${id}`)
                setMiembros(prev => ({ ...prev, [id]: data || [] }))
            } catch (err) {
                console.error(err)
            } finally {
                setCargandoMiemb(null)
            }
        }
    }

    const handleCrear = async (e) => {
        e.preventDefault()
        const errores = []
        if (!form.nombre.trim()) errores.push('Nombre de la comunidad')
        if (!form.descripcion.trim()) errores.push('Descripción')
        if (errores.length > 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Campos incompletos',
                html: `<ul style="text-align:left;padding-left:1.2rem">${errores.map(e => `<li>${e}</li>`).join('')}</ul>`,
            })
            return
        }
        setGuardando(true)
        Swal.fire({ title: 'Creando comunidad...', allowOutsideClick: false, didOpen: () => Swal.showLoading() })
        try {
            await Fetch.postData('comunidades', {
                nombre:       form.nombre.trim(),
                descripcion:  form.descripcion.trim(),
                icono:        form.icono,
                Color:        form.color,
                ColorClaro:   form.color + '22',
                banner:       form.banner || null,
                id_categoria: form.id_categoria ? parseInt(form.id_categoria) : null,
            })
            setModalAbierto(false)
            setForm(FORM_VACIO)
            setBannerPreview('')
            await cargarComunidades()
            Swal.fire({ icon: 'success', title: 'Comunidad creada', timer: 1500, showConfirmButton: false })
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Error', text: err.message || 'Error al crear la comunidad.' })
        } finally {
            setGuardando(false)
        }
    }

    return (
        <div className="max-w-7xl mx-auto p-8">
            {/* Encabezado */}
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Comunidades</h2>
                    <p className="text-slate-500 mt-1">Lista de todas las comunidades y sus miembros.</p>
                </div>
                <button
                    onClick={() => setModalAbierto(true)}
                    className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors shadow-sm"
                >
                    <span className="material-symbols-outlined text-base">add</span>
                    Crear comunidad
                </button>
            </div>

            {/* Tabla */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Comunidad</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Descripción</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Categoría</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Miembros</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {cargando ? (
                            <tr><td colSpan="5" className="px-6 py-10 text-center text-slate-400">Cargando...</td></tr>
                        ) : comunidades.length === 0 ? (
                            <tr><td colSpan="5" className="px-6 py-10 text-center text-slate-400 italic">No hay comunidades registradas.</td></tr>
                        ) : comunidadesPagina.map(c => {
                            const abierta = expandida === c.id_comunidad
                            return (
                                <React.Fragment key={c.id_comunidad}>
                                    <tr className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <span
                                                    className="size-9 rounded-lg flex items-center justify-center text-lg shrink-0"
                                                    style={{ background: c.ColorClaro || '#f0f4f8', color: c.Color || '#0ea5e9' }}
                                                >
                                                    {c.icono || '🌐'}
                                                </span>
                                                <span className="font-semibold text-slate-900 text-sm">{c.nombre}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-500 max-w-xs truncate">{c.descripcion}</td>
                                        <td className="px-6 py-4 text-sm text-slate-500">
                                            {c.Categoria?.nombre || c.categoria || '—'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                className="text-sky-600 font-semibold text-sm flex items-center gap-1 bg-transparent border-none cursor-pointer"
                                                onClick={() => toggleExpandir(c.id_comunidad)}
                                            >
                                                <i className={`fa-solid fa-chevron-${abierta ? 'up' : 'down'} text-xs`} />
                                                {abierta ? 'Ocultar' : 'Ver miembros'}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-1">
                                                <button
                                                    onClick={() => setComunidadDetalle(c)}
                                                    className="p-2 hover:bg-sky-50 rounded-lg text-slate-400 hover:text-sky-600 transition-colors"
                                                    title="Ver detalles"
                                                >
                                                    <span className="material-symbols-outlined text-xl">visibility</span>
                                                </button>
                                                <button
                                                    onClick={() => abrirEditar(c)}
                                                    className="p-2 hover:bg-amber-50 rounded-lg text-slate-400 hover:text-amber-600 transition-colors"
                                                    title="Editar comunidad"
                                                >
                                                    <span className="material-symbols-outlined text-xl">edit</span>
                                                </button>
                                                <button
                                                    onClick={() => eliminarComunidad(c.id_comunidad, c.nombre)}
                                                    className="p-2 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-500 transition-colors"
                                                    title="Eliminar comunidad"
                                                >
                                                    <span className="material-symbols-outlined text-xl">delete</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>

                                    {abierta && (
                                        <tr>
                                            <td colSpan="5" className="bg-slate-50/70 px-10 py-5 border-b border-slate-100">
                                                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Miembros</p>
                                                {cargandoMiemb === c.id_comunidad ? (
                                                    <p className="text-slate-400 text-sm">Cargando miembros...</p>
                                                ) : (miembros[c.id_comunidad] || []).length === 0 ? (
                                                    <p className="text-slate-400 text-sm italic">Esta comunidad no tiene miembros aún.</p>
                                                ) : (
                                                    <div className="flex flex-wrap gap-2">
                                                        {(miembros[c.id_comunidad] || []).map((m, i) => (
                                                            <span key={i} className="flex items-center gap-2 bg-white border border-slate-200 rounded-full px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm">
                                                                <span
                                                                    className="size-5 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 overflow-hidden"
                                                                    style={{ background: c.ColorClaro || '#e0f2fe', color: c.Color || '#0ea5e9' }}
                                                                >
                                                                    {m.Usuario?.img_perfil
                                                                        ? <img src={m.Usuario.img_perfil} alt="" className="w-full h-full object-cover" />
                                                                        : m.Usuario?.nombre_completo?.charAt(0) || '?'
                                                                    }
                                                                </span>
                                                                {m.Usuario?.nombre_completo || 'Usuario desconocido'}
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
                        totalItems={comunidades.length}
                        itemsMostrados={comunidadesPagina.length}
                    />
                </div>
            </div>

            {/* Modal ver detalles */}
            {comunidadDetalle && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={() => setComunidadDetalle(null)}>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden" onClick={e => e.stopPropagation()}>
                        {/* Banner */}
                        {comunidadDetalle.banner && (
                            <div className="h-40 w-full overflow-hidden">
                                <img src={comunidadDetalle.banner} alt="" className="w-full h-full object-cover" />
                            </div>
                        )}
                        {/* Header con color */}
                        <div className="px-6 py-5 flex items-center justify-between border-b border-slate-100"
                            style={{ background: comunidadDetalle.ColorClaro || '#f0f9ff' }}>
                            <div className="flex items-center gap-3">
                                <span className="size-12 rounded-xl flex items-center justify-center text-2xl shadow-sm"
                                    style={{ background: comunidadDetalle.Color + '30', color: comunidadDetalle.Color }}>
                                    {comunidadDetalle.icono || '🌐'}
                                </span>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">{comunidadDetalle.nombre}</h3>
                                    <p className="text-xs text-slate-500">{comunidadDetalle.Categoria?.nombre || comunidadDetalle.categoria || 'Sin categoría'}</p>
                                </div>
                            </div>
                            <button onClick={() => setComunidadDetalle(null)}
                                className="p-2 hover:bg-white/60 rounded-full text-slate-500 transition-colors bg-transparent border-none cursor-pointer">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        {/* Cuerpo */}
                        <div className="px-6 py-5 space-y-4">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Descripción</p>
                                <p className="text-sm text-slate-700 leading-relaxed">{comunidadDetalle.descripcion}</p>
                            </div>
                            <div className="flex gap-6">
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Color</p>
                                    <div className="flex items-center gap-2">
                                        <span className="size-5 rounded-full inline-block border border-slate-200" style={{ background: comunidadDetalle.Color }} />
                                        <span className="text-sm text-slate-600">{comunidadDetalle.Color}</span>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Miembros</p>
                                    <p className="text-sm font-semibold text-slate-700">
                                        {(miembros[comunidadDetalle.id_comunidad] || []).length > 0
                                            ? `${miembros[comunidadDetalle.id_comunidad].length} miembro(s)`
                                            : 'Sin datos cargados'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Creada</p>
                                    <p className="text-sm text-slate-600">
                                        {comunidadDetalle.createdAt ? new Date(comunidadDetalle.createdAt).toLocaleDateString('es-CR') : '—'}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="px-6 pb-5 flex justify-end gap-2">
                            <button onClick={() => { setComunidadDetalle(null); abrirEditar(comunidadDetalle) }}
                                className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold rounded-lg transition-colors">
                                <span className="material-symbols-outlined text-base">edit</span>
                                Editar
                            </button>
                            <button onClick={() => setComunidadDetalle(null)}
                                className="px-4 py-2 border border-slate-200 text-slate-600 text-sm font-semibold rounded-lg hover:bg-slate-50 transition-colors">
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal editar comunidad */}
            {comunidadEditando && (
                <div className="sb-modal-overlay" onClick={cerrarEditar}>
                    <div className="sb-modal" onClick={e => e.stopPropagation()}>
                        <div className="sb-modal__header">
                            <h2 className="sb-modal__titulo">Editar comunidad</h2>
                            <button className="sb-modal__close" onClick={cerrarEditar}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                            </button>
                        </div>
                        <form className="sb-modal__form" onSubmit={handleEditar}>
                            <div className="sb-modal__preview" style={{ background: formEditar.color + '18', borderColor: formEditar.color + '44' }}>
                                <span className="sb-modal__preview-icono" style={{ background: formEditar.color + '30', color: formEditar.color }}>{formEditar.icono}</span>
                                <div>
                                    <p className="sb-modal__preview-nombre">{formEditar.nombre || 'Nombre de la comunidad'}</p>
                                    <p className="sb-modal__preview-cat">{categorias.find(c => String(c.id_categoria) === String(formEditar.id_categoria))?.nombre || 'Sin categoría'}</p>
                                </div>
                            </div>

                            <div className="sb-modal__campo">
                                <label className="sb-modal__label">Imagen de portada</label>
                                <label className="sb-modal__banner-upload" style={bannerPreviewEditar ? { backgroundImage: `url(${bannerPreviewEditar})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}>
                                    {subiendoBannerEditar ? (
                                        <span className="sb-modal__banner-placeholder">
                                            <span style={{ fontSize: 13 }}>Subiendo imagen...</span>
                                        </span>
                                    ) : !bannerPreviewEditar ? (
                                        <span className="sb-modal__banner-placeholder">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                                            <span>Subir portada</span>
                                        </span>
                                    ) : (
                                        <span className="sb-modal__banner-change">Cambiar imagen</span>
                                    )}
                                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleBannerEditar} disabled={subiendoBannerEditar} />
                                </label>
                            </div>

                            <div className="sb-modal__campo">
                                <label className="sb-modal__label">Nombre</label>
                                <input type="text" className="sb-modal__input" value={formEditar.nombre}
                                    onChange={e => setFormEditar(prev => ({ ...prev, nombre: e.target.value }))} maxLength={60} required />
                            </div>

                            <div className="sb-modal__campo">
                                <label className="sb-modal__label">Descripción</label>
                                <textarea className="sb-modal__textarea" value={formEditar.descripcion}
                                    onChange={e => setFormEditar(prev => ({ ...prev, descripcion: e.target.value }))} maxLength={200} rows={3} required />
                            </div>

                            <div className="sb-modal__campo">
                                <label className="sb-modal__label">Categoría</label>
                                <select className="sb-modal__select" value={formEditar.id_categoria}
                                    onChange={e => setFormEditar(prev => ({ ...prev, id_categoria: e.target.value }))}>
                                    <option value="">Sin categoría</option>
                                    {categorias.map(cat => <option key={cat.id_categoria} value={cat.id_categoria}>{cat.nombre}</option>)}
                                </select>
                            </div>

                            <div className="sb-modal__campo">
                                <label className="sb-modal__label">Ícono</label>
                                <div className="sb-modal__iconos">
                                    {ICONOS.map(ic => (
                                        <button key={ic} type="button"
                                            className={`sb-modal__icono-btn ${formEditar.icono === ic ? 'sb-modal__icono-btn--activo' : ''}`}
                                            onClick={() => setFormEditar(prev => ({ ...prev, icono: ic }))}>{ic}</button>
                                    ))}
                                </div>
                            </div>

                            <div className="sb-modal__campo">
                                <label className="sb-modal__label">Color</label>
                                <div className="sb-modal__colores">
                                    {COLORES.map(col => (
                                        <button key={col} type="button"
                                            className={`sb-modal__color-btn ${formEditar.color === col ? 'sb-modal__color-btn--activo' : ''}`}
                                            style={{ background: col }}
                                            onClick={() => setFormEditar(prev => ({ ...prev, color: col }))} />
                                    ))}
                                </div>
                            </div>

                            <button type="submit" className="sb-modal__btn-submit" style={{ background: formEditar.color }} disabled={guardandoEditar || subiendoBannerEditar || !formEditar.nombre.trim()}>
                                {subiendoBannerEditar ? 'Subiendo imagen...' : guardandoEditar ? 'Guardando...' : 'Guardar cambios'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal crear comunidad — igual al de PaginaComunidades */}
            {modalAbierto && (
                <div className="sb-modal-overlay" onClick={cerrarModal}>
                    <div className="sb-modal" onClick={e => e.stopPropagation()}>
                        <div className="sb-modal__header">
                            <h2 className="sb-modal__titulo">Nueva comunidad</h2>
                            <button className="sb-modal__close" onClick={cerrarModal}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                            </button>
                        </div>

                        <form className="sb-modal__form" onSubmit={handleCrear}>
                            <div className="sb-modal__preview" style={{ background: form.color + '18', borderColor: form.color + '44' }}>
                                <span className="sb-modal__preview-icono" style={{ background: form.color + '30', color: form.color }}>{form.icono}</span>
                                <div>
                                    <p className="sb-modal__preview-nombre">{form.nombre || 'Nombre de la comunidad'}</p>
                                    <p className="sb-modal__preview-cat">{categorias.find(c => String(c.id_categoria) === String(form.id_categoria))?.nombre || 'Sin categoría'}</p>
                                </div>
                            </div>

                            <div className="sb-modal__campo">
                                <label className="sb-modal__label">Imagen de portada</label>
                                <label className="sb-modal__banner-upload" style={bannerPreview ? { backgroundImage: `url(${bannerPreview})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}>
                                    {subiendoBanner ? (
                                        <span className="sb-modal__banner-placeholder">
                                            <span style={{ fontSize: 13 }}>Subiendo imagen...</span>
                                        </span>
                                    ) : !bannerPreview ? (
                                        <span className="sb-modal__banner-placeholder">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                                            <span>Subir portada</span>
                                        </span>
                                    ) : (
                                        <span className="sb-modal__banner-change">Cambiar imagen</span>
                                    )}
                                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleBanner} disabled={subiendoBanner} />
                                </label>
                            </div>

                            <div className="sb-modal__campo">
                                <label className="sb-modal__label">Nombre</label>
                                <input type="text" className="sb-modal__input" placeholder="Ej: Diseñadores UX/UI" value={form.nombre} onChange={e => handleChange('nombre', e.target.value)} maxLength={60} required />
                            </div>

                            <div className="sb-modal__campo">
                                <label className="sb-modal__label">Descripción</label>
                                <textarea className="sb-modal__textarea" placeholder="¿De qué trata esta comunidad?" value={form.descripcion} onChange={e => handleChange('descripcion', e.target.value)} maxLength={200} rows={3} required />
                            </div>

                            <div className="sb-modal__campo">
                                <label className="sb-modal__label">Categoría</label>
                                <select className="sb-modal__select" value={form.id_categoria} onChange={e => handleChange('id_categoria', e.target.value)}>
                                    <option value="">Sin categoría</option>
                                    {categorias.map(cat => <option key={cat.id_categoria} value={cat.id_categoria}>{cat.nombre}</option>)}
                                </select>
                            </div>

                            <div className="sb-modal__campo">
                                <label className="sb-modal__label">Ícono</label>
                                <div className="sb-modal__iconos">
                                    {ICONOS.map(ic => (
                                        <button key={ic} type="button" className={`sb-modal__icono-btn ${form.icono === ic ? 'sb-modal__icono-btn--activo' : ''}`} onClick={() => handleChange('icono', ic)}>{ic}</button>
                                    ))}
                                </div>
                            </div>

                            <div className="sb-modal__campo">
                                <label className="sb-modal__label">Color</label>
                                <div className="sb-modal__colores">
                                    {COLORES.map(col => (
                                        <button key={col} type="button" className={`sb-modal__color-btn ${form.color === col ? 'sb-modal__color-btn--activo' : ''}`} style={{ background: col }} onClick={() => handleChange('color', col)} />
                                    ))}
                                </div>
                            </div>

                            <button type="submit" className="sb-modal__btn-submit" style={{ background: form.color }} disabled={guardando || subiendoBanner || !form.nombre.trim()}>
                                {subiendoBanner ? 'Subiendo imagen...' : guardando ? 'Creando...' : 'Crear comunidad'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default TablaComunidadesAdmin
