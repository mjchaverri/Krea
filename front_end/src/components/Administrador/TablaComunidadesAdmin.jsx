import React, { useState, useEffect } from 'react'
import Fetch from '../../services/Fetch'
import Swal from 'sweetalert2'
import '../../styles/EstilosSidebar/SidebarComunidades.css'
import { isDemoMode, archivoABase64 } from '../../mock/mockEngine'

const ICONOS = ['🎨', '🎵', '💻', '📸', '✍️', '🎭', '🎬', '🏛️', '🌿', '🎧', '🖌️', '📐', '🧵', '🎙️', '🖼️', '🎮']
const COLORES = ['#0ea5e9', '#8b5cf6', '#f43f5e', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#6366f1', '#14b8a6', '#f97316']
const FORM_VACIO = { nombre: '', descripcion: '', id_categoria: '', icono: ICONOS[0], color: COLORES[0], banner: '' }

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

function TablaComunidadesAdmin() {
    const [comunidades, setComunidades] = useState([])
    const [categorias,  setCategorias]  = useState([])
    const [cargando,    setCargando]    = useState(true)
    const [filtroCat,   setFiltroCat]   = useState(null)
    const [miembros,    setMiembros]    = useState({})

    // Modal crear
    const [modalAbierto,  setModalAbierto]  = useState(false)
    const [form,          setForm]          = useState(FORM_VACIO)
    const [bannerPreview, setBannerPreview] = useState('')
    const [guardando,     setGuardando]     = useState(false)
    const [subiendoBanner, setSubiendoBanner] = useState(false)

    // Modal editar
    const [comunidadEditando,    setComunidadEditando]    = useState(null)
    const [formEditar,           setFormEditar]           = useState(FORM_VACIO)
    const [bannerPreviewEditar,  setBannerPreviewEditar]  = useState('')
    const [guardandoEditar,      setGuardandoEditar]      = useState(false)
    const [subiendoBannerEditar, setSubiendoBannerEditar] = useState(false)

    // Modal gestión
    const [verMiembrosId,    setVerMiembrosId]    = useState(null)
    const [gestionTab,       setGestionTab]       = useState('miembros')
    const [cargandoMiemb,    setCargandoMiemb]    = useState(null)
    const [reportes,         setReportes]         = useState({})
    const [cargandoRep,      setCargandoRep]      = useState(null)
    const [baneados,         setBaneados]         = useState({})
    const [cargandoBan,      setCargandoBan]      = useState(null)

    const cargarComunidades = async () => {
        const data = await Fetch.getData('comunidades?limit=100')
        setComunidades(data || [])
    }

    useEffect(() => {
        Promise.all([
            cargarComunidades(),
            Fetch.getData('categorias').then(data => setCategorias(data || [])).catch(() => {}),
        ]).finally(() => setCargando(false))
    }, [])

    const cerrarModal = async () => {
        const sucio = form.nombre || form.descripcion
        if (sucio) {
            const { isConfirmed } = await Swal.fire({
                title: '¿Descartar cambios?', text: 'Los datos ingresados se perderán.', icon: 'question',
                showCancelButton: true, confirmButtonText: 'Sí, descartar', cancelButtonText: 'Seguir editando', confirmButtonColor: '#64748b',
            })
            if (!isConfirmed) return
        }
        setModalAbierto(false); setForm(FORM_VACIO); setBannerPreview('')
    }

    const abrirEditar = (c) => {
        setFormEditar({ nombre: c.nombre || '', descripcion: c.descripcion || '', id_categoria: c.id_categoria || c.Categoria?.id_categoria || '', icono: c.icono || ICONOS[0], color: c.Color || COLORES[0], banner: c.banner || '' })
        setBannerPreviewEditar(c.banner || '')
        setComunidadEditando(c)
    }

    const cerrarEditar = async () => {
        const { isConfirmed } = await Swal.fire({
            title: '¿Cancelar edición?', text: 'Los cambios no guardados se perderán.', icon: 'question',
            showCancelButton: true, confirmButtonText: 'Sí, cancelar', cancelButtonText: 'Seguir editando', confirmButtonColor: '#64748b',
        })
        if (!isConfirmed) return
        setComunidadEditando(null); setFormEditar(FORM_VACIO); setBannerPreviewEditar('')
    }

    const handleBanner = async (e) => {
        const file = e.target.files?.[0]; if (!file) return
        setBannerPreview(URL.createObjectURL(file)); setSubiendoBanner(true)
        try {
            if (isDemoMode()) {
                const dataUrl = await archivoABase64(file)
                setForm(prev => ({ ...prev, banner: dataUrl }))
                return
            }
            const data = new FormData(); data.append('file', file); data.append('upload_preset', 'imagenes')
            const res = await fetch('https://api.cloudinary.com/v1_1/dyy1yqvbv/image/upload', { method: 'POST', body: data })
            const result = await res.json()
            setForm(prev => ({ ...prev, banner: result.secure_url }))
        } catch { Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo subir la imagen.' }); setBannerPreview(''); setForm(prev => ({ ...prev, banner: '' }))
        } finally { setSubiendoBanner(false) }
    }

    const handleBannerEditar = async (e) => {
        const file = e.target.files?.[0]; if (!file) return
        setBannerPreviewEditar(URL.createObjectURL(file)); setSubiendoBannerEditar(true)
        try {
            if (isDemoMode()) {
                const dataUrl = await archivoABase64(file)
                setFormEditar(prev => ({ ...prev, banner: dataUrl }))
                return
            }
            const data = new FormData(); data.append('file', file); data.append('upload_preset', 'imagenes')
            const res = await fetch('https://api.cloudinary.com/v1_1/dyy1yqvbv/image/upload', { method: 'POST', body: data })
            const result = await res.json()
            setFormEditar(prev => ({ ...prev, banner: result.secure_url }))
        } catch { Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo subir la imagen.' }); setBannerPreviewEditar(''); setFormEditar(prev => ({ ...prev, banner: '' }))
        } finally { setSubiendoBannerEditar(false) }
    }

    const handleCrear = async (e) => {
        e.preventDefault()
        const errores = []
        if (!form.nombre.trim()) errores.push('Nombre')
        if (!form.descripcion.trim()) errores.push('Descripción')
        if (errores.length > 0) { Swal.fire({ icon: 'warning', title: 'Campos incompletos', html: `<ul style="text-align:left;padding-left:1.2rem">${errores.map(e => `<li>${e}</li>`).join('')}</ul>` }); return }
        setGuardando(true)
        Swal.fire({ title: 'Creando comunidad...', allowOutsideClick: false, didOpen: () => Swal.showLoading() })
        try {
            await Fetch.postData('comunidades', { nombre: form.nombre.trim(), descripcion: form.descripcion.trim(), icono: form.icono, Color: form.color, ColorClaro: form.color + '22', banner: form.banner || null, id_categoria: form.id_categoria ? parseInt(form.id_categoria) : null })
            setModalAbierto(false); setForm(FORM_VACIO); setBannerPreview('')
            await cargarComunidades()
            Swal.fire({ icon: 'success', title: 'Comunidad creada', timer: 1500, showConfirmButton: false })
        } catch (err) { Swal.fire({ icon: 'error', title: 'Error', text: err.message })
        } finally { setGuardando(false) }
    }

    const handleEditar = async (e) => {
        e.preventDefault()
        const errores = []
        if (!formEditar.nombre.trim()) errores.push('Nombre')
        if (!formEditar.descripcion.trim()) errores.push('Descripción')
        if (errores.length > 0) { Swal.fire({ icon: 'warning', title: 'Campos incompletos', html: `<ul style="text-align:left;padding-left:1.2rem">${errores.map(e => `<li>${e}</li>`).join('')}</ul>` }); return }
        setGuardandoEditar(true)
        Swal.fire({ title: 'Guardando cambios...', allowOutsideClick: false, didOpen: () => Swal.showLoading() })
        try {
            await Fetch.putData(`comunidades/${comunidadEditando.id_comunidad}`, { nombre: formEditar.nombre.trim(), descripcion: formEditar.descripcion.trim(), icono: formEditar.icono, Color: formEditar.color, ColorClaro: formEditar.color + '22', banner: formEditar.banner || null, id_categoria: formEditar.id_categoria ? parseInt(formEditar.id_categoria) : null })
            setComunidadEditando(null); setFormEditar(FORM_VACIO); setBannerPreviewEditar('')
            await cargarComunidades()
            Swal.fire({ icon: 'success', title: 'Comunidad actualizada', timer: 1500, showConfirmButton: false })
        } catch (err) { Swal.fire({ icon: 'error', title: 'Error', text: err.message })
        } finally { setGuardandoEditar(false) }
    }

    const eliminarComunidad = async (id, nombre) => {
        const { isConfirmed } = await Swal.fire({
            title: '¿Eliminar comunidad?', html: `Se eliminará <strong>${nombre}</strong> y todos sus miembros.`, icon: 'warning',
            showCancelButton: true, confirmButtonColor: '#ef4444', cancelButtonColor: '#64748b', confirmButtonText: 'Sí, eliminar', cancelButtonText: 'Cancelar',
        })
        if (!isConfirmed) return
        Swal.fire({ title: 'Eliminando...', allowOutsideClick: false, didOpen: () => Swal.showLoading() })
        try {
            await Fetch.deleteData(`comunidades/${id}`)
            setComunidades(prev => prev.filter(c => c.id_comunidad !== id))
            Swal.fire({ icon: 'success', title: 'Comunidad eliminada', timer: 1500, showConfirmButton: false })
        } catch (err) { Swal.fire({ icon: 'error', title: 'Error', text: err.message }) }
    }

    const verMiembros = async (id) => {
        setVerMiembrosId(id)
        setGestionTab('miembros')
        if (!miembros[id]) {
            setCargandoMiemb(id)
            try {
                const data = await Fetch.getData(`miembros/comunidad/${id}`)
                setMiembros(prev => ({ ...prev, [id]: data || [] }))
            } catch (err) { console.error(err) } finally { setCargandoMiemb(null) }
        }
    }

    const cargarReportes = async (id) => {
        setCargandoRep(id)
        try {
            const data = await Fetch.getData(`reportes-chat/comunidad/${id}`)
            setReportes(prev => ({ ...prev, [id]: Array.isArray(data) ? data : (data?.data || []) }))
        } catch (err) { console.error(err) } finally { setCargandoRep(null) }
    }

    const cargarBaneados = async (id) => {
        setCargandoBan(id)
        try {
            const data = await Fetch.getData(`reportes-chat/baneados/${id}`)
            setBaneados(prev => ({ ...prev, [id]: Array.isArray(data) ? data : (data?.data || []) }))
        } catch (err) { console.error(err) } finally { setCargandoBan(null) }
    }

    const cambiarTab = (tab) => {
        setGestionTab(tab)
        const id = verMiembrosId
        if (tab === 'reportes' && !reportes[id]) cargarReportes(id)
        if (tab === 'baneados' && !baneados[id]) cargarBaneados(id)
    }

    const handleActualizarEstadoReporte = async (id_reporte, estado, idCom) => {
        try {
            await Fetch.putData(`reportes-chat/${id_reporte}/estado`, { estado })
            setReportes(prev => ({
                ...prev,
                [idCom]: prev[idCom].map(r => r.id_reporte_chat === id_reporte ? { ...r, estado } : r)
            }))
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Error', text: err.message })
        }
    }

    const handleEliminarMensaje = async (id_reporte, id_mensaje, idCom) => {
        const { isConfirmed } = await Swal.fire({
            title: '¿Eliminar mensaje?', text: 'El mensaje del chat será eliminado permanentemente.', icon: 'warning',
            showCancelButton: true, confirmButtonColor: '#ef4444', cancelButtonColor: '#64748b',
            confirmButtonText: 'Sí, eliminar', cancelButtonText: 'Cancelar',
        })
        if (!isConfirmed) return
        try {
            await Fetch.deleteData(`chat-comunidad/${id_mensaje}`)
            await handleActualizarEstadoReporte(id_reporte, 'revisado', idCom)
        } catch (err) { Swal.fire({ icon: 'error', title: 'Error', text: err.message }) }
    }

    const handleExpulsarMiembro = async (id_comunidad, m) => {
        const nombre = m.Usuario?.nombre_completo || 'este usuario'
        const idUsuario = m.id_usuario || m.Usuario?.id_usuario
        const { isConfirmed } = await Swal.fire({
            title: `¿Expulsar a ${nombre}?`,
            text: 'Será removido de la comunidad pero podrá volver a unirse.',
            icon: 'warning', showCancelButton: true,
            confirmButtonColor: '#f59e0b', cancelButtonColor: '#64748b',
            confirmButtonText: 'Sí, expulsar', cancelButtonText: 'Cancelar',
        })
        if (!isConfirmed) return
        try {
            await Fetch.deleteData(`miembros/${id_comunidad}/${idUsuario}`)
            setMiembros(prev => ({
                ...prev,
                [id_comunidad]: prev[id_comunidad].filter(x => (x.id_usuario || x.Usuario?.id_usuario) !== idUsuario)
            }))
            Swal.fire({ icon: 'success', title: `${nombre} fue expulsado`, timer: 1500, showConfirmButton: false })
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Error', text: err.message })
        }
    }

    const handleBanearMiembro = async (id_comunidad, m) => {
        const nombre = m.Usuario?.nombre_completo || 'este usuario'
        const idUsuario = m.id_usuario || m.Usuario?.id_usuario
        const { value: formValues, isConfirmed } = await Swal.fire({
            title: `Banear a ${nombre}`,
            html: `
                <div style="text-align:left;display:flex;flex-direction:column;gap:12px;margin-top:8px">
                    <div>
                        <label style="font-size:13px;font-weight:600;color:#374151;display:block;margin-bottom:4px">Razón (opcional)</label>
                        <textarea id="swal-ban-razon" placeholder="Motivo del baneo..."
                            style="width:100%;padding:8px 10px;border:1.5px solid #e2e8f0;border-radius:8px;font-size:13px;resize:none;height:68px;box-sizing:border-box;font-family:inherit;outline:none"></textarea>
                    </div>
                </div>`,
            icon: 'warning', showCancelButton: true,
            confirmButtonColor: '#ef4444', cancelButtonColor: '#64748b',
            confirmButtonText: 'Banear', cancelButtonText: 'Cancelar',
            preConfirm: () => ({ razon: document.getElementById('swal-ban-razon').value.trim() })
        })
        if (!isConfirmed) return
        try {
            await Fetch.postData('reportes-chat/banear', {
                id_comunidad:   id_comunidad,
                id_usuario:     idUsuario,
                razon:          formValues.razon,
                nombre_usuario: m.Usuario?.nombre_usuario || nombre,
            })
            setMiembros(prev => ({
                ...prev,
                [id_comunidad]: prev[id_comunidad].filter(x => (x.id_usuario || x.Usuario?.id_usuario) !== idUsuario)
            }))
            // Refrescar baneados si ya estaba cargado
            if (baneados[id_comunidad]) cargarBaneados(id_comunidad)
            Swal.fire({ icon: 'success', title: `${nombre} fue baneado`, timer: 1500, showConfirmButton: false })
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Error', text: err.message })
        }
    }

    const handleDesbanear = async (id_comunidad, id_usuario) => {
        const { isConfirmed } = await Swal.fire({
            title: '¿Desbanear usuario?', text: 'El usuario podrá unirse de nuevo a la comunidad.', icon: 'question',
            showCancelButton: true, confirmButtonColor: '#10b981', cancelButtonColor: '#64748b',
            confirmButtonText: 'Sí, desbanear', cancelButtonText: 'Cancelar',
        })
        if (!isConfirmed) return
        try {
            await Fetch.deleteData(`reportes-chat/baneados/${id_comunidad}/${id_usuario}`)
            setBaneados(prev => ({
                ...prev,
                [id_comunidad]: prev[id_comunidad].filter(b => b.id_usuario !== id_usuario)
            }))
            Swal.fire({ icon: 'success', title: 'Usuario desbaneado', timer: 1500, showConfirmButton: false })
        } catch (err) { Swal.fire({ icon: 'error', title: 'Error', text: err.message }) }
    }

    // Derivados
    const hoy = new Date()
    const hace7 = new Date(hoy); hace7.setDate(hoy.getDate() - 7)
    const nuevasEstaSeamana = comunidades.filter(c => c.createdAt && new Date(c.createdAt) >= hace7).length

    const comunidadesFiltradas = filtroCat === null
        ? comunidades
        : comunidades.filter(c => c.Categoria?.id_categoria === filtroCat || c.id_categoria === filtroCat)

    // Count by category
    const countPorCat = {}
    comunidades.forEach(c => {
        const id = c.Categoria?.id_categoria || c.id_categoria
        if (id) countPorCat[id] = (countPorCat[id] || 0) + 1
    })

    return (
        <div style={{ padding: '28px 32px', minHeight: '100%' }}>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
                <div>
                    <h2 style={{ fontSize: 24, fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-0.5px' }}>Comunidades</h2>
                    <p style={{ fontSize: 13, color: '#94a3b8', margin: '6px 0 0' }}>Conecta con otros profesionales, comparte hilos de conversación y gestiona tus espacios creativos.</p>
                </div>
                <button onClick={() => setModalAbierto(true)} style={{
                    display: 'flex', alignItems: 'center', gap: 8, background: '#0ea5e9', color: '#fff',
                    border: 'none', cursor: 'pointer', padding: '10px 20px', borderRadius: 10,
                    fontSize: 13, fontWeight: 700, boxShadow: '0 2px 8px rgba(14,165,233,0.3)', flexShrink: 0,
                }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>
                    Crear nueva comunidad
                </button>
            </div>

            {/* Stat cards */}
            {!cargando && (
                <div style={{ display: 'flex', gap: 20, marginBottom: 28 }}>
                    <StatCard label="Comunidades Activas" value={comunidades.length} icon="groups"
                        iconColor="#0ea5e9" badge={nuevasEstaSeamana > 0} badgeText={`+${nuevasEstaSeamana}% esta semana`} badgeColor="#10b981" />
                    <StatCard label="Categorías" value={categorias.length} icon="category"
                        iconColor="#a855f7" sub="Categorías disponibles"
                        badge badgeText="Global" badgeColor="#a855f7" />
                    <StatCard label="Nuevas Esta Semana" value={nuevasEstaSeamana} icon="trending_up"
                        iconColor="#10b981" sub="Comunidades creadas recientemente"
                        badge={nuevasEstaSeamana > 0} badgeText="Nuevo" badgeColor="#10b981" />
                </div>
            )}

            {/* Main layout: sidebar + cards */}
            <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>

                {/* Left sidebar: categorías */}
                <div style={{ width: 220, flexShrink: 0, background: '#fff', borderRadius: 16, border: '1px solid #e8edf2', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                    <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9' }}>
                        <h3 style={{ fontSize: 13, fontWeight: 800, color: '#0f172a', margin: 0, textTransform: 'uppercase', letterSpacing: 0.5 }}>Categorías</h3>
                    </div>
                    <div style={{ padding: '8px' }}>
                        <button onClick={() => setFiltroCat(null)} style={{
                            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            padding: '9px 12px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, transition: 'all 0.15s', marginBottom: 2,
                            background: filtroCat === null ? '#0ea5e9' : 'transparent',
                            color: filtroCat === null ? '#fff' : '#64748b',
                        }}>
                            <span>Todas</span>
                            <span style={{ fontSize: 11, fontWeight: 700, padding: '1px 8px', borderRadius: 10, background: filtroCat === null ? 'rgba(255,255,255,0.25)' : '#f1f5f9', color: filtroCat === null ? '#fff' : '#94a3b8' }}>{comunidades.length}</span>
                        </button>
                        {categorias.map(cat => {
                            const activo = filtroCat === cat.id_categoria
                            const count = countPorCat[cat.id_categoria] || 0
                            return (
                                <button key={cat.id_categoria} onClick={() => setFiltroCat(cat.id_categoria)} style={{
                                    width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                    padding: '9px 12px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, transition: 'all 0.15s', marginBottom: 2,
                                    background: activo ? '#0ea5e9' : 'transparent',
                                    color: activo ? '#fff' : '#64748b',
                                }}
                                    onMouseEnter={e => { if (!activo) e.currentTarget.style.background = '#f1f5f9' }}
                                    onMouseLeave={e => { if (!activo) e.currentTarget.style.background = 'transparent' }}>
                                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'left' }}>{cat.nombre}</span>
                                    <span style={{ fontSize: 11, fontWeight: 700, padding: '1px 7px', borderRadius: 10, background: activo ? 'rgba(255,255,255,0.25)' : '#f1f5f9', color: activo ? '#fff' : '#94a3b8', flexShrink: 0, marginLeft: 4 }}>{count}</span>
                                </button>
                            )
                        })}
                    </div>
                </div>

                {/* Right: card grid */}
                <div style={{ flex: 1, minWidth: 0 }}>
                    {cargando ? (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200, color: '#94a3b8' }}>
                            <span className="material-symbols-outlined" style={{ marginRight: 8 }}>progress_activity</span>
                            Cargando comunidades...
                        </div>
                    ) : comunidadesFiltradas.length === 0 ? (
                        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e8edf2', padding: '48px', textAlign: 'center' }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 40, color: '#e2e8f0', display: 'block', marginBottom: 12 }}>groups</span>
                            <p style={{ color: '#94a3b8', fontSize: 14, margin: 0 }}>No hay comunidades en esta categoría.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
                            {comunidadesFiltradas.map(c => (
                                <div key={c.id_comunidad} style={{ background: '#fff', borderRadius: 16, border: '1px solid #e8edf2', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', transition: 'box-shadow 0.2s' }}
                                    onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)'}
                                    onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)'}>

                                    {/* Banner */}
                                    <div style={{ height: 80, background: c.banner ? 'transparent' : (c.Color || '#0ea5e9') + '20', position: 'relative', overflow: 'hidden' }}>
                                        {c.banner
                                            ? <img src={c.banner} alt={c.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>{c.icono || '🌐'}</div>
                                        }
                                        {/* Category badge */}
                                        {(c.Categoria?.nombre || c.categoria) && (
                                            <span style={{ position: 'absolute', top: 8, left: 8, fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 6, background: 'rgba(0,0,0,0.5)', color: '#fff', backdropFilter: 'blur(4px)' }}>
                                                {c.Categoria?.nombre || c.categoria}
                                            </span>
                                        )}
                                    </div>

                                    {/* Body */}
                                    <div style={{ padding: '16px 20px 12px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                                            <span style={{ fontSize: 22, lineHeight: 1 }}>{c.icono || '🌐'}</span>
                                            <h4 style={{ fontSize: 15, fontWeight: 800, color: '#0f172a', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.nombre}</h4>
                                        </div>
                                        <p style={{ fontSize: 12, color: '#94a3b8', margin: '0 0 14px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                                            {c.descripcion || 'Sin descripción'}
                                        </p>

                                        {/* Stats row */}
                                        <div style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
                                            {miembros[c.id_comunidad] !== undefined && (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                                    <span className="material-symbols-outlined" style={{ fontSize: 14, color: '#94a3b8' }}>group</span>
                                                    <span style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>{miembros[c.id_comunidad].length} miembros</span>
                                                </div>
                                            )}
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                                <span style={{ width: 8, height: 8, borderRadius: '50%', background: c.Color || '#0ea5e9' }} />
                                                <span style={{ fontSize: 11, color: '#94a3b8' }}>{c.Color || '#0ea5e9'}</span>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div style={{ display: 'flex', gap: 8 }}>
                                            <button onClick={() => verMiembros(c.id_comunidad)} style={{
                                                flex: 1, padding: '8px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer',
                                                fontSize: 12, fontWeight: 700, color: '#64748b', transition: 'all 0.15s',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
                                            }}
                                                onMouseEnter={e => { e.currentTarget.style.background = '#f0f9ff'; e.currentTarget.style.borderColor = '#0ea5e9'; e.currentTarget.style.color = '#0ea5e9' }}
                                                onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#64748b' }}>
                                                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>manage_accounts</span>
                                                Gestionar
                                            </button>
                                            <button onClick={() => abrirEditar(c)} style={{ width: 34, height: 34, borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', transition: 'all 0.15s' }}
                                                onMouseEnter={e => { e.currentTarget.style.background = '#fef3c7'; e.currentTarget.style.color = '#f59e0b' }}
                                                onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#94a3b8' }}>
                                                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>edit</span>
                                            </button>
                                            <button onClick={() => eliminarComunidad(c.id_comunidad, c.nombre)} style={{ width: 34, height: 34, borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', transition: 'all 0.15s' }}
                                                onMouseEnter={e => { e.currentTarget.style.background = '#fef2f2'; e.currentTarget.style.color = '#ef4444' }}
                                                onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#94a3b8' }}>
                                                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>delete</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Modal gestión comunidad — tabs: Miembros | Reportes | Baneados */}
            {verMiembrosId !== null && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', padding: 16 }} onClick={() => setVerMiembrosId(null)}>
                    <div style={{ background: '#fff', borderRadius: 20, boxShadow: '0 20px 60px rgba(0,0,0,0.15)', width: '100%', maxWidth: 520, maxHeight: '85vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }} onClick={e => e.stopPropagation()}>
                        {(() => {
                            const c = comunidades.find(x => x.id_comunidad === verMiembrosId)
                            const id = verMiembrosId
                            const TABS = [
                                { id: 'miembros', label: 'Miembros' },
                                { id: 'reportes', label: 'Reportes' },
                                { id: 'baneados', label: 'Baneados' },
                            ]
                            return (
                                <>
                                    {/* Header */}
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px 0', flexShrink: 0 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <span style={{ fontSize: 22 }}>{c?.icono || '🌐'}</span>
                                            <h3 style={{ fontSize: 15, fontWeight: 800, color: '#0f172a', margin: 0 }}>{c?.nombre}</h3>
                                        </div>
                                        <button onClick={() => setVerMiembrosId(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                                            <span className="material-symbols-outlined">close</span>
                                        </button>
                                    </div>
                                    {/* Tabs */}
                                    <div style={{ display: 'flex', borderBottom: '1px solid #f1f5f9', margin: '12px 24px 0', flexShrink: 0 }}>
                                        {TABS.map(tab => (
                                            <button key={tab.id} onClick={() => cambiarTab(tab.id)} style={{
                                                padding: '8px 16px', border: 'none', borderBottom: `2px solid ${gestionTab === tab.id ? '#0ea5e9' : 'transparent'}`,
                                                background: 'transparent', color: gestionTab === tab.id ? '#0ea5e9' : '#64748b',
                                                fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s',
                                            }}>{tab.label}</button>
                                        ))}
                                    </div>
                                    {/* Body */}
                                    <div style={{ overflowY: 'auto', flex: 1, padding: '16px 24px' }}>

                                        {/* TAB: Miembros */}
                                        {gestionTab === 'miembros' && (
                                            cargandoMiemb === id ? (
                                                <p style={{ color: '#94a3b8', textAlign: 'center', padding: '20px 0' }}>Cargando miembros...</p>
                                            ) : (miembros[id] || []).length === 0 ? (
                                                <p style={{ color: '#94a3b8', fontStyle: 'italic', textAlign: 'center', padding: '20px 0' }}>Esta comunidad no tiene miembros aún.</p>
                                            ) : (
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                                    {(miembros[id] || []).map((m, i) => {
                                                        const nombre = m.Usuario?.nombre_completo || 'Usuario desconocido'
                                                        return (
                                                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 10, background: '#f8fafc' }}>
                                                                <div style={{ width: 36, height: 36, borderRadius: '50%', background: c?.ColorClaro || '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                                                                    {m.Usuario?.img_perfil
                                                                        ? <img src={m.Usuario.img_perfil} alt={nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                                        : <span style={{ fontSize: 13, fontWeight: 800, color: c?.Color || '#0ea5e9' }}>{nombre.charAt(0)}</span>}
                                                                </div>
                                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                                    <p style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{nombre}</p>
                                                                    <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>@{m.Usuario?.nombre_usuario || '—'}</p>
                                                                </div>
                                                                <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                                                                    <button
                                                                        onClick={() => handleExpulsarMiembro(id, m)}
                                                                        title="Expulsar de la comunidad"
                                                                        style={{ padding: '4px 10px', borderRadius: 7, border: 'none', background: '#fef9c3', color: '#d97706', fontSize: 11, fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s' }}
                                                                        onMouseEnter={e => { e.currentTarget.style.background = '#f59e0b'; e.currentTarget.style.color = '#fff' }}
                                                                        onMouseLeave={e => { e.currentTarget.style.background = '#fef9c3'; e.currentTarget.style.color = '#d97706' }}
                                                                    >
                                                                        Expulsar
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleBanearMiembro(id, m)}
                                                                        title="Banear de la comunidad"
                                                                        style={{ padding: '4px 10px', borderRadius: 7, border: 'none', background: '#fef2f2', color: '#ef4444', fontSize: 11, fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s' }}
                                                                        onMouseEnter={e => { e.currentTarget.style.background = '#ef4444'; e.currentTarget.style.color = '#fff' }}
                                                                        onMouseLeave={e => { e.currentTarget.style.background = '#fef2f2'; e.currentTarget.style.color = '#ef4444' }}
                                                                    >
                                                                        Banear
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            )
                                        )}

                                        {/* TAB: Reportes */}
                                        {gestionTab === 'reportes' && (
                                            cargandoRep === id ? (
                                                <p style={{ color: '#94a3b8', textAlign: 'center', padding: '20px 0' }}>Cargando reportes...</p>
                                            ) : (reportes[id] || []).length === 0 ? (
                                                <p style={{ color: '#94a3b8', fontStyle: 'italic', textAlign: 'center', padding: '20px 0' }}>No hay reportes en esta comunidad.</p>
                                            ) : (
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                                    {(reportes[id] || []).map(r => (
                                                        <div key={r.id_reporte_chat} style={{ border: '1.5px solid #fee2e2', borderRadius: 10, padding: '12px 14px', background: r.estado === 'pendiente' ? '#fff5f5' : '#f8fafc', display: 'flex', flexDirection: 'column', gap: 4 }}>
                                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                                <span style={{ fontSize: 12, fontWeight: 700, color: '#dc2626' }}>{r.autor_mensaje || 'Desconocido'}</span>
                                                                <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 6, background: r.estado === 'pendiente' ? '#fef3c7' : r.estado === 'revisado' ? '#dcfce7' : '#f1f5f9', color: r.estado === 'pendiente' ? '#92400e' : r.estado === 'revisado' ? '#15803d' : '#64748b', fontWeight: 700 }}>
                                                                    {r.estado}
                                                                </span>
                                                            </div>
                                                            <p style={{ fontSize: 13, color: '#374151', margin: 0, fontStyle: 'italic' }}>"{r.texto_mensaje}"</p>
                                                            <p style={{ fontSize: 12, color: '#6b7280', margin: 0 }}>Razón: {r.razon}</p>
                                                            {r.estado === 'pendiente' && (
                                                                <div style={{ display: 'flex', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
                                                                    <button onClick={() => handleActualizarEstadoReporte(r.id_reporte_chat, 'descartado', id)} style={{ padding: '4px 10px', borderRadius: 6, border: 'none', background: '#f1f5f9', color: '#64748b', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                                                                        Descartar
                                                                    </button>
                                                                    <button onClick={() => handleActualizarEstadoReporte(r.id_reporte_chat, 'revisado', id)} style={{ padding: '4px 10px', borderRadius: 6, border: 'none', background: '#dcfce7', color: '#15803d', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                                                                        Marcar revisado
                                                                    </button>
                                                                    <button onClick={() => handleEliminarMensaje(r.id_reporte_chat, r.id_mensaje, id)} style={{ padding: '4px 10px', borderRadius: 6, border: 'none', background: '#fee2e2', color: '#dc2626', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                                                                        Eliminar mensaje
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            )
                                        )}

                                        {/* TAB: Baneados */}
                                        {gestionTab === 'baneados' && (
                                            cargandoBan === id ? (
                                                <p style={{ color: '#94a3b8', textAlign: 'center', padding: '20px 0' }}>Cargando baneados...</p>
                                            ) : (baneados[id] || []).length === 0 ? (
                                                <p style={{ color: '#94a3b8', fontStyle: 'italic', textAlign: 'center', padding: '20px 0' }}>No hay usuarios baneados en esta comunidad.</p>
                                            ) : (
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                                    {(baneados[id] || []).map(b => (
                                                        <div key={b.id_ban} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 10, background: '#fff5f5', border: '1px solid #fecaca' }}>
                                                            <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                                <span style={{ fontSize: 13, fontWeight: 800, color: '#ef4444' }}>{(b.nombre_usuario || '?').charAt(0).toUpperCase()}</span>
                                                            </div>
                                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                                <p style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', margin: 0 }}>{b.nombre_usuario || 'ID: ' + b.id_usuario}</p>
                                                                {b.razon && <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>Razón: {b.razon}</p>}
                                                            </div>
                                                            <button onClick={() => handleDesbanear(id, b.id_usuario)} style={{ padding: '5px 10px', borderRadius: 7, border: '1.5px solid #d1fae5', background: '#ecfdf5', color: '#10b981', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                                                                Desbanear
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )
                                        )}

                                    </div>
                                </>
                            )
                        })()}
                    </div>
                </div>
            )}

            {/* Modal crear comunidad */}
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
                                    {subiendoBanner ? <span className="sb-modal__banner-placeholder"><span style={{ fontSize: 13 }}>Subiendo imagen...</span></span>
                                        : !bannerPreview ? <span className="sb-modal__banner-placeholder"><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg><span>Subir portada</span></span>
                                        : <span className="sb-modal__banner-change">Cambiar imagen</span>}
                                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleBanner} disabled={subiendoBanner} />
                                </label>
                            </div>
                            <div className="sb-modal__campo"><label className="sb-modal__label">Nombre</label><input type="text" className="sb-modal__input" placeholder="Ej: Diseñadores UX/UI" value={form.nombre} onChange={e => setForm(p => ({ ...p, nombre: e.target.value }))} maxLength={60} required /></div>
                            <div className="sb-modal__campo"><label className="sb-modal__label">Descripción</label><textarea className="sb-modal__textarea" placeholder="¿De qué trata esta comunidad?" value={form.descripcion} onChange={e => setForm(p => ({ ...p, descripcion: e.target.value }))} maxLength={200} rows={3} required /></div>
                            <div className="sb-modal__campo"><label className="sb-modal__label">Categoría</label>
                                <select className="sb-modal__select" value={form.id_categoria} onChange={e => setForm(p => ({ ...p, id_categoria: e.target.value }))}>
                                    <option value="">Sin categoría</option>
                                    {categorias.map(cat => <option key={cat.id_categoria} value={cat.id_categoria}>{cat.nombre}</option>)}
                                </select>
                            </div>
                            <div className="sb-modal__campo"><label className="sb-modal__label">Ícono</label>
                                <div className="sb-modal__iconos">{ICONOS.map(ic => <button key={ic} type="button" className={`sb-modal__icono-btn ${form.icono === ic ? 'sb-modal__icono-btn--activo' : ''}`} onClick={() => setForm(p => ({ ...p, icono: ic }))}>{ic}</button>)}</div>
                            </div>
                            <div className="sb-modal__campo"><label className="sb-modal__label">Color</label>
                                <div className="sb-modal__colores">{COLORES.map(col => <button key={col} type="button" className={`sb-modal__color-btn ${form.color === col ? 'sb-modal__color-btn--activo' : ''}`} style={{ background: col }} onClick={() => setForm(p => ({ ...p, color: col }))} />)}</div>
                            </div>
                            <button type="submit" className="sb-modal__btn-submit" style={{ background: form.color }} disabled={guardando || subiendoBanner || !form.nombre.trim()}>
                                {subiendoBanner ? 'Subiendo imagen...' : guardando ? 'Creando...' : 'Crear comunidad'}
                            </button>
                        </form>
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
                                    {subiendoBannerEditar ? <span className="sb-modal__banner-placeholder"><span style={{ fontSize: 13 }}>Subiendo imagen...</span></span>
                                        : !bannerPreviewEditar ? <span className="sb-modal__banner-placeholder"><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg><span>Subir portada</span></span>
                                        : <span className="sb-modal__banner-change">Cambiar imagen</span>}
                                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleBannerEditar} disabled={subiendoBannerEditar} />
                                </label>
                            </div>
                            <div className="sb-modal__campo"><label className="sb-modal__label">Nombre</label><input type="text" className="sb-modal__input" value={formEditar.nombre} onChange={e => setFormEditar(prev => ({ ...prev, nombre: e.target.value }))} maxLength={60} required /></div>
                            <div className="sb-modal__campo"><label className="sb-modal__label">Descripción</label><textarea className="sb-modal__textarea" value={formEditar.descripcion} onChange={e => setFormEditar(prev => ({ ...prev, descripcion: e.target.value }))} maxLength={200} rows={3} required /></div>
                            <div className="sb-modal__campo"><label className="sb-modal__label">Categoría</label>
                                <select className="sb-modal__select" value={formEditar.id_categoria} onChange={e => setFormEditar(prev => ({ ...prev, id_categoria: e.target.value }))}>
                                    <option value="">Sin categoría</option>
                                    {categorias.map(cat => <option key={cat.id_categoria} value={cat.id_categoria}>{cat.nombre}</option>)}
                                </select>
                            </div>
                            <div className="sb-modal__campo"><label className="sb-modal__label">Ícono</label>
                                <div className="sb-modal__iconos">{ICONOS.map(ic => <button key={ic} type="button" className={`sb-modal__icono-btn ${formEditar.icono === ic ? 'sb-modal__icono-btn--activo' : ''}`} onClick={() => setFormEditar(prev => ({ ...prev, icono: ic }))}>{ic}</button>)}</div>
                            </div>
                            <div className="sb-modal__campo"><label className="sb-modal__label">Color</label>
                                <div className="sb-modal__colores">{COLORES.map(col => <button key={col} type="button" className={`sb-modal__color-btn ${formEditar.color === col ? 'sb-modal__color-btn--activo' : ''}`} style={{ background: col }} onClick={() => setFormEditar(prev => ({ ...prev, color: col }))} />)}</div>
                            </div>
                            <button type="submit" className="sb-modal__btn-submit" style={{ background: formEditar.color }} disabled={guardandoEditar || subiendoBannerEditar || !formEditar.nombre.trim()}>
                                {subiendoBannerEditar ? 'Subiendo imagen...' : guardandoEditar ? 'Guardando...' : 'Guardar cambios'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default TablaComunidadesAdmin
