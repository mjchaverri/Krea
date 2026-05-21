import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const NAV_ITEMS = [
    { id: 'dashboard',     icon: 'dashboard',       label: 'Dashboard' },
    { id: 'usuarios',      icon: 'group',            label: 'Gestión de Usuarios' },
    { id: 'portafolio',    icon: 'folder_special',   label: 'Gestión de Portafolios' },
    { id: 'convocatorias', icon: 'campaign',         label: 'Convocatorias' },
    { id: 'comunidades',   icon: 'groups',           label: 'Comunidades' },
]

function SidebarAdmin({ vistaActual, mostrandoDashboard, mostrandoUsuarios, mostrandoPortafolio, mostrandoConvocatorias, mostrandoComunidades }) {
    const [admin, setAdmin] = useState({ Nombre: 'Admin User', Correo: 'admin@proshowcase.com' })
    const navigate = useNavigate()

    useEffect(() => {
        const userString = localStorage.getItem("UsuarioActivo")
        if (userString) {
            try { setAdmin(JSON.parse(userString)) } catch {}
        }
    }, [])

    const handlers = {
        dashboard:     mostrandoDashboard,
        usuarios:      mostrandoUsuarios,
        portafolio:    mostrandoPortafolio,
        convocatorias: mostrandoConvocatorias,
        comunidades:   mostrandoComunidades,
    }

    const handleLogout = () => {
        localStorage.removeItem("UsuarioActivo")
        localStorage.removeItem("idUsuario")
        window.location.href = "/"
    }

    return (
        <aside className="w-72 bg-white border-r border-slate-200 flex flex-col shrink-0 h-screen sticky top-0">
            <div className="p-6">
                <div className="flex items-center gap-3">
                    <div className="bg-primary size-10 rounded-lg flex items-center justify-center text-white">
                        <span className="material-symbols-outlined">auto_awesome_motion</span>
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-slate-900 text-lg font-bold leading-tight">ProShowcase</h1>
                        <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">Admin Panel</p>
                    </div>
                </div>
            </div>

            <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
                {NAV_ITEMS.map(item => (
                    <button
                        key={item.id}
                        onClick={handlers[item.id]}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left text-sm font-semibold
                            ${vistaActual === item.id
                                ? 'bg-sky-50 text-sky-700'
                                : 'text-slate-600 hover:bg-slate-50'
                            }`}
                    >
                        <span className="material-symbols-outlined">{item.icon}</span>
                        {item.label}
                    </button>
                ))}

                <div style={{ borderTop: '1px solid #e2e8f0', margin: '12px 0' }} />

                <button
                    onClick={() => navigate('/principal')}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left text-sm font-semibold text-emerald-600 hover:bg-emerald-50"
                >
                    <span className="material-symbols-outlined">open_in_new</span>
                    Ir a la plataforma
                </button>
            </nav>

            <div className="p-4 border-t border-slate-200">
                <div className="flex items-center gap-3 p-2">
                    <div className="size-10 rounded-full bg-slate-200 overflow-hidden shrink-0">
                        {admin.img_perfil ? (
                            <img src={admin.img_perfil} alt={admin.Nombre} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-sky-100 text-sky-600 font-bold text-sm">
                                {admin.Nombre?.charAt(0) || admin.nombre_completo?.charAt(0)}
                            </div>
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold truncate text-slate-900">
                            {admin.Nombre || admin.nombre_completo}
                        </p>
                        <p className="text-xs text-slate-500 truncate">
                            {admin.Correo || admin.correo}
                        </p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors bg-transparent border-none cursor-pointer"
                        title="Cerrar sesión"
                    >
                        <span className="material-symbols-outlined">logout</span>
                    </button>
                </div>
            </div>
        </aside>
    )
}

export default SidebarAdmin
