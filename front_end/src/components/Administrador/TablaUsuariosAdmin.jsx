import React, { useState, useEffect } from 'react'
import Fetch from '../../services/Fetch'
import { useNavigate } from 'react-router-dom'

const API_UBICACIONES = 'https://ubicaciones.paginasweb.cr'

const TablaUsuariosAdmin = () => {
  const navigate = useNavigate()
  const [usuarios, setUsuarios]     = useState([])
  const [busqueda, setBusqueda]     = useState("")
  const [isModalOpen, setIsModalOpen]       = useState(false)
  const [isCrearOpen, setIsCrearOpen]       = useState(false)
  const [datosEditar, setDatosEditar]       = useState({
    id_usuario:      "",
    nombre_completo: "",
    correo:          "",
    telefono:        "",
    provincia:       "",
    canton:          "",
    distrito:        "",
  })
  const [datosCrear, setDatosCrear] = useState({
    nombre_usuario:  "",
    nombre_completo: "",
    correo:          "",
    contrasena:      "",
    telefono:        "",
    provincia:       "",
    canton:          "",
    distrito:        "",
    id_rol:          "2",
  })

  // Ubicaciones para el modal de crear usuario
  const [provincias,   setProvincias]   = useState([])
  const [cantones,     setCantones]     = useState([])
  const [distritos,    setDistritos]    = useState([])
  const [provinciaId,  setProvinciaId]  = useState("")
  const [cantonId,     setCantonId]     = useState("")

  useEffect(() => {
    if (!isCrearOpen) return
    fetch(`${API_UBICACIONES}/provincias.json`)
      .then(r => r.json())
      .then(data => setProvincias(Object.entries(data).map(([id, nombre]) => ({ id, nombre }))))
      .catch(console.error)
  }, [isCrearOpen])

  const handleProvinciaCrear = (id, nombre) => {
    setProvinciaId(id)
    setCantonId("")
    setCantones([])
    setDistritos([])
    setDatosCrear(p => ({ ...p, provincia: nombre, canton: "", distrito: "" }))
    if (!id) return
    fetch(`${API_UBICACIONES}/provincia/${id}/cantones.json`)
      .then(r => r.json())
      .then(data => setCantones(Object.entries(data).map(([id, nombre]) => ({ id, nombre }))))
      .catch(console.error)
  }

  const handleCantonCrear = (id, nombre) => {
    setCantonId(id)
    setDistritos([])
    setDatosCrear(p => ({ ...p, canton: nombre, distrito: "" }))
    if (!id) return
    fetch(`${API_UBICACIONES}/provincia/${provinciaId}/canton/${id}/distritos.json`)
      .then(r => r.json())
      .then(data => setDistritos(Object.entries(data).map(([id, nombre]) => ({ id, nombre }))))
      .catch(console.error)
  }

  useEffect(() => {
    async function traerUsuarios() {
      try {
        const data = await Fetch.getData("usuarios?limit=100")
        setUsuarios(data || [])
      } catch (err) {
        console.error("Error al cargar usuarios:", err)
      }
    }
    traerUsuarios()
  }, [])

  const eliminarUsuario = async (id_usuario) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
      try {
        await Fetch.deleteData(`usuarios/${id_usuario}`)
        setUsuarios(prev => prev.filter(u => u.id_usuario !== id_usuario))
      } catch (err) {
        alert(err.message || "No se pudo eliminar el usuario.")
      }
    }
  }

  const iniciarEdicion = (usuario) => {
    setDatosEditar({
      id_usuario:      usuario.id_usuario,
      nombre_completo: usuario.nombre_completo || '',
      correo:          usuario.correo || '',
      telefono:        usuario.telefono || '',
      provincia:       usuario.provincia || '',
      canton:          usuario.canton || '',
      distrito:        usuario.distrito || '',
    })
    setIsModalOpen(true)
  }

  const guardarEdicion = async () => {
    try {
      await Fetch.putData(`usuarios/${datosEditar.id_usuario}`, {
        nombre_completo: datosEditar.nombre_completo,
        correo:          datosEditar.correo,
        telefono:        datosEditar.telefono,
        provincia:       datosEditar.provincia,
        canton:          datosEditar.canton,
        distrito:        datosEditar.distrito,
      })
      const data = await Fetch.getData("usuarios?limit=100")
      setUsuarios(data || [])
      setIsModalOpen(false)
    } catch (err) {
      alert(err.message || "Error al editar usuario")
    }
  }

  const crearUsuario = async () => {
    const { nombre_usuario, nombre_completo, correo, contrasena, telefono, provincia, canton, distrito, id_rol } = datosCrear
    if (!nombre_usuario || !nombre_completo || !correo || !contrasena) {
      alert("Nombre de usuario, nombre completo, correo y contraseña son obligatorios.")
      return
    }
    try {
      await Fetch.postData('usuarios/register', {
        nombre_usuario, nombre_completo, correo, contrasena,
        telefono, provincia, canton, distrito,
        id_rol: parseInt(id_rol),
      })
      const data = await Fetch.getData("usuarios?limit=100")
      setUsuarios(data || [])
      setIsCrearOpen(false)
      setDatosCrear({ nombre_usuario: "", nombre_completo: "", correo: "", contrasena: "", telefono: "", provincia: "", canton: "", distrito: "", id_rol: "2" })
      setProvinciaId(""); setCantonId(""); setCantones([]); setDistritos([])
    } catch (err) {
      alert(err.message || "Error al crear usuario")
    }
  }

  const usuariosFiltrados = usuarios.filter(u => {
    const nombre  = (u.nombre_completo || u.nombre_usuario || "").toLowerCase()
    const correo  = (u.correo || "").toLowerCase()
    const termino = busqueda.toLowerCase()
    return nombre.includes(termino) || correo.includes(termino)
  })

  return (
    <div className="max-w-7xl mx-auto p-8 font-display">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Gestión de Usuarios</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Administra los accesos y perfiles de tu plataforma.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setIsCrearOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 transition-all shadow-sm active:scale-95"
          >
            <span className="material-symbols-outlined">person_add</span>
            Crear Usuario
          </button>
          <button
            onClick={() => navigate("/FormularioConvo")}
            className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 transition-all shadow-sm active:scale-95"
          >
            <span className="material-symbols-outlined">campaign</span>
            Convocatoria
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex gap-4 items-center mb-6">
        <div className="relative w-full">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
          <input
            type="text"
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-sm outline-none transition-all"
            placeholder="Buscar por nombre o correo electrónico..."
          />
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Usuario</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Correo</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Teléfono</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Ubicación</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {usuariosFiltrados.map(usuario => (
                <tr key={usuario.id_usuario} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden">
                        {usuario.img_perfil
                          ? <img src={usuario.img_perfil} alt={usuario.nombre_completo} className="w-full h-full object-cover" />
                          : <span className="text-primary font-bold">{usuario.nombre_completo?.charAt(0) || '?'}</span>
                        }
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{usuario.nombre_completo}</p>
                        <p className="text-xs text-slate-500">@{usuario.nombre_usuario}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{usuario.correo}</td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{usuario.telefono || '-'}</td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                    {[usuario.provincia, usuario.canton, usuario.distrito].filter(Boolean).join(', ') || '-'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => iniciarEdicion(usuario)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-xl">edit</span>
                      </button>
                      <button onClick={() => eliminarUsuario(usuario.id_usuario)} className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-slate-400 hover:text-red-500 transition-colors">
                        <span className="material-symbols-outlined text-xl">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {usuariosFiltrados.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                    No se encontraron usuarios.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800">
          <p className="text-sm text-slate-500">
            Mostrando <span className="font-medium">{usuariosFiltrados.length}</span> de <span className="font-medium">{usuarios.length}</span> usuarios
          </p>
        </div>
      </div>

      {isCrearOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Crear Usuario</h3>
              <button onClick={() => setIsCrearOpen(false)} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full text-slate-400 transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: 'Nombre de usuario', field: 'nombre_usuario' },
                  { label: 'Nombre completo',   field: 'nombre_completo' },
                  { label: 'Correo',            field: 'correo' },
                  { label: 'Contraseña',        field: 'contrasena', type: 'password' },
                  { label: 'Teléfono',          field: 'telefono' },
                ].map(({ label, field, type }) => (
                  <div key={field} className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">{label}</label>
                    <input
                      type={type || 'text'}
                      value={datosCrear[field]}
                      onChange={e => setDatosCrear(prev => ({ ...prev, [field]: e.target.value }))}
                      className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    />
                  </div>
                ))}

                {/* Ubicación en cascada */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase ml-1">Provincia</label>
                  <select
                    value={provinciaId}
                    onChange={e => { const opt = e.target.options[e.target.selectedIndex]; handleProvinciaCrear(e.target.value, opt.text) }}
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="">Seleccionar provincia</option>
                    {provincias.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase ml-1">Cantón</label>
                  <select
                    value={cantonId}
                    disabled={!provinciaId}
                    onChange={e => { const opt = e.target.options[e.target.selectedIndex]; handleCantonCrear(e.target.value, opt.text) }}
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none cursor-pointer disabled:opacity-50"
                  >
                    <option value="">Seleccionar cantón</option>
                    {cantones.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase ml-1">Distrito</label>
                  <select
                    value={datosCrear.distrito}
                    disabled={!cantonId}
                    onChange={e => setDatosCrear(p => ({ ...p, distrito: e.target.value }))}
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none cursor-pointer disabled:opacity-50"
                  >
                    <option value="">Seleccionar distrito</option>
                    {distritos.map(d => <option key={d.id} value={d.nombre}>{d.nombre}</option>)}
                  </select>
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs font-bold text-slate-500 uppercase ml-1">Rol</label>
                  <select
                    value={datosCrear.id_rol}
                    onChange={e => setDatosCrear(prev => ({ ...prev, id_rol: e.target.value }))}
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  >
                    <option value="1">Admin</option>
                    <option value="2">Personal</option>
                    <option value="3">Empresa</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
              <button onClick={() => setIsCrearOpen(false)} className="px-6 py-2.5 rounded-xl text-slate-600 font-bold hover:bg-slate-200 transition-all">Cancelar</button>
              <button onClick={crearUsuario} className="px-8 py-2.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 shadow-lg active:scale-95 transition-all">
                Crear Usuario
              </button>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Editar Usuario</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full text-slate-400 transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: 'Nombre Completo', field: 'nombre_completo' },
                  { label: 'Correo',          field: 'correo' },
                  { label: 'Teléfono',        field: 'telefono' },
                  { label: 'Provincia',       field: 'provincia' },
                  { label: 'Cantón',          field: 'canton' },
                  { label: 'Distrito',        field: 'distrito' },
                ].map(({ label, field }) => (
                  <div key={field} className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">{label}</label>
                    <input
                      value={datosEditar[field]}
                      onChange={e => setDatosEditar(prev => ({ ...prev, [field]: e.target.value }))}
                      className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 rounded-xl text-slate-600 font-bold hover:bg-slate-200 transition-all">Cancelar</button>
              <button onClick={guardarEdicion} className="px-8 py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 shadow-lg shadow-primary/20 active:scale-95 transition-all">
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TablaUsuariosAdmin
