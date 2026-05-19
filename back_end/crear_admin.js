// Ejecutar UNA sola vez: node crear_admin.js
// Crea el usuario administrador inicial en la BD

const bcrypt = require('bcrypt')
const { Sequelize } = require('sequelize')
const config = require('./src/config/config')

const sequelize = new Sequelize(
    config.development.database,
    config.development.username,
    config.development.password,
    { host: config.development.host, dialect: config.development.dialect, logging: false }
)

async function main() {
    await sequelize.authenticate()

    const hash = await bcrypt.hash('Admin1234', 10)

    await sequelize.query(`
        INSERT INTO usuarios
            (nombre_usuario, nombre_completo, correo, contrasena, telefono, provincia, canton, distrito, id_rol, createdAt, updatedAt)
        VALUES
            ('admin_krea', 'Administrador Krea', 'admin@krea.com', :hash, '88888888', 'San José', 'San José', 'Carmen', 1, NOW(), NOW())
    `, { replacements: { hash } })

    console.log('✅ Usuario admin creado:')
    console.log('   Correo:     admin@krea.com')
    console.log('   Contraseña: Admin1234')
    console.log('   Rol:        Admin (id_rol = 1)')

    await sequelize.close()
}

main().catch(err => { console.error('❌ Error:', err.message); process.exit(1) })
