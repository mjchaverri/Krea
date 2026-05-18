const express = require("express")

const app = express()

const sequelize = require("./config/db")

require("./index")

app.use(express.json())

// ── Importar rutas ──────────────────────────────────────────────
const usuarioRoutes            = require("./routes/usuario_routes")
const rolesRoutes              = require("./routes/roles_routes")
const talentosRoutes           = require("./routes/talentos_routes")
const convocatoriasRoutes      = require("./routes/convocatorias_routes")
const tipoParaConvosRoutes     = require("./routes/tipo_para_convos_routes")
const resenasRoutes            = require("./routes/resenas_routes")
const componentesRoutes        = require("./routes/componentes_routes")
const componentesEstilosRoutes = require("./routes/componentes_estilos_routes")
const bloquesComponentesRoutes = require("./routes/bloques_componentes_routes")

// ── Usar rutas ──────────────────────────────────────────────────
app.use("/usuarios",            usuarioRoutes)
app.use("/roles",               rolesRoutes)
app.use("/talentos",            talentosRoutes)
app.use("/convocatorias",       convocatoriasRoutes)
app.use("/tipo-convocatorias",  tipoParaConvosRoutes)
app.use("/resenas",             resenasRoutes)
app.use("/componentes",         componentesRoutes)
app.use("/componentes-estilos", componentesEstilosRoutes)
app.use("/bloques-componentes", bloquesComponentesRoutes)

app.listen(3000, () => {
    console.log('servidor corriendo');
})