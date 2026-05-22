import React, { useState, useEffect } from 'react'
import Fetch from '../../services/Fetch'
import { normalizarUsuario } from '../../utils/normalizers'

const DashboardAdmin = () => {
  const [usuarios, setUsuarios] = useState([])
  const [portafolios, setPortafolios] = useState([])
  const [respuestas] = useState([])

  useEffect(() => {
    async function traerDatos() {
      try {
        const [resU, resP] = await Promise.all([
          Fetch.getData("usuarios?limit=100"),
          Fetch.getData("portafolios?limit=100"),
        ]);
        setUsuarios((resU || []).map(normalizarUsuario))
        setPortafolios(resP || [])
      } catch (error) {
        console.error("Error trayendo datos del dashboard", error)
      }
    }
    traerDatos()
  }, [])

  const participanTab = respuestas.filter(r => r.respuesta === "Participar");
  const noParticipanTab = respuestas.filter(r => r.respuesta === "No participar");

  return (
    <div className="max-w-7xl mx-auto p-8 font-display">
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Dashboard</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Resumen general de tu plataforma y convocatorias.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-center transition-all hover:shadow-md">
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 text-primary p-3 rounded-lg shadow-sm">
              <span className="material-symbols-outlined text-3xl font-variation-settings-fill-1">group</span>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Usuarios</p>
              <h3 className="text-4xl font-black text-slate-900 dark:text-white leading-tight">{usuarios.length}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-center transition-all hover:shadow-md border-l-4 border-l-blue-500">
          <div className="flex items-center gap-4">
            <div className="bg-blue-500/10 text-blue-500 p-3 rounded-lg">
              <span className="material-symbols-outlined text-3xl">check_circle</span>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Aceptaron Convocatoria</p>
              <h3 className="text-4xl font-black text-slate-900 dark:text-white leading-tight">{participanTab.length}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-center transition-all hover:shadow-md border-l-4 border-l-slate-400">
          <div className="flex items-center gap-4">
            <div className="bg-slate-500/10 text-slate-500 p-3 rounded-lg">
              <span className="material-symbols-outlined text-3xl">cancel</span>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Aceptaron Convocatoria</p>
              <h3 className="text-4xl font-black text-slate-900 dark:text-white leading-tight">{participanTab.length}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-center transition-all hover:shadow-md border-l-4 border-l-slate-400">
          <div className="flex items-center gap-4">
            <div className="bg-slate-500/10 text-slate-500 p-3 rounded-lg">
              <span className="material-symbols-outlined text-3xl">cancel</span>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">No Participan</p>
              <h3 className="text-4xl font-black text-slate-900 dark:text-white leading-tight">{noParticipanTab.length}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-8">

        {/* Responses Table - Full width */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-blue-50/30">
            <h3 className="text-lg font-bold text-blue-900 dark:text-blue-200">Respuestas a Convocatorias</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Usuario</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Convocatoria</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Respuesta</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {respuestas.slice().reverse().map((resp, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">
                      {resp.usuarioNombre}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                      {resp.convocatoriaNombre}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${resp.respuesta === 'Participar'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                        }`}>
                        {resp.respuesta === 'Participar' ? 'SÍ' : 'NO'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-400">
                      {resp.fecha}
                    </td>
                  </tr>
                ))}
                {respuestas.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-slate-400 text-sm italic">
                      Aún no hay respuestas registradas.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Simplified User List - Full Width Below */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50/50">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Lista de Usuarios</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Usuario</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Email</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Rol</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Ubicación</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {usuarios.map((usuario) => (
                  <tr key={usuario.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden">
                          <span className="text-primary text-xs font-bold">{usuario.Nombre?.charAt(0)}</span>
                        </div>
                        <span className="text-sm font-semibold text-slate-900 dark:text-white">{usuario.Nombre}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{usuario.Correo}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${usuario.Roles === 'Admin'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
                        }`}>
                        {usuario.Roles}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500">
                      {`${usuario.Provincias || ''}, ${usuario.Canton || ''}, ${usuario.Distrito || ''}`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  )
}

export default DashboardAdmin