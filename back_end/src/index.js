const Usuario = require("./models/Usuario")
const Roles = require("./models/Roles")
const Talentos = require("./models/Talentos")
const Tipos_talentos = require("./models/Tipos_talentos")
const Tipos_para_convos = require("./models/Tipo_para_convos")
const Portafolios = require("./models/Portafolios")
const Resenas = require("./models/Resenas")
const Componentes = require("./models/Componentes")
const Bloques_Componentes = require("./models/Bloques_Componentes")
const Componentes_estilos = require("./models/Componentes_estilos")
const Convocatorias = require("./models/Convocatoria")
const Participante_convo = require("./models/Participante_convo")
const Reporte_convo = require("./models/Reporte_convo")
const Tipo_convo = require("./models/Tipo_convo")
const Categorias = require("./models/Categorias")
const Categoria_portafolios = require("./models/Categoria_portafolios")
const Comunidades = require("./models/Comunidades")
const Miembros = require("./models/Miembros")
const Chat_Comu = require("./models/Chat_Comu")
const Chat_Miembros = require("./models/Chat_Miembros")
const Seguidos = require("./models/Seguidos")

// ── Usuarios ────────────────────────────────────────────────────
// Un usuario tiene un rol
Usuario.belongsTo(Roles, { foreignKey: "id_rol" })
Roles.hasMany(Usuario, { foreignKey: "id_rol" })

// ── Portafolios ─────────────────────────────────────────────────
// Un usuario puede tener muchos portafolios
Usuario.hasMany(Portafolios, { foreignKey: "id_usuario" })
Portafolios.belongsTo(Usuario, { foreignKey: "id_usuario" })

// ── Reseñas ─────────────────────────────────────────────────────
// Un usuario puede escribir muchas reseñas
Usuario.hasMany(Resenas, { foreignKey: "id_usuario" })
Resenas.belongsTo(Usuario, { foreignKey: "id_usuario" })
// Un portafolio puede tener muchas reseñas
Portafolios.hasMany(Resenas, { foreignKey: "id_portafolio" })
Resenas.belongsTo(Portafolios, { foreignKey: "id_portafolio" })

// ── Componentes del portafolio ──────────────────────────────────
// Un portafolio tiene muchos componentes
Portafolios.hasMany(Componentes, { foreignKey: "id_portafolio" })
Componentes.belongsTo(Portafolios, { foreignKey: "id_portafolio" })
// Un componente tiene muchos bloques
Componentes.hasMany(Bloques_Componentes, { foreignKey: "id_componente" })
Bloques_Componentes.belongsTo(Componentes, { foreignKey: "id_componente" })
// Un componente tiene muchos estilos
Componentes.hasMany(Componentes_estilos, { foreignKey: "id_componente" })
Componentes_estilos.belongsTo(Componentes, { foreignKey: "id_componente" })

// ── Categorías de portafolio (N:M) ──────────────────────────────
Portafolios.belongsToMany(Categorias, {
    through: Categoria_portafolios,
    foreignKey: "id_portafolio",
    otherKey: "id_categoria"
})
Categorias.belongsToMany(Portafolios, {
    through: Categoria_portafolios,
    foreignKey: "id_categoria",
    otherKey: "id_portafolio"
})

// ── Talentos de usuario (N:M) ───────────────────────────────────
Usuario.belongsToMany(Talentos, {
    through: Tipos_talentos,
    foreignKey: "id_usuario",
    otherKey: "id_talento"
})
Talentos.belongsToMany(Usuario, {
    through: Tipos_talentos,
    foreignKey: "id_talento",
    otherKey: "id_usuario"
})

// ── Convocatorias ────────────────────────────────────────────────
// Un usuario crea muchas convocatorias
Usuario.hasMany(Convocatorias, { foreignKey: "id_usuario" })
Convocatorias.belongsTo(Usuario, { foreignKey: "id_usuario" })
// Una convocatoria tiene muchos participantes
Convocatorias.hasMany(Participante_convo, { foreignKey: "id_convocatoria" })
Participante_convo.belongsTo(Convocatorias, { foreignKey: "id_convocatoria" })
// Un usuario puede participar en muchas convocatorias
Usuario.hasMany(Participante_convo, { foreignKey: "id_usuario" })
Participante_convo.belongsTo(Usuario, { foreignKey: "id_usuario" })
// Un reporte pertenece a un participante y a un usuario
Participante_convo.hasOne(Reporte_convo, { foreignKey: "id_participante_convo" })
Reporte_convo.belongsTo(Participante_convo, { foreignKey: "id_participante_convo" })
Usuario.hasMany(Reporte_convo, { foreignKey: "id_usuario" })
Reporte_convo.belongsTo(Usuario, { foreignKey: "id_usuario" })
// Tipo de convocatoria
Tipos_para_convos.hasMany(Tipo_convo, { foreignKey: "id_tipo" })
Tipo_convo.belongsTo(Tipos_para_convos, { foreignKey: "id_tipo" })
Convocatorias.hasMany(Tipo_convo, { foreignKey: "id_convocatoria" })
Tipo_convo.belongsTo(Convocatorias, { foreignKey: "id_convocatoria" })

// ── Comunidades ──────────────────────────────────────────────────
// Una comunidad pertenece a una categoría
Categorias.hasMany(Comunidades, { foreignKey: "id_categoria" })
Comunidades.belongsTo(Categorias, { foreignKey: "id_categoria" })
// Una comunidad tiene muchos miembros
Comunidades.hasMany(Miembros, { foreignKey: "id_comunidad" })
Miembros.belongsTo(Comunidades, { foreignKey: "id_comunidad" })
// Un usuario puede ser miembro de muchas comunidades
Usuario.hasMany(Miembros, { foreignKey: "id_usuario" })
Miembros.belongsTo(Usuario, { foreignKey: "id_usuario" })

// ── Seguidos (N:M entre usuarios) ────────────────────────────────
Usuario.hasMany(Seguidos, { foreignKey: "id_seguidor", as: "siguiendo" })
Seguidos.belongsTo(Usuario, { foreignKey: "id_seguidor", as: "seguidor" })
Usuario.hasMany(Seguidos, { foreignKey: "id_seguido", as: "seguidores" })
Seguidos.belongsTo(Usuario, { foreignKey: "id_seguido", as: "seguido" })

// ── Chat ──────────────────────────────────────────────────────────
// Una comunidad tiene muchos mensajes de chat
Comunidades.hasMany(Chat_Comu, { foreignKey: "id_comunidad" })
Chat_Comu.belongsTo(Comunidades, { foreignKey: "id_comunidad" })
// Un mensaje de chat está vinculado a muchos miembros (lectura)
Chat_Comu.hasMany(Chat_Miembros, { foreignKey: "id_chat" })
Chat_Miembros.belongsTo(Chat_Comu, { foreignKey: "id_chat" })
Miembros.hasMany(Chat_Miembros, { foreignKey: "id_miembro" })
Chat_Miembros.belongsTo(Miembros, { foreignKey: "id_miembro" })

module.exports = {
    Usuario,
    Roles,
    Talentos,
    Tipos_talentos,
    Tipos_para_convos,
    Portafolios,
    Resenas,
    Componentes,
    Bloques_Componentes,
    Componentes_estilos,
    Convocatorias,
    Participante_convo,
    Reporte_convo,
    Tipo_convo,
    Categorias,
    Categoria_portafolios,
    Comunidades,
    Miembros,
    Chat_Comu,
    Chat_Miembros,
    Seguidos
}