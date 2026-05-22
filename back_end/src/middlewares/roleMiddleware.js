const ROL_NOMBRE = { 1: 'admin', 2: 'personal', 3: 'empresa' }

// Uso: roleMiddleware("admin")  o  roleMiddleware("empresa", "admin")
const roleMiddleware = (...rolesPermitidos) => {
    return (req, res, next) => {
        const rolUsuario = ROL_NOMBRE[req.usuario?.id_rol]

        if (!rolUsuario) {
            return res.status(403).json({ status: 403, message: "No tienes un rol asignado." })
        }

        if (!rolesPermitidos.map(r => r.toLowerCase()).includes(rolUsuario)) {
            return res.status(403).json({
                status: 403,
                message: `Acceso restringido. Se requiere rol: ${rolesPermitidos.join(" o ")}.`
            })
        }

        next()
    }
}

module.exports = roleMiddleware
