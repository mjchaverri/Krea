import { useState, useEffect } from 'react'
import Fetch from '../../services/Fetch'
import Swal from 'sweetalert2'
import Paginacion from './Paginacion'

const POR_PAGINA = 8

const API_UBICACIONES = 'https://ubicaciones.paginasweb.cr'

const TablaUsuariosAdmin = () => {
  const [usuarios, setUsuarios]     = useState([])
  const [busqueda, setBusqueda]     = useState("")
  const [filtroRol, setFiltroRol]   = useState("TODOS")
  const [orden, setOrden]           = useState("recientes")
  const [pagina, setPagina]         = useState(1)
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

  // Ubicaciones — modal crear
  const [provincias,  setProvincias]  = useState([])
  const [cantones,    setCantones]    = useState([])
  const [distritos,   setDistritos]   = useState([])
  const [provinciaId, setProvinciaId] = useState("")
  const [cantonId,    setCantonId]    = useState("")

  // Ubicaciones — modal editar
  const [provinciasEditar,  setProvinciasEditar]  = useState([])
  const [cantonesEditar,    setCantonesEditar]    = useState([])
  const [distritosEditar,   setDistritosEditar]   = useState([])
  const [provinciaIdEditar, setProvinciaIdEditar] = useState("")
  const [cantonIdEditar,    setCantonIdEditar]    = useState("")

  useEffect(() => {
    if (!isCrearOpen) return
    fetch(`${API_UBICACIONES}/provincias.json`)
      .then(r => r.json())
      .then(data => setProvincias(Object.entries(data).map(([id, nombre]) => ({ id, nombre }))))
      .catch(console.error)
  }, [isCrearOpen])

  // Al abrir el modal de editar: carga provincias y pre-selecciona la guardada
  useEffect(() => {
    if (!isModalOpen) return
    fetch(`${API_UBICACIONES}/provincias.json`)
      .then(r => r.json())
      .then(data => {
        const lista = Object.entries(data).map(([id, nombre]) => ({ id, nombre }))
        setProvinciasEditar(lista)
        const provActual = datosEditar.provincia
        const match = lista.find(p => p.nombre.toLowerCase() === provActual?.toLowerCase())
        if (!match) return
        setProvinciaIdEditar(match.id)
        return fetch(`${API_UBICACIONES}/provincia/${match.id}/cantones.json`)
          .then(r => r.json())
          .then(data2 => {
            const listaCantones = Object.entries(data2).map(([id, nombre]) => ({ id, nombre }))
            setCantonesEditar(listaCantones)
            const cantonActual = datosEditar.canton
            const matchC = listaCantones.find(c => c.nombre.toLowerCase() === cantonActual?.toLowerCase())
            if (!matchC) return
            setCantonIdEditar(matchC.id)
            return fetch(`${API_UBICACIONES}/provincia/${match.id}/canton/${matchC.id}/distritos.json`)
              .then(r => r.json())
              .then(data3 => setDistritosEditar(Object.entries(data3).map(([id, nombre]) => ({ id, nombre }))))
          })
      })
      .catch(console.error)
  }, [isModalOpen])

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

  const handleProvinciaEditar = (id, nombre) => {
    setProvinciaIdEditar(id)
    setCantonIdEditar("")
    setCantonesEditar([])
    setDistritosEditar([])
    setDatosEditar(p => ({ ...p, provincia: nombre, canton: "", distrito: "" }))
    if (!id) return
    fetch(`${API_UBICACIONES}/provincia/${id}/cantones.json`)
      .then(r => r.json())
      .then(data => setCantonesEditar(Object.entries(data).map(([id, nombre]) => ({ id, nombre }))))
      .catch(console.error)
  }

  const handleCantonEditar = (id, nombre) => {
    setCantonIdEditar(id)
    setDistritosEditar([])
    setDatosEditar(p => ({ ...p, canton: nombre, distrito: "" }))
    if (!id) return
    fetch(`${API_UBICACIONES}/provincia/${provinciaIdEditar}/canton/${id}/distritos.json`)
      .then(r => r.json())
      .then(data => setDistritosEditar(Object.entries(data).map(([id, nombre]) => ({ id, nombre }))))
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
    const { isConfirmed } = await Swal.fire({
      title: '¿Eliminar usuario?',
      text: 'Esta acción no se puede deshacer.',
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
      await Fetch.deleteData(`usuarios/${id_usuario}`)
      setUsuarios(prev => prev.filter(u => u.id_usuario !== id_usuario))
      Swal.fire({ icon: 'success', title: 'Usuario eliminado', timer: 1500, showConfirmButton: false })
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: err.message || 'No se pudo eliminar el usuario.' })
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
    const errores = []
    if (!datosEditar.nombre_completo?.trim()) errores.push('Nombre completo')
    if (!datosEditar.correo?.trim()) errores.push('Correo')
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datosEditar.correo)) errores.push('Correo con formato válido')
    if (errores.length > 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        html: `<ul style="text-align:left;padding-left:1.2rem">${errores.map(e => `<li>${e}</li>`).join('')}</ul>`,
      })
      return
    }
    Swal.fire({ title: 'Guardando cambios...', allowOutsideClick: false, didOpen: () => Swal.showLoading() })
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
      cerrarModalEditar()
      Swal.fire({ icon: 'success', title: 'Cambios guardados', timer: 1500, showConfirmButton: false })
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: err.message || 'Error al editar usuario' })
    }
  }

  const validarCrear = () => {
    const errores = []
    if (!datosCrear.nombre_usuario.trim()) errores.push('Nombre de usuario')
    if (!datosCrear.nombre_completo.trim()) errores.push('Nombre completo')
    if (!datosCrear.correo.trim()) errores.push('Correo')
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datosCrear.correo)) errores.push('Correo con formato válido (ej: user@email.com)')
    if (!datosCrear.contrasena) errores.push('Contraseña')
    else if (datosCrear.contrasena.length < 6) errores.push('Contraseña de mínimo 6 caracteres')
    return errores
  }

  const confirmarCancelarCrear = async () => {
    const sucio = datosCrear.nombre_usuario || datosCrear.nombre_completo || datosCrear.correo || datosCrear.contrasena
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
    setIsCrearOpen(false)
    setDatosCrear({ nombre_usuario: '', nombre_completo: '', correo: '', contrasena: '', telefono: '', provincia: '', canton: '', distrito: '', id_rol: '2' })
    setProvinciaId(''); setCantonId(''); setCantones([]); setDistritos([])
  }

  const cerrarModalEditar = () => {
    setIsModalOpen(false)
    setProvinciaIdEditar(""); setCantonIdEditar("")
    setCantonesEditar([]); setDistritosEditar([])
  }

  const confirmarCancelarEditar = async () => {
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
    cerrarModalEditar()
  }

  const crearUsuario = async () => {
    const { nombre_usuario, nombre_completo, correo, contrasena, telefono, provincia, canton, distrito, id_rol } = datosCrear
    const errores = validarCrear()
    if (errores.length > 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        html: `<ul style="text-align:left;padding-left:1.2rem">${errores.map(e => `<li>${e}</li>`).join('')}</ul>`,
      })
      return
    }
    Swal.fire({ title: 'Creando usuario...', allowOutsideClick: false, didOpen: () => Swal.showLoading() })
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
      Swal.fire({ icon: 'success', title: 'Usuario creado', timer: 1500, showConfirmButton: false })
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: err.message || 'Error al crear usuario' })
    }
  }

  const ROL_MAP = { 1: 'Admin', 2: 'Personal', 3: 'Empresa' }

  const usuariosFiltrados = usuarios
    .filter(u => {
      const nombre  = (u.nombre_completo || u.nombre_usuario || "").toLowerCase()
      const correo  = (u.correo || "").toLowerCase()
      const termino = busqueda.toLowerCase()
      const coincideBusqueda = nombre.includes(termino) || correo.includes(termino)
      const rolNombre = ROL_MAP[u.id_rol] || ''
      const coincideRol = filtroRol === 'TODOS' || rolNombre === filtroRol
      return coincideBusqueda && coincideRol
    })
    .sort((a, b) => {
      const fa = new Date(a.createdAt || 0)
      const fb = new Date(b.createdAt || 0)
      return orden === 'recientes' ? fb - fa : fa - fb
    })

  const totalPaginas    = Math.max(1, Math.ceil(usuariosFiltrados.length / POR_PAGINA))
  const usuariosPagina  = usuariosFiltrados.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA)

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
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col lg:flex-row gap-4 items-center mb-6">
        <div className="relative w-full lg:flex-1">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
          <input
            type="text"
            value={busqueda}
            onChange={e => { setBusqueda(e.target.value); setPagina(1) }}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-sm outline-none transition-all"
            placeholder="Buscar por nombre o correo electrónico..."
          />
        </div>
        <div className="flex flex-wrap gap-2 w-full lg:w-auto">
          {['TODOS', 'Admin', 'Personal', 'Empresa'].map(rol => (
            <button
              key={rol}
              onClick={() => { setFiltroRol(rol); setPagina(1) }}
              className={`px-3 py-2 text-xs font-bold uppercase rounded-lg transition-colors ${
                filtroRol === rol
                  ? 'bg-primary/10 text-primary'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-primary/5'
              }`}
            >
              {rol}
            </button>
          ))}
          <div className="w-px bg-slate-200 dark:bg-slate-700 self-stretch mx-1" />
          {[{ val: 'recientes', label: 'Recientes' }, { val: 'antiguos', label: 'Antiguos' }].map(({ val, label }) => (
            <button
              key={val}
              onClick={() => { setOrden(val); setPagina(1) }}
              className={`px-3 py-2 text-xs font-bold uppercase rounded-lg transition-colors ${
                orden === val
                  ? 'bg-sky-100 text-sky-600'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-sky-50'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Usuario</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Correo</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Rol</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Teléfono</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Ubicación</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {usuariosPagina.map(usuario => (
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
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      usuario.id_rol === 1 ? 'bg-violet-100 text-violet-700' :
                      usuario.id_rol === 3 ? 'bg-amber-100 text-amber-700' :
                      'bg-sky-100 text-sky-700'
                    }`}>
                      {ROL_MAP[usuario.id_rol] || 'Sin rol'}
                    </span>
                  </td>
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
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                    No se encontraron usuarios.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800">
          <Paginacion
            pagina={pagina}
            totalPaginas={totalPaginas}
            onChange={p => setPagina(p)}
            totalItems={usuariosFiltrados.length}
            itemsMostrados={usuariosPagina.length}
          />
        </div>
      </div>

      {isCrearOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Crear Usuario</h3>
              <button onClick={confirmarCancelarCrear} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full text-slate-400 transition-colors">
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
              <button onClick={confirmarCancelarCrear} className="px-6 py-2.5 rounded-xl text-slate-600 font-bold hover:bg-slate-200 transition-all">Cancelar</button>
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
              <button onClick={confirmarCancelarEditar} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full text-slate-400 transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: 'Nombre Completo', field: 'nombre_completo' },
                  { label: 'Correo',          field: 'correo' },
                  { label: 'Teléfono',        field: 'telefono' },
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

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase ml-1">Provincia</label>
                  <select
                    value={provinciaIdEditar}
                    onChange={e => { const opt = e.target.options[e.target.selectedIndex]; handleProvinciaEditar(e.target.value, opt.text) }}
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="">{datosEditar.provincia || 'Seleccionar provincia'}</option>
                    {provinciasEditar.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase ml-1">Cantón</label>
                  <select
                    value={cantonIdEditar}
                    disabled={!provinciaIdEditar}
                    onChange={e => { const opt = e.target.options[e.target.selectedIndex]; handleCantonEditar(e.target.value, opt.text) }}
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none cursor-pointer disabled:opacity-50"
                  >
                    <option value="">{datosEditar.canton || 'Seleccionar cantón'}</option>
                    {cantonesEditar.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase ml-1">Distrito</label>
                  <select
                    value={datosEditar.distrito}
                    disabled={!cantonIdEditar}
                    onChange={e => setDatosEditar(p => ({ ...p, distrito: e.target.value }))}
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none cursor-pointer disabled:opacity-50"
                  >
                    <option value="">{datosEditar.distrito || 'Seleccionar distrito'}</option>
                    {distritosEditar.map(d => <option key={d.id} value={d.nombre}>{d.nombre}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
              <button onClick={confirmarCancelarEditar} className="px-6 py-2.5 rounded-xl text-slate-600 font-bold hover:bg-slate-200 transition-all">Cancelar</button>
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
