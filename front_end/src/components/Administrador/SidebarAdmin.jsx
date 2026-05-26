import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Fetch from '../../services/Fetch'

const NAV_ITEMS = [
    { id: 'dashboard', icon: 'dashboard', label: 'Dashboard' },
    { id: 'usuarios', icon: 'group', label: 'Usuarios' },
    { id: 'portafolio', icon: 'folder_special', label: 'Portafolios' },
    { id: 'comunidades', icon: 'groups', label: 'Comunidades' },
    { id: 'convocatorias', icon: 'campaign', label: 'Convocatorias' },
    { id: 'resenas', icon: 'star', label: 'Reseñas' },
]

function SidebarAdmin({ vistaActual, mostrandoDashboard, mostrandoUsuarios, mostrandoPortafolio, mostrandoConvocatorias, mostrandoComunidades, mostrandoResenas }) {
    const [admin, setAdmin] = useState({ Nombre: 'Admin', correo: 'admin@krea.com' })
    const navigate = useNavigate()

    useEffect(() => {
        const s = localStorage.getItem('UsuarioActivo')
        if (s) try { setAdmin(JSON.parse(s)) } catch { }
    }, [])

    const handlers = {
        dashboard: mostrandoDashboard,
        usuarios: mostrandoUsuarios,
        portafolio: mostrandoPortafolio,
        convocatorias: mostrandoConvocatorias,
        comunidades: mostrandoComunidades,
        resenas: mostrandoResenas,
    }

    const nombreCorto = (admin.Nombre || admin.nombre_completo || 'Admin').split(' ')[0]

    return (
        <aside style={{
            width: 240,
            background: '#fff',
            borderRight: '1px solid #e8edf2',
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            flexShrink: 0,
        }}>
            {/* Logo */}
            <div style={{ padding: '24px 20px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 26, fontWeight: 900, color: '#0ea5e9', letterSpacing: '-1px' }}>Krea</span>
                    <span style={{
                        fontSize: 10, fontWeight: 700, color: '#0ea5e9',
                        background: '#e0f2fe', borderRadius: 4, padding: '2px 7px',
                        letterSpacing: 1,
                    }}>ADMIN</span>
                </div>
            </div>

            {/* Nav */}
            <nav style={{ flex: 1, padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: 2, overflowY: 'auto' }}>
                {NAV_ITEMS.map(item => {
                    const activo = vistaActual === item.id
                    return (
                        <button
                            key={item.id}
                            onClick={handlers[item.id]}
                            style={{
                                display: 'flex', alignItems: 'center', gap: 12,
                                padding: '10px 14px', borderRadius: 10,
                                border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left',
                                fontSize: 14, fontWeight: 600, transition: 'all 0.15s',
                                background: activo ? '#0ea5e9' : 'transparent',
                                color: activo ? '#fff' : '#64748b',
                            }}
                            onMouseEnter={e => { if (!activo) e.currentTarget.style.background = '#f1f5f9' }}
                            onMouseLeave={e => { if (!activo) e.currentTarget.style.background = 'transparent' }}
                        >
                            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>{item.icon}</span>
                            {item.label}
                        </button>
                    )
                })}

                <div style={{ borderTop: '1px solid #f1f5f9', margin: '8px 0' }} />

                <button
                    onClick={() => navigate('/principal')}
                    style={{
                        display: 'flex', alignItems: 'center', gap: 12,
                        padding: '10px 14px', borderRadius: 10,
                        border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left',
                        fontSize: 14, fontWeight: 600, background: 'transparent', color: '#10b981',
                        transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#f0fdf4' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
                >
                    <span className="material-symbols-outlined" style={{ fontSize: 20 }}>open_in_new</span>
                    Ir a la plataforma
                </button>
            </nav>

            {/* User */}
            <div style={{ padding: '12px 16px', borderTop: '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                        width: 36, height: 36, borderRadius: '50%',
                        background: '#e0f2fe', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', flexShrink: 0, overflow: 'hidden',
                    }}>
                        {admin.img || admin.img_perfil
                            ? <img src={admin.img || admin.img_perfil} alt={nombreCorto} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            : <span style={{ color: '#0ea5e9', fontWeight: 800, fontSize: 14 }}>{nombreCorto.charAt(0)}</span>
                        }
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {admin.Nombre || admin.nombre_completo || 'Admin'}
                        </p>
                        <p style={{ fontSize: 10, fontWeight: 700, color: '#0ea5e9', margin: 0, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                            Super Admin
                        </p>
                    </div>
                    <button
                        title="Cerrar sesión"
                        onClick={() => Fetch.logoutClient()}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 4 }}
                    >
                        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>logout</span>
                    </button>
                </div>
            </div>
        </aside>
    )
}

export default SidebarAdmin
