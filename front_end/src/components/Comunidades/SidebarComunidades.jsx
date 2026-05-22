import React, { useState } from 'react'
import '../../styles/EstilosSidebar/SidebarComunidades.css'
import Fetch from '../../services/Fetch'


const ICONOS = ['🎨', '🎵', '💻', '📸', '✍️', '🎭', '🎬', '🏛️', '🌿', '🎧', '🖌️', '📐', '🧵', '🎙️', '🖼️', '🎮']
const COLORES = ['#0ea5e9', '#8b5cf6', '#f43f5e', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#6366f1', '#14b8a6', '#f97316']
const CATEGORIAS_MODAL = [
    'Diseño y creatividad visual', 'UX/UI', 'Desarrollo y tecnología creativa',
    'Multimedia y animación', 'Fotografía y arte visual', 'Publicidad y marketing',
    'Arquitectura', 'Diseño de interiores', 'Diseño industrial', 'Educación',
    'Escritura y contenido', 'Manualidades y arte hecho a mano', 'Moda y costura',
    'Música y producción sonora', 'Ilustración', 'Modelado 3D',
]

function SidebarComunidades({
    misComunidades = [],
    comunidadActiva = null,
    usuario = null,
    onSeleccionar,
    onExplorar,
    onComunidadCreada,
}) {
    const [modalAbierto, setModalAbierto] = useState(false)
    const [guardando, setGuardando] = useState(false)
    const [form, setForm] = useState({
        nombre: '', descripcion: '', categoria: CATEGORIAS_MODAL[0],
        icono: ICONOS[0], color: COLORES[0], banner: '',
    })
    const [bannerPreview, setBannerPreview] = useState('')

    const handleChange = (campo, valor) => setForm(prev => ({ ...prev, [campo]: valor }))

    const handleBanner = (e) => {
        const file = e.target.files?.[0]
        if (!file) return
        const url = URL.createObjectURL(file)
        setBannerPreview(url)
        handleChange('banner', url)
    }

    const handleCrear = async (e) => {
        e.preventDefault()
        if (!form.nombre.trim() || !form.descripcion.trim()) return
        setGuardando(true)
        try {
            const nueva = await Fetch.postData('comunidades', {
                nombre:      form.nombre.trim(),
                descripcion: form.descripcion.trim(),
                icono:       form.icono,
                Color:       form.color,
                ColorClaro:  form.color + '22',
                banner:      form.banner || null,
            })
            // Normalizar para el frontend
            const normalizada = {
                id:          nueva.id_comunidad,
                nombre:      nueva.nombre,
                descripcion: nueva.descripcion,
                icono:       nueva.icono || form.icono,
                color:       nueva.Color || form.color,
                colorClaro:  nueva.ColorClaro || form.color + '22',
                banner:      nueva.banner || '',
                categoria:   form.categoria,
            }
            onComunidadCreada?.(normalizada)
            setModalAbierto(false)
            setBannerPreview('')
            setForm({ nombre: '', descripcion: '', categoria: CATEGORIAS_MODAL[0], icono: ICONOS[0], color: COLORES[0], banner: '' })
        } catch (err) {
            console.error(err)
            alert(err.message || 'Error al crear la comunidad')
        } finally {
            setGuardando(false)
        }
    }

    return (
        <>
            <aside className="sb" id="sidebar-comunidades">
                <div className="sb__scroll">

                    {/* DISCOVERY */}
                    <div className="sb__section">
                        <p className="sb__section-label">Discovery</p>
                        <ul className="sb__nav">
                            <li>
                                <button
                                    className={`sb__nav-item ${!comunidadActiva ? 'sb__nav-item--activo' : ''}`}
                                    onClick={() => { onExplorar?.(); onCategoria?.('Todas') }}
                                >
                                    <span className="sb__nav-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                                    </span>
                                    Todas las comunidades
                                </button>
                            </li>
                        </ul>
                    </div>

                    {/* MIS COMUNIDADES */}
                    <div className="sb__section">
                        <p className="sb__section-label">Mis comunidades</p>
                        {!usuario ? (
                            <p className="sb__empty-txt">Inicia sesión para ver tus comunidades.</p>
                        ) : misComunidades.length === 0 ? (
                            <p className="sb__empty-txt">Aún no te has unido a ninguna.</p>
                        ) : (
                            <ul className="sb__nav">
                                {misComunidades.map(com => (
                                    <li key={com.id}>
                                        <button
                                            className={`sb__nav-item ${comunidadActiva?.id === com.id ? 'sb__nav-item--activo' : ''}`}
                                            onClick={() => onSeleccionar?.(com)}
                                        >
                                            <span className="sb__nav-icon sb__nav-icon--emoji" style={{ background: com.color + '22' }}>
                                                {com.icono}
                                            </span>
                                            {com.nombre}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* CTA card */}
                    <div className="sb__cta">
                        <p className="sb__cta-titulo">¿No encuentras tu nicho?</p>
                        <p className="sb__cta-desc">Crea tu propia comunidad y reúne a personas con tu misma pasión.</p>
                        {usuario ? (
                            <button className="sb__cta-btn" onClick={() => setModalAbierto(true)} id="btn-abrir-crear-comunidad">
                                Crear comunidad
                            </button>
                        ) : (
                            <a href="/Iniciar" className="sb__cta-btn">Iniciar sesión</a>
                        )}
                    </div>

                </div>
            </aside>

            {/* Modal crear comunidad */}
            {modalAbierto && (
                <div className="sb-modal-overlay" onClick={() => setModalAbierto(false)}>
                    <div className="sb-modal" onClick={e => e.stopPropagation()}>
                        <div className="sb-modal__header">
                            <h2 className="sb-modal__titulo">Nueva comunidad</h2>
                            <button className="sb-modal__close" onClick={() => setModalAbierto(false)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                            </button>
                        </div>
                        <form className="sb-modal__form" onSubmit={handleCrear}>
                            <div className="sb-modal__preview" style={{ background: form.color + '18', borderColor: form.color + '44' }}>
                                <span className="sb-modal__preview-icono" style={{ background: form.color + '30', color: form.color }}>{form.icono}</span>
                                <div>
                                    <p className="sb-modal__preview-nombre">{form.nombre || 'Nombre de la comunidad'}</p>
                                    <p className="sb-modal__preview-cat">{form.categoria}</p>
                                </div>
                            </div>

                            <div className="sb-modal__campo">
                                <label className="sb-modal__label">Imagen de portada</label>
                                <label className="sb-modal__banner-upload" style={bannerPreview ? { backgroundImage: `url(${bannerPreview})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}>
                                    {!bannerPreview && (
                                        <span className="sb-modal__banner-placeholder">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                                            <span>Subir portada</span>
                                        </span>
                                    )}
                                    {bannerPreview && <span className="sb-modal__banner-change">Cambiar imagen</span>}
                                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleBanner} />
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
                                <select className="sb-modal__select" value={form.categoria} onChange={e => handleChange('categoria', e.target.value)}>
                                    {CATEGORIAS_MODAL.map(cat => <option key={cat} value={cat}>{cat}</option>)}
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
                            <button type="submit" id="btn-crear-comunidad" className="sb-modal__btn-submit" style={{ background: form.color }} disabled={guardando || !form.nombre.trim()}>
                                {guardando ? 'Creando...' : 'Crear comunidad'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    )
}

export default SidebarComunidades
