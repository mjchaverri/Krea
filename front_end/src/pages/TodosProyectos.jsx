import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar/Navbar';
import Footer from '../components/ApartadoPaginaPrincipal/Footer';
import Fetch from '../services/Fetch';
import CardProyecto from '../components/PerfilUsuario/CardProyecto';
import ModalProyecto from '../components/PerfilUsuario/ModalProyecto';
import { calcularPromedio } from '../utils/calcularPromedio';
import "../styles/EstilosPerfilUsuario/ProyectosRecientes.css";
import "../styles/PlantillaTalentos/TodosProyectos.css";

function TodosProyectos() {
    const navigate = useNavigate();
    const [portafolios, setPortafolios] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [todasResenas, setTodasResenas] = useState([]);
    const [proyectoSeleccionado, setProyectoSeleccionado] = useState(null);

    // Filtros
    const [filtroProvincia, setFiltroProvincia] = useState("");
    const [filtroCanton, setFiltroCanton] = useState("");
    const [filtroDistrito, setFiltroDistrito] = useState("");
    const [filtroRating, setFiltroRating] = useState(0);
    const [ordenarPor, setOrdenarPor] = useState("recientes"); // recientes, populares, valorados
    const [visibleCount, setVisibleCount] = useState(6); // Paginación inicial explorador

    const cargarDatos = async () => {
        try {
            const [dataPortafolios, dataUsuarios, dataResenas] = await Promise.all([
                Fetch.getData("portafolios"),
                Fetch.getData("usuarios"),
                Fetch.getData("resenas")
            ]);

            setPortafolios(dataPortafolios || []);
            setUsuarios(dataUsuarios || []);
            setTodasResenas(dataResenas || []);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        cargarDatos();
    }, []);

    // Funciones útiles para obtener valores únicos (memorizadas)
    const provinciasUnicas = useMemo(() => 
        [...new Set(usuarios.map(u => u.Provincias).filter(Boolean))], 
    [usuarios]);

    const cantonesDelProvincia = useMemo(() => 
        [...new Set(usuarios.filter(u => (!filtroProvincia || u.Provincias === filtroProvincia)).map(u => u.Canton).filter(Boolean))], 
    [usuarios, filtroProvincia]);

    const distritosDelCanton = useMemo(() => 
        [...new Set(usuarios.filter(u => (!filtroCanton || u.Canton === filtroCanton)).map(u => u.Distrito).filter(Boolean))], 
    [usuarios, filtroCanton]);

    // Array combinado y filtrado usando useMemo para evitar recalcular en cada render
    const proyectosFiltrados = useMemo(() => {
        let resultado = portafolios.reduce((acc, proyecto) => {
            const usuario = usuarios.find(u => String(u.id) === String(proyecto.usuarioId)) || {};
            
            // Filtros de Ubicacion
            if (filtroProvincia && usuario.Provincias !== filtroProvincia) return acc;
            if (filtroCanton && usuario.Canton !== filtroCanton) return acc;
            if (filtroDistrito && usuario.Distrito !== filtroDistrito) return acc;
            
            const resenasP = todasResenas.filter(r => r.portafolioId === proyecto.id);
            const promedio = parseFloat(calcularPromedio(resenasP));

            // Filtro de Rating
            if (filtroRating > 0 && promedio < filtroRating) return acc;

            acc.push({ ...proyecto, usuario, promedio, cantidadResenas: resenasP.length });
            return acc;
        }, []);

        // Aplicar Ordenamiento
        if (ordenarPor === "recientes") {
            resultado.sort((a, b) => (b.id > a.id ? 1 : -1)); // Simulación por ID si no hay fecha
        } else if (ordenarPor === "valorados") {
            resultado.sort((a, b) => b.promedio - a.promedio);
        } else if (ordenarPor === "populares") {
            resultado.sort((a, b) => b.cantidadResenas - a.cantidadResenas);
        }

        return resultado;
    }, [portafolios, usuarios, todasResenas, filtroProvincia, filtroCanton, filtroDistrito, filtroRating, ordenarPor]);

    return (
        <div>
            <Navbar />
            <div className='todos-proyectos-wrapper'>
                <div className='filtros-container'>
                    <h4>Filtros</h4>
                    
                    <div className="filtro-grupo">
                        <label>Provincia</label>
                        <select value={filtroProvincia} onChange={e => { setFiltroProvincia(e.target.value); setFiltroCanton(""); setFiltroDistrito(""); }}>
                            <option value="">Todas</option>
                            {provinciasUnicas.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                    </div>

                    <div className="filtro-grupo">
                        <label>Cantón</label>
                        <select value={filtroCanton} onChange={e => { setFiltroCanton(e.target.value); setFiltroDistrito(""); }} disabled={!filtroProvincia}>
                            <option value="">Todos</option>
                            {cantonesDelProvincia.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>

                    <div className="filtro-grupo">
                        <label>Distrito</label>
                        <select value={filtroDistrito} onChange={e => setFiltroDistrito(e.target.value)} disabled={!filtroCanton}>
                            <option value="">Todos</option>
                            {distritosDelCanton.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                    </div>

                    <div className="filtro-grupo">
                        <label>Calificación (Estrellas)</label>
                        <select value={filtroRating} onChange={e => setFiltroRating(Number(e.target.value))}>
                            <option value={0}>Cualquiera</option>
                            <option value={4}>4+ Estrellas</option>
                            <option value={3}>3+ Estrellas</option>
                            <option value={2}>2+ Estrellas</option>
                            <option value={1}>1+ Estrellas</option>
                        </select>
                    </div>
                    <div className="filtro-grupo">
                        <label>Ordenar por</label>
                        <select value={ordenarPor} onChange={e => setOrdenarPor(e.target.value)}>
                            <option value="recientes">Más recientes</option>
                            <option value="populares">Más populares (Reseñas)</option>
                            <option value="valorados">Mejor valorados (Estrellas)</option>
                        </select>
                    </div>
                    
                    <button className="limpiar-filtros" onClick={() => {
                        setFiltroProvincia("");
                        setFiltroCanton("");
                        setFiltroDistrito("");
                        setFiltroRating(0);
                        setOrdenarPor("recientes");
                    }}>Limpiar Filtros</button>
                    
                </div>
                
                <div className='proyectos-container todos-proyectos-main'>
                    <div className="proyectos-header">
                        <h4>Explorar Portafolios</h4>
                        <p>{proyectosFiltrados.length} resultados</p>
                    </div>

                    <div className="proyectos-grid">
                        {proyectosFiltrados.length === 0 && (
                            <div className="sin-resultados">No se encontraron proyectos con esos filtros.</div>
                        )}

                        {proyectosFiltrados.slice(0, visibleCount).map(proyecto => (
                            <CardProyecto
                                key={proyecto.id}
                                idProyecto={proyecto.id}
                                nombreProyecto={proyecto.titulo}
                                descripcionProyecto={proyecto.descripcion}
                                estructura={proyecto.componentes?.[0]}
                                promedio={proyecto.promedio}
                                imgPortada={proyecto.imgPortada}
                                onVerProyecto={() => setProyectoSeleccionado(proyecto)}
                            />
                        ))}
                    </div>
                    {proyectosFiltrados.length > visibleCount && (
                        <div className="cargar-mas-wrapper" style={{ display: 'flex', justifyContent: 'center', marginTop: '40px' }}>
                            <button 
                                className="btn-create-empty" 
                                style={{ padding: '14px 40px', fontSize: '16px' }} 
                                onClick={() => setVisibleCount(prev => prev + 6)}
                            >
                                Cargar más talentos
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <Footer />

            {/* ModalProyecto existente — sin modificar */}
            <ModalProyecto 
                proyecto={proyectoSeleccionado} 
                resenas={proyectoSeleccionado ? todasResenas.filter(r => r.portafolioId === proyectoSeleccionado.id) : []}
                onClose={() => setProyectoSeleccionado(null)}
                onReviewAdded={cargarDatos}
            />

            {/* Botón flotante — navega a /perfil/:usuarioId (nueva página) */}
            {proyectoSeleccionado && (
                <button
                    onClick={() => navigate(`/perfil/${proyectoSeleccionado.usuarioId}`)}
                    title="Ver perfil del creador"
                    style={{
                        position: 'fixed',
                        bottom: '32px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        zIndex: 10001,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: '#0db9f2',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '999px',
                        padding: '12px 24px',
                        fontWeight: '700',
                        fontSize: '14px',
                        cursor: 'pointer',
                        boxShadow: '0 8px 24px rgba(13,185,242,0.4)',
                        transition: 'all .2s',
                        letterSpacing: '0.01em',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#09a1d3'; e.currentTarget.style.transform = 'translateX(-50%) translateY(-2px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#0db9f2'; e.currentTarget.style.transform = 'translateX(-50%) translateY(0)'; }}
                >
                    <span className="fa-solid fa-user" style={{ fontSize: '13px' }} />
                    Ver perfil del creador
                </button>
            )}
        </div>
    );
}

export default TodosProyectos;
