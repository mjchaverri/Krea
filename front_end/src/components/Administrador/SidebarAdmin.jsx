import React, { useEffect, useState } from 'react'
import Fetch from '../../services/Fetch'

function SidebarAdmin({ mostrandoDashboard, mostrandoUsuarios, mostrandoPortafolio }) {
  const [admin, setAdmin] = useState({ Nombre: 'Admin User', Correo: 'admin@proshowcase.com' });

  useEffect(() => {
    // Obtener datos del admin real desde el localStorage
    const userString = localStorage.getItem("UsuarioActivo");
    if (userString) {
      setAdmin(JSON.parse(userString));
    }
  }, []);

  const handleLogout = () => {
    Fetch.logoutClient()
  };

  return (
    <aside className="w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col shrink-0 h-screen sticky top-0">
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="bg-primary size-10 rounded-lg flex items-center justify-center text-white">
            <span className="material-symbols-outlined">auto_awesome_motion</span>
          </div>
          <div className="flex flex-col">
            <h1 className="text-slate-900 dark:text-white text-lg font-bold leading-tight">ProShowcase</h1>
            <p className="text-slate-500 dark:text-slate-400 text-xs font-medium uppercase tracking-wider">Admin Panel</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        <button 
          onClick={mostrandoDashboard}
          className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors text-left"
        >
          <span className="material-symbols-outlined">dashboard</span>
          <span className="text-sm font-semibold">Dashboard</span>
        </button>

        <button 
          onClick={mostrandoUsuarios}
          className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors text-left"
        >
          <span className="material-symbols-outlined">group</span>
          <span className="text-sm font-semibold">Gestión de Usuarios</span>
        </button>

        <button 
          onClick={mostrandoPortafolio}
          className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors text-left"
        >
          <span className="material-symbols-outlined">folder_special</span>
          <span className="text-sm font-semibold">Gestión de Portafolios</span>
        </button>
      </nav>

      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3 p-2">
          <div className="size-10 rounded-full bg-slate-200 overflow-hidden shrink-0">
            {admin.Imagen ? (
              <img src={admin.Imagen} alt={admin.Nombre} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-primary/20 text-primary font-bold">
                {admin.Nombre?.charAt(0)}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold truncate text-slate-900 dark:text-white">{admin.Nombre}</p>
            <p className="text-xs text-slate-500 truncate">{admin.Correo}</p>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors bg-none border-none cursor-pointer"
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