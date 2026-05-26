import { useState, useEffect } from 'react'
import Fetch from '../../services/Fetch'
import Swal from 'sweetalert2'
import { normalizarUsuario, normalizarPortafolio, normalizarResena } from '../../utils/normalizers'
import { calcularPromedio } from '../../utils/calcularPromedio'
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer,
} from 'recharts'
import ModalDetalleConvocatoria from './ModalDetalleConvocatoria'

const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
const DIAS = ['LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB', 'DOM']

const CATEGORIAS_ABREV = {
    'Diseño y creatividad visual': 'Diseño Visual',
    'UX/UI': 'Diseño UI/UX',
    'Fotografía y arte visual': 'Fotografía',
    'Ilustración': 'Ilustración',
    'Modelado 3D': 'Modelado 3D',
    'Multimedia y animación': 'Multimedia',
    'Desarrollo y tecnología creativa': 'Desarrollo',
    'Publicidad y marketing': 'Marketing',
    'Arquitectura': 'Arquitectura',
    'Moda y costura': 'Moda',
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function agruparPorMes(lista, mesesAtras = 6) {
    const ahora = new Date()
    const resultado = []
    for (let i = mesesAtras - 1; i >= 0; i--) {
        const d = new Date(ahora.getFullYear(), ahora.getMonth() - i, 1)
        resultado.push({ mes: MESES[d.getMonth()], año: d.getFullYear(), usuarios: 0, portafolios: 0 })
    }
    lista.forEach(item => {
        if (!item.createdAt) return
        const d = new Date(item.createdAt)
        const slot = resultado.find(r => r.mes === MESES[d.getMonth()] && r.año === d.getFullYear())
        if (slot) slot.usuarios++
    })
    return resultado
}

function calcularCrecimiento(lista) {
    const ahora = new Date()
    const inicioEste = new Date(ahora.getFullYear(), ahora.getMonth(), 1)
    const inicioAnterior = new Date(ahora.getFullYear(), ahora.getMonth() - 1, 1)
    const este = lista.filter(u => u.createdAt && new Date(u.createdAt) >= inicioEste).length
    const anterior = lista.filter(u => u.createdAt && new Date(u.createdAt) >= inicioAnterior && new Date(u.createdAt) < inicioEste).length
    if (!anterior) return null
    return (((este - anterior) / anterior) * 100).toFixed(1)
}

function heatmapData(usuarios) {
    const conteo = {}
    usuarios.forEach(u => {
        if (!u.createdAt) return
        const d = new Date(u.createdAt)
        const key = d.toISOString().slice(0, 10)
        conteo[key] = (conteo[key] || 0) + 1
    })
    const hoy = new Date()
    const semanas = 10
    const celdas = []
    for (let s = semanas - 1; s >= 0; s--) {
        const semana = []
        for (let d = 0; d < 7; d++) {
            const fecha = new Date(hoy)
            fecha.setDate(hoy.getDate() - (s * 7 + (6 - d)))
            const key = fecha.toISOString().slice(0, 10)
            semana.push(conteo[key] || 0)
        }
        celdas.push(semana)
    }
    return celdas // [semana][dia]
}

// ── Componentes menores ───────────────────────────────────────────────────────
function StatCard({ label, value, sub, badge, badgeColor, badgeText, icon, iconColor }) {
    return (
        <div style={{
            background: '#fff', borderRadius: 16, padding: '20px 24px',
            border: '1px solid #e8edf2', display: 'flex', alignItems: 'center',
            gap: 16, flex: 1, minWidth: 0,
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
        }}>
            <div style={{
                width: 48, height: 48, borderRadius: 14,
                background: iconColor + '20',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
                <span className="material-symbols-outlined" style={{ color: iconColor, fontSize: 24 }}>{icon}</span>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                    <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.8, margin: 0 }}>{label}</p>
                    {badge && (
                        <span style={{
                            fontSize: 11, fontWeight: 700, padding: '2px 8px',
                            borderRadius: 20, background: badgeColor + '20', color: badgeColor,
                        }}>{badgeText}</span>
                    )}
                </div>
                <p style={{ fontSize: 28, fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-1px', lineHeight: 1.1 }}>{value}</p>
                {sub && <p style={{ fontSize: 12, color: '#94a3b8', margin: '4px 0 0' }}>{sub}</p>}
            </div>
        </div>
    )
}

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null
    return (
        <div style={{ background: '#0f172a', borderRadius: 10, padding: '8px 14px', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
            <p style={{ color: '#94a3b8', fontSize: 11, margin: '0 0 4px', fontWeight: 600 }}>{label}</p>
            {payload.map((p, i) => (
                <p key={i} style={{ color: '#fff', fontSize: 13, margin: 0, fontWeight: 700 }}>
                    {p.value} nuevos
                </p>
            ))}
        </div>
    )
}

// ── Dashboard principal ────────────────────────────────────────────────────────
function DashboardAdmin({ onInspeccionar }) {
    const [usuarios, setUsuarios] = useState([])
    const [portafolios, setPortafolios] = useState([])
    const [comunidades, setComunidades] = useState([])
    const [convocatorias, setConvocatorias] = useState([])
    const [resenas, setResenas] = useState([])
    const [cargando, setCargando] = useState(true)
    const [convDetalle, setConvDetalle] = useState(null)
    const [destacadoMes, setDestacadoMes] = useState(null)
    const [guardandoDest, setGuardandoDest] = useState(false)
    const [buscarUsuario, setBuscarUsuario] = useState('')

    useEffect(() => {
        Promise.all([
            Fetch.getData('usuarios?limit=500'),
            Fetch.getData('portafolios?limit=500'),
            Fetch.getData('comunidades?limit=500'),
            Fetch.getData('convocatorias?limit=500'),
            Fetch.getData('resenas?limit=500'),
            Fetch.getData('configuracion/talento_destacado').catch(() => null),
        ]).then(([u, p, c, co, r, cfg]) => {
            setUsuarios((u || []).map(normalizarUsuario))
            setPortafolios((p || []).map(normalizarPortafolio))
            setComunidades(c || [])
            setConvocatorias(co || [])
            setResenas((r || []).map(normalizarResena))
            if (cfg) setDestacadoMes(cfg)
        }).catch(console.error).finally(() => setCargando(false))
    }, [])

    // ── Derivados ──
    const hoy = new Date()
    const convActivas = convocatorias.filter(c => c.fecha_cierre && new Date(c.fecha_cierre) >= hoy)
    const portPublicados = portafolios.filter(p => p.pdf).length
    const tasaConversion = portafolios.length ? ((portPublicados / portafolios.length) * 100).toFixed(1) : '0.0'
    const crecUsuarios = calcularCrecimiento(usuarios)
    const actividadMeses = agruparPorMes(usuarios, 6)
    const heatmap = heatmapData(usuarios)
    const maxHeat = Math.max(1, ...heatmap.flat())

    // Categorías
    const catCount = {}
    portafolios.forEach(p => (p.categorias || []).forEach(cat => {
        const label = CATEGORIAS_ABREV[cat] || cat
        catCount[label] = (catCount[label] || 0) + 1
    }))
    const totalCat = Object.values(catCount).reduce((a, b) => a + b, 0) || 1
    const topCats = Object.entries(catCount).sort((a, b) => b[1] - a[1]).slice(0, 4)
    const CAT_COLORS = ['#0ea5e9', '#f59e0b', '#a855f7', '#64748b']

    // Perfiles con 5 estrellas (promedio exacto de 5)
    const talentos = usuarios
        .map(u => {
            const misPortas = portafolios.filter(p => String(p.usuarioId) === String(u.id))
            const misResenas = resenas.filter(r => misPortas.some(p => String(p.id) === String(r.portafolioId)))
            const prom = calcularPromedio(misResenas)
            return { ...u, rating: parseFloat(prom) || 0, numResenas: misResenas.length }
        })
        .filter(u => u.rating === 5)
        .sort((a, b) => b.numResenas - a.numResenas)

    const mesActual = new Date().toISOString().slice(0, 7) // "2026-05"
    const mesNombre = new Date().toLocaleString('es-ES', { month: 'long', year: 'numeric' })
    const necesitaRenovar = destacadoMes && destacadoMes.mes !== mesActual

    const seleccionarDestacado = async (u) => {
        const { isConfirmed } = await Swal.fire({
            title: '¿Destacar este talento?',
            html: `<strong>${u.Nombre}</strong> aparecerá como talento destacado del mes en la página principal.`,
            icon: 'question', showCancelButton: true,
            confirmButtonColor: '#0ea5e9', cancelButtonColor: '#64748b',
            confirmButtonText: 'Sí, destacar', cancelButtonText: 'Cancelar',
        })
        if (!isConfirmed) return
        setGuardandoDest(true)
        Swal.fire({ title: 'Guardando...', allowOutsideClick: false, didOpen: () => Swal.showLoading() })
        try {
            await Fetch.putData('configuracion/talento_destacado', {
                valor: { id_usuario: u.id, nombre: u.Nombre, img: u.img || '', mes: mesActual }
            })
            setDestacadoMes({ id_usuario: u.id, nombre: u.Nombre, img: u.img || '', mes: mesActual })
            Swal.fire({ icon: 'success', title: '¡Talento destacado actualizado!', text: `${u.Nombre} aparecerá en la página principal.`, timer: 2000, showConfirmButton: false })
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Error', text: err.message })
        } finally {
            setGuardandoDest(false)
        }
    }

    const quitarDestacado = async () => {
        const { isConfirmed } = await Swal.fire({
            title: '¿Quitar talento destacado?',
            html: `<strong>${destacadoMes?.nombre}</strong> dejará de aparecer como destacado en la página principal.`,
            icon: 'warning', showCancelButton: true,
            confirmButtonColor: '#ef4444', cancelButtonColor: '#64748b',
            confirmButtonText: 'Sí, quitar', cancelButtonText: 'Cancelar',
        })
        if (!isConfirmed) return
        setGuardandoDest(true)
        Swal.fire({ title: 'Guardando...', allowOutsideClick: false, didOpen: () => Swal.showLoading() })
        try {
            await Fetch.putData('configuracion/talento_destacado', { valor: null })
            setDestacadoMes(null)
            Swal.fire({ icon: 'success', title: 'Destacado eliminado', text: 'Ya no hay un talento destacado activo.', timer: 2000, showConfirmButton: false })
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Error', text: err.message })
        } finally {
            setGuardandoDest(false)
        }
    }

    const banearUsuario = async (u) => {
        if (u.bloqueado) {
            const expira = u.fecha_ban_expira
                ? new Date(u.fecha_ban_expira).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
                : 'permanente'
            const { isConfirmed } = await Swal.fire({
                title: '¿Reactivar cuenta?',
                html: `<strong>${u.Nombre}</strong> podrá volver a iniciar sesión.<br/><small style="color:#94a3b8">Ban vigente hasta: ${expira}</small>`,
                icon: 'question', showCancelButton: true,
                confirmButtonColor: '#10b981', cancelButtonColor: '#64748b',
                confirmButtonText: 'Sí, reactivar', cancelButtonText: 'Cancelar',
            })
            if (!isConfirmed) return
            try {
                await Fetch.patchData(`usuarios/${u.id}/bloquear`, { desbanear: true })
                setUsuarios(prev => prev.map(us => us.id === u.id ? { ...us, bloqueado: false, fecha_ban_expira: null, razon_ban: null } : us))
                Swal.fire({ icon: 'success', title: 'Cuenta reactivada', timer: 1800, showConfirmButton: false })
            } catch (err) {
                Swal.fire({ icon: 'error', title: 'Error', text: err.message })
            }
            return
        }
        const { value: formValues, isConfirmed } = await Swal.fire({
            title: `Suspender a ${u.Nombre}`,
            html: `
                <div style="text-align:left;display:flex;flex-direction:column;gap:12px;margin-top:8px">
                    <div>
                        <label style="font-size:13px;font-weight:600;color:#374151;display:block;margin-bottom:4px">Razón (opcional)</label>
                        <textarea id="swal-razon" placeholder="Motivo del baneo..."
                            style="width:100%;padding:8px 10px;border:1.5px solid #e2e8f0;border-radius:8px;font-size:13px;resize:none;height:68px;box-sizing:border-box;font-family:inherit;outline:none"></textarea>
                    </div>
                    <div>
                        <label style="font-size:13px;font-weight:600;color:#374151;display:block;margin-bottom:4px">Duración</label>
                        <select id="swal-duracion" style="width:100%;padding:8px 10px;border:1.5px solid #e2e8f0;border-radius:8px;font-size:13px;box-sizing:border-box;background:#fff">
                            <option value="1">1 día</option>
                            <option value="7">7 días</option>
                            <option value="30">30 días</option>
                            <option value="90">90 días</option>
                            <option value="0">Permanente</option>
                        </select>
                    </div>
                </div>`,
            icon: 'warning', showCancelButton: true,
            confirmButtonColor: '#ef4444', cancelButtonColor: '#64748b',
            confirmButtonText: 'Suspender', cancelButtonText: 'Cancelar',
            preConfirm: () => ({
                razon: document.getElementById('swal-razon').value.trim(),
                duracion: parseInt(document.getElementById('swal-duracion').value),
            })
        })
        if (!isConfirmed) return
        try {
            const result = await Fetch.patchData(`usuarios/${u.id}/bloquear`, { razon: formValues.razon, duracion: formValues.duracion })
            setUsuarios(prev => prev.map(us => us.id === u.id
                ? { ...us, bloqueado: true, fecha_ban_expira: result?.fecha_ban_expira || null, razon_ban: formValues.razon }
                : us))
            Swal.fire({ icon: 'success', title: 'Usuario suspendido', timer: 1800, showConfirmButton: false })
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Error', text: err.message })
        }
    }

    const eliminarUsuarioAdmin = async (u) => {
        const { isConfirmed } = await Swal.fire({
            title: '¿Eliminar usuario?',
            html: `Esta acción es <strong>permanente</strong>. Se eliminará la cuenta de <strong>${u.Nombre}</strong> y todos sus datos asociados.`,
            icon: 'error', showCancelButton: true,
            confirmButtonColor: '#ef4444', cancelButtonColor: '#64748b',
            confirmButtonText: 'Sí, eliminar permanentemente', cancelButtonText: 'Cancelar',
        })
        if (!isConfirmed) return
        try {
            await Fetch.deleteData(`usuarios/${u.id}`)
            setUsuarios(prev => prev.filter(us => us.id !== u.id))
            Swal.fire({ icon: 'success', title: 'Usuario eliminado', timer: 1800, showConfirmButton: false })
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Error', text: err.message })
        }
    }

    // Usuarios filtrados para la tabla de gestión
    const usuariosVisibles = buscarUsuario.trim()
        ? usuarios.filter(u =>
            u.Nombre?.toLowerCase().includes(buscarUsuario.toLowerCase()) ||
            u.Correo?.toLowerCase().includes(buscarUsuario.toLowerCase()) ||
            u.nombre_usuario?.toLowerCase().includes(buscarUsuario.toLowerCase())
        )
        : [...usuarios].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)).slice(0, 15)

    if (cargando) return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94a3b8' }}>
            <span className="material-symbols-outlined" style={{ marginRight: 8 }}>progress_activity</span>
            Cargando datos...
        </div>
    )

    return (
        <>
            <div style={{ padding: '28px 32px', minHeight: '100%' }}>

                {/* ── Stat cards ── */}
                <div style={{ display: 'flex', gap: 20, marginBottom: 28 }}>
                    <StatCard label="Total Usuarios" value={usuarios.length.toLocaleString()} icon="group"
                        iconColor="#0ea5e9" badge={!!crecUsuarios}
                        badgeText={crecUsuarios ? `+${crecUsuarios}%` : null} badgeColor="#10b981"
                        sub={`${usuarios.filter(u => u.id_rol === 3).length} empresas registradas`} />
                    <StatCard label="Portafolios" value={portafolios.length.toLocaleString()} icon="folder_special"
                        iconColor="#a855f7" badge={portPublicados > 0}
                        badgeText={`+${portPublicados}`} badgeColor="#0ea5e9"
                        sub={`${portPublicados} publicados`} />
                    <StatCard label="Comunidades" value={comunidades.length} icon="groups"
                        iconColor="#f59e0b" badge badgeText="Global" badgeColor="#f59e0b" />
                    <StatCard label="Tasa de Conversión" value={`${tasaConversion}%`} icon="trending_up"
                        iconColor="#10b981" badge badgeText="Top" badgeColor="#10b981"
                        sub="Portafolios publicados / usuarios" />
                </div>

                {/* ── Layout 2 columnas ── */}
                <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>

                    {/* ── Columna izquierda ── */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 24, minWidth: 0 }}>

                        {/* Actividad de Usuarios */}
                        <div style={{ background: '#fff', borderRadius: 16, padding: '24px 24px 16px', border: '1px solid #e8edf2', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                                <div>
                                    <h3 style={{ fontSize: 17, fontWeight: 800, color: '#0f172a', margin: 0 }}>Actividad de Usuarios</h3>
                                    <p style={{ fontSize: 12, color: '#94a3b8', margin: '4px 0 0' }}>Registros en los últimos 6 meses</p>
                                </div>
                                <span style={{
                                    fontSize: 12, fontWeight: 600, color: '#64748b',
                                    background: '#f1f5f9', borderRadius: 20, padding: '6px 14px',
                                    border: '1px solid #e2e8f0',
                                }}>Últimos 6 Meses</span>
                            </div>
                            <ResponsiveContainer width="100%" height={200}>
                                <AreaChart data={actividadMeses} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="gradArea" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.01} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                    <XAxis dataKey="mes" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                    <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Area type="monotone" dataKey="usuarios" stroke="#0ea5e9" strokeWidth={2.5}
                                        fill="url(#gradArea)" dot={{ fill: '#0ea5e9', r: 4 }} activeDot={{ r: 6 }} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Categorías + Heatmap */}
                        <div style={{ display: 'flex', gap: 20 }}>

                            {/* Proyectos por Categoría */}
                            <div style={{ flex: 1, background: '#fff', borderRadius: 16, padding: 24, border: '1px solid #e8edf2', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                                <h3 style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', margin: '0 0 18px', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                    Proyectos por Categoría
                                </h3>
                                {topCats.length === 0 ? (
                                    <p style={{ color: '#94a3b8', fontSize: 13, fontStyle: 'italic' }}>Sin categorías asignadas</p>
                                ) : topCats.map(([cat, count], i) => {
                                    const pct = Math.round((count / totalCat) * 100)
                                    return (
                                        <div key={cat} style={{ marginBottom: 16 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                                                <span style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 }}>{cat}</span>
                                                <span style={{ fontSize: 12, fontWeight: 700, color: '#0f172a' }}>{pct}%</span>
                                            </div>
                                            <div style={{ height: 8, background: '#f1f5f9', borderRadius: 4, overflow: 'hidden' }}>
                                                <div style={{ height: '100%', width: `${pct}%`, background: CAT_COLORS[i] || '#0ea5e9', borderRadius: 4, transition: 'width 0.8s ease' }} />
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>

                            {/* Mapa de actividad semanal */}
                            <div style={{ flex: 1, background: '#fff', borderRadius: 16, padding: 24, border: '1px solid #e8edf2', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                                <h3 style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', margin: '0 0 18px', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                    Mapa de Actividad Semanal
                                </h3>
                                <div style={{ display: 'flex', gap: 8 }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, paddingTop: 2 }}>
                                        {DIAS.map(d => (
                                            <span key={d} style={{ fontSize: 9, color: '#94a3b8', fontWeight: 700, height: 14, lineHeight: '14px' }}>{d}</span>
                                        ))}
                                    </div>
                                    <div style={{ display: 'flex', gap: 4, flex: 1 }}>
                                        {heatmap.map((semana, si) => (
                                            <div key={si} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                                {semana.map((val, di) => {
                                                    const intensity = val / maxHeat
                                                    return (
                                                        <div key={di} title={`${val} registro(s)`} style={{
                                                            width: 14, height: 14, borderRadius: 3,
                                                            background: val === 0 ? '#f1f5f9' : `rgba(14,165,233,${0.15 + intensity * 0.85})`,
                                                            cursor: 'default',
                                                        }} />
                                                    )
                                                })}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 12 }}>
                                    <span style={{ fontSize: 10, color: '#94a3b8' }}>Menos</span>
                                    {[0.1, 0.3, 0.6, 0.85, 1].map((op, i) => (
                                        <div key={i} style={{ width: 12, height: 12, borderRadius: 3, background: `rgba(14,165,233,${op})` }} />
                                    ))}
                                    <span style={{ fontSize: 10, color: '#94a3b8' }}>Más</span>
                                </div>
                            </div>
                        </div>

                        {/* Gestión de Usuarios */}
                        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e8edf2', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                            <div style={{ padding: '20px 24px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                                <div>
                                    <h3 style={{ fontSize: 15, fontWeight: 800, color: '#0f172a', margin: 0 }}>Gestión de Usuarios</h3>
                                    <p style={{ fontSize: 11, color: '#94a3b8', margin: '3px 0 0' }}>
                                        {buscarUsuario.trim() ? `${usuariosVisibles.length} resultado(s)` : `Mostrando ${usuariosVisibles.length} de ${usuarios.length}`}
                                    </p>
                                </div>
                                <div style={{ position: 'relative', flexShrink: 0 }}>
                                    <span className="material-symbols-outlined" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 16, color: '#94a3b8', pointerEvents: 'none' }}>search</span>
                                    <input
                                        value={buscarUsuario}
                                        onChange={e => setBuscarUsuario(e.target.value)}
                                        placeholder="Buscar usuario..."
                                        style={{ paddingLeft: 32, paddingRight: 12, paddingTop: 8, paddingBottom: 8, borderRadius: 8, border: '1.5px solid #e2e8f0', fontSize: 13, outline: 'none', width: 200, fontFamily: 'inherit', background: '#f8fafc' }}
                                    />
                                </div>
                            </div>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ background: '#f8fafc', borderTop: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9' }}>
                                        {['USUARIO', 'CORREO', 'ROL', 'ESTADO', 'ACCIONES'].map(h => (
                                            <th key={h} style={{ padding: '10px 16px', fontSize: 10, fontWeight: 700, color: '#94a3b8', textAlign: 'left', textTransform: 'uppercase', letterSpacing: 0.8 }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {usuariosVisibles.length === 0 ? (
                                        <tr><td colSpan={5} style={{ padding: '24px', textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>
                                            {buscarUsuario.trim() ? 'Sin resultados para esa búsqueda' : 'Sin usuarios registrados'}
                                        </td></tr>
                                    ) : usuariosVisibles.map(u => {
                                        const ROL = { 1: { label: 'Admin', color: '#6366f1' }, 2: { label: 'Personal', color: '#f59e0b' }, 3: { label: 'Empresa', color: '#10b981' } }
                                        const rol = ROL[u.id_rol] || { label: '—', color: '#94a3b8' }
                                        return (
                                            <tr key={u.id} style={{ borderBottom: '1px solid #f8fafc', background: u.bloqueado ? '#fff5f5' : 'transparent' }}>
                                                <td style={{ padding: '11px 16px' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                                                            {u.img ? <img src={u.img} alt={u.Nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                                : <span style={{ fontSize: 12, fontWeight: 800, color: '#0ea5e9' }}>{u.Nombre?.charAt(0)}</span>}
                                                        </div>
                                                        <div style={{ minWidth: 0 }}>
                                                            <p style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 160 }}>{u.Nombre}</p>
                                                            <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>@{u.nombre_usuario}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td style={{ padding: '11px 16px', fontSize: 12, color: '#64748b', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.Correo}</td>
                                                <td style={{ padding: '11px 16px' }}>
                                                    <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 20, background: rol.color + '20', color: rol.color, whiteSpace: 'nowrap' }}>
                                                        {rol.label}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '11px 16px' }}>
                                                    {u.bloqueado ? (
                                                        <span title={u.razon_ban || ''} style={{ fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 20, background: '#fef2f2', color: '#ef4444', whiteSpace: 'nowrap', cursor: u.razon_ban ? 'help' : 'default' }}>
                                                            🚫 Suspendido
                                                        </span>
                                                    ) : (
                                                        <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 20, background: '#dcfce7', color: '#16a34a', whiteSpace: 'nowrap' }}>
                                                            ✓ Activo
                                                        </span>
                                                    )}
                                                </td>
                                                <td style={{ padding: '11px 16px' }}>
                                                    <div style={{ display: 'flex', gap: 6 }}>
                                                        <button
                                                            onClick={() => banearUsuario(u)}
                                                            title={u.bloqueado ? 'Reactivar cuenta' : 'Suspender cuenta'}
                                                            style={{
                                                                padding: '5px 10px', borderRadius: 7, border: 'none', cursor: 'pointer',
                                                                fontSize: 11, fontWeight: 700, transition: 'all 0.15s',
                                                                background: u.bloqueado ? '#dcfce7' : '#fef9c3',
                                                                color: u.bloqueado ? '#16a34a' : '#d97706',
                                                            }}
                                                            onMouseEnter={e => { e.currentTarget.style.opacity = '0.8' }}
                                                            onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
                                                        >
                                                            {u.bloqueado ? 'Reactivar' : 'Banear'}
                                                        </button>
                                                        <button
                                                            onClick={() => eliminarUsuarioAdmin(u)}
                                                            title="Eliminar usuario permanentemente"
                                                            style={{
                                                                padding: '5px 10px', borderRadius: 7, border: 'none', cursor: 'pointer',
                                                                fontSize: 11, fontWeight: 700, background: '#fef2f2', color: '#ef4444',
                                                                transition: 'all 0.15s',
                                                            }}
                                                            onMouseEnter={e => { e.currentTarget.style.background = '#ef4444'; e.currentTarget.style.color = '#fff' }}
                                                            onMouseLeave={e => { e.currentTarget.style.background = '#fef2f2'; e.currentTarget.style.color = '#ef4444' }}
                                                        >
                                                            Eliminar
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* ── Columna derecha ── */}
                    <div style={{ width: 320, display: 'flex', flexDirection: 'column', gap: 20, flexShrink: 0 }}>

                        {/* Convocatorias Activas */}
                        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e8edf2', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                            <div style={{ padding: '20px 20px 16px' }}>
                                <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', margin: 0 }}>Convocatorias Activas</h3>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                                {convActivas.length === 0 ? (
                                    <p style={{ padding: '16px 20px', color: '#94a3b8', fontSize: 13, fontStyle: 'italic' }}>No hay convocatorias activas</p>
                                ) : convActivas.slice(0, 3).map((c, i) => {
                                    const urgente = i === 0
                                    const fechaFormato = c.fecha_cierre
                                        ? new Date(c.fecha_cierre).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
                                        : '—'
                                    return (
                                        <div key={c.id_convocatoria} style={{
                                            padding: '14px 20px',
                                            borderBottom: i < Math.min(convActivas.length, 3) - 1 ? '1px solid #f8fafc' : 'none',
                                        }}>
                                            <div style={{ display: 'flex', gap: 6, marginBottom: 6, flexWrap: 'wrap' }}>
                                                {urgente && (
                                                    <span style={{ fontSize: 10, fontWeight: 700, color: '#ef4444', background: '#fef2f2', padding: '2px 8px', borderRadius: 20 }}>URGENTE</span>
                                                )}
                                                <span style={{ fontSize: 10, fontWeight: 600, color: '#64748b' }}>
                                                    {c.nombre?.split(' ').slice(0, 3).join(' ')} • {c.ubicacion || 'Remoto'}
                                                </span>
                                            </div>
                                            <p style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', margin: '0 0 8px', lineHeight: 1.3 }}>
                                                {c.nombre}
                                            </p>
                                            <div style={{ display: 'flex', gap: 12, marginBottom: 10 }}>
                                                <span style={{ fontSize: 11, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 4 }}>
                                                    <span className="material-symbols-outlined" style={{ fontSize: 13 }}>schedule</span>
                                                    Cierre: {fechaFormato}
                                                </span>
                                            </div>
                                            <button
                                                onClick={() => setConvDetalle(c)}
                                                style={{
                                                    width: '100%', padding: '9px', borderRadius: 10, border: 'none', cursor: 'pointer',
                                                    fontSize: 12, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase',
                                                    background: urgente ? '#0ea5e9' : '#f1f5f9',
                                                    color: urgente ? '#fff' : '#64748b',
                                                    transition: 'all 0.15s',
                                                }}
                                            >
                                                Inspeccionar
                                            </button>
                                        </div>
                                    )
                                })}
                            </div>

                            <div style={{ padding: '12px 20px', borderTop: '1px solid #f1f5f9' }}>
                                <button
                                    onClick={onInspeccionar}
                                    style={{ fontSize: 13, fontWeight: 600, color: '#64748b', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                                >
                                    Ver todas las vacantes →
                                </button>
                            </div>
                        </div>

                        {/* Talento Destacado */}
                        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e8edf2', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                            <div style={{ padding: '20px 20px 12px' }}>
                                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                                    <div>
                                        <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', margin: '0 0 2px' }}>Perfiles Destacados ⭐⭐⭐⭐⭐</h3>
                                        <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>Usuarios con promedio de 5 estrellas</p>
                                    </div>
                                    {destacadoMes && (
                                        <span style={{
                                            fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 20, flexShrink: 0,
                                            background: necesitaRenovar ? '#fef3c7' : '#dcfce7',
                                            color: necesitaRenovar ? '#d97706' : '#16a34a',
                                        }}>
                                            {necesitaRenovar ? `⚠ Renovar para ${mesNombre}` : `✓ ${mesNombre}`}
                                        </span>
                                    )}
                                </div>

                                {/* Talento actualmente destacado */}
                                {destacadoMes && (
                                    <div style={{ marginTop: 12, background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: 10, padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 10 }}>
                                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                                            {destacadoMes.img
                                                ? <img src={destacadoMes.img} alt={destacadoMes.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                : <span style={{ color: '#0ea5e9', fontWeight: 800, fontSize: 12 }}>{destacadoMes.nombre?.charAt(0)}</span>
                                            }
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <p style={{ fontSize: 12, fontWeight: 700, color: '#0284c7', margin: 0 }}>{destacadoMes.nombre}</p>
                                            <p style={{ fontSize: 10, color: '#64748b', margin: 0 }}>Destacado en página principal</p>
                                        </div>
                                        <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#0ea5e9' }}>star</span>
                                    </div>
                                )}
                            </div>

                            {talentos.length === 0 ? (
                                <p style={{ padding: '0 20px 20px', color: '#94a3b8', fontSize: 13, fontStyle: 'italic' }}>Sin reseñas registradas aún</p>
                            ) : talentos.map((u, i) => {
                                const esActual = destacadoMes && String(destacadoMes.id_usuario) === String(u.id)
                                return (
                                    <div key={u.id} style={{
                                        display: 'flex', alignItems: 'center', gap: 12,
                                        padding: '12px 20px', borderTop: '1px solid #f8fafc',
                                        background: esActual ? '#f0f9ff' : 'transparent',
                                        transition: 'background 0.15s',
                                    }}>
                                        <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                                            {u.img ? <img src={u.img} alt={u.Nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                : <span style={{ color: '#0ea5e9', fontWeight: 800, fontSize: 14 }}>{u.Nombre?.charAt(0)}</span>}
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <p style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.Nombre}</p>
                                            <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>{u.numResenas} reseña{u.numResenas !== 1 ? 's' : ''}</p>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                                <i className="fa-solid fa-star" style={{ fontSize: 12, color: '#f59e0b' }} />
                                                <span style={{ fontSize: 13, fontWeight: 800, color: '#0f172a' }}>{u.rating}</span>
                                            </div>
                                            {esActual ? (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                                    <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 20, background: '#0ea5e9', color: '#fff' }}>Activo</span>
                                                    <button
                                                        onClick={quitarDestacado}
                                                        disabled={guardandoDest}
                                                        style={{
                                                            fontSize: 10, fontWeight: 700, padding: '4px 10px', borderRadius: 20,
                                                            background: 'none', border: '1px solid #fca5a5', color: '#ef4444',
                                                            cursor: 'pointer', transition: 'all 0.15s',
                                                        }}
                                                        onMouseEnter={e => { e.currentTarget.style.background = '#ef4444'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#ef4444' }}
                                                        onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.borderColor = '#fca5a5' }}
                                                    >
                                                        Quitar
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => seleccionarDestacado(u)}
                                                    disabled={guardandoDest}
                                                    style={{
                                                        fontSize: 10, fontWeight: 700, padding: '4px 10px', borderRadius: 20,
                                                        background: 'none', border: '1px solid #e2e8f0', color: '#64748b',
                                                        cursor: 'pointer', transition: 'all 0.15s',
                                                    }}
                                                    onMouseEnter={e => { e.currentTarget.style.background = '#0ea5e9'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#0ea5e9' }}
                                                    onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#64748b'; e.currentTarget.style.borderColor = '#e2e8f0' }}
                                                >
                                                    Destacar
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {convDetalle && (
                <ModalDetalleConvocatoria
                    convocatoria={convDetalle}
                    onClose={() => setConvDetalle(null)}
                    onActualizar={() => { }}
                />
            )}
        </>
    )
}

export default DashboardAdmin
