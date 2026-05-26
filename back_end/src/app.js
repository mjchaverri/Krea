require("dotenv").config();
const express = require("express")
const cors = require("cors")
const app = express()
const chatbotRoutes = require("./routes/chatbot.routes");

const sequelize = require("./config/db")
require("./index")

const setupSwagger = require("./config/swagger")

app.use(cors())
app.use(express.json())

// ── Importar rutas ──────────────────────────────────────────────
const usuarioRoutes = require("./routes/usuario_routes")
const rolesRoutes = require("./routes/roles_routes")
const talentosRoutes = require("./routes/talentos_routes")
const convocatoriasRoutes = require("./routes/convocatorias_routes")
const tipoParaConvosRoutes = require("./routes/tipo_para_convos_routes")
const resenasRoutes = require("./routes/resenas_routes")
const componentesRoutes = require("./routes/componentes_routes")
const componentesEstilosRoutes = require("./routes/componentes_estilos_routes")
const bloquesComponentesRoutes = require("./routes/bloques_componentes_routes")
const chatComuRoutes = require("./routes/chat_comu_routes")
const comunidadesRoutes = require("./routes/comunidades_routes")
const categoriasRoutes = require("./routes/categorias_routes")
const portafoliosRoutes = require("./routes/Portafolios_routes")
const reporte_convoRoutes = require("./routes/Reportes_convo_routes")
const miembrosRoutes = require("./routes/miembros_routes")
const seguidosRoutes = require("./routes/seguidos_routes")
const configuracionRoutes = require("./routes/configuracion_routes")
const resenas_perfilRoutes = require("./routes/resenas_perfil_routes")
const reportesChatRoutes   = require("./routes/reportes_chat_routes")

// ── Rutas ───────────────────────────────────────────────────────
app.use("/usuarios", usuarioRoutes)
app.use("/roles", rolesRoutes)
app.use("/talentos", talentosRoutes)
app.use("/convocatorias", convocatoriasRoutes)
app.use("/tipo-convocatorias", tipoParaConvosRoutes)
app.use("/resenas", resenasRoutes)
app.use("/componentes", componentesRoutes)
app.use("/componentes-estilos", componentesEstilosRoutes)
app.use("/bloques-componentes", bloquesComponentesRoutes)
app.use("/chat-comunidad", chatComuRoutes)
app.use("/comunidades", comunidadesRoutes)
app.use("/categorias", categoriasRoutes)
app.use("/portafolios", portafoliosRoutes)
app.use("/reporte-convo", reporte_convoRoutes)
app.use("/miembros", miembrosRoutes)
app.use("/seguidos", seguidosRoutes)
app.use("/configuracion", configuracionRoutes)
app.use("/resenas-perfil", resenas_perfilRoutes)
app.use("/reportes-chat", reportesChatRoutes)
app.use("/api/chatbot", chatbotRoutes);

setupSwagger(app)

app.listen(3000, () => {
    console.log('servidor corriendo en puerto 3000')
    console.log('documentación disponible en http://localhost:3000/api/docs')
})