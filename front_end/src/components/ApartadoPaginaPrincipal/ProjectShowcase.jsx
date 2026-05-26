import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Fetch from "../../services/Fetch";
import { normalizarPortafolio, normalizarResena } from '../../utils/normalizers';
import CardProyecto from '../PerfilUsuario/CardProyecto';
import '../../styles/Principales/InicioPagina.css';

function ProjectShowcase({ showcaseRef }) {
    const navigate = useNavigate();
    const filtersRef = useRef(null);
    const [datos, setDatos] = useState({ portafolios: [], resenas: [] });
    const [activeCategory, setActiveCategory] = useState('Todo');

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const [resP, resR] = await Promise.all([
                    Fetch.getData("portafolios?limit=500").catch(() => []),
                    Fetch.getData("resenas?limit=500").catch(() => []),
                ]);
                setDatos({
                    portafolios: (resP || []).map(normalizarPortafolio),
                    resenas:     (resR || []).map(normalizarResena),
                });
            } catch (error) {
                console.error("Error cargando portafolios:", error);
            }
        };
        cargarDatos();
    }, []);

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

    const scrollFilters = (dir) =>
        filtersRef.current?.scrollBy({ left: dir * 240, behavior: 'smooth' });

    const portafoliosProcesados = useMemo(() => {
        if (!datos.portafolios.length) return [];
        return datos.portafolios
            .map(p => {
                const resenasPf = datos.resenas.filter(r => String(r.portafolioId) === String(p.id));
                const avgRating = resenasPf.length > 0
                    ? resenasPf.reduce((sum, r) => sum + (r.rating || 0), 0) / resenasPf.length
                    : 0;
                return {
                    ...p,
                    user:         p.usuario || { Nombre: 'Usuario', img: '' },
                    avgRating,
                    totalResenas: resenasPf.length,
                };
            })
            .sort((a, b) => b.avgRating - a.avgRating || b.totalResenas - a.totalResenas);
    }, [datos]);

    const filteredProjects = useMemo(() => {
        let list = portafoliosProcesados;
        if (activeCategory !== 'Todo') {
            list = portafoliosProcesados.filter(p =>
                (p.categorias || []).includes(activeCategory)
            );
        }
        return list.slice(0, 4);
    }, [portafoliosProcesados, activeCategory]);

    return (
        <section className='ShowcaseSection' ref={showcaseRef}>
            <div className='ShowcaseHeader'>
                <span className='ShowcaseEyebrow'>✦ Portafolios destacados</span>
                <h2 className='ShowcaseTitle'>Descubre la excelencia creativa</h2>
                <p className='ShowcaseSubtitle'>
                    Explora los proyectos más innovadores y conecta con el talento que está
                    transformando el futuro digital.
                </p>
            </div>

            <div className='FiltersCarouselWrapper'>
                <button className='FilterArrow' onClick={() => scrollFilters(-1)}>
                    <i className="fa-solid fa-chevron-left"></i>
                </button>
                <div className='CategoryFilters' ref={filtersRef}>
                    {categories.map(cat => (
                        <button
                            key={cat}
                            className={`FilterBtn ${activeCategory === cat ? 'active' : ''}`}
                            onClick={() => setActiveCategory(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
                <button className='FilterArrow' onClick={() => scrollFilters(1)}>
                    <i className="fa-solid fa-chevron-right"></i>
                </button>
            </div>

            <div className='ProjectsGrid'>
                {filteredProjects.map((project, index) => (
                    <CardProyecto
                        key={`${project.id}-${index}`}
                        idProyecto={project.id}
                        nombreProyecto={project.titulo}
                        componentes={project.componentes}
                        categorias={project.categorias || []}
                        usuario={project.user}
                        promedio={project.avgRating}
                        onVerProyecto={() => navigate('/Registro')}
                    />
                ))}
                {filteredProjects.length === 0 && (
                    <div className="no-projects">No se encontraron proyectos en esta categoría.</div>
                )}
            </div>
        </section>
    );
}

export default ProjectShowcase;
