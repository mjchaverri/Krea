// Motor del modo demo: intercepta las llamadas de src/services/Fetch.jsx
// y las resuelve contra una "base de datos" falsa guardada en localStorage,
// sin tocar la red. Todo se devuelve en el mismo formato crudo (snake_case)
// que devolvería el backend real, para que normalizers.js siga funcionando
// sin cambios.

import { crearSeedInicial } from './mockSeed'

const DEMO_FLAG_KEY = 'krea_demo_activo'
const DB_KEY = 'krea_demo_db'

export function isDemoMode() {
    return localStorage.getItem(DEMO_FLAG_KEY) === 'true'
}

export function activarModoDemo() {
    localStorage.setItem(DEMO_FLAG_KEY, 'true')
    localStorage.setItem(DB_KEY, JSON.stringify(crearSeedInicial()))
}

export function desactivarModoDemo() {
    localStorage.removeItem(DEMO_FLAG_KEY)
    localStorage.removeItem(DB_KEY)
}

// Convierte un archivo subido a un data URL (base64), para usarlo como
// reemplazo local de la subida a Cloudinary en modo demo. A diferencia de
// URL.createObjectURL, un data URL es un string autocontenido que sigue
// funcionando después de guardarlo en localStorage y recargar la página.
export function archivoABase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result)
        reader.onerror = reject
        reader.readAsDataURL(file)
    })
}

function leerDB() {
    const raw = localStorage.getItem(DB_KEY)
    if (!raw) {
        const fresh = crearSeedInicial()
        localStorage.setItem(DB_KEY, JSON.stringify(fresh))
        return fresh
    }
    try {
        return JSON.parse(raw)
    } catch (_) {
        const fresh = crearSeedInicial()
        localStorage.setItem(DB_KEY, JSON.stringify(fresh))
        return fresh
    }
}

function guardarDB(db) {
    localStorage.setItem(DB_KEY, JSON.stringify(db))
}

function nextId(lista, campo) {
    if (!lista.length) return 1
    return Math.max(...lista.map(r => Number(r[campo]) || 0)) + 1
}

function ahora() {
    return new Date().toISOString()
}

function aplicarLimit(lista, params) {
    const limit = parseInt(params.get('limit'))
    if (!limit || Number.isNaN(limit)) return lista
    return lista.slice(0, limit)
}

// Adjunta el usuario dueño (raw, forma Usuario del backend) a un portafolio
function enriquecerPortafolio(p, db) {
    const u = db.usuarios.find(x => x.id_usuario === p.id_usuario)
    return {
        ...p,
        Usuario: u ? {
            id_usuario: u.id_usuario,
            nombre_completo: u.nombre_completo,
            img_perfil: u.img_perfil,
            provincia: u.provincia,
            canton: u.canton,
            distrito: u.distrito,
        } : null,
    }
}

function enriquecerResenaPerfil(r, db) {
    const autor = db.usuarios.find(x => x.id_usuario === r.id_usuario_autor)
    return {
        ...r,
        autor: autor ? {
            id_usuario: autor.id_usuario,
            nombre_completo: autor.nombre_completo,
            img_perfil: autor.img_perfil,
        } : null,
    }
}

function parseEndpoint(endpoint) {
    const [pathPart, queryString] = endpoint.split('?')
    const segmentos = pathPart.split('/').filter(Boolean)
    const params = new URLSearchParams(queryString || '')
    return { segmentos, params }
}

function usuarioActivoId() {
    return parseInt(localStorage.getItem('idUsuario')) || null
}

// ─────────────────────────────────────────────────────────────
// Router principal
// ─────────────────────────────────────────────────────────────
export async function mockRequest(method, endpoint, body) {
    const db = leerDB()
    const { segmentos, params } = parseEndpoint(endpoint)
    const [recurso, a, b, c] = segmentos

    const resultado = despachar(method, recurso, a, b, c, params, body, db)
    guardarDB(db)

    // Simula una pequeña latencia de red para que la UI se sienta real
    await new Promise(r => setTimeout(r, 120))

    if (resultado === undefined) {
        throw new Error(`[modo demo] Endpoint no soportado: ${method} ${endpoint}`)
    }
    return resultado
}

function despachar(method, recurso, a, b, c, params, body, db) {
    // ── usuarios ──────────────────────────────────────────────
    if (recurso === 'usuarios') {
        if (method === 'GET' && !a) return aplicarLimit(db.usuarios, params)
        if (method === 'GET' && a && a !== 'me') return db.usuarios.find(u => u.id_usuario === Number(a)) || null
        if (method === 'POST' && a === 'register') {
            const nuevo = { id_usuario: nextId(db.usuarios, 'id_usuario'), createdAt: ahora(), bloqueado: false, ...body }
            db.usuarios.push(nuevo)
            return nuevo
        }
        if (method === 'PUT' && a) {
            const u = db.usuarios.find(x => x.id_usuario === Number(a))
            if (u) Object.assign(u, body)
            return u
        }
        if (method === 'PATCH' && a && b === 'bloquear') {
            const u = db.usuarios.find(x => x.id_usuario === Number(a))
            if (u) Object.assign(u, body)
            return u
        }
        if (method === 'DELETE' && a) {
            db.usuarios = db.usuarios.filter(x => x.id_usuario !== Number(a))
            return { ok: true }
        }
    }

    // ── portafolios ───────────────────────────────────────────
    if (recurso === 'portafolios') {
        if (method === 'GET' && a === 'usuario' && b) {
            const lista = db.portafolios.filter(p => p.id_usuario === Number(b)).map(p => enriquecerPortafolio(p, db))
            return aplicarLimit(lista, params)
        }
        if (method === 'GET' && !a) {
            let lista = db.portafolios
            const idUsuarioFiltro = params.get('id_usuario')
            if (idUsuarioFiltro) lista = lista.filter(p => p.id_usuario === Number(idUsuarioFiltro))
            lista = lista.map(p => enriquecerPortafolio(p, db))
            return aplicarLimit(lista, params)
        }
        if (method === 'POST' && !a) {
            const nuevo = { id_portafolio: nextId(db.portafolios, 'id_portafolio'), createdAt: ahora(), updatedAt: ahora(), ...body }
            db.portafolios.push(nuevo)
            return enriquecerPortafolio(nuevo, db)
        }
        if (method === 'PUT' && a) {
            const p = db.portafolios.find(x => x.id_portafolio === Number(a))
            if (p) { Object.assign(p, body); p.updatedAt = ahora() }
            return p ? enriquecerPortafolio(p, db) : null
        }
        if (method === 'DELETE' && a) {
            db.portafolios = db.portafolios.filter(x => x.id_portafolio !== Number(a))
            return { ok: true }
        }
    }

    // ── resenas (de portafolio) ───────────────────────────────
    if (recurso === 'resenas') {
        if (method === 'GET' && a === 'portafolio' && b) {
            return db.resenas.filter(r => r.id_portafolio === Number(b))
        }
        if (method === 'GET' && !a) return aplicarLimit(db.resenas, params)
        if (method === 'POST' && !a) {
            const nueva = { id_resena: nextId(db.resenas, 'id_resena'), createdAt: ahora(), ...body }
            db.resenas.push(nueva)
            return nueva
        }
        if (method === 'DELETE' && a) {
            db.resenas = db.resenas.filter(x => x.id_resena !== Number(a))
            return { ok: true }
        }
    }

    // ── resenas-perfil ────────────────────────────────────────
    if (recurso === 'resenas-perfil') {
        if (method === 'GET' && a === 'usuario' && b) {
            const lista = db.resenas_perfil
                .filter(r => r.id_usuario_receptor === Number(b))
                .map(r => enriquecerResenaPerfil(r, db))
            return aplicarLimit(lista, params)
        }
        if (method === 'GET' && a === 'admin' && b === 'todas') {
            return db.resenas_perfil.map(r => enriquecerResenaPerfil(r, db))
        }
        if (method === 'POST' && !a) {
            const nueva = { id_resena_perfil: nextId(db.resenas_perfil, 'id_resena_perfil'), createdAt: ahora(), ...body }
            db.resenas_perfil.push(nueva)
            return enriquecerResenaPerfil(nueva, db)
        }
        if (method === 'DELETE' && a) {
            db.resenas_perfil = db.resenas_perfil.filter(x => x.id_resena_perfil !== Number(a))
            return { ok: true }
        }
    }

    // ── comunidades ───────────────────────────────────────────
    if (recurso === 'comunidades') {
        if (method === 'GET' && !a) return aplicarLimit(db.comunidades, params)
        if (method === 'POST' && !a) {
            const nueva = {
                id_comunidad: nextId(db.comunidades, 'id_comunidad'),
                createdAt: ahora(),
                total_miembros: 1,
                ...body,
            }
            db.comunidades.push(nueva)
            return nueva
        }
        if (method === 'PUT' && a) {
            const cm = db.comunidades.find(x => x.id_comunidad === Number(a))
            if (cm) Object.assign(cm, body)
            return cm
        }
        if (method === 'DELETE' && a) {
            db.comunidades = db.comunidades.filter(x => x.id_comunidad !== Number(a))
            return { ok: true }
        }
    }

    // ── miembros ──────────────────────────────────────────────
    if (recurso === 'miembros') {
        if (method === 'GET' && a === 'usuario' && b) return db.miembros.filter(m => m.id_usuario === Number(b))
        if (method === 'GET' && a === 'comunidad' && b) return db.miembros.filter(m => m.id_comunidad === Number(b))
        if (method === 'POST' && !a) {
            const nuevo = { id_miembro: nextId(db.miembros, 'id_miembro'), createdAt: ahora(), ...body }
            db.miembros.push(nuevo)
            const cm = db.comunidades.find(x => x.id_comunidad === Number(body.id_comunidad))
            if (cm) cm.total_miembros = (parseInt(cm.total_miembros) || 0) + 1
            return nuevo
        }
        if (method === 'DELETE' && a && b) {
            db.miembros = db.miembros.filter(x => !(x.id_comunidad === Number(a) && x.id_usuario === Number(b)))
            const cm = db.comunidades.find(x => x.id_comunidad === Number(a))
            if (cm) cm.total_miembros = Math.max(0, (parseInt(cm.total_miembros) || 1) - 1)
            return { ok: true }
        }
    }

    // ── chat-comunidad ────────────────────────────────────────
    if (recurso === 'chat-comunidad') {
        if (method === 'GET' && a) {
            return db.chat_comunidad
                .filter(m => m.id_comunidad === Number(a))
                .sort((x, y) => new Date(x.Fecha) - new Date(y.Fecha))
        }
        if (method === 'POST' && !a) {
            const nuevo = { id_chat_comu: nextId(db.chat_comunidad, 'id_chat_comu'), Fecha: ahora(), ...body }
            db.chat_comunidad.push(nuevo)
            return nuevo
        }
        if (method === 'DELETE' && a) {
            db.chat_comunidad = db.chat_comunidad.filter(x => x.id_chat_comu !== Number(a))
            return { ok: true }
        }
    }

    // ── convocatorias ─────────────────────────────────────────
    if (recurso === 'convocatorias') {
        if (method === 'GET' && a && b === 'participantes') {
            return db.participantes_convo.filter(p => p.id_convocatoria === Number(a))
        }
        if (method === 'GET' && !a) {
            let lista = db.convocatorias
            const idComunidad = params.get('id_comunidad')
            if (idComunidad) lista = lista.filter(cv => cv.id_comunidad === Number(idComunidad))
            return aplicarLimit(lista, params)
        }
        if (method === 'POST' && a && b === 'participar') {
            const nuevo = {
                id_participante_convo: nextId(db.participantes_convo, 'id_participante_convo'),
                id_convocatoria: Number(a),
                createdAt: ahora(),
                ...body,
            }
            db.participantes_convo.push(nuevo)
            return nuevo
        }
        if (method === 'POST' && !a) {
            const nueva = { id_convocatoria: nextId(db.convocatorias, 'id_convocatoria'), createdAt: ahora(), ...body }
            db.convocatorias.push(nueva)
            return nueva
        }
        if (method === 'PUT' && a) {
            const cv = db.convocatorias.find(x => x.id_convocatoria === Number(a))
            if (cv) Object.assign(cv, body)
            return cv
        }
        if (method === 'DELETE' && a && b === 'participantes' && c) {
            db.participantes_convo = db.participantes_convo.filter(
                p => !(p.id_convocatoria === Number(a) && p.id_usuario === Number(c))
            )
            return { ok: true }
        }
        if (method === 'DELETE' && a) {
            db.convocatorias = db.convocatorias.filter(x => x.id_convocatoria !== Number(a))
            return { ok: true }
        }
    }

    // ── reportes-chat ─────────────────────────────────────────
    if (recurso === 'reportes-chat') {
        if (method === 'GET' && a === 'baneados' && b) return db.baneados_comunidad.filter(x => x.id_comunidad === Number(b))
        if (method === 'GET' && a === 'comunidad' && b) return db.reportes_chat.filter(x => x.id_comunidad === Number(b))
        if (method === 'POST' && a === 'banear') {
            const nuevo = { id_baneado: nextId(db.baneados_comunidad, 'id_baneado'), createdAt: ahora(), ...body }
            db.baneados_comunidad.push(nuevo)
            return nuevo
        }
        if (method === 'POST' && !a) {
            const nuevo = { id_reporte: nextId(db.reportes_chat, 'id_reporte'), createdAt: ahora(), estado: 'pendiente', ...body }
            db.reportes_chat.push(nuevo)
            return nuevo
        }
        if (method === 'PUT' && a && b === 'estado') {
            const rp = db.reportes_chat.find(x => x.id_reporte === Number(a))
            if (rp) Object.assign(rp, body)
            return rp
        }
        if (method === 'DELETE' && a === 'baneados' && b && c) {
            db.baneados_comunidad = db.baneados_comunidad.filter(
                x => !(x.id_comunidad === Number(b) && x.id_usuario === Number(c))
            )
            return { ok: true }
        }
    }

    // ── seguidos ──────────────────────────────────────────────
    if (recurso === 'seguidos') {
        if (method === 'GET' && a === 'portafolios') {
            const activo = usuarioActivoId()
            const siguiendoIds = db.seguidos.filter(s => s.id_seguidor === activo).map(s => s.id_seguido)
            return db.portafolios.filter(p => siguiendoIds.includes(p.id_usuario)).map(p => enriquecerPortafolio(p, db))
        }
        if (method === 'GET' && a === 'check' && b) {
            const activo = usuarioActivoId()
            const existe = db.seguidos.some(s => s.id_seguidor === activo && s.id_seguido === Number(b))
            return { siguiendo: existe }
        }
        if (method === 'GET' && a === 'seguidores' && b) return db.seguidos.filter(s => s.id_seguido === Number(b))
        if (method === 'GET' && a === 'siguiendo' && b) return db.seguidos.filter(s => s.id_seguidor === Number(b))
        if (method === 'POST' && !a) {
            const nuevo = { id_seguido_registro: nextId(db.seguidos, 'id_seguido_registro'), createdAt: ahora(), ...body }
            db.seguidos.push(nuevo)
            return nuevo
        }
        if (method === 'DELETE' && a) {
            db.seguidos = db.seguidos.filter(x => x.id_seguido_registro !== Number(a))
            return { ok: true }
        }
    }

    // ── categorias ────────────────────────────────────────────
    if (recurso === 'categorias' && method === 'GET' && !a) return db.categorias

    // ── configuracion ─────────────────────────────────────────
    if (recurso === 'configuracion' && a === 'talento_destacado') {
        if (method === 'GET') {
            if (!db.configuracion.talento_destacado) return null
            const u = db.usuarios.find(x => x.id_usuario === db.configuracion.talento_destacado)
            return u || null
        }
        if (method === 'PUT') {
            db.configuracion.talento_destacado = body.id_usuario ?? body.id ?? null
            return db.configuracion
        }
    }

    return undefined
}
