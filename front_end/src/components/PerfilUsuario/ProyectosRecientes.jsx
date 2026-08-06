import "../../styles/EstilosPerfilUsuario/ProyectosRecientes.css"
import { useState, useEffect, useMemo } from 'react'
import CardProyecto from './CardProyecto';
import ModalProyecto from './ModalProyecto';
import Paginacion from '../Administrador/Paginacion';
import Fetch from '../../services/Fetch';
import Swal from 'sweetalert2';
import { normalizarPortafolio, normalizarResena } from '../../utils/normalizers';
import { calcularPromedio } from '../../utils/calcularPromedio';
import { useNavigate } from "react-router-dom";

const POR_PAGINA = 8;

function ProyectosRecientes() {
    const [proyectos,            setProyectos]            = useState([])
    const [todasResenas,         setTodasResenas]         = useState([])
    const [proyectoSeleccionado, setProyectoSeleccionado] = useState(null)
    const [loading,              setLoading]              = useState(true)
    const [error,                setError]                = useState(null)
    const [pagina,               setPagina]               = useState(1)
    const [vista,                setVista]                = useState('cuadricula')

    const navigate = useNavigate()

    const cargarDatos = async () => {
        setLoading(true)
        setError(null)
        try {
            const usuario = JSON.parse(localStorage.getItem("UsuarioActivo"))
            if (!usuario?.id) { setLoading(false); return }

            const [resP, resR] = await Promise.all([
                Fetch.getData(`portafolios/usuario/${usuario.id}?limit=200`),
                Fetch.getData('resenas?limit=200'),
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

    useEffect(() => { cargarDatos() }, [])

    const handleEditarPortfolio = (proyecto) =>
        navigate("/portafolio", { state: { proyectoEditando: proyecto } });

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
            setProyectos(prev => prev.filter(p => p.id !== id));
            Swal.fire({ icon: 'success', title: 'Eliminado', timer: 2000, showConfirmButton: false });
        } catch {
            Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo eliminar el portafolio.', confirmButtonColor: '#0ea5e9' });
        }
    };

    const totalPaginas  = Math.max(1, Math.ceil(proyectos.length / POR_PAGINA));
    const proyectosPag  = proyectos.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA);

    const proyectosRenderizados = useMemo(() =>
        proyectosPag.map(proyecto => {
            const resenasProyecto = todasResenas.filter(r => r.portafolioId === proyecto.id)
            return (
                <CardProyecto
                    key={proyecto.id}
                    idProyecto={proyecto.id}
                    nombreProyecto={proyecto.titulo}
                    componentes={proyecto.componentes}
                    categorias={proyecto.categorias || []}
                    promedio={calcularPromedio(resenasProyecto)}
                    onVerProyecto={() => setProyectoSeleccionado(proyecto)}
                    onEditar={() => handleEditarPortfolio(proyecto)}
                    onDelete={() => handleDeletePortfolio(proyecto.id)}
                    vista={vista}
                />
            )
        }),
    [proyectosPag, todasResenas, vista])

    return (
        <div className='proyectos-container'>
            <div className="proyectos-header">
                <h4>Mis Proyectos</h4>
                <div className="proyectos-header-acciones">
                    <div className="proyectos-vista-toggle" role="group" aria-label="Tipo de vista">
                        <button
                            className={`proyectos-vista-btn ${vista === 'cuadricula' ? 'proyectos-vista-btn--activo' : ''}`}
                            onClick={() => setVista('cuadricula')}
                            title="Vista de cuadrícula"
                            type="button"
                        >
                            <i className="fa-solid fa-table-cells-large" />
                        </button>
                        <button
                            className={`proyectos-vista-btn ${vista === 'lista' ? 'proyectos-vista-btn--activo' : ''}`}
                            onClick={() => setVista('lista')}
                            title="Vista de lista"
                            type="button"
                        >
                            <i className="fa-solid fa-list" />
                        </button>
                    </div>
                    <button
                        className="btn-create-empty"
                        onClick={() => navigate("/portafolio")}
                    >
                        + Agregar Portafolio
                    </button>
                </div>
            </div>

            <div className={`proyectos-grid ${vista === 'lista' ? 'proyectos-grid--lista' : ''}`}>
                {loading ? (
                    Array(6).fill(0).map((_, i) => (
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
                        <button className="btn-create-empty" onClick={cargarDatos}>Reintentar</button>
                    </div>
                ) : proyectos.length === 0 ? (
                    <div className="empty-state-container">
                        <div className="empty-state-icon">📁</div>
                        <h4>Aún no tienes proyectos</h4>
                        <p>Los proyectos que crees aparecerán aquí automáticamente.</p>
                        <button className="btn-create-empty" onClick={() => navigate("/portafolio")}>
                            + Crear mi primer proyecto
                        </button>
                    </div>
                ) : (
                    proyectosRenderizados
                )}
            </div>

            {!loading && !error && proyectos.length > 0 && (
                <div style={{ marginTop: '32px' }}>
                    <Paginacion
                        pagina={pagina}
                        totalPaginas={totalPaginas}
                        onChange={p => { setPagina(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        totalItems={proyectos.length}
                        itemsMostrados={proyectosPag.length}
                    />
                </div>
            )}

            <ModalProyecto
                proyecto={proyectoSeleccionado}
                resenas={proyectoSeleccionado
                    ? todasResenas.filter(r => r.portafolioId === proyectoSeleccionado.id)
                    : []}
                onClose={() => setProyectoSeleccionado(null)}
                onReviewAdded={cargarDatos}
            />
        </div>
    )
}

export default ProyectosRecientes
