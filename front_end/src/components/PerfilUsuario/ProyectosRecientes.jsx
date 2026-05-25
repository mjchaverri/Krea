import "../../styles/EstilosPerfilUsuario/ProyectosRecientes.css"
import { useState, useEffect, useMemo } from 'react'
import CardProyecto from './CardProyecto';
import ModalProyecto from './ModalProyecto';
import Fetch from '../../services/Fetch';
import { normalizarPortafolio, normalizarResena } from '../../utils/normalizers';
import { calcularPromedio } from '../../utils/calcularPromedio';
import { useNavigate } from "react-router-dom";

function ProyectosRecientes() {
    const [proyectos, setProyectos] = useState([])
    const [todasResenas, setTodasResenas] = useState([])
    const [proyectoSeleccionado, setProyectoSeleccionado] = useState(null)
    const [loading, setLoading] = useState(true)
    const [visibleCount, setVisibleCount] = useState(3)

    const navigate = useNavigate()

    const cargarDatos = async () => {
        setLoading(true)
        try {
            const usuario = JSON.parse(localStorage.getItem("UsuarioActivo"))
            if (!usuario?.id) return

            const [resP, resR] = await Promise.all([
                Fetch.getData(`portafolios/usuario/${usuario.id}?limit=50`),
                Fetch.getData('resenas?limit=100'),
            ])

            setProyectos((resP || []).map(normalizarPortafolio))
            setTodasResenas((resR || []).map(normalizarResena))
        } catch (error) {
            console.error(error)
        } finally {
            setTimeout(() => setLoading(false), 800)
        }
    }

    const handleDeletePortfolio = async (id) => {
        const confirmar = window.confirm("¿Estás seguro de que quieres eliminar este portafolio? Esta acción no se puede deshacer.");
        if (!confirmar) return;

        try {
            await Fetch.deleteData(`portafolios/${id}`);
            setProyectos((prev) => prev.filter((p) => p.id !== id));
        } catch (error) {
            console.error("Error al eliminar portafolio:", error);
            alert("No se pudo eliminar el portafolio. Intenta de nuevo.");
        }
    };

    useEffect(() => {
        cargarDatos()
    }, [])

    // 🔥 Memo optimizado (fuera del JSX)
    const proyectosRenderizados = useMemo(() => {
        return proyectos.slice(0, visibleCount).map((proyecto) => {
            const resenasProyecto = todasResenas.filter(
                r => r.portafolioId === proyecto.id
            )

            const promedio = calcularPromedio(resenasProyecto)

            return (
                <CardProyecto
                    key={proyecto.id}
                    idProyecto={proyecto.id}
                    nombreProyecto={proyecto.titulo}
                    componentes={proyecto.componentes}
                    categorias={proyecto.categorias || []}
                    promedio={promedio}
                    onVerProyecto={() => setProyectoSeleccionado(proyecto)}
                    onDelete={() => handleDeletePortfolio(proyecto.id)}
                />
            )
        })
    }, [proyectos, todasResenas, visibleCount])

    const usuarioActivo = JSON.parse(localStorage.getItem("UsuarioActivo") || "{}");
    const isOwner = !!usuarioActivo.id;

    return (
        <div className='proyectos-container'>
            <div className="proyectos-header">
                <h4>Proyectos Recientes</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    {isOwner && (
                        <button 
                            className="btn-create-empty"
                            onClick={() => navigate("/portafolio")}
                            style={{ padding: '8px 16px', fontSize: '13px' }}
                        >
                            + Agregar Portafolio
                        </button>
                    )}
                    <p onClick={() => navigate("/todos-proyectos")}>Ver todos</p>
                </div>
            </div>

            <div className="proyectos-grid">
                {loading ? (
                    // Skeleton
                    Array(3).fill(0).map((_, i) => (
                        <div key={i} className="proyecto-card-skeleton">
                            <div className="skeleton-image"></div>
                            <div className="skeleton-text title"></div>
                            <div className="skeleton-text body"></div>
                        </div>
                    ))
                ) : proyectos.length === 0 ? (
                    // Empty State
                    <div className="empty-state-container">
                        <div className="empty-state-icon">📁</div>
                        <h4>Este usuario aún no tiene proyectos</h4>
                        <p>Los proyectos que crees aparecerán en esta sección automáticamente.</p>
                        <button
                            className="btn-create-empty"
                            onClick={() => navigate("/portafolio")}
                        >
                            + Crear mi primer proyecto
                        </button>
                    </div>
                ) : (
                    <>
                        {proyectosRenderizados}

                        {proyectos.length > visibleCount && (
                            <div
                                className="paginacion-container"
                                style={{
                                    gridColumn: '1 / -1',
                                    textAlign: 'center',
                                    marginTop: '20px'
                                }}
                            >
                                <button
                                    className="btn-create-empty"
                                    onClick={() => setVisibleCount(prev => prev + 3)}
                                >
                                    Cargar más proyectos
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Modal */}
            <ModalProyecto 
                proyecto={proyectoSeleccionado}
                resenas={
                    proyectoSeleccionado
                        ? todasResenas.filter(
                              r => r.portafolioId === proyectoSeleccionado.id
                          )
                        : []
                }
                onClose={() => setProyectoSeleccionado(null)}
                onReviewAdded={cargarDatos}
            />
        </div>
    )
}

export default ProyectosRecientes