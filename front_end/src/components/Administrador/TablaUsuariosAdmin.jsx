import { useState, useEffect } from 'react'
import Fetch from '../../services/Fetch'
import Swal from 'sweetalert2'
import Paginacion from './Paginacion'

const POR_PAGINA = 8
const API_UBICACIONES = 'https://ubicaciones.paginasweb.cr'

const ROL_MAP = {
    1: { label: 'Admin',    color: '#8b5cf6', bg: '#ede9fe' },
    2: { label: 'Personal', color: '#0ea5e9', bg: '#e0f2fe' },
    3: { label: 'Empresa',  color: '#f59e0b', bg: '#fef3c7' },
}

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
                    {badge && <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 20, background: badgeColor + '20', color: badgeColor, flexShrink: 0 }}>{badgeText}</span>}
                </div>
                <p style={{ fontSize: 28, fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-1px', lineHeight: 1.1 }}>{value}</p>
                {sub && <p style={{ fontSize: 12, color: '#94a3b8', margin: '4px 0 0' }}>{sub}</p>}
            </div>
        </div>
    )
}

const TablaUsuariosAdmin = () => {
    const [usuarios,   setUsuarios]   = useState([])
    const [busqueda,   setBusqueda]   = useState('')
    const [filtroRol,  setFiltroRol]  = useState('TODOS')
    const [orden,      setOrden]      = useState('recientes')
    const [pagina,     setPagina]     = useState(1)
    const [isModalOpen,  setIsModalOpen]  = useState(false)
    const [isCrearOpen,  setIsCrearOpen]  = useState(false)

    const [datosEditar, setDatosEditar] = useState({
        id_usuario: '', nombre_completo: '', correo: '', telefono: '', provincia: '', canton: '', distrito: '',
    })
    const [datosCrear, setDatosCrear] = useState({
        nombre_usuario: '', nombre_completo: '', correo: '', contrasena: '', telefono: '', provincia: '', canton: '', distrito: '', id_rol: '2',
    })

    // Ubicaciones — modal crear
    const [provincias,  setProvincias]  = useState([])
    const [cantones,    setCantones]    = useState([])
    const [distritos,   setDistritos]   = useState([])
    const [provinciaId, setProvinciaId] = useState('')
    const [cantonId,    setCantonId]    = useState('')

    // Ubicaciones — modal editar
    const [provinciasEditar,  setProvinciasEditar]  = useState([])
    const [cantonesEditar,    setCantonesEditar]    = useState([])
    const [distritosEditar,   setDistritosEditar]   = useState([])
    const [provinciaIdEditar, setProvinciaIdEditar] = useState('')
    const [cantonIdEditar,    setCantonIdEditar]    = useState('')

    useEffect(() => {
        if (!isCrearOpen) return
        fetch(`${API_UBICACIONES}/provincias.json`)
            .then(r => r.json())
            .then(data => setProvincias(Object.entries(data).map(([id, nombre]) => ({ id, nombre }))))
            .catch(console.error)
    }, [isCrearOpen])

    useEffect(() => {
        if (!isModalOpen) return
        fetch(`${API_UBICACIONES}/provincias.json`)
            .then(r => r.json())
            .then(data => {
                const lista = Object.entries(data).map(([id, nombre]) => ({ id, nombre }))
                setProvinciasEditar(lista)
                const match = lista.find(p => p.nombre.toLowerCase() === datosEditar.provincia?.toLowerCase())
                if (!match) return
                setProvinciaIdEditar(match.id)
                return fetch(`${API_UBICACIONES}/provincia/${match.id}/cantones.json`)
                    .then(r => r.json())
                    .then(data2 => {
                        const listaCantones = Object.entries(data2).map(([id, nombre]) => ({ id, nombre }))
                        setCantonesEditar(listaCantones)
                        const matchC = listaCantones.find(c => c.nombre.toLowerCase() === datosEditar.canton?.toLowerCase())
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
        setProvinciaId(id); setCantonId(''); setCantones([]); setDistritos([])
        setDatosCrear(p => ({ ...p, provincia: nombre, canton: '', distrito: '' }))
        if (!id) return
        fetch(`${API_UBICACIONES}/provincia/${id}/cantones.json`).then(r => r.json())
            .then(data => setCantones(Object.entries(data).map(([id, nombre]) => ({ id, nombre })))).catch(console.error)
    }
    const handleCantonCrear = (id, nombre) => {
        setCantonId(id); setDistritos([])
        setDatosCrear(p => ({ ...p, canton: nombre, distrito: '' }))
        if (!id) return
        fetch(`${API_UBICACIONES}/provincia/${provinciaId}/canton/${id}/distritos.json`).then(r => r.json())
            .then(data => setDistritos(Object.entries(data).map(([id, nombre]) => ({ id, nombre })))).catch(console.error)
    }
    const handleProvinciaEditar = (id, nombre) => {
        setProvinciaIdEditar(id); setCantonIdEditar(''); setCantonesEditar([]); setDistritosEditar([])
        setDatosEditar(p => ({ ...p, provincia: nombre, canton: '', distrito: '' }))
        if (!id) return
        fetch(`${API_UBICACIONES}/provincia/${id}/cantones.json`).then(r => r.json())
            .then(data => setCantonesEditar(Object.entries(data).map(([id, nombre]) => ({ id, nombre })))).catch(console.error)
    }
    const handleCantonEditar = (id, nombre) => {
        setCantonIdEditar(id); setDistritosEditar([])
        setDatosEditar(p => ({ ...p, canton: nombre, distrito: '' }))
        if (!id) return
        fetch(`${API_UBICACIONES}/provincia/${provinciaIdEditar}/canton/${id}/distritos.json`).then(r => r.json())
            .then(data => setDistritosEditar(Object.entries(data).map(([id, nombre]) => ({ id, nombre })))).catch(console.error)
    }

    useEffect(() => {
        Fetch.getData('usuarios?limit=200').then(data => setUsuarios(data || [])).catch(console.error)
    }, [])

    const eliminarUsuario = async (id_usuario) => {
        const { isConfirmed } = await Swal.fire({
            title: '¿Eliminar usuario?', text: 'Esta acción no se puede deshacer.', icon: 'warning',
            showCancelButton: true, confirmButtonColor: '#ef4444', cancelButtonColor: '#64748b',
            confirmButtonText: 'Sí, eliminar', cancelButtonText: 'Cancelar',
        })
        if (!isConfirmed) return
        Swal.fire({ title: 'Eliminando...', allowOutsideClick: false, didOpen: () => Swal.showLoading() })
        try {
            await Fetch.deleteData(`usuarios/${id_usuario}`)
            setUsuarios(prev => prev.filter(u => u.id_usuario !== id_usuario))
            Swal.fire({ icon: 'success', title: 'Usuario eliminado', timer: 1500, showConfirmButton: false })
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Error', text: err.message || 'No se pudo eliminar.' })
        }
    }

    const iniciarEdicion = (usuario) => {
        setDatosEditar({
            id_usuario:      usuario.id_usuario,
            nombre_completo: usuario.nombre_completo || '',
            correo:          usuario.correo          || '',
            telefono:        usuario.telefono        || '',
            provincia:       usuario.provincia       || '',
            canton:          usuario.canton          || '',
            distrito:        usuario.distrito        || '',
        })
        setIsModalOpen(true)
    }

    const guardarEdicion = async () => {
        const errores = []
        if (!datosEditar.nombre_completo?.trim()) errores.push('Nombre completo')
        if (!datosEditar.correo?.trim()) errores.push('Correo')
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datosEditar.correo)) errores.push('Correo válido')
        if (errores.length > 0) {
            Swal.fire({ icon: 'warning', title: 'Campos incompletos', html: `<ul style="text-align:left;padding-left:1.2rem">${errores.map(e => `<li>${e}</li>`).join('')}</ul>` })
            return
        }
        Swal.fire({ title: 'Guardando...', allowOutsideClick: false, didOpen: () => Swal.showLoading() })
        try {
            await Fetch.putData(`usuarios/${datosEditar.id_usuario}`, {
                nombre_completo: datosEditar.nombre_completo, correo: datosEditar.correo,
                telefono: datosEditar.telefono, provincia: datosEditar.provincia,
                canton: datosEditar.canton, distrito: datosEditar.distrito,
            })
            const data = await Fetch.getData('usuarios?limit=200')
            setUsuarios(data || [])
            cerrarModalEditar()
            Swal.fire({ icon: 'success', title: 'Cambios guardados', timer: 1500, showConfirmButton: false })
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Error', text: err.message })
        }
    }

    const validarCrear = () => {
        const e = []
        if (!datosCrear.nombre_usuario.trim()) e.push('Nombre de usuario')
        if (!datosCrear.nombre_completo.trim()) e.push('Nombre completo')
        if (!datosCrear.correo.trim()) e.push('Correo')
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datosCrear.correo)) e.push('Correo válido')
        if (!datosCrear.contrasena) e.push('Contraseña')
        else if (datosCrear.contrasena.length < 6) e.push('Contraseña de mínimo 6 caracteres')
        return e
    }

    const confirmarCancelarCrear = async () => {
        const sucio = datosCrear.nombre_usuario || datosCrear.nombre_completo || datosCrear.correo || datosCrear.contrasena
        if (sucio) {
            const { isConfirmed } = await Swal.fire({
                title: '¿Descartar cambios?', text: 'Los datos ingresados se perderán.', icon: 'question',
                showCancelButton: true, confirmButtonText: 'Sí, descartar', cancelButtonText: 'Seguir editando', confirmButtonColor: '#64748b',
            })
            if (!isConfirmed) return
        }
        setIsCrearOpen(false)
        setDatosCrear({ nombre_usuario: '', nombre_completo: '', correo: '', contrasena: '', telefono: '', provincia: '', canton: '', distrito: '', id_rol: '2' })
        setProvinciaId(''); setCantonId(''); setCantones([]); setDistritos([])
    }

    const cerrarModalEditar = () => {
        setIsModalOpen(false)
        setProvinciaIdEditar(''); setCantonIdEditar(''); setCantonesEditar([]); setDistritosEditar([])
    }

    const confirmarCancelarEditar = async () => {
        const { isConfirmed } = await Swal.fire({
            title: '¿Cancelar edición?', text: 'Los cambios no guardados se perderán.', icon: 'question',
            showCancelButton: true, confirmButtonText: 'Sí, cancelar', cancelButtonText: 'Seguir editando', confirmButtonColor: '#64748b',
        })
        if (!isConfirmed) return
        cerrarModalEditar()
    }

    const crearUsuario = async () => {
        const errores = validarCrear()
        if (errores.length > 0) {
            Swal.fire({ icon: 'warning', title: 'Campos incompletos', html: `<ul style="text-align:left;padding-left:1.2rem">${errores.map(e => `<li>${e}</li>`).join('')}</ul>` })
            return
        }
        Swal.fire({ title: 'Creando usuario...', allowOutsideClick: false, didOpen: () => Swal.showLoading() })
        try {
            await Fetch.postData('usuarios/register', {
                nombre_usuario: datosCrear.nombre_usuario, nombre_completo: datosCrear.nombre_completo,
                correo: datosCrear.correo, contrasena: datosCrear.contrasena,
                telefono: datosCrear.telefono, provincia: datosCrear.provincia,
                canton: datosCrear.canton, distrito: datosCrear.distrito,
                id_rol: parseInt(datosCrear.id_rol),
            })
            const data = await Fetch.getData('usuarios?limit=200')
            setUsuarios(data || [])
            setIsCrearOpen(false)
            setDatosCrear({ nombre_usuario: '', nombre_completo: '', correo: '', contrasena: '', telefono: '', provincia: '', canton: '', distrito: '', id_rol: '2' })
            setProvinciaId(''); setCantonId(''); setCantones([]); setDistritos([])
            Swal.fire({ icon: 'success', title: 'Usuario creado', timer: 1500, showConfirmButton: false })
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Error', text: err.message })
        }
    }

    // Derivados
    const hoy = new Date()
    const hoyStr = hoy.toISOString().slice(0, 10)
    const nuevosHoy = usuarios.filter(u => u.createdAt && u.createdAt.slice(0, 10) === hoyStr).length
    const admins    = usuarios.filter(u => u.id_rol === 1).length

    const FILTROS_ROL = [
        { val: 'TODOS',    label: 'Todos' },
        { val: 'Admin',    label: 'Admin' },
        { val: 'Personal', label: 'Personal' },
        { val: 'Empresa',  label: 'Empresa' },
    ]

    const usuariosFiltrados = usuarios
        .filter(u => {
            const nombre  = (u.nombre_completo || u.nombre_usuario || '').toLowerCase()
            const correo  = (u.correo || '').toLowerCase()
            const termino = busqueda.toLowerCase()
            const coincideBusqueda = nombre.includes(termino) || correo.includes(termino)
            const rolNombre = ROL_MAP[u.id_rol]?.label || ''
            const coincideRol = filtroRol === 'TODOS' || rolNombre === filtroRol
            return coincideBusqueda && coincideRol
        })
        .sort((a, b) => {
            const fa = new Date(a.createdAt || 0), fb = new Date(b.createdAt || 0)
            return orden === 'recientes' ? fb - fa : fa - fb
        })

    const totalPaginas   = Math.max(1, Math.ceil(usuariosFiltrados.length / POR_PAGINA))
    const usuariosPagina = usuariosFiltrados.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA)

    // ── Shared input style ──
    const inputStyle = { width: '100%', border: '1px solid #e2e8f0', borderRadius: 10, padding: '10px 14px', fontSize: 14, outline: 'none', boxSizing: 'border-box', background: '#fff' }
    const selectStyle = { ...inputStyle, cursor: 'pointer', appearance: 'none' }
    const labelStyle = { display: 'block', fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }

    return (
        <div style={{ padding: '28px 32px', minHeight: '100%' }}>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
                <div>
                    <h2 style={{ fontSize: 24, fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-0.5px' }}>Gestión de Usuarios</h2>
                    <p style={{ fontSize: 13, color: '#94a3b8', margin: '6px 0 0' }}>Administra el ecosistema de creadores y clientes de la plataforma.</p>
                </div>
                <button onClick={() => setIsCrearOpen(true)} style={{
                    display: 'flex', alignItems: 'center', gap: 8, background: '#0ea5e9', color: '#fff',
                    border: 'none', cursor: 'pointer', padding: '10px 20px', borderRadius: 10,
                    fontSize: 13, fontWeight: 700, boxShadow: '0 2px 8px rgba(14,165,233,0.3)', flexShrink: 0,
                }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>person_add</span>
                    Invitar Usuario
                </button>
            </div>

            {/* Stat cards */}
            <div style={{ display: 'flex', gap: 20, marginBottom: 28 }}>
                <StatCard label="Usuarios Totales" value={usuarios.length.toLocaleString()} icon="group"
                    iconColor="#0ea5e9" sub={`${admins} administradores`}
                    badge={usuarios.length > 0} badgeText="+12% vs mes pasado" badgeColor="#10b981" />
                <StatCard label="Nuevos Hoy" value={nuevosHoy} icon="person_add"
                    iconColor="#10b981" sub="Actualizado en tiempo real"
                    badge={nuevosHoy > 0} badgeText="Hoy" badgeColor="#10b981" />
                <StatCard label="Tasa de Retención" value="94.2%" icon="cached"
                    iconColor="#0ea5e9" sub="Usuarios activos este mes"
                    badge badgeText="Estable" badgeColor="#0ea5e9" />
            </div>

            {/* Search + filters */}
            <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #e8edf2', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, flexWrap: 'wrap', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                {/* Search */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: '8px 14px', flex: 1, minWidth: 220 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#94a3b8' }}>search</span>
                    <input type="text" value={busqueda} onChange={e => { setBusqueda(e.target.value); setPagina(1) }}
                        placeholder="Buscar por nombre o email..."
                        style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 13, color: '#334155', width: '100%' }} />
                </div>

                {/* Role filter tabs */}
                <div style={{ display: 'flex', gap: 4 }}>
                    {FILTROS_ROL.map(f => (
                        <button key={f.val} onClick={() => { setFiltroRol(f.val); setPagina(1) }} style={{
                            padding: '7px 14px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 700, transition: 'all 0.15s',
                            background: filtroRol === f.val ? '#0ea5e9' : '#f1f5f9',
                            color: filtroRol === f.val ? '#fff' : '#64748b',
                        }}>
                            {f.label}
                        </button>
                    ))}
                </div>

                {/* Order */}
                <div style={{ display: 'flex', gap: 4 }}>
                    {[{ val: 'recientes', label: 'Recientes' }, { val: 'antiguos', label: 'Antiguos' }].map(({ val, label }) => (
                        <button key={val} onClick={() => { setOrden(val); setPagina(1) }} style={{
                            padding: '7px 14px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600, transition: 'all 0.15s',
                            background: orden === val ? '#f1f5f9' : 'transparent',
                            color: orden === val ? '#0f172a' : '#94a3b8',
                        }}>
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table card */}
            <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e8edf2', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
                            {['USUARIO', 'ROL', 'ESTADO', 'FECHA REGISTRO', 'ACCIONES'].map(h => (
                                <th key={h} style={{ padding: '12px 20px', fontSize: 10, fontWeight: 700, color: '#94a3b8', textAlign: h === 'ACCIONES' ? 'right' : 'left', textTransform: 'uppercase', letterSpacing: 0.8 }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {usuariosPagina.map(usuario => {
                            const rol = ROL_MAP[usuario.id_rol] || { label: 'Sin rol', color: '#94a3b8', bg: '#f1f5f9' }
                            const nombreCorto = usuario.nombre_completo || usuario.nombre_usuario || '?'
                            const fechaReg = usuario.createdAt ? new Date(usuario.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'
                            return (
                                <tr key={usuario.id_usuario} style={{ borderBottom: '1px solid #f8fafc', transition: 'background 0.1s' }}
                                    onMouseEnter={e => e.currentTarget.style.background = '#fafbfc'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>

                                    <td style={{ padding: '12px 20px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                            <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                                                {usuario.img_perfil
                                                    ? <img src={usuario.img_perfil} alt={nombreCorto} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                    : <span style={{ fontSize: 14, fontWeight: 800, color: '#0ea5e9' }}>{nombreCorto.charAt(0)}</span>
                                                }
                                            </div>
                                            <div style={{ minWidth: 0 }}>
                                                <p style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{nombreCorto}</p>
                                                <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>{usuario.correo}</p>
                                            </div>
                                        </div>
                                    </td>

                                    <td style={{ padding: '12px 20px' }}>
                                        <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 20, background: rol.bg, color: rol.color }}>
                                            {rol.label.toUpperCase()}
                                        </span>
                                    </td>

                                    <td style={{ padding: '12px 20px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
                                            <span style={{ fontSize: 13, color: '#64748b', fontWeight: 500 }}>Activo</span>
                                        </div>
                                    </td>

                                    <td style={{ padding: '12px 20px', fontSize: 13, color: '#94a3b8' }}>{fechaReg}</td>

                                    <td style={{ padding: '12px 20px', textAlign: 'right' }}>
                                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6 }}>
                                            <button onClick={() => iniciarEdicion(usuario)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#cbd5e1', padding: '6px', borderRadius: 8, display: 'flex', alignItems: 'center', transition: 'all 0.15s' }}
                                                onMouseEnter={e => { e.currentTarget.style.background = '#f0f9ff'; e.currentTarget.style.color = '#0ea5e9' }}
                                                onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#cbd5e1' }}>
                                                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>edit</span>
                                            </button>
                                            <button onClick={() => eliminarUsuario(usuario.id_usuario)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#cbd5e1', padding: '6px', borderRadius: 8, display: 'flex', alignItems: 'center', transition: 'all 0.15s' }}
                                                onMouseEnter={e => { e.currentTarget.style.background = '#fef2f2'; e.currentTarget.style.color = '#ef4444' }}
                                                onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#cbd5e1' }}>
                                                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>delete</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                        {usuariosFiltrados.length === 0 && (
                            <tr><td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: '#94a3b8', fontStyle: 'italic' }}>No se encontraron usuarios.</td></tr>
                        )}
                    </tbody>
                </table>

                <div style={{ padding: '14px 24px', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 12, color: '#94a3b8' }}>
                        Mostrando {(pagina - 1) * POR_PAGINA + 1}–{Math.min(pagina * POR_PAGINA, usuariosFiltrados.length)} de {usuariosFiltrados.length} usuarios
                    </span>
                    <Paginacion pagina={pagina} totalPaginas={totalPaginas} onChange={p => setPagina(p)} totalItems={usuariosFiltrados.length} itemsMostrados={usuariosPagina.length} />
                </div>
            </div>

            {/* ── Modal CREAR usuario ── */}
            {isCrearOpen && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', padding: 16 }}>
                    <div style={{ background: '#fff', borderRadius: 20, boxShadow: '0 20px 60px rgba(0,0,0,0.15)', width: '100%', maxWidth: 560, maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid #f1f5f9', flexShrink: 0 }}>
                            <h3 style={{ fontSize: 17, fontWeight: 800, color: '#0f172a', margin: 0 }}>Crear Usuario</h3>
                            <button onClick={confirmarCancelarCrear} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 4 }}>
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <div style={{ overflowY: 'auto', flex: 1, padding: '24px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                {[
                                    { label: 'Nombre de usuario', field: 'nombre_usuario' },
                                    { label: 'Nombre completo',   field: 'nombre_completo' },
                                    { label: 'Correo',            field: 'correo' },
                                    { label: 'Contraseña',        field: 'contrasena', type: 'password' },
                                    { label: 'Teléfono',          field: 'telefono' },
                                ].map(({ label, field, type }) => (
                                    <div key={field}>
                                        <label style={labelStyle}>{label}</label>
                                        <input type={type || 'text'} value={datosCrear[field]}
                                            onChange={e => setDatosCrear(prev => ({ ...prev, [field]: e.target.value }))}
                                            style={inputStyle} />
                                    </div>
                                ))}

                                <div>
                                    <label style={labelStyle}>Provincia</label>
                                    <select value={provinciaId} style={selectStyle}
                                        onChange={e => { const opt = e.target.options[e.target.selectedIndex]; handleProvinciaCrear(e.target.value, opt.text) }}>
                                        <option value="">Seleccionar</option>
                                        {provincias.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label style={labelStyle}>Cantón</label>
                                    <select value={cantonId} disabled={!provinciaId} style={{ ...selectStyle, opacity: !provinciaId ? 0.5 : 1 }}
                                        onChange={e => { const opt = e.target.options[e.target.selectedIndex]; handleCantonCrear(e.target.value, opt.text) }}>
                                        <option value="">Seleccionar</option>
                                        {cantones.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label style={labelStyle}>Distrito</label>
                                    <select value={datosCrear.distrito} disabled={!cantonId} style={{ ...selectStyle, opacity: !cantonId ? 0.5 : 1 }}
                                        onChange={e => setDatosCrear(p => ({ ...p, distrito: e.target.value }))}>
                                        <option value="">Seleccionar</option>
                                        {distritos.map(d => <option key={d.id} value={d.nombre}>{d.nombre}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label style={labelStyle}>Rol</label>
                                    <select value={datosCrear.id_rol} style={selectStyle}
                                        onChange={e => setDatosCrear(prev => ({ ...prev, id_rol: e.target.value }))}>
                                        <option value="1">Admin</option>
                                        <option value="2">Personal</option>
                                        <option value="3">Empresa</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div style={{ padding: '16px 24px', borderTop: '1px solid #f1f5f9', display: 'flex', gap: 12, flexShrink: 0 }}>
                            <button onClick={confirmarCancelarCrear} style={{ flex: 1, border: '1px solid #e2e8f0', background: '#fff', color: '#64748b', fontWeight: 600, fontSize: 14, padding: '10px', borderRadius: 10, cursor: 'pointer' }}>Cancelar</button>
                            <button onClick={crearUsuario} style={{ flex: 1, background: '#0ea5e9', color: '#fff', fontWeight: 700, fontSize: 14, padding: '10px', borderRadius: 10, cursor: 'pointer', border: 'none' }}>Crear Usuario</button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Modal EDITAR usuario ── */}
            {isModalOpen && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', padding: 16 }}>
                    <div style={{ background: '#fff', borderRadius: 20, boxShadow: '0 20px 60px rgba(0,0,0,0.15)', width: '100%', maxWidth: 520, maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid #f1f5f9', flexShrink: 0 }}>
                            <h3 style={{ fontSize: 17, fontWeight: 800, color: '#0f172a', margin: 0 }}>Editar Usuario</h3>
                            <button onClick={confirmarCancelarEditar} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 4 }}>
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <div style={{ overflowY: 'auto', flex: 1, padding: '24px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                {[
                                    { label: 'Nombre Completo', field: 'nombre_completo' },
                                    { label: 'Correo',          field: 'correo' },
                                    { label: 'Teléfono',        field: 'telefono' },
                                ].map(({ label, field }) => (
                                    <div key={field}>
                                        <label style={labelStyle}>{label}</label>
                                        <input value={datosEditar[field]} style={inputStyle}
                                            onChange={e => setDatosEditar(prev => ({ ...prev, [field]: e.target.value }))} />
                                    </div>
                                ))}

                                <div>
                                    <label style={labelStyle}>Provincia</label>
                                    <select value={provinciaIdEditar} style={selectStyle}
                                        onChange={e => { const opt = e.target.options[e.target.selectedIndex]; handleProvinciaEditar(e.target.value, opt.text) }}>
                                        <option value="">{datosEditar.provincia || 'Seleccionar'}</option>
                                        {provinciasEditar.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label style={labelStyle}>Cantón</label>
                                    <select value={cantonIdEditar} disabled={!provinciaIdEditar} style={{ ...selectStyle, opacity: !provinciaIdEditar ? 0.5 : 1 }}
                                        onChange={e => { const opt = e.target.options[e.target.selectedIndex]; handleCantonEditar(e.target.value, opt.text) }}>
                                        <option value="">{datosEditar.canton || 'Seleccionar'}</option>
                                        {cantonesEditar.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label style={labelStyle}>Distrito</label>
                                    <select value={datosEditar.distrito} disabled={!cantonIdEditar} style={{ ...selectStyle, opacity: !cantonIdEditar ? 0.5 : 1 }}
                                        onChange={e => setDatosEditar(p => ({ ...p, distrito: e.target.value }))}>
                                        <option value="">{datosEditar.distrito || 'Seleccionar'}</option>
                                        {distritosEditar.map(d => <option key={d.id} value={d.nombre}>{d.nombre}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div style={{ padding: '16px 24px', borderTop: '1px solid #f1f5f9', display: 'flex', gap: 12, flexShrink: 0 }}>
                            <button onClick={confirmarCancelarEditar} style={{ flex: 1, border: '1px solid #e2e8f0', background: '#fff', color: '#64748b', fontWeight: 600, fontSize: 14, padding: '10px', borderRadius: 10, cursor: 'pointer' }}>Cancelar</button>
                            <button onClick={guardarEdicion} style={{ flex: 1, background: '#0ea5e9', color: '#fff', fontWeight: 700, fontSize: 14, padding: '10px', borderRadius: 10, cursor: 'pointer', border: 'none' }}>Guardar Cambios</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default TablaUsuariosAdmin
