import "../../styles/EstilosPerfilUsuario/ProyectosRecientes.css"
import { useState, useEffect, useMemo } from 'react'
import CardProyecto from './CardProyecto';
import ModalProyecto from './ModalProyecto';
import Fetch from '../../services/Fetch';
import Swal from 'sweetalert2';
import { normalizarPortafolio, normalizarResena } from '../../utils/normalizers';
import { calcularPromedio } from '../../utils/calcularPromedio';
import { useNavigate } from "react-router-dom";

function ProyectosRecientes() {
    const [proyectos, setProyectos] = useState([])
    const [todasResenas, setTodasResenas] = useState([])
    const [proyectoSeleccionado, setProyectoSeleccionado] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [visibleCount, setVisibleCount] = useState(3)

    const navigate = useNavigate()

    const cargarDatos = async () => {
        setLoading(true)
        setError(null)
        try {
            const usuario = JSON.parse(localStorage.getItem("UsuarioActivo"))
            if (!usuario?.id) {
                setLoading(false)
                return
            }

            const [resP, resR] = await Promise.all([
                Fetch.getData(`portafolios/usuario/${usuario.id}?limit=50`),
                Fetch.getData('resenas?limit=100'),
            ])

            setProyectos((resP || []).map(normalizarPortafolio))
            setTodasResenas((resR || []).map(normalizarResena))
        } catch (err) {
            console.error(err)
            setError("No se pudieron cargar los proyectos.")
        } finally {
            setLoading(false)
        }
    }

    const handleEditarPortfolio = (proyecto) => {
        navigate("/portafolio", { state: { proyectoEditando: proyecto } });
    };

    const handleDeletePortfolio = async (id) => {
        const result = await Swal.fire({
            title: '¿Eliminar portafolio?',
            text: 'Esta acción no se puede deshacer.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
        });
        if (!result.isConfirmed) return;

        try {
            await Fetch.deleteData(`portafolios/${id}`);
            setProyectos((prev) => prev.filter((p) => p.id !== id));
            Swal.fire({ icon: 'success', title: 'Eliminado', text: 'El portafolio fue eliminado correctamente.', confirmButtonColor: '#0ea5e9', timer: 2000, showConfirmButton: false });
        } catch (error) {
            console.error("Error al eliminar portafolio:", error);
            Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo eliminar el portafolio. Intenta de nuevo.', confirmButtonColor: '#0ea5e9' });
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
                    onEditar={() => handleEditarPortfolio(proyecto)}
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
                    Array(3).fill(0).map((_, i) => (
                        <div key={i} className="proyecto-card-skeleton">
                            <div className="skeleton-image"></div>
                            <div className="skeleton-text title"></div>
                            <div className="skeleton-text body"></div>
                        </div>
                    ))
                ) : error ? (
                    <div className="empty-state-container">
                        <div className="empty-state-icon">⚠️</div>
                        <h4>Error al cargar proyectos</h4>
                        <p>{error}</p>
                        <button className="btn-create-empty" onClick={cargarDatos}>
                            Reintentar
                        </button>
                    </div>
                ) : proyectos.length === 0 ? (
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