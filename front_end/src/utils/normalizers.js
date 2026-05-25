export function normalizarPortafolio(p) {
    let componentes = []
    if (p.componentes_json) {
        try { componentes = JSON.parse(p.componentes_json) } catch (_) { componentes = [] }
    }
    return {
        id:          p.id_portafolio,
        titulo:      p.titulo,
        descripcion: p.descripcion,
        pdf:         p.pdf,
        imgPortada:  p.img_portada,
        usuarioId:   p.id_usuario,
        componentes,
        categorias:  p.categorias  || [],
    }
}

export function normalizarResena(r) {
    return {
        id:           r.id_resena,
        portafolioId: r.id_portafolio,
        usuarioId:    r.id_usuario,
        rating:       r.calificacion,
        comentario:   r.comentarios,
        fecha:        r.createdAt || r.fecha,
    }
}

export function normalizarUsuario(u) {
    return {
        id:             u.id_usuario,
        nombre_usuario: u.nombre_usuario,
        Nombre:         u.nombre_completo,
        Correo:         u.correo,
        Telefono:       u.telefono,
        Provincias:     u.provincia,
        Canton:         u.canton,
        Distrito:       u.distrito,
        img:            u.img_perfil,
        descripcion:    u.descripcion,
        id_rol:         u.id_rol,
        createdAt:      u.createdAt,
    }
}

export function normalizarComunidad(c) {
    return {
        id:          c.id_comunidad,
        nombre:      c.nombre,
        descripcion: c.descripcion,
        icono:       c.icono || '🌐',
        color:       c.Color || '#0ea5e9',
        colorClaro:  c.ColorClaro || '#0ea5e922',
        banner:      c.banner || '',
        categoria:   c.Categoria?.nombre || '',
        creadoPor:   c.id_usuario || null,
    }
}
