import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar/Navbar';
import Footer from '../components/ApartadoPaginaPrincipal/Footer';
import Fetch from '../services/Fetch';
import { normalizarPortafolio, normalizarResena } from '../utils/normalizers';
import CardProyecto from '../components/PerfilUsuario/CardProyecto';
import ModalProyecto from '../components/PerfilUsuario/ModalProyecto';
import { calcularPromedio } from '../utils/calcularPromedio';
import "../styles/EstilosPerfilUsuario/ProyectosRecientes.css";
import "../styles/PlantillaTalentos/TodosProyectos.css";
import ChatBotBubble from '../components/PlantillaTalentos/ChatBotBubble';

const ITEMS_POR_PAGINA = 12;

function TodosProyectos() {
    const navigate = useNavigate();
    const [portafolios, setPortafolios] = useState([]);
    const [todasResenas, setTodasResenas] = useState([]);
    const [proyectoSeleccionado, setProyectoSeleccionado] = useState(null);
    const [busqueda, setBusqueda] = useState("");
    const [cargando, setCargando] = useState(true);
    const [tabActiva, setTabActiva] = useState("todos");
    const [paginaActual, setPaginaActual] = useState(1);

    const [filtroProvincia, setFiltroProvincia] = useState("");
    const [filtroCanton, setFiltroCanton] = useState("");
    const [filtroDistrito, setFiltroDistrito] = useState("");
    const [filtroRating, setFiltroRating] = useState(0);
    const [ordenarPor, setOrdenarPor] = useState("recientes");
    const [filtroCategoria, setFiltroCategoria] = useState("");
    const [dropdownAbierto, setDropdownAbierto] = useState(null);
    const dropdownsRef = useRef(null);

    useEffect(() => {
        const handler = (e) => {
            if (dropdownsRef.current && !dropdownsRef.current.contains(e.target))
                setDropdownAbierto(null);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const toggleDropdown = (key) => setDropdownAbierto(prev => prev === key ? null : key);

    const ORDENAR_LABELS = { recientes: 'Más recientes', valorados: 'Mejor valorados', populares: 'Más reseñas' };
    const RATING_LABELS  = { 0: 'Todas', 3: '3★+', 4: '4★+', 5: '5★' };

    const CATEGORIAS = [
        "Diseño y creatividad visual", "UX/UI", "Desarrollo y tecnología creativa",
        "Multimedia y animación", "Fotografía y arte visual", "Publicidad y marketing",
        "Arquitectura", "Diseño de interiores", "Diseño industrial", "Educación",
        "Escritura y contenido", "Manualidades y arte hecho a mano", "Moda y costura",
        "Música y producción sonora", "Ilustración", "Modelado 3D",
    ];

    const usuarioActivo = useMemo(() => {
        try { return JSON.parse(localStorage.getItem("UsuarioActivo")) || null } catch { return null }
    }, []);

    const [portafoliosSiguiendo, setPortafoliosSiguiendo] = useState([]);
    const [cargandoSiguiendo, setCargandoSiguiendo] = useState(false);
    const [paginaSiguiendo, setPaginaSiguiendo] = useState(1);

    const cargarDatos = async () => {
        setCargando(true);
        try {
            const [resP, resR] = await Promise.all([
                Fetch.getData("portafolios?limit=500").catch(() => []),
                Fetch.getData("resenas?limit=500").catch(() => []),
            ]);
            setPortafolios((resP || []).map(normalizarPortafolio));
            setTodasResenas((resR || []).map(normalizarResena));
        } catch (error) {
            console.error(error);
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => { cargarDatos(); }, []);

    // Cargar portafolios de seguidos cuando se activa esa pestaña
    useEffect(() => {
        if (tabActiva !== 'siguiendo' || !usuarioActivo) return;
        setCargandoSiguiendo(true);
        Fetch.getData("seguidos/portafolios")
            .then(data => setPortafoliosSiguiendo((data || []).map(normalizarPortafolio)))
            .catch(console.error)
            .finally(() => setCargandoSiguiendo(false));
    }, [tabActiva]);

    // Reset página cuando cambian filtros
    useEffect(() => { setPaginaActual(1); }, [
        filtroProvincia, filtroCanton, filtroDistrito, filtroRating, ordenarPor, busqueda, filtroCategoria
    ]);

    const provinciasUnicas = useMemo(() =>
        [...new Set(portafolios.map(p => p.usuario?.Provincias).filter(Boolean))],
        [portafolios]);

    const cantonesUnicos = useMemo(() =>
        [...new Set(portafolios
            .filter(p => !filtroProvincia || p.usuario?.Provincias === filtroProvincia)
            .map(p => p.usuario?.Canton).filter(Boolean))],
        [portafolios, filtroProvincia]);

    const distritosUnicos = useMemo(() =>
        [...new Set(portafolios
            .filter(p => !filtroCanton || p.usuario?.Canton === filtroCanton)
            .map(p => p.usuario?.Distrito).filter(Boolean))],
        [portafolios, filtroCanton]);

    const proyectosFiltrados = useMemo(() => {
        let resultado = portafolios.reduce((acc, proyecto) => {
            const u = proyecto.usuario || {};

            if (filtroProvincia && u.Provincias !== filtroProvincia) return acc;
            if (filtroCanton && u.Canton !== filtroCanton) return acc;
            if (filtroDistrito && u.Distrito !== filtroDistrito) return acc;
            if (filtroCategoria && !(proyecto.categorias || []).includes(filtroCategoria)) return acc;

            if (busqueda) {
                const q = busqueda.toLowerCase();
                if (!proyecto.titulo?.toLowerCase().includes(q) && !u.Nombre?.toLowerCase().includes(q)) return acc;
            }

            const resenasP = todasResenas.filter(r => r.portafolioId === proyecto.id);
            const promedio = parseFloat(calcularPromedio(resenasP));
            if (filtroRating > 0 && promedio < filtroRating) return acc;

            acc.push({ ...proyecto, promedio, cantidadResenas: resenasP.length });
            return acc;
        }, []);

        if (ordenarPor === "recientes") resultado.sort((a, b) => b.id - a.id);
        if (ordenarPor === "valorados") resultado.sort((a, b) => b.promedio - a.promedio);
        if (ordenarPor === "populares") resultado.sort((a, b) => b.cantidadResenas - a.cantidadResenas);

        return resultado;
    }, [portafolios, todasResenas, filtroProvincia, filtroCanton, filtroDistrito, filtroRating, ordenarPor, busqueda, filtroCategoria]);

    const totalPaginas = Math.max(1, Math.ceil(proyectosFiltrados.length / ITEMS_POR_PAGINA));
    const proyectosPagina = proyectosFiltrados.slice(
        (paginaActual - 1) * ITEMS_POR_PAGINA,
        paginaActual * ITEMS_POR_PAGINA
    );

    const limpiarFiltros = () => {
        setFiltroProvincia(""); setFiltroCanton(""); setFiltroDistrito("");
        setFiltroRating(0); setOrdenarPor("recientes"); setBusqueda(""); setFiltroCategoria("");
    };

    const hayFiltros = filtroProvincia || filtroCanton || filtroDistrito || filtroRating > 0 || busqueda || ordenarPor !== "recientes" || filtroCategoria;

    // Genera los botones de paginación con ellipsis
    const generarPaginas = () => {
        if (totalPaginas <= 7) return Array.from({ length: totalPaginas }, (_, i) => i + 1);
        const paginas = new Set([1, totalPaginas, paginaActual]);
        if (paginaActual > 1) paginas.add(paginaActual - 1);
        if (paginaActual < totalPaginas) paginas.add(paginaActual + 1);
        return [...paginas].sort((a, b) => a - b);
    };

    const paginasVisibles = generarPaginas();

    return (
        <div className="tp-page">
            <Navbar />

            {/* ── Hero con búsqueda ── */}
            <section className="tp-hero">
                <div className="tp-hero__content">
                    <span className="tp-hero__eyebrow">✦ Explorar talentos</span>
                    <h1 className="tp-hero__titulo">Descubre portafolios creativos</h1>
                    <p className="tp-hero__sub">Encuentra diseñadores, fotógrafos, desarrolladores y más talentos de Costa Rica.</p>
                    <div className="tp-hero__search">
                        <i className="fa-solid fa-magnifying-glass tp-hero__search-icon" />
                        <input
                            type="text"
                            className="tp-hero__input"
                            placeholder="Buscar por título o autor..."
                            value={busqueda}
                            onChange={e => setBusqueda(e.target.value)}
                        />
                        {busqueda && (
                            <button className="tp-hero__clear" onClick={() => setBusqueda("")}>
                                <i className="fa-solid fa-xmark" />
                            </button>
                        )}
                    </div>
                </div>
            </section>

            {/* ── Tabs ── */}
            <div className="tp-tabs">
                <div className="tp-tabs__inner">
                    <button
                        className={`tp-tab ${tabActiva === 'todos' ? 'tp-tab--activa' : ''}`}
                        onClick={() => setTabActiva('todos')}
                    >
                        <i className="fa-solid fa-grid-2" /> Todos los portafolios
                    </button>
                    {usuarioActivo && (
                        <button
                            className={`tp-tab ${tabActiva === 'siguiendo' ? 'tp-tab--activa' : ''}`}
                            onClick={() => setTabActiva('siguiendo')}
                        >
                            <i className="fa-regular fa-star" /> Siguiendo
                            {portafoliosSiguiendo.length > 0 && <span className="tp-tab__badge">{portafoliosSiguiendo.length}</span>}
                        </button>
                    )}
                </div>
            </div>

            {/* ── Contenido ── */}
            {tabActiva === 'todos' ? (
                <div className="tp-layout">

                    {/* Barra de filtros con dropdowns */}
                    <div className="tp-filtros" ref={dropdownsRef}>
                        <span className="tp-filtros__titulo">
                            <i className="fa-solid fa-sliders" /> Filtros
                            {hayFiltros && <span className="tp-filtros__badge">{[filtroProvincia, filtroCanton, filtroDistrito, filtroRating > 0, filtroCategoria, ordenarPor !== 'recientes'].filter(Boolean).length}</span>}
                        </span>

                        <div className="tp-filtros__dropdowns">

                            {/* Ordenar */}
                            <div className="tp-dd">
                                <button
                                    className={`tp-dd__btn ${ordenarPor !== 'recientes' ? 'tp-dd__btn--activo' : ''}`}
                                    onClick={() => toggleDropdown('ordenar')}
                                >
                                    {ORDENAR_LABELS[ordenarPor]}
                                    <i className={`fa-solid fa-chevron-down tp-dd__arrow ${dropdownAbierto === 'ordenar' ? 'open' : ''}`} />
                                </button>
                                {dropdownAbierto === 'ordenar' && (
                                    <div className="tp-dd__panel">
                                        {Object.entries(ORDENAR_LABELS).map(([val, label]) => (
                                            <button
                                                key={val}
                                                className={`tp-dd__opcion ${ordenarPor === val ? 'activa' : ''}`}
                                                onClick={() => { setOrdenarPor(val); setDropdownAbierto(null); }}
                                            >{label}</button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Calificación */}
                            <div className="tp-dd">
                                <button
                                    className={`tp-dd__btn ${filtroRating > 0 ? 'tp-dd__btn--activo' : ''}`}
                                    onClick={() => toggleDropdown('rating')}
                                >
                                    {filtroRating > 0 ? RATING_LABELS[filtroRating] : 'Calificación'}
                                    <i className={`fa-solid fa-chevron-down tp-dd__arrow ${dropdownAbierto === 'rating' ? 'open' : ''}`} />
                                </button>
                                {dropdownAbierto === 'rating' && (
                                    <div className="tp-dd__panel">
                                        {[0, 5, 4, 3].map(n => (
                                            <button
                                                key={n}
                                                className={`tp-dd__opcion ${filtroRating === n ? 'activa' : ''}`}
                                                onClick={() => { setFiltroRating(n); setDropdownAbierto(null); }}
                                            >
                                                {n === 0
                                                    ? <><i className="fa-solid fa-list" /> Todas</>
                                                    : <><i className="fa-solid fa-star" style={{ color: '#f59e0b' }} /> {RATING_LABELS[n]}</>
                                                }
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Categoría */}
                            <div className="tp-dd">
                                <button
                                    className={`tp-dd__btn ${filtroCategoria ? 'tp-dd__btn--activo' : ''}`}
                                    onClick={() => toggleDropdown('categoria')}
                                >
                                    <span className="tp-dd__label-truncate">
                                        {filtroCategoria || 'Categoría'}
                                    </span>
                                    <i className={`fa-solid fa-chevron-down tp-dd__arrow ${dropdownAbierto === 'categoria' ? 'open' : ''}`} />
                                </button>
                                {dropdownAbierto === 'categoria' && (
                                    <div className="tp-dd__panel tp-dd__panel--cats">
                                        {CATEGORIAS.map(cat => (
                                            <button
                                                key={cat}
                                                className={`tp-dd__opcion ${filtroCategoria === cat ? 'activa' : ''}`}
                                                onClick={() => { setFiltroCategoria(filtroCategoria === cat ? "" : cat); setDropdownAbierto(null); }}
                                            >{cat}</button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Ubicación */}
                            <div className="tp-dd">
                                <button
                                    className={`tp-dd__btn ${(filtroProvincia || filtroCanton || filtroDistrito) ? 'tp-dd__btn--activo' : ''}`}
                                    onClick={() => toggleDropdown('ubicacion')}
                                >
                                    {filtroProvincia || 'Ubicación'}
                                    <i className={`fa-solid fa-chevron-down tp-dd__arrow ${dropdownAbierto === 'ubicacion' ? 'open' : ''}`} />
                                </button>
                                {dropdownAbierto === 'ubicacion' && (
                                    <div className="tp-dd__panel tp-dd__panel--ubicacion">
                                        <div className="tp-dd__filtro-grupo">
                                            <label>Provincia</label>
                                            <select value={filtroProvincia} onChange={e => { setFiltroProvincia(e.target.value); setFiltroCanton(""); setFiltroDistrito(""); }}>
                                                <option value="">Todas</option>
                                                {provinciasUnicas.map(p => <option key={p} value={p}>{p}</option>)}
                                            </select>
                                        </div>
                                        <div className="tp-dd__filtro-grupo">
                                            <label>Cantón</label>
                                            <select value={filtroCanton} disabled={!filtroProvincia} onChange={e => { setFiltroCanton(e.target.value); setFiltroDistrito(""); }}>
                                                <option value="">Todos</option>
                                                {cantonesUnicos.map(c => <option key={c} value={c}>{c}</option>)}
                                            </select>
                                        </div>
                                        <div className="tp-dd__filtro-grupo">
                                            <label>Distrito</label>
                                            <select value={filtroDistrito} disabled={!filtroCanton} onChange={e => setFiltroDistrito(e.target.value)}>
                                                <option value="">Todos</option>
                                                {distritosUnicos.map(d => <option key={d} value={d}>{d}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {hayFiltros && (
                                <button className="tp-filtros__limpiar" onClick={limpiarFiltros}>
                                    <i className="fa-solid fa-xmark" /> Limpiar
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Grid principal */}
                    <main className="tp-main">
                        <div className="tp-main__header">
                            <p className="tp-main__count">
                                {cargando ? 'Cargando...' : `${proyectosFiltrados.length} resultado${proyectosFiltrados.length !== 1 ? 's' : ''}`}
                            </p>
                        </div>

                        {cargando ? (
                            <div className="tp-loading">
                                <div className="tp-spinner" />
                                <p>Cargando portafolios...</p>
                            </div>
                        ) : proyectosFiltrados.length === 0 ? (
                            <div className="tp-empty">
                                <i className="fa-solid fa-magnifying-glass" />
                                <h3>Sin resultados</h3>
                                <p>No hay portafolios que coincidan con tu búsqueda.</p>
                                {hayFiltros && (
                                    <button className="tp-empty__btn" onClick={limpiarFiltros}>
                                        Limpiar filtros
                                    </button>
                                )}
                            </div>
                        ) : (
                            <>
                                <div className="proyectos-grid">
                                    {proyectosPagina.map(proyecto => (
                                        <CardProyecto
                                            key={proyecto.id}
                                            idProyecto={proyecto.id}
                                            nombreProyecto={proyecto.titulo}
                                            componentes={proyecto.componentes}
                                            categorias={proyecto.categorias || []}
                                            promedio={proyecto.promedio}
                                            usuario={proyecto.usuario}
                                            onVerProyecto={() => setProyectoSeleccionado(proyecto)}
                                        />
                                    ))}
                                </div>

                                {/* Paginación */}
                                {totalPaginas > 1 && (
                                    <div className="tp-paginacion">
                                        <button
                                            className="tp-pag-btn"
                                            onClick={() => setPaginaActual(p => Math.max(1, p - 1))}
                                            disabled={paginaActual === 1}
                                        >
                                            <i className="fa-solid fa-chevron-left" style={{ fontSize: 11 }} />
                                        </button>

                                        {paginasVisibles.map((num, idx) => {
                                            const anterior = paginasVisibles[idx - 1];
                                            const mostrarEllipsis = anterior && num - anterior > 1;
                                            return (
                                                <React.Fragment key={num}>
                                                    {mostrarEllipsis && (
                                                        <span className="tp-pag-ellipsis">...</span>
                                                    )}
                                                    <button
                                                        className={`tp-pag-btn ${paginaActual === num ? 'tp-pag-btn--activa' : ''}`}
                                                        onClick={() => setPaginaActual(num)}
                                                    >
                                                        {num}
                                                    </button>
                                                </React.Fragment>
                                            );
                                        })}

                                        <button
                                            className="tp-pag-btn"
                                            onClick={() => setPaginaActual(p => Math.min(totalPaginas, p + 1))}
                                            disabled={paginaActual === totalPaginas}
                                        >
                                            <i className="fa-solid fa-chevron-right" style={{ fontSize: 11 }} />
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </main>
                </div>
            ) : (
                /* ── Tab Siguiendo ── */
                <div className="tp-siguiendo-view">
                    {cargandoSiguiendo ? (
                        <div className="tp-loading">
                            <div className="tp-spinner" />
                            <p>Cargando portafolios...</p>
                        </div>
                    ) : portafoliosSiguiendo.length === 0 ? (
                        <div className="tp-empty">
                            <i className="fa-regular fa-star" />
                            <h3>Aún no sigues a nadie</h3>
                            <p>Visita el perfil de un talento y haz clic en <strong>Seguir</strong> para ver su trabajo aquí.</p>
                            <button className="tp-empty__btn" onClick={() => setTabActiva('todos')}>
                                Explorar portafolios
                            </button>
                        </div>
                    ) : (
                        <>
                            <p className="tp-main__count" style={{ marginBottom: 16 }}>
                                {portafoliosSiguiendo.length} portafolio{portafoliosSiguiendo.length !== 1 ? 's' : ''} de usuarios que sigues
                            </p>
                            <div className="proyectos-grid">
                                {portafoliosSiguiendo
                                    .slice((paginaSiguiendo - 1) * ITEMS_POR_PAGINA, paginaSiguiendo * ITEMS_POR_PAGINA)
                                    .map(proyecto => {
                                        const resenasP = todasResenas.filter(r => r.portafolioId === proyecto.id);
                                        return (
                                            <CardProyecto
                                                key={proyecto.id}
                                                idProyecto={proyecto.id}
                                                nombreProyecto={proyecto.titulo}
                                                componentes={proyecto.componentes}
                                                categorias={proyecto.categorias || []}
                                                promedio={calcularPromedio(resenasP)}
                                                onVerProyecto={() => setProyectoSeleccionado(proyecto)}
                                            />
                                        );
                                    })}
                            </div>
                            {Math.ceil(portafoliosSiguiendo.length / ITEMS_POR_PAGINA) > 1 && (
                                <div className="tp-paginacion">
                                    {Array.from({ length: Math.ceil(portafoliosSiguiendo.length / ITEMS_POR_PAGINA) }, (_, i) => i + 1).map(num => (
                                        <button
                                            key={num}
                                            className={`tp-pag-btn ${paginaSiguiendo === num ? 'tp-pag-btn--activa' : ''}`}
                                            onClick={() => setPaginaSiguiendo(num)}
                                        >
                                            {num}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}

            <Footer />

            <ModalProyecto
                proyecto={proyectoSeleccionado}
                resenas={proyectoSeleccionado ? todasResenas.filter(r => r.portafolioId === proyectoSeleccionado.id) : []}
                onClose={() => setProyectoSeleccionado(null)}
                onReviewAdded={cargarDatos}
            />

            {proyectoSeleccionado && (
                <button
                    className="tp-btn-perfil-flotante"
                    onClick={() => navigate(`/perfil/${proyectoSeleccionado.usuarioId}`)}
                >
                    <i className="fa-solid fa-user" /> Ver perfil del creador
                </button>
            )}

            <ChatBotBubble />
        </div>
    );
}

export default TodosProyectos;
