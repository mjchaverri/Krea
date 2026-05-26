import React, { useState, useEffect, useMemo } from 'react';
import ResenasPerfilUsuario from '../components/PerfilUsuario/ResenasPerfilUsuario';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar/Navbar';
import Footer from '../components/ApartadoPaginaPrincipal/Footer';
import InfoUsuario from '../components/PerfilUsuario/InfoUsuario';
import SeccionesPerfil from '../components/PerfilUsuario/SeccionesPerfil';
import CardProyecto from '../components/PerfilUsuario/CardProyecto';
import ModalProyecto from '../components/PerfilUsuario/ModalProyecto';
import Paginacion from '../components/Administrador/Paginacion';
import Fetch from '../services/Fetch';
import { normalizarPortafolio, normalizarResena, normalizarUsuario } from '../utils/normalizers';
import { calcularPromedio } from '../utils/calcularPromedio';

import '../styles/EstilosPerfilUsuario/PerfilUsuario.css';
import '../styles/EstilosPerfilUsuario/InfoUsuarios.css';
import '../styles/EstilosPerfilUsuario/ProyectosRecientes.css';
import '../styles/EstilosPerfilUsuario/ResenasUsuario.css';
import '../styles/EstilosPerfilUsuario/SeccionesPerfil.css';

const POR_PAGINA = 8;

function PerfilVisitante() {
    const { usuarioId } = useParams();
    const navigate      = useNavigate();

    const [usuario,              setUsuario]              = useState(null);
    const [portafolios,          setPortafolios]          = useState([]);
    const [todasResenas,         setTodasResenas]         = useState([]);
    const [cargando,             setCargando]             = useState(true);
    const [proyectoSeleccionado, setProyectoSeleccionado] = useState(null);
    const [pagina,               setPagina]               = useState(1);
    const [activeTab,            setActiveTab]            = useState('proyectos');
    const [resenasCount,         setResenasCount]         = useState(0);

    const cargarDatos = async () => {
        setCargando(true);
        try {
            const [resU, resP, resR] = await Promise.all([
                Fetch.getData(`usuarios/${usuarioId}`),
                Fetch.getData(`portafolios/usuario/${usuarioId}?limit=200`),
                Fetch.getData('resenas?limit=200'),
            ]);
            setUsuario(resU ? normalizarUsuario(resU) : null);
            setPortafolios((resP || []).map(normalizarPortafolio));
            setTodasResenas((resR || []).map(normalizarResena));
        } catch (error) {
            if (error.status === 401) { navigate('/iniciar-sesion'); return; }
            console.error('PerfilVisitante — error cargando datos:', error);
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => { cargarDatos(); }, [usuarioId]);

    const resenasProyecto = useMemo(() => {
        if (!proyectoSeleccionado) return [];
        return todasResenas.filter(r => r.portafolioId === proyectoSeleccionado.id);
    }, [proyectoSeleccionado, todasResenas]);

    const totalPaginas   = Math.max(1, Math.ceil(portafolios.length / POR_PAGINA));
    const portafoliosPag = portafolios.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA);

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
                    <button className="btn-create-empty" onClick={() => navigate('/todos-proyectos')} style={{ marginTop: '20px' }}>
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
                <button className="perfil-volver-btn" onClick={() => navigate(-1)}>← Volver</button>
                <span className="perfil-volver-txt">Perfil de <strong>{usuario.Nombre}</strong></span>
            </div>

            <div className="perfil-content">
                <InfoUsuario usuario={usuario} isOwner={false} onUpdate={null} />
            </div>

            <div className="secciones-perfil">
                <SeccionesPerfil
                    activeTab={activeTab}
                    onTabChange={(tab) => { setActiveTab(tab); setPagina(1); }}
                    resenasCount={resenasCount}
                />
            </div>

            {/* PROYECTOS */}
            {activeTab === 'proyectos' && (
                <div className="proyectos-container">
                    <div className="proyectos-header">
                        <h4>Proyectos de {usuario.Nombre}</h4>
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
                            portafoliosPag.map(proyecto => {
                                const resenasP = todasResenas.filter(r => r.portafolioId === proyecto.id);
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
                            })
                        )}
                    </div>

                    {portafolios.length > 0 && (
                        <div style={{ marginTop: '32px' }}>
                            <Paginacion
                                pagina={pagina}
                                totalPaginas={totalPaginas}
                                onChange={p => { setPagina(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                totalItems={portafolios.length}
                                itemsMostrados={portafoliosPag.length}
                            />
                        </div>
                    )}

                    <ModalProyecto
                        proyecto={proyectoSeleccionado}
                        resenas={resenasProyecto}
                        onClose={() => setProyectoSeleccionado(null)}
                        onReviewAdded={cargarDatos}
                    />
                </div>
            )}

            {/* RESEÑAS */}
            {activeTab === 'resenas' && (
                <div className="perfil-resenas">
                    <ResenasPerfilUsuario
                        usuarioId={usuarioId}
                        isOwner={false}
                        onCountChange={setResenasCount}
                    />
                </div>
            )}

            <Footer />
        </div>
    );
}

export default PerfilVisitante;
