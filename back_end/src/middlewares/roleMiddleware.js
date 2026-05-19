const { Usuario, Roles } = require("../index")

// Uso: roleMiddleware("admin")  o  roleMiddleware("empresa", "admin")
const roleMiddleware = (...rolesPermitidos) => {
    return async (req, res, next) => {
        try {
            const usuario = await Usuario.findByPk(req.usuario.id, {
                include: [{ model: Roles, attributes: ["nombre"] }]
            })

            if (!usuario || !usuario.Roles) {
                return res.status(403).json({ status: 403, message: "No tienes un rol asignado." })
            }

            const rolUsuario = usuario.Roles.nombre.toLowerCase()
            if (!rolesPermitidos.map(r => r.toLowerCase()).includes(rolUsuario)) {
                return res.status(403).json({
                    status: 403,
                    message: `Acceso restringido. Se requiere rol: ${rolesPermitidos.join(" o ")}.`
                })
            }

            next()
        } catch (error) {
            res.status(500).json({ status: 500, message: "Error al verificar el rol." })
        }
    }
}

module.exports = roleMiddleware
