const Usuario = require("./models/Usuario")
const Talentos = require("./models/Talentos")
const Tipos_para_convos = require("./models/Tipo_para_convos")
const Roles = require("./models/Roles")
const Portafolios = require("./models/Portafolios")
const Resenas = require("./models/Resenas")
const Componentes = require("./models/Componentes")
const Bloques_Componentes = require("./models/Bloques_Componentes")
const Componentes_estilos = require("./models/Componentes_estilos")
const Participante_convo = require("./models/Participante_convo")
const Convocatorias = require("./models/Convocatoria")
const Reporte_convo = require("./models/Reporte_convo")
const Tipo_convo = require("./models/Tipo_convo")



//Relaciones entre tablas
// Un usuario tiene un rol, y un rol puede tener muchos usuarios
Usuario.belongsTo(Roles,{foreignKey: "id_rol"})
Roles.hasMany(Usuario,{foreignKey: "id_rol"})
// Un usuario tiene muchos portafolios, y un portafolio pertenece a un usuario
Usuario.hasMany(Portafolios,{foreignKey: "id_usuario"})
Portafolios.belongsTo(Usuario,{foreignKey: "id_usuario"})

// un usuario puede escribir muchas reseñas, y una reseña pertenece a un usuario
Usuario.hasMany(Resenas,{foreignKey: "id_usuario"})
Resenas.belongsTo(Usuario,{foreignKey: "id_usuario"})


// un portafolio puede tener muchas reseñas, y una reseña pertenece a un portafolio
Portafolios.hasMany(Resenas,{foreignKey: "id_portafolio"})
Resenas.belongsTo(Portafolios,{foreignKey: "id_portafolio"})
// portafolio tiene muchos componentes, y un componente pertenece a un portafolio
Portafolios.hasMany(Componentes,{foreignKey: "id_portafolio"})
Componentes.belongsTo(Portafolios,{foreignKey: "id_portafolio"})
// un componente tiene muchos bloques_componentes, y un bloque_componente pertenece a un componente
Componentes.hasMany(Bloques_Componentes,{foreignKey: "id_componente"})
Bloques_Componentes.belongsTo(Componentes,{foreignKey: "id_componente"})
// componente tiene muchos componentes_estilos, y un componente_estilo pertenece a un componente
Componentes.hasMany(Componentes_estilos,{foreignKey: "id_componente"})
Componentes_estilos.belongsTo(Componentes,{foreignKey: "id_componente"})
// un usuario puede participar en muchas convocatorias, y una convocatoria puede tener muchos participantes
Usuario.hasMany(Participante_convo,{foreignKey: "id_usuario"})
Convocatorias.hasMany(Participante_convo,{foreignKey: "id_convocatoria"})
// un usuario puede hacer un reporte de convocatoria, y un reporte de convocatoria pertenece a un usuario
Usuario.belongsTo(Reporte_convo,{foreignKey: "id_usuario"})
Reporte_convo.belongsTo(Usuario,{foreignKey: "id_usuario"})
// una convocatoria puede tener muchos tipos de convocatoria, y un tipo de convocatoria pertenece a una convocatoria
Convocatorias.hasMany(Tipo_convo,{foreignKey: "id_convocatoria"})
Tipo_convo.belongsTo(Convocatorias,{foreignKey: "id_convocatoria"})



module.exports = {
    Usuario,
    Talentos,
    Tipos_para_convos,
    Roles,
    Portafolios,
    Resenas,
    Componentes,
    Bloques_Componentes,
    Componentes_estilos,
    Participante_convo,
    Convocatorias, 
    Reporte_convo,
    Tipo_convo


}