import React, { useState, useEffect, useMemo } from 'react';
import ResenasPerfilUsuario from '../components/PerfilUsuario/ResenasPerfilUsuario';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar/Navbar';
import Footer from '../components/ApartadoPaginaPrincipal/Footer';
import InfoUsuario from '../components/PerfilUsuario/InfoUsuario';
import SeccionesPerfil from '../components/PerfilUsuario/SeccionesPerfil';
import CardProyecto from '../components/PerfilUsuario/CardProyecto';
import ModalProyecto from '../components/PerfilUsuario/ModalProyecto';
import Fetch from '../services/Fetch';
import { normalizarPortafolio, normalizarResena, normalizarUsuario } from '../utils/normalizers';
import { calcularPromedio } from '../utils/calcularPromedio';

// Reutilizamos exactamente los mismos estilos del perfil personal
import '../styles/EstilosPerfilUsuario/PerfilUsuario.css';
import '../styles/EstilosPerfilUsuario/InfoUsuarios.css';
import '../styles/EstilosPerfilUsuario/ProyectosRecientes.css';
import '../styles/EstilosPerfilUsuario/ResenasUsuario.css';
import '../styles/EstilosPerfilUsuario/SeccionesPerfil.css';

/**
 * PerfilVisitante — /perfil/:usuarioId
 *
 * Muestra el perfil PÚBLICO de cualquier usuario.
 * Reutiliza InfoUsuario con isOwner=false (sin edición, sin admin).
 * Reutiliza CardProyecto + ModalProyecto para los proyectos.
 * Carga datos desde Fetch usando el :usuarioId de la URL.
 * No modifica ningún componente existente.
 */
function PerfilVisitante() {
    const { usuarioId } = useParams();
    const navigate = useNavigate();

    const [usuario, setUsuario] = useState(null);
    const [portafolios, setPortafolios] = useState([]);
    const [todasResenas, setTodasResenas] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [proyectoSeleccionado, setProyectoSeleccionado] = useState(null);
    const [visibleCount, setVisibleCount] = useState(6);

    // Cargar datos — misma lógica que PerfilUsuario + ProyectosRecientes
    // pero parametrizada por usuarioId de la URL en lugar de localStorage
    const cargarDatos = async () => {
        setCargando(true);
        try {
            const [resU, resP, resR] = await Promise.all([
                Fetch.getData(`usuarios/${usuarioId}`),
                Fetch.getData(`portafolios/usuario/${usuarioId}?limit=50`),
                Fetch.getData('resenas?limit=100'),
            ]);

            setUsuario(resU ? normalizarUsuario(resU) : null);
            setPortafolios((resP || []).map(normalizarPortafolio));
            setTodasResenas((resR || []).map(normalizarResena));
        } catch (error) {
            console.error('PerfilVisitante — error cargando datos:', error);
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargarDatos();
    }, [usuarioId]);

    // Reseñas del proyecto actualmente abierto en el modal
    const resenasProyecto = useMemo(() => {
        if (!proyectoSeleccionado) return [];
        return todasResenas.filter(
            (r) => r.portafolioId === proyectoSeleccionado.id
        );
    }, [proyectoSeleccionado, todasResenas]);

    if (cargando) {
        return (
            <div className="perfil-page">
                <Navbar />
                <div style={{ padding: '80px 20px', textAlign: 'center', color: '#6b7a8c' }}>
                    <p>Cargando perfil...</p>
                </div>
            </div>
        );
    }

    if (!usuario) {
        return (
            <div className="perfil-page">
                <Navbar />
                <div style={{ padding: '80px 20px', textAlign: 'center', color: '#6b7a8c' }}>
                    <p>No se encontró el usuario.</p>
                    <button
                        className="btn-create-empty"
                        onClick={() => navigate('/todos-proyectos')}
                        style={{ marginTop: '20px' }}
                    >
                        ← Volver a proyectos
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="perfil-page">
            <Navbar />

            <div className="perfil-volver-bar">
                <button className="perfil-volver-btn" onClick={() => navigate(-1)}>
                    ← Volver
                </button>
                <span className="perfil-volver-txt">
                    Perfil de <strong>{usuario.Nombre}</strong>
                </span>
            </div>

            {/* INFO DEL USUARIO — InfoUsuario con isOwner=false:
                nunca muestra "Editar perfil" ni "Panel Admin" */}
            <div className="perfil-content">
                <InfoUsuario
                    usuario={usuario}
                    isOwner={false}
                    onUpdate={null}
                />
            </div>

            {/* TABS — reutiliza exactamente SeccionesPerfil */}
            <div className="secciones-perfil">
                <SeccionesPerfil />
            </div>

            {/* RESEÑAS DE PERFIL */}
            <div className="perfil-resenas">
                <ResenasPerfilUsuario usuarioId={usuarioId} isOwner={false} />
            </div>

            {/* PROYECTOS — usa CardProyecto + ModalProyecto, igual que ProyectosRecientes
                pero cargando los portafolios del usuario visitado */}
            <div className="proyectos-container">
                <div className="proyectos-header">
                    <h4>Proyectos Recientes</h4>
                    <p>{portafolios.length} proyecto{portafolios.length !== 1 ? 's' : ''}</p>
                </div>

                <div className="proyectos-grid">
                    {portafolios.length === 0 ? (
                        <div className="empty-state-container">
                            <div className="empty-state-icon">📁</div>
                            <h4>Este usuario aún no tiene proyectos</h4>
                            <p>Los proyectos que cree aparecerán aquí automáticamente.</p>
                        </div>
                    ) : (
                        <>
                            {portafolios.slice(0, visibleCount).map((proyecto) => {
                                const resenasP = todasResenas.filter(
                                    (r) => r.portafolioId === proyecto.id
                                );
                                return (
                                    <CardProyecto
                                        key={proyecto.id}
                                        idProyecto={proyecto.id}
                                        nombreProyecto={proyecto.titulo}
                                        componentes={proyecto.componentes}
                                        categorias={proyecto.categorias || []}
                                        promedio={calcularPromedio(resenasP)}
                                        usuario={{ Nombre: usuario?.Nombre, img: usuario?.img }}
                                        onVerProyecto={() => setProyectoSeleccionado(proyecto)}
                                    />
                                );
                            })}

                            {portafolios.length > visibleCount && (
                                <div
                                    style={{ gridColumn: '1 / -1', textAlign: 'center', marginTop: '20px' }}
                                >
                                    <button
                                        className="btn-create-empty"
                                        onClick={() => setVisibleCount((prev) => prev + 6)}
                                    >
                                        Cargar más proyectos
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Modal de proyecto — ModalProyecto existente sin modificar.
                    isOwner se calcula dentro de ModalProyecto comparando
                    localStorage con proyecto.usuarioId, así que si el
                    visitante no es el dueño, el botón "Editar" no aparece. */}
                <ModalProyecto
                    proyecto={proyectoSeleccionado}
                    resenas={resenasProyecto}
                    onClose={() => setProyectoSeleccionado(null)}
                    onReviewAdded={cargarDatos}
                />
            </div>

            <Footer />
        </div>
    );
}

export default PerfilVisitante;
