import React, { useState, useEffect } from 'react'
import Fetch from '../../services/Fetch'
import { normalizarUsuario } from '../../utils/normalizers'

const ROL_NOMBRE = { 1: 'Admin', 2: 'Personal', 3: 'Empresa' }
const ROL_COLOR  = {
    1: 'bg-blue-100 text-blue-800',
    2: 'bg-amber-100 text-amber-800',
    3: 'bg-green-100 text-green-800',
}

const DashboardAdmin = () => {
    const [usuarios, setUsuarios]     = useState([])
    const [portafolios, setPortafolios] = useState([])
    const [cargando, setCargando]     = useState(true)

    useEffect(() => {
        async function traerDatos() {
            try {
                const [resU, resP] = await Promise.all([
                    Fetch.getData("usuarios?limit=200"),
                    Fetch.getData("portafolios?limit=200"),
                ])
                setUsuarios((resU || []).map(normalizarUsuario))
                setPortafolios(resP || [])
            } catch (error) {
                console.error("Error trayendo datos del dashboard", error)
            } finally {
                setCargando(false)
            }
        }
        traerDatos()
    }, [])

    const totalEmpresas  = usuarios.filter(u => u.id_rol === 3).length
    const totalPersonales = usuarios.filter(u => u.id_rol === 2).length

    return (
        <div className="max-w-7xl mx-auto p-8 font-display">
            <div className="mb-8">
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Dashboard</h2>
                <p className="text-slate-500 mt-1">Resumen general de la plataforma.</p>
            </div>

            {/* ── Tarjetas de estadísticas ── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-all">
                    <div className="bg-sky-100 text-sky-600 p-3 rounded-lg">
                        <span className="material-symbols-outlined text-3xl">group</span>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Usuarios</p>
                        <h3 className="text-4xl font-black text-slate-900 leading-tight">
                            {cargando ? '—' : usuarios.length}
                        </h3>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-all border-l-4 border-l-violet-500">
                    <div className="bg-violet-100 text-violet-600 p-3 rounded-lg">
                        <span className="material-symbols-outlined text-3xl">folder_special</span>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Portafolios</p>
                        <h3 className="text-4xl font-black text-slate-900 leading-tight">
                            {cargando ? '—' : portafolios.length}
                        </h3>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-all border-l-4 border-l-emerald-500">
                    <div className="bg-emerald-100 text-emerald-600 p-3 rounded-lg">
                        <span className="material-symbols-outlined text-3xl">business</span>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Empresas / Personales</p>
                        <h3 className="text-4xl font-black text-slate-900 leading-tight">
                            {cargando ? '—' : `${totalEmpresas} / ${totalPersonales}`}
                        </h3>
                    </div>
                </div>
            </div>

            {/* ── Lista de Usuarios ── */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-200 bg-slate-50/50">
                    <h3 className="text-lg font-bold text-slate-900">Lista de Usuarios</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Usuario</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Email</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Rol</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Ubicación</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {cargando ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-8 text-center text-slate-400 text-sm">
                                        Cargando...
                                    </td>
                                </tr>
                            ) : usuarios.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-8 text-center text-slate-400 text-sm italic">
                                        No hay usuarios registrados.
                                    </td>
                                </tr>
                            ) : (
                                usuarios.map((usuario) => (
                                    <tr key={usuario.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="size-8 rounded-full bg-sky-100 flex items-center justify-center overflow-hidden shrink-0">
                                                    {usuario.img
                                                        ? <img src={usuario.img} alt={usuario.Nombre} className="w-full h-full object-cover" />
                                                        : <span className="text-sky-600 text-xs font-bold">{usuario.Nombre?.charAt(0)}</span>
                                                    }
                                                </div>
                                                <span className="text-sm font-semibold text-slate-900">{usuario.Nombre}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">{usuario.Correo}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${ROL_COLOR[usuario.id_rol] || 'bg-slate-100 text-slate-600'}`}>
                                                {ROL_NOMBRE[usuario.id_rol] || 'Sin rol'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-xs text-slate-500">
                                            {[usuario.Provincias, usuario.Canton, usuario.Distrito].filter(Boolean).join(', ') || '—'}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default DashboardAdmin
