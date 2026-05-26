export function normalizarPortafolio(p) {
    let componentes = []
    if (p.componentes_json) {
        try { componentes = JSON.parse(p.componentes_json) } catch (_) { componentes = [] }
    }
    const u = p.Usuario || p.usuario || null
    return {
        id:          p.id_portafolio,
        titulo:      p.titulo,
        descripcion: p.descripcion,
        pdf:         p.pdf,
        imgPortada:  p.img_portada,
        usuarioId:   p.id_usuario,
        componentes,
        categorias:  p.categorias || [],
        usuario: u ? {
            id:         u.id_usuario,
            Nombre:     u.nombre_completo,
            img:        u.img_perfil,
            Provincias: u.provincia,
            Canton:     u.canton,
            Distrito:   u.distrito,
        } : null,
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
        id:               u.id_usuario,
        nombre_usuario:   u.nombre_usuario,
        Nombre:           u.nombre_completo,
        Correo:           u.correo,
        Telefono:         u.telefono,
        Provincias:       u.provincia,
        Canton:           u.canton,
        Distrito:         u.distrito,
        img:              u.img_perfil,
        descripcion:      u.descripcion,
        id_rol:           u.id_rol,
        createdAt:        u.createdAt,
        bloqueado:        u.bloqueado || false,
        fecha_ban_expira: u.fecha_ban_expira || null,
        razon_ban:        u.razon_ban || null,
    }
}

export function normalizarResenaPerfil(r) {
    return {
        id:         r.id_resena_perfil,
        receptorId: r.id_usuario_receptor,
        autorId:    r.id_usuario_autor,
        rating:     r.calificacion,
        comentario: r.comentarios,
        fecha:      r.createdAt,
        autor: r.autor ? {
            id:     r.autor.id_usuario,
            nombre: r.autor.nombre_completo,
            img:    r.autor.img_perfil,
        } : null,
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
