require("dotenv").config()
const jwt = require("jsonwebtoken")
const { tokenBlacklist } = require("../controllers/UsuarioController")

const verificarToken = (req, res, next) => {
    const authHeader = req.headers["authorization"]
    const token = authHeader && authHeader.split(" ")[1] // Bearer <token>

    
    if (!token) {
        return res.status(401).json({ status: 401, message: "Acceso denegado. Token requerido." })
    }

    if (tokenBlacklist.has(token)) {
        return res.status(401).json({ status: 401, message: "Token invalidado. Inicia sesión de nuevo." })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'aguacate')
        req.usuario = decoded // { id, correo, id_rol }
        next()
    } catch (error) {
        return res.status(401).json({ status: 401, message: "Token inválido o expirado." })
    }
}

module.exports = verificarToken
