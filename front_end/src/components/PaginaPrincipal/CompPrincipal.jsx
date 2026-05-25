import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Fetch from '../../services/Fetch';
import { normalizarPortafolio, normalizarResena } from '../../utils/normalizers';
import CardProyecto from '../PerfilUsuario/CardProyecto';
import PreviewComponentes from '../PlantillaTalentos/PreviewComponentes';
import ModalProyecto from '../PerfilUsuario/ModalProyecto';
import SeccionComoFunciona from './SeccionComoFunciona';
import SeccionComunidad from './SeccionComunidad';
import '../../styles/Principales/PaginaPrincipal.css';

const categories = [
    'Todo',
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
];

function CompPrincipal() {
    const navigate = useNavigate();
    const filtersRef = useRef(null);
    const [datos, setDatos] = useState({ portafolios: [], resenas: [] });
    const [activeCategory, setActiveCategory] = useState('Todo');
    const [proyectoSeleccionado, setProyectoSeleccionado] = useState(null);
    const [configDestacado, setConfigDestacado] = useState(null);

    const scrollFilters = (dir) =>
        filtersRef.current?.scrollBy({ left: dir * 240, behavior: 'smooth' });

    useEffect(() => {
        const cargar = async () => {
            try {
                const [resP, resR, resCfg] = await Promise.all([
                    Fetch.getData('portafolios?limit=500').catch(() => []),
                    Fetch.getData('resenas?limit=500').catch(() => []),
                    Fetch.getData('configuracion/talento_destacado').catch(() => null),
                ]);
                setDatos({
                    portafolios: (resP || []).map(normalizarPortafolio),
                    resenas:     (resR || []).map(normalizarResena),
                });
                if (resCfg) setConfigDestacado(resCfg);
            } catch (e) {
                console.error('Error cargando datos:', e);
            }
        };
        cargar();
        window._recargarDatosPrincipal = cargar;
    }, []);

    const portafoliosProcesados = useMemo(() => {
        if (!datos.portafolios.length) return [];
        return datos.portafolios
            .map(p => {
                const resenasPf = datos.resenas.filter(r => String(r.portafolioId) === String(p.id));
                const avgRating = resenasPf.length > 0
                    ? resenasPf.reduce((sum, r) => sum + (r.rating || 0), 0) / resenasPf.length
                    : 0;
                return { ...p, user: p.usuario || { Nombre: 'Usuario', img: '' }, avgRating, totalResenas: resenasPf.length };
            })
            .sort((a, b) => b.avgRating - a.avgRating || b.totalResenas - a.totalResenas);
    }, [datos]);

    const filtrados = useMemo(() => {
        const lista = activeCategory === 'Todo'
            ? portafoliosProcesados
            : portafoliosProcesados.filter(p => (p.categorias || []).includes(activeCategory));
        return lista.slice(0, 4);
    }, [portafoliosProcesados, activeCategory]);

    const destacado = useMemo(() => {
        if (!portafoliosProcesados.length) return null;
        // Si el admin eligió un talento, mostrar su mejor portafolio
        if (configDestacado?.id_usuario) {
            const portasDelTalento = portafoliosProcesados.filter(
                p => String(p.usuarioId) === String(configDestacado.id_usuario)
            );
            if (portasDelTalento.length) {
                const conResenas = portasDelTalento.filter(p => p.avgRating !== null);
                return conResenas.length
                    ? conResenas.reduce((best, p) => p.avgRating > best.avgRating ? p : best)
                    : portasDelTalento[0];
            }
        }
        // Fallback: portafolio con mejor rating automáticamente
        const conResenas = portafoliosProcesados.filter(p => p.avgRating !== null);
        if (!conResenas.length) return null;
        return conResenas.reduce((best, p) =>
            p.avgRating > best.avgRating ||
            (p.avgRating === best.avgRating && p.totalResenas > best.totalResenas)
                ? p : best
        );
    }, [portafoliosProcesados, configDestacado]);

    const renderStars = (rating) => {
        const full = Math.floor(rating);
        const half = rating - full >= 0.5;
        return Array.from({ length: 5 }, (_, i) => {
            if (i < full) return <i key={i} className="fa-solid fa-star pp-star pp-star--full" />;
            if (i === full && half) return <i key={i} className="fa-solid fa-star-half-stroke pp-star pp-star--half" />;
            return <i key={i} className="fa-regular fa-star pp-star pp-star--empty" />;
        });
    };

    return (
        <div className="pp-wrapper">

            {/* ── Sección portafolios ── */}
            <section className="pp-section">
                <div className="pp-section-header">
                    <span className="pp-eyebrow">✦ Portafolios</span>
                    <h2 className="pp-title">Explora los mejores portafolios</h2>
                    <p className="pp-subtitle">
                        Descubre el trabajo de los creativos de la comunidad Krea.
                    </p>
                </div>

                <div className="pp-filters-carousel">
                    <button className="pp-filters-arrow" onClick={() => scrollFilters(-1)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                    </button>
                    <div className="pp-filters" ref={filtersRef}>
                        {categories.map(cat => (
                            <button
                                key={cat}
                                className={`pp-filter-btn ${activeCategory === cat ? 'active' : ''}`}
                                onClick={() => setActiveCategory(cat)}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                    <button className="pp-filters-arrow" onClick={() => scrollFilters(1)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                    </button>
                </div>

                <div className="pp-grid">
                    {filtrados.map((project, index) => (
                        <CardProyecto
                            key={`${project.id}-${index}`}
                            idProyecto={project.id}
                            nombreProyecto={project.titulo}
                            componentes={project.componentes}
                            categorias={project.categorias || []}
                            usuario={project.user}
                            promedio={project.avgRating}
                            onVerProyecto={() => setProyectoSeleccionado(project)}
                        />
                    ))}

                    {filtrados.length === 0 && (
                        <div className="pp-empty">No hay portafolios en esta categoría.</div>
                    )}
                </div>

                <div className="pp-ver-mas">
                    <button className="pp-btn-ver-mas" onClick={() => navigate('/todos-proyectos')}>
                        Ver más proyectos
                    </button>
                </div>
            </section>

            <SeccionComoFunciona />
            <SeccionComunidad />

            {/* ── Portafolio destacado ── */}
            {destacado && (
                <section className="pp-destacado-section">
                    <div className="pp-destacado-card">
                        <div className="pp-destacado-preview">
                            <PreviewComponentes componentes={destacado.componentes} />
                        </div>
                        <div className="pp-destacado-info">
                            <span className="pp-destacado-badge">DESTACADO</span>
                            <h2 className="pp-destacado-title">{destacado.titulo}</h2>

                            <div className="pp-destacado-rating">
                                {renderStars(destacado.avgRating)}
                                <span className="pp-destacado-rating-num">
                                    {destacado.avgRating.toFixed(1)}/5
                                </span>
                                <span className="pp-destacado-rating-count">
                                    ({destacado.totalResenas} reseña{destacado.totalResenas !== 1 ? 's' : ''})
                                </span>
                            </div>

                            {destacado.descripcion && (
                                <p className="pp-destacado-desc">{destacado.descripcion}</p>
                            )}

                            {destacado.categorias?.length > 0 && (
                                <div className="pp-destacado-tags">
                                    {destacado.categorias.slice(0, 3).map(cat => (
                                        <span key={cat} className="pp-destacado-tag">
                                            <i className="fa-solid fa-circle-check" /> {cat}
                                        </span>
                                    ))}
                                </div>
                            )}

                            <div className="pp-destacado-btns">
                                <button
                                    className="pp-btn-primary"
                                    onClick={() => setProyectoSeleccionado(destacado)}
                                >
                                    Ver portafolio
                                </button>
                                <button
                                    className="pp-btn-secondary"
                                    onClick={() => navigate(`/perfil/${destacado.usuarioId}`)}
                                >
                                    Visitar perfil
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {proyectoSeleccionado && (
                <ModalProyecto
                    proyecto={proyectoSeleccionado}
                    resenas={datos.resenas}
                    onClose={() => setProyectoSeleccionado(null)}
                    onReviewAdded={async () => {
                        const res = await Fetch.getData('resenas?limit=500').catch(() => []);
                        setDatos(prev => ({ ...prev, resenas: (res || []).map(normalizarResena) }));
                    }}
                />
            )}
        </div>
    );
}

export default CompPrincipal;
