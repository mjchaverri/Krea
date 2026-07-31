// Dataset inicial del modo demo ("Iniciar sesión de prueba").
// Todo en formato CRUDO (snake_case, igual que el backend real) para que
// los normalizadores de src/utils/normalizers.js y de CompComunidades.jsx
// sigan funcionando exactamente igual que con datos reales.
//
// Este archivo se va llenando por fases (usuarios, portafolios, comunidades...).
// crearSeedInicial() siempre debe devolver una copia nueva (nunca el mismo
// objeto/arrays compartidos) para que cada sesión demo empiece limpia.

// ── Imágenes del portafolio de arquitectura (Estudio Aikon) ──────────────
// Nota: los nombres de archivo NO deben tener espacios/paréntesis/comas —
// Estructura1.jsx arma `url(${imageUrl})` sin comillas, y esos caracteres
// rompen la sintaxis de url() en CSS.
import fotoArqExterior from '../assets/portafolios img/arq-exterior.png'
import fotoArqInterior from '../assets/portafolios img/arq-interior.png'
import fotoArqDetalle from '../assets/portafolios img/arq-detalle-madera.png'
import fotoArqMesa from '../assets/portafolios img/arq-mesa-planos.png'
import fotoArqModelo from '../assets/portafolios img/arq-modelo.png'

// ── Imágenes del portafolio de tatuajes (Hiroshi Nakamura) ───────────────
import fotoTatuHero from '../assets/portafolios img/tatuaje-hero.png'
import fotoTatuDetalle from '../assets/portafolios img/tatuaje-detalle.png'
import fotoTatuMascara from '../assets/portafolios img/tatuaje-mascara.png'
import fotoTatuBrazo from '../assets/portafolios img/tatuaje-brazo.png'
import fotoTatuBoceto from '../assets/portafolios img/tatuaje-boceto.png'

// ── Fotos de banco libre (Unsplash / Pexels) para las cuentas freelancer ──
// Cada portafolio usa fotos DISTINTAS que cuentan un proyecto específico
// (proceso -> resultado), en vez de repetir la misma imagen.
const fotoFotografoHero = 'https://images.unsplash.com/photo-1758525589426-c2b1075164f6?w=1400&q=80&auto=format&fit=crop'
const fotoFotografoProceso = 'https://images.pexels.com/photos/7129669/pexels-photo-7129669.jpeg?w=1400'
const fotoFotografoResultado = 'https://images.pexels.com/photos/20414999/pexels-photo-20414999.jpeg?w=1400'

const fotoCosturaHero = 'https://images.pexels.com/photos/7256922/pexels-photo-7256922.jpeg?w=1400'
const fotoCosturaProceso = 'https://images.pexels.com/photos/6765056/pexels-photo-6765056.jpeg?w=1400'
const fotoCosturaResultado = 'https://images.pexels.com/photos/13530383/pexels-photo-13530383.jpeg?w=1400'

const fotoIlustracionHero = 'https://images.unsplash.com/photo-1736147066581-95fa303553a0?w=1400&q=80&auto=format&fit=crop'
const fotoIlustracionProceso = 'https://images.pexels.com/photos/5428670/pexels-photo-5428670.jpeg?w=1400'

const fotoAgenciaProceso = 'https://images.pexels.com/photos/15543046/pexels-photo-15543046.jpeg?w=1400'
const fotoAgenciaEquipo = 'https://images.pexels.com/photos/4623082/pexels-photo-4623082.jpeg?w=1400'

const fotoPinturaProceso = 'https://images.pexels.com/photos/5033999/pexels-photo-5033999.jpeg?w=1400'
const fotoPinturaResultado = 'https://images.pexels.com/photos/3625632/pexels-photo-3625632.jpeg?w=1400'

export const CATEGORIAS_BASE = [
    'Diseño y creatividad visual',
    'UX/UI',
    'Desarrollo y tecnología creativa',
    'Multimedia y animación',
    'Fotografía y arte visual',
    'Publicidad y marketing',
    'Arquitectura',
    'Diseño de interiores',
    'Diseño industrial',
    'Educación',
    'Escritura y contenido',
    'Manualidades y arte hecho a mano',
    'Moda y costura',
    'Música y producción sonora',
    'Ilustración',
    'Modelado 3D',
]

// id_usuario del usuario con el que arranca la sesión de prueba
export const DEMO_USUARIO_ID = 1

// ─────────────────────────────────────────────────────────────
// Helpers para construir bloques del editor de portafolios con
// el mismo esquema {id, type, data} que usa usePortafolioEditor.js
// ─────────────────────────────────────────────────────────────
const EDITABLE_DEFAULT = {
    texto: '', colorTexto: '#1a202c', colorFondo: '', imageUrl: '', fontSize: '16px',
    bold: false, italic: false, align: 'left', textPosition: 'center',
    childColorFondo: '', childImageUrl: '', fontFamily: 'sans-serif',
    imagePosition: '50% 50%', childImagePosition: '50% 50%',
}

function editable(overrides = {}) {
    return { ...EDITABLE_DEFAULT, ...overrides }
}

function bloqueImagen(imageUrl, overrides = {}) {
    return { id: crypto.randomUUID(), type: 'Estructura1', data: editable({ imageUrl, ...overrides }) }
}

function bloqueTexto(texto, overrides = {}) {
    return { id: crypto.randomUUID(), type: 'Estructura1', data: editable({ texto, ...overrides }) }
}

function bloqueImagenConTexto(imageUrl, texto, overrides = {}) {
    return {
        id: crypto.randomUUID(),
        type: 'Estructura1',
        data: editable({ imageUrl, texto, childColorFondo: 'rgba(0,0,0,0.15)', ...overrides }),
    }
}

// Imagen a la izquierda, texto a la derecha. Usa 'GrillaDoble' — es de las
// 7 plantillas reales que ofrece SidebarTalentos.jsx (el panel "Plantillas"
// del editor). 'Grilla1_2_Izda'/'Grilla1_2_Derecha' existen como componentes
// en el código pero NO están conectadas a ese panel, así que un usuario real
// nunca puede elegirlas — no correspondía usarlas acá tampoco.
function bloqueGrillaLateral(imageUrl, texto, overrides = {}) {
    return {
        id: crypto.randomUUID(),
        type: 'GrillaDoble',
        data: {
            fondo: editable(),
            bloque1: editable({ imageUrl }),
            bloque2: editable({ texto, align: 'left', textPosition: 'center', ...overrides }),
        },
    }
}

// Texto a la izquierda, imagen a la derecha — GrillaDoble (plantilla real).
function bloqueTextoImagen(texto, imageUrl, overrides = {}) {
    return {
        id: crypto.randomUUID(),
        type: 'GrillaDoble',
        data: {
            fondo: editable(),
            bloque1: editable({ texto, align: 'left', textPosition: 'center', ...overrides }),
            bloque2: editable({ imageUrl }),
        },
    }
}

function bloqueGrillaDoble(imageUrl1, imageUrl2) {
    return {
        id: crypto.randomUUID(),
        type: 'GrillaDoble',
        data: {
            fondo: editable(),
            bloque1: editable({ imageUrl: imageUrl1 }),
            bloque2: editable({ imageUrl: imageUrl2 }),
        },
    }
}

function bloqueGrillaTriple(imageUrl1, imageUrl2, textoBloque3, overrides = {}) {
    return {
        id: crypto.randomUUID(),
        type: 'GrillaTriple',
        data: {
            fondo: editable(),
            bloque1: editable({ imageUrl: imageUrl1 }),
            bloque2: editable({ imageUrl: imageUrl2 }),
            bloque3: editable({ texto: textoBloque3, align: 'left', textPosition: 'center', ...overrides }),
        },
    }
}

// ─────────────────────────────────────────────────────────────
// Portafolio: Estudio Aikon Arquitectura
// ─────────────────────────────────────────────────────────────
const COMPONENTES_ARQUITECTURA = [
    bloqueImagen(fotoArqExterior),
    bloqueTexto(
        'Arquitectura honesta basada en la luz y los volúmenes esenciales. Eliminamos el exceso usando tonos tierra, beige y blanco para crear una transición fluida con el paisaje que invita a la calma.',
        { italic: true, colorTexto: '#334155', fontSize: '18px' }
    ),
    bloqueGrillaDoble(fotoArqModelo, fotoArqMesa),
    bloqueTexto(
        'La materialización de estas atmósferas requiere un equilibrio riguroso entre precisión técnica y sensibilidad artística. El proceso comienza en el taller, analizando la textura de los materiales reales y probando su volumetría a través de maquetas físicas a escala y planos técnicos detallados.',
        { colorTexto: '#334155', fontSize: '17px' }
    ),
    bloqueGrillaLateral(fotoArqDetalle,
        'Diseño consciente y ejecución rigurosa. Cada proyecto es la oportunidad de materializar la calma a través de la arquitectura y la luz.',
        { colorTexto: '#334155', fontSize: '17px' }
    ),
    bloqueImagen(fotoArqInterior),
]

// ─────────────────────────────────────────────────────────────
// Portafolio: Hiroshi Nakamura — Tatuaje Japonés
// ─────────────────────────────────────────────────────────────
const COMPONENTES_TATUAJE = [
    bloqueImagenConTexto(fotoTatuHero, 'Hiroshi Nakamura\nArtista del tatuaje', {
        colorTexto: '#ffffff', bold: true, fontSize: '15px', textPosition: 'bottom', align: 'left', fontFamily: 'serif',
    }),
    bloqueTexto('El arte japonés llevado a la piel con precisión y significado.', {
        italic: true, colorTexto: '#334155', fontSize: '16px', fontFamily: 'serif',
    }),
    bloqueTextoImagen(
        'Detalle minucioso donde cada trazo construye profundidad, textura y movimiento en la composición.',
        fotoTatuDetalle,
        { colorTexto: '#334155', fontSize: '15px', fontFamily: 'serif' }
    ),
    bloqueGrillaTriple(fotoTatuBrazo, fotoTatuMascara,
        'La armonía entre sombras y líneas define la esencia del tatuaje tradicional japonés.\n\nCada pieza se adapta al cuerpo y al entorno, creando una obra viva dentro de un espacio auténtico.',
        { colorTexto: '#334155', fontSize: '14px', fontFamily: 'serif' }
    ),
    bloqueGrillaLateral(fotoTatuBoceto,
        'Del boceto al tatuaje final, el proceso combina técnica, planificación y visión artística.',
        { colorTexto: '#334155', fontSize: '15px', fontFamily: 'serif' }
    ),
]

// ─────────────────────────────────────────────────────────────
// Portafolio: Mauricio Vindas — Fotografía (sesión de retrato)
// ─────────────────────────────────────────────────────────────
const COMPONENTES_FOTOGRAFIA = [
    bloqueImagen(fotoFotografoHero),
    bloqueTexto(
        'Sesión de retrato al aire libre. Capturo momentos auténticos trabajando siempre con luz natural.',
        { colorTexto: '#334155', fontSize: '18px' }
    ),
    bloqueGrillaLateral(fotoFotografoProceso,
        'Después de cada sesión viene la selección y edición: ajustar color, contraste y encuadre hasta encontrar la toma correcta.',
        { colorTexto: '#334155', fontSize: '17px' }
    ),
    bloqueGrillaLateral(fotoFotografoResultado,
        'El resultado final: un retrato en blanco y negro que prioriza la expresión por encima de todo lo demás.',
        { colorTexto: '#334155', fontSize: '17px' }
    ),
]

// ─────────────────────────────────────────────────────────────
// Portafolio: Ana Rojas — Costura y confección (vestido a la medida)
// ─────────────────────────────────────────────────────────────
const COMPONENTES_COSTURA = [
    bloqueImagen(fotoCosturaHero),
    bloqueTexto(
        'Vestido a la medida, hecho por encargo. Costura y arreglos cuidando cada detalle, de principio a fin.',
        { colorTexto: '#334155', fontSize: '18px' }
    ),
    bloqueGrillaLateral(fotoCosturaProceso,
        'Todo empieza con el patrón y el corte de la tela: la base de que la prenda quede exacta.',
        { colorTexto: '#334155', fontSize: '17px' },
    ),
    bloqueGrillaLateral(fotoCosturaResultado,
        'La prenda terminada, lista para su dueña, después de varias pruebas de ajuste.',
        { colorTexto: '#334155', fontSize: '17px' },
    ),
]

// ─────────────────────────────────────────────────────────────
// Portafolio: Diego Fallas — Ilustración digital (diseño de personaje)
// ─────────────────────────────────────────────────────────────
const COMPONENTES_ILUSTRACION = [
    bloqueImagen(fotoIlustracionHero),
    bloqueTexto(
        'Diseño de personaje para un proyecto editorial, cien por ciento en tableta gráfica.',
        { colorTexto: '#334155', fontSize: '18px' }
    ),
    bloqueGrillaLateral(fotoIlustracionProceso,
        'El boceto inicial se refina en varias pasadas antes de entrar a color: proporciones, gesto y expresión primero.',
        { colorTexto: '#334155', fontSize: '17px' },
    ),
]

// ─────────────────────────────────────────────────────────────
// Portafolio: Nimbus Studio — Branding y diseño digital (rediseño de marca)
// ─────────────────────────────────────────────────────────────
const COMPONENTES_AGENCIA = [
    bloqueImagen(fotoAgenciaProceso),
    bloqueTexto(
        'Proyecto de rediseño de marca para un cliente del sector retail. Estrategia antes que estética.',
        { colorTexto: '#334155', fontSize: '18px' }
    ),
    bloqueGrillaLateral(fotoAgenciaEquipo,
        'Investigación y estrategia de marca trabajadas en equipo, antes de tocar cualquier herramienta de diseño.',
        { colorTexto: '#334155', fontSize: '17px' },
    ),
]

// ─────────────────────────────────────────────────────────────
// Portafolio: Valeria Solís — Pintura (cuenta de la sesión de prueba)
// ─────────────────────────────────────────────────────────────
const COMPONENTES_PINTURA = [
    bloqueImagen(fotoPinturaProceso),
    bloqueTexto(
        'Encargo de una pieza abstracta para un cliente particular. Trabajo con acrílico, mezclando color directo sobre el lienzo.',
        { colorTexto: '#334155', fontSize: '18px' }
    ),
    bloqueGrillaLateral(fotoPinturaResultado,
        'La obra terminada: color, textura y composición trabajando juntos hasta encontrar el balance final.',
        { colorTexto: '#334155', fontSize: '17px' },
    ),
]

// Timestamp relativo (n horas atrás) para que el chat se vea con una
// conversación real en el tiempo, no todo con la misma fecha exacta.
function horasAtras(n) {
    return new Date(Date.now() - n * 60 * 60 * 1000).toISOString()
}

// Codifica una convocatoria dentro de un mensaje de chat, con el mismo
// prefijo "📢{...}" que usa CompComunidades.jsx para detectarla.
function textoConvocatoria(id, titulo, descripcion, fechaCierre) {
    return `📢${JSON.stringify({ id, t: titulo, d: descripcion, c: fechaCierre })}`
}

// ─────────────────────────────────────────────────────────────
// Comunidades
// ─────────────────────────────────────────────────────────────
const COMUNIDADES_SEED = [
    {
        id_comunidad: 1,
        nombre: 'Arquitectura y Diseño CR',
        descripcion: 'Espacio para compartir proyectos, referencias y buenas prácticas de arquitectura y diseño de interiores en Costa Rica.',
        icono: '📐',
        Color: '#0ea5e9',
        ColorClaro: '#e0f2fe',
        banner: '',
        Categoria: { nombre: 'Arquitectura' },
        id_usuario: 2, // Estudio Aikon
        total_miembros: 4,
    },
    {
        id_comunidad: 2,
        nombre: 'Tatuaje e Ilustración',
        descripcion: 'Comunidad para tatuadores e ilustradores: técnica, referencias y crítica constructiva.',
        icono: '🎨',
        Color: '#ec4899',
        ColorClaro: '#fce7f3',
        banner: '',
        Categoria: { nombre: 'Ilustración' },
        id_usuario: 3, // Hiroshi Nakamura
        total_miembros: 3,
    },
    {
        id_comunidad: 3,
        nombre: 'Fotografía Costa Rica',
        descripcion: 'Fotógrafos compartiendo trabajo, tips de edición y organizando salidas grupales.',
        icono: '📸',
        Color: '#f59e0b',
        ColorClaro: '#fef3c7',
        banner: '',
        Categoria: { nombre: 'Fotografía y arte visual' },
        id_usuario: 4, // Mauricio Vindas
        total_miembros: 3,
    },
]

// ─────────────────────────────────────────────────────────────
// Miembros
// ─────────────────────────────────────────────────────────────
const MIEMBROS_SEED = [
    { id_miembro: 1, id_comunidad: 1, id_usuario: 2 },
    { id_miembro: 2, id_comunidad: 1, id_usuario: DEMO_USUARIO_ID },
    { id_miembro: 3, id_comunidad: 1, id_usuario: 7 },
    { id_miembro: 4, id_comunidad: 1, id_usuario: 6 },
    { id_miembro: 5, id_comunidad: 2, id_usuario: 3 },
    { id_miembro: 6, id_comunidad: 2, id_usuario: 6 },
    { id_miembro: 7, id_comunidad: 2, id_usuario: DEMO_USUARIO_ID },
    { id_miembro: 8, id_comunidad: 3, id_usuario: 4 },
    { id_miembro: 9, id_comunidad: 3, id_usuario: 5 },
    { id_miembro: 10, id_comunidad: 3, id_usuario: DEMO_USUARIO_ID },
]

// ─────────────────────────────────────────────────────────────
// Convocatoria (comunidad de Arquitectura) + su mensaje en el chat
// ─────────────────────────────────────────────────────────────
const CONVOCATORIAS_SEED = [
    {
        id_convocatoria: 1,
        nombre: 'Concurso de Portafolios de Arquitectura Q3',
        descripcion: 'Buscamos los mejores proyectos residenciales del trimestre. El ganador se destaca en la portada de la comunidad.',
        fecha_cierre: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
        id_usuario: 2,
        id_comunidad: 1,
    },
]

const PARTICIPANTES_CONVO_SEED = [
    { id_participante_convo: 1, id_convocatoria: 1, id_usuario: DEMO_USUARIO_ID },
]

// ─────────────────────────────────────────────────────────────
// Mensajes de chat por comunidad
// ─────────────────────────────────────────────────────────────
const CHAT_COMUNIDAD_SEED = [
    // ── Arquitectura y Diseño CR ──
    { id_chat_comu: 1, id_comunidad: 1, usuario_nombre: 'Estudio Aikon Arquitectura', texto: '¡Bienvenidos a la comunidad! Compartan sus proyectos y dudas por acá.', Fecha: horasAtras(72) },
    { id_chat_comu: 2, id_comunidad: 1, usuario_nombre: 'Diego Fallas', texto: 'Me encanta el enfoque minimalista de sus últimos proyectos, ¿qué usan para las maquetas 3D?', Fecha: horasAtras(50) },
    { id_chat_comu: 3, id_comunidad: 1, usuario_nombre: 'Estudio Aikon Arquitectura', texto: '¡Gracias Diego! Combinamos modelado digital para volumetría y maquetas físicas de madera para presentarle al cliente.', Fecha: horasAtras(49) },
    { id_chat_comu: 4, id_comunidad: 1, usuario_nombre: 'Estudio Aikon Arquitectura', texto: textoConvocatoria(1, 'Concurso de Portafolios de Arquitectura Q3', 'Buscamos los mejores proyectos residenciales del trimestre. El ganador se destaca en la portada de la comunidad.', CONVOCATORIAS_SEED[0].fecha_cierre), Fecha: horasAtras(24) },
    { id_chat_comu: 5, id_comunidad: 1, usuario_nombre: 'Valeria Solís', texto: 'Qué interesante la convocatoria, ¿aplica también para diseño de interiores?', Fecha: horasAtras(20) },

    // ── Tatuaje e Ilustración ──
    { id_chat_comu: 6, id_comunidad: 2, usuario_nombre: 'Hiroshi Nakamura', texto: 'Bienvenidos, este espacio es para compartir referencias de tatuaje japonés e ilustración en general.', Fecha: horasAtras(60) },
    { id_chat_comu: 7, id_comunidad: 2, usuario_nombre: 'Diego Fallas', texto: '¿Alguna recomendación de referencias para empezar a estudiar motivos japoneses?', Fecha: horasAtras(40) },
    { id_chat_comu: 8, id_comunidad: 2, usuario_nombre: 'Hiroshi Nakamura', texto: 'Te recomiendo empezar por los grabados ukiyo-e clásicos, ahí está el origen de casi todo el imaginario que usamos hoy.', Fecha: horasAtras(39) },

    // ── Fotografía Costa Rica ──
    { id_chat_comu: 9, id_comunidad: 3, usuario_nombre: 'Mauricio Vindas', texto: '¡Bienvenidos! Comenten qué tipo de fotografía hacen para ir armando salidas grupales.', Fecha: horasAtras(30) },
    { id_chat_comu: 10, id_comunidad: 3, usuario_nombre: 'Ana Rojas', texto: 'Yo hago más que todo fotografía de producto para mis piezas de costura, pero me encantaría aprender retrato.', Fecha: horasAtras(28) },
    { id_chat_comu: 11, id_comunidad: 3, usuario_nombre: 'Mauricio Vindas', texto: '¡Perfecto! Podemos armar una salida de retrato el próximo mes.', Fecha: horasAtras(27) },
]

// ─────────────────────────────────────────────────────────────
// Reseñas de portafolio
// ─────────────────────────────────────────────────────────────
const RESENAS_SEED = [
    { id_resena: 1, id_portafolio: 1, id_usuario: DEMO_USUARIO_ID, calificacion: 5, comentarios: 'Un proyecto impresionante, se nota el cuidado en cada detalle.', createdAt: horasAtras(65) },
    { id_resena: 2, id_portafolio: 1, id_usuario: 6, calificacion: 5, comentarios: 'La paleta de materiales es un gusto, muy inspirador.', createdAt: horasAtras(44) },
    { id_resena: 3, id_portafolio: 1, id_usuario: 7, calificacion: 4, comentarios: 'Excelente ejecución, me encantaría ver más del proceso de diseño.', createdAt: horasAtras(30) },

    { id_resena: 4, id_portafolio: 2, id_usuario: 6, calificacion: 5, comentarios: 'El nivel de detalle en el pez koi es una locura, gran trabajo.', createdAt: horasAtras(55) },
    { id_resena: 5, id_portafolio: 2, id_usuario: DEMO_USUARIO_ID, calificacion: 5, comentarios: 'Composición impecable, se nota la técnica tradicional japonesa.', createdAt: horasAtras(33) },

    { id_resena: 6, id_portafolio: 3, id_usuario: 5, calificacion: 5, comentarios: 'El retrato en blanco y negro quedó espectacular.', createdAt: horasAtras(20) },

    { id_resena: 7, id_portafolio: 4, id_usuario: DEMO_USUARIO_ID, calificacion: 4, comentarios: 'Muy buen acabado, se nota el cuidado en la costura.', createdAt: horasAtras(18) },

    { id_resena: 8, id_portafolio: 5, id_usuario: 2, calificacion: 4, comentarios: 'Buen manejo de proporciones, con potencial para crecer más.', createdAt: horasAtras(15) },

    { id_resena: 9, id_portafolio: 6, id_usuario: 4, calificacion: 5, comentarios: 'Excelente estrategia de marca, muy profesional.', createdAt: horasAtras(10) },

    { id_resena: 10, id_portafolio: 7, id_usuario: 3, calificacion: 5, comentarios: 'El manejo del color es excelente, se ve una obra muy trabajada.', createdAt: horasAtras(8) },
    { id_resena: 11, id_portafolio: 7, id_usuario: 5, calificacion: 4, comentarios: 'Me encanta la textura que logra, muy expresivo.', createdAt: horasAtras(6) },
]

// ─────────────────────────────────────────────────────────────
// Reseñas de perfil (entre usuarios, no ligadas a un portafolio)
// ─────────────────────────────────────────────────────────────
const RESENAS_PERFIL_SEED = [
    { id_resena_perfil: 1, id_usuario_receptor: 2, id_usuario_autor: 7, calificacion: 5, comentarios: 'Excelente para trabajar, muy profesionales y puntuales.', createdAt: horasAtras(48) },
    { id_resena_perfil: 2, id_usuario_receptor: 3, id_usuario_autor: 6, calificacion: 5, comentarios: 'Gran artista, muy atento a los detalles del cliente.', createdAt: horasAtras(36) },
    { id_resena_perfil: 3, id_usuario_receptor: DEMO_USUARIO_ID, id_usuario_autor: 3, calificacion: 5, comentarios: 'Excelente comunicación y calidad en el trabajo entregado.', createdAt: horasAtras(24) },
    { id_resena_perfil: 4, id_usuario_receptor: 4, id_usuario_autor: 5, calificacion: 5, comentarios: 'Muy buena onda y profesional en la sesión.', createdAt: horasAtras(14) },
    { id_resena_perfil: 5, id_usuario_receptor: DEMO_USUARIO_ID, id_usuario_autor: 5, calificacion: 4, comentarios: 'Buen trabajo, cumplió con los tiempos acordados.', createdAt: horasAtras(5) },
]

// ─────────────────────────────────────────────────────────────
// Seguidos (relaciones de "seguir" entre cuentas)
// ─────────────────────────────────────────────────────────────
const SEGUIDOS_SEED = [
    { id_seguido_registro: 1, id_seguidor: DEMO_USUARIO_ID, id_seguido: 2, createdAt: horasAtras(60) },
    { id_seguido_registro: 2, id_seguidor: DEMO_USUARIO_ID, id_seguido: 3, createdAt: horasAtras(58) },
    { id_seguido_registro: 3, id_seguidor: DEMO_USUARIO_ID, id_seguido: 4, createdAt: horasAtras(40) },
    { id_seguido_registro: 4, id_seguidor: 6, id_seguido: 3, createdAt: horasAtras(50) },
    { id_seguido_registro: 5, id_seguidor: 6, id_seguido: 2, createdAt: horasAtras(45) },
    { id_seguido_registro: 6, id_seguidor: 5, id_seguido: DEMO_USUARIO_ID, createdAt: horasAtras(20) },
    { id_seguido_registro: 7, id_seguidor: 5, id_seguido: 4, createdAt: horasAtras(19) },
    { id_seguido_registro: 8, id_seguidor: 7, id_seguido: 2, createdAt: horasAtras(35) },
    { id_seguido_registro: 9, id_seguidor: 4, id_seguido: DEMO_USUARIO_ID, createdAt: horasAtras(9) },
]

export function crearSeedInicial() {
    return {
        usuarios: [
            {
                id_usuario: DEMO_USUARIO_ID,
                nombre_usuario: 'valeria_pintura',
                nombre_completo: 'Valeria Solís',
                correo: 'valeria.solis@gmail.com',
                telefono: '87654321',
                provincia: 'Heredia',
                canton: 'Heredia',
                distrito: 'Mercedes',
                img_perfil: 'https://i.pravatar.cc/300?img=47',
                descripcion: 'Pintora freelance. Trabajo principalmente con acrílico y óleo, retratos y paisajes por encargo.',
                id_rol: 2,
                createdAt: new Date().toISOString(),
                bloqueado: false,
                fecha_ban_expira: null,
                razon_ban: null,
            },
            {
                id_usuario: 2,
                nombre_usuario: 'estudio_aikon',
                nombre_completo: 'Estudio Aikon Arquitectura',
                correo: 'contacto@aikon-arquitectura.com',
                telefono: '22334455',
                provincia: 'San José',
                canton: 'Escazú',
                distrito: 'San Rafael',
                img_perfil: 'https://images.unsplash.com/photo-1481253127861-534498168948?w=300&h=300&fit=crop',
                descripcion: 'Estudio de arquitectura enfocado en diseño residencial contemporáneo: espacios honestos, luz natural y materiales nobles. Más de 8 años creando proyectos a medida en Costa Rica.',
                id_rol: 3,
                createdAt: new Date().toISOString(),
                bloqueado: false,
                fecha_ban_expira: null,
                razon_ban: null,
            },
            {
                id_usuario: 3,
                nombre_usuario: 'hiroshi_nakamura',
                nombre_completo: 'Hiroshi Nakamura',
                correo: 'hiroshi.tattoo@gmail.com',
                telefono: '61237890',
                provincia: 'San José',
                canton: 'San José',
                distrito: 'Catedral',
                img_perfil: 'https://i.pravatar.cc/300?img=13',
                descripcion: 'Especialista en tatuaje japonés (irezumi) con enfoque en piezas a gran escala que fluyen con la anatomía del cuerpo.',
                id_rol: 2,
                createdAt: new Date().toISOString(),
                bloqueado: false,
                fecha_ban_expira: null,
                razon_ban: null,
            },
            {
                id_usuario: 4,
                nombre_usuario: 'mauricio_fotografia',
                nombre_completo: 'Mauricio Vindas',
                correo: 'mauricio.vindas@gmail.com',
                telefono: '83456712',
                provincia: 'Alajuela',
                canton: 'Alajuela',
                distrito: 'San José',
                img_perfil: 'https://i.pravatar.cc/300?img=52',
                descripcion: 'Fotógrafo freelance. Retratos, paisajes y sesiones al aire libre con luz natural.',
                id_rol: 2,
                createdAt: new Date().toISOString(),
                bloqueado: false,
                fecha_ban_expira: null,
                razon_ban: null,
            },
            {
                id_usuario: 5,
                nombre_usuario: 'ana_costura',
                nombre_completo: 'Ana Rojas',
                correo: 'ana.rojas.costura@gmail.com',
                telefono: '89127634',
                provincia: 'Cartago',
                canton: 'Cartago',
                distrito: 'Oriental',
                img_perfil: 'https://i.pravatar.cc/300?img=32',
                descripcion: 'Costurera y modista freelance. Confección y arreglos a la medida, vestidos y piezas únicas hechas a mano.',
                id_rol: 2,
                createdAt: new Date().toISOString(),
                bloqueado: false,
                fecha_ban_expira: null,
                razon_ban: null,
            },
            {
                id_usuario: 6,
                nombre_usuario: 'diego_ilustra',
                nombre_completo: 'Diego Fallas',
                correo: 'diego.fallas.art@gmail.com',
                telefono: '84561239',
                provincia: 'San José',
                canton: 'Curridabat',
                distrito: 'Curridabat',
                img_perfil: 'https://i.pravatar.cc/300?img=68',
                descripcion: 'Ilustrador digital freelance. Diseño de personajes e ilustración editorial, cien por ciento en tableta gráfica.',
                id_rol: 2,
                createdAt: new Date().toISOString(),
                bloqueado: false,
                fecha_ban_expira: null,
                razon_ban: null,
            },
            {
                id_usuario: 7,
                nombre_usuario: 'nimbus_studio',
                nombre_completo: 'Nimbus Studio',
                correo: 'hola@nimbusstudio.com',
                telefono: '22981122',
                provincia: 'San José',
                canton: 'Santa Ana',
                distrito: 'Santa Ana',
                img_perfil: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=300&fit=crop',
                descripcion: 'Estudio de branding y diseño digital. Construimos identidades de marca coherentes: estrategia, diseño y ejecución en un mismo equipo.',
                id_rol: 3,
                createdAt: new Date().toISOString(),
                bloqueado: false,
                fecha_ban_expira: null,
                razon_ban: null,
            },
        ],
        portafolios: [
            {
                id_portafolio: 7,
                id_usuario: DEMO_USUARIO_ID,
                titulo: 'Pieza Abstracta por Encargo',
                descripcion: 'Proceso completo de una obra abstracta en acrílico, de la mezcla de color al lienzo terminado.',
                pdf: '',
                img_portada: fotoPinturaProceso,
                componentes_json: JSON.stringify(COMPONENTES_PINTURA),
                categorias: ['Diseño y creatividad visual'],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
            {
                id_portafolio: 1,
                id_usuario: 2,
                titulo: 'Arquitectura Residencial Contemporánea',
                descripcion: 'Proyectos residenciales que combinan luz natural, materiales nobles y volúmenes esenciales.',
                pdf: '',
                img_portada: fotoArqExterior,
                componentes_json: JSON.stringify(COMPONENTES_ARQUITECTURA),
                categorias: ['Arquitectura', 'Diseño de interiores'],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
            {
                id_portafolio: 2,
                id_usuario: 3,
                titulo: 'Tatuaje Japonés Contemporáneo',
                descripcion: 'Especialista en tatuaje japonés con enfoque en piezas personalizadas que fluyen con la anatomía del cuerpo. Combina tradición, técnica moderna y atención al detalle para crear obras duraderas y significativas.',
                pdf: '',
                img_portada: fotoTatuHero,
                componentes_json: JSON.stringify(COMPONENTES_TATUAJE),
                categorias: ['Ilustración', 'Diseño y creatividad visual'],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
            {
                id_portafolio: 3,
                id_usuario: 4,
                titulo: 'Sesión de Retrato al Aire Libre',
                descripcion: 'De la toma en locación a la edición final: un retrato en blanco y negro con luz natural.',
                pdf: '',
                img_portada: fotoFotografoHero,
                componentes_json: JSON.stringify(COMPONENTES_FOTOGRAFIA),
                categorias: ['Fotografía y arte visual'],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
            {
                id_portafolio: 4,
                id_usuario: 5,
                titulo: 'Vestido a la Medida por Encargo',
                descripcion: 'Del patrón y corte de tela a la prenda terminada, con varias pruebas de ajuste.',
                pdf: '',
                img_portada: fotoCosturaHero,
                componentes_json: JSON.stringify(COMPONENTES_COSTURA),
                categorias: ['Moda y costura'],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
            {
                id_portafolio: 5,
                id_usuario: 6,
                titulo: 'Diseño de Personaje Editorial',
                descripcion: 'Del boceto inicial en tableta gráfica al refinamiento de proporciones y expresión.',
                pdf: '',
                img_portada: fotoIlustracionHero,
                componentes_json: JSON.stringify(COMPONENTES_ILUSTRACION),
                categorias: ['Ilustración'],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
            {
                id_portafolio: 6,
                id_usuario: 7,
                titulo: 'Rediseño de Marca — Cliente Retail',
                descripcion: 'Proyecto de rediseño de marca: investigación y estrategia trabajadas en equipo antes del diseño final.',
                pdf: '',
                img_portada: fotoAgenciaProceso,
                componentes_json: JSON.stringify(COMPONENTES_AGENCIA),
                categorias: ['UX/UI', 'Publicidad y marketing'],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
        ],
        resenas: RESENAS_SEED.map(r => ({ ...r })),
        resenas_perfil: RESENAS_PERFIL_SEED.map(r => ({ ...r })),
        comunidades: COMUNIDADES_SEED.map(c => ({ ...c })),
        miembros: MIEMBROS_SEED.map(m => ({ ...m })),
        chat_comunidad: CHAT_COMUNIDAD_SEED.map(m => ({ ...m })),
        convocatorias: CONVOCATORIAS_SEED.map(c => ({ ...c })),
        participantes_convo: PARTICIPANTES_CONVO_SEED.map(p => ({ ...p })),
        reportes_chat: [],
        baneados_comunidad: [],
        seguidos: SEGUIDOS_SEED.map(s => ({ ...s })),
        categorias: CATEGORIAS_BASE.map((nombre, i) => ({ id_categoria: i + 1, nombre })),
        configuracion: { talento_destacado: null },
    }
}
