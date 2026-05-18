import { useState } from 'react'
import Fetch from '../../services/Fetch'
import '../../styles/Principales/AdminComunidad.css'

const ICONOS = ['🎨', '🎵', '💻', '📸', '✍️', '🎭', '🎬', '🏛️', '🌿', '🎧', '🖌️', '📐', '🧵', '🎙️', '🖼️', '🎮']
const COLORES = ['#0ea5e9', '#8b5cf6', '#f43f5e', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#6366f1', '#14b8a6', '#f97316']
const CATEGORIAS = [
    'Diseño y creatividad visual', 'UX/UI', 'Desarrollo y tecnología creativa',
    'Multimedia y animación', 'Fotografía y arte visual', 'Publicidad y marketing',
    'Arquitectura', 'Diseño de interiores', 'Diseño industrial', 'Educación',
    'Escritura y contenido', 'Manualidades y arte hecho a mano', 'Moda y costura',
    'Música y producción sonora', 'Ilustración', 'Modelado 3D',
]

function TabEditar({ comunidad, onGuardado }) {
    const [form, setForm] = useState({
        nombre: comunidad.nombre || '',
        descripcion: comunidad.descripcion || '',
        categoria: comunidad.categoria || CATEGORIAS[0],
        icono: comunidad.icono || '🎨',
        color: comunidad.color || '#0ea5e9',
        banner: comunidad.banner || '',
    })
    const [bannerPreview, setBannerPreview] = useState(comunidad.banner || '')
    const [guardando, setGuardando] = useState(false)
    const [ok, setOk] = useState(false)

    const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

    const handleBanner = (e) => {
        const file = e.target.files?.[0]
        if (!file) return
        const url = URL.createObjectURL(file)
        setBannerPreview(url)
        set('banner', url)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setGuardando(true)
        try {
            const actualizada = await Fetch.patchData('comunidades', {
                ...form,
                colorClaro: form.color + '22',
            }, comunidad.id)
            setOk(true)
            setTimeout(() => setOk(false), 2500)
            onGuardado?.(actualizada)
        } catch (err) { console.error(err) }
        finally { setGuardando(false) }
    }

    return (
        <form className="adm-form" onSubmit={handleSubmit}>
            {/* Preview */}
            <div className="adm-preview" style={{ background: form.color + '18', borderColor: form.color + '44' }}>
                <span className="adm-preview__icono" style={{ background: form.color + '30', color: form.color }}>{form.icono}</span>
                <div>
                    <p className="adm-preview__nombre">{form.nombre || 'Nombre'}</p>
                    <p className="adm-preview__cat">{form.categoria}</p>
                </div>
            </div>

            {/* Banner */}
            <div className="adm-campo">
                <label className="adm-label">Imagen de portada</label>
                <label className="adm-banner" style={bannerPreview ? { backgroundImage: `url(${bannerPreview})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}>
                    {!bannerPreview
                        ? <span className="adm-banner__placeholder">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                            <span>Subir portada</span>
                          </span>
                        : <span className="adm-banner__change">Cambiar imagen</span>
                    }
                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleBanner} />
                </label>
            </div>

            <div className="adm-campo">
                <label className="adm-label">Nombre</label>
                <input className="adm-input" type="text" value={form.nombre} onChange={e => set('nombre', e.target.value)} maxLength={60} required />
            </div>
            <div className="adm-campo">
                <label className="adm-label">Descripción</label>
                <textarea className="adm-textarea" value={form.descripcion} onChange={e => set('descripcion', e.target.value)} rows={3} maxLength={200} required />
            </div>
            <div className="adm-campo">
                <label className="adm-label">Categoría</label>
                <select className="adm-select" value={form.categoria} onChange={e => set('categoria', e.target.value)}>
                    {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>
            <div className="adm-campo">
                <label className="adm-label">Ícono</label>
                <div className="adm-iconos">
                    {ICONOS.map(ic => (
                        <button key={ic} type="button" className={`adm-icono-btn ${form.icono === ic ? 'adm-icono-btn--activo' : ''}`} onClick={() => set('icono', ic)}>{ic}</button>
                    ))}
                </div>
            </div>
            <div className="adm-campo">
                <label className="adm-label">Color</label>
                <div className="adm-colores">
                    {COLORES.map(col => (
                        <button key={col} type="button" className={`adm-color-btn ${form.color === col ? 'adm-color-btn--activo' : ''}`} style={{ background: col }} onClick={() => set('color', col)} />
                    ))}
                </div>
            </div>

            <button type="submit" className="adm-btn-submit" style={{ background: form.color }} disabled={guardando}>
                {ok ? '✓ Guardado' : guardando ? 'Guardando...' : 'Guardar cambios'}
            </button>
        </form>
    )
}

function TabMiembros({ comunidad, miembros, onExpulsar }) {
    const miembrosDeCom = miembros.filter(m => m.comunidadId === comunidad.id)
    const [expulsando, setExpulsando] = useState(null)

    const handleExpulsar = async (m) => {
        setExpulsando(m.id)
        try {
            await Fetch.deleteData('miembros_comunidades', m.id)
            onExpulsar?.(m.id)
        } catch (err) { console.error(err) }
        finally { setExpulsando(null) }
    }

    return (
        <div className="adm-miembros">
            <p className="adm-miembros__count">{miembrosDeCom.length} miembro{miembrosDeCom.length !== 1 ? 's' : ''}</p>
            {miembrosDeCom.length === 0 ? (
                <p className="adm-empty">Esta comunidad no tiene miembros aún.</p>
            ) : (
                <ul className="adm-miembros__lista">
                    {miembrosDeCom.map(m => (
                        <li key={m.id} className="adm-miembro-item">
                            <div className="adm-miembro-avatar" style={{ background: comunidad.color }}>
                                {m.usuarioNombre?.[0]?.toUpperCase() || '?'}
                            </div>
                            <span className="adm-miembro-nombre">{m.usuarioNombre}</span>
                            <button
                                className="adm-btn-expulsar"
                                onClick={() => handleExpulsar(m)}
                                disabled={expulsando === m.id}
                                title="Expulsar de la comunidad"
                            >
                                {expulsando === m.id
                                    ? <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                                    : <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="18" y1="8" x2="23" y2="13"/><line x1="23" y1="8" x2="18" y2="13"/></svg>
                                }
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

function TabConvocatoria({ comunidad, usuario, onCreada }) {
    const [form, setForm] = useState({ nombre: '', descripcion: '' })
    const [guardando, setGuardando] = useState(false)
    const [ok, setOk] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!form.nombre.trim()) return
        setGuardando(true)
        try {
            const msg = await Fetch.postData({
                comunidadId: comunidad.id,
                usuarioId: usuario.id,
                usuarioNombre: usuario.Nombre,
                texto: form.descripcion.trim(),
                convocatoriaNombre: form.nombre.trim(),
                esConvocatoria: true,
                fecha: new Date().toISOString(),
            }, 'mensajes_comunidad')
            onCreada?.(msg)
            setOk(true)
            setForm({ nombre: '', descripcion: '' })
            setTimeout(() => setOk(false), 2500)
        } catch (err) { console.error(err) }
        finally { setGuardando(false) }
    }

    return (
        <form className="adm-form" onSubmit={handleSubmit}>
            <p className="adm-convo-hint">La convocatoria aparecerá como una tarjeta especial en el chat de la comunidad.</p>
            <div className="adm-campo">
                <label className="adm-label">Título de la convocatoria</label>
                <input className="adm-input" type="text" placeholder="Ej: Búsqueda de diseñador UX" value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} maxLength={80} required />
            </div>
            <div className="adm-campo">
                <label className="adm-label">Descripción</label>
                <textarea className="adm-textarea" placeholder="Requisitos, fechas, detalles..." value={form.descripcion} onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))} rows={4} maxLength={400} />
            </div>
            <button type="submit" className="adm-btn-submit" style={{ background: comunidad.color }} disabled={guardando || !form.nombre.trim()}>
                {ok ? '✓ Convocatoria publicada' : guardando ? 'Publicando...' : 'Publicar convocatoria'}
            </button>
        </form>
    )
}

function ModalAdminComunidad({ comunidad, usuario, miembros, onClose, onComunidadActualizada, onMiembroExpulsado, onConvocatoriaCreada }) {
    const [tab, setTab] = useState('editar')

    const TABS = [
        { id: 'editar', label: 'Editar comunidad' },
        { id: 'miembros', label: `Miembros (${miembros.filter(m => m.comunidadId === comunidad.id).length})` },
        { id: 'convocatoria', label: 'Nueva convocatoria' },
    ]

    return (
        <div className="adm-overlay" onClick={onClose}>
            <div className="adm-modal" onClick={e => e.stopPropagation()}>
                <div className="adm-modal__header">
                    <div className="adm-modal__title-group">
                        <span className="adm-modal__icono" style={{ background: comunidad.color + '22', color: comunidad.color }}>{comunidad.icono}</span>
                        <div>
                            <h2 className="adm-modal__titulo">Gestionar comunidad</h2>
                            <p className="adm-modal__sub">{comunidad.nombre}</p>
                        </div>
                    </div>
                    <button className="adm-modal__close" onClick={onClose}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                </div>

                <div className="adm-tabs">
                    {TABS.map(t => (
                        <button key={t.id} className={`adm-tab ${tab === t.id ? 'adm-tab--activo' : ''}`} onClick={() => setTab(t.id)}
                            style={tab === t.id ? { borderBottomColor: comunidad.color, color: comunidad.color } : {}}>
                            {t.label}
                        </button>
                    ))}
                </div>

                <div className="adm-modal__body">
                    {tab === 'editar' && (
                        <TabEditar comunidad={comunidad} onGuardado={onComunidadActualizada} />
                    )}
                    {tab === 'miembros' && (
                        <TabMiembros comunidad={comunidad} miembros={miembros} onExpulsar={onMiembroExpulsado} />
                    )}
                    {tab === 'convocatoria' && (
                        <TabConvocatoria comunidad={comunidad} usuario={usuario} onCreada={onConvocatoriaCreada} />
                    )}
                </div>
            </div>
        </div>
    )
}

export default ModalAdminComunidad
