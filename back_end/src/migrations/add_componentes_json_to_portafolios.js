require('dotenv').config()
const mysql = require('mysql2/promise')

async function run() {
    const conn = await mysql.createConnection({
        host:     process.env.DB_HOST || '127.0.0.1',
        user:     process.env.DB_USER || 'root',
        password: process.env.DB_PASS || 'root',
        database: process.env.DB_NAME || 'krea',
    })

    try {
        await conn.execute(`
            ALTER TABLE portafolios
            ADD COLUMN componentes_json LONGTEXT NULL DEFAULT NULL
        `)
        console.log('✓ Columna componentes_json agregada a portafolios')
    } catch (e) {
        if (e.code === 'ER_DUP_FIELDNAME') {
            console.log('→ La columna ya existe, sin cambios.')
        } else {
            throw e
        }
    } finally {
        await conn.end()
    }
}

run().catch(err => { console.error(err); process.exit(1) })
