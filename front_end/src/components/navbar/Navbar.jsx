import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Fetch from '../../services/Fetch';
import '../../styles/Principales/NavBar.css';

function Navbar() {
    const [menuOpen, setMenuOpen]           = useState(false);
    const [userImg, setUserImg]             = useState(null);
    const [userName, setUserName]           = useState(null);
    const [bellOpen, setBellOpen]           = useState(false);
    const [convocatorias, setConvocatorias] = useState([]);
    const bellRef                           = useRef(null);
    const location                          = useLocation();
    const navigate                          = useNavigate();

    /* ── Usuario activo ── */
    useEffect(() => {
        try {
            const raw = localStorage.getItem('UsuarioActivo');
            if (raw) {
                const user = JSON.parse(raw);
                setUserImg(user.img || null);
                setUserName(user.Nombre || null);
            }
        } catch {}
    }, []);

    /* ── Convocatorias ── */
    useEffect(() => {
        const cargar = async () => {
            try {
                const raw = localStorage.getItem('UsuarioActivo');
                const user = raw ? JSON.parse(raw) : null;

                const [todasConvocatorias, todasRespuestas] = await Promise.all([
                    Fetch.getData('convocatorias'),
                    Fetch.getData('respuestas_convocatorias'),
                ]);

                const filtradas = (todasConvocatorias || []).filter(conv => {
                    if (!user) return true;
                    return !(todasRespuestas || []).some(
                        r => r.idConvocatoria === conv.id && r.usuarioNombre === user.Nombre
                    );
                });
                setConvocatorias(filtradas);
            } catch (e) {
                console.error('Error cargando convocatorias:', e);
            }
        };
        cargar();
    }, []);

    /* ── Cerrar panel al hacer clic fuera ── */
    useEffect(() => {
        const handleClick = (e) => {
            if (bellRef.current && !bellRef.current.contains(e.target)) {
                setBellOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const responder = async (id, respuesta) => {
        try {
            const raw = localStorage.getItem('UsuarioActivo');
            const user = raw ? JSON.parse(raw) : { Nombre: 'Usuario desconocido' };
            const conv = convocatorias.find(c => c.id === id);

            await Fetch.postData({
                idConvocatoria:     id,
                usuarioNombre:      user.Nombre,
                convocatoriaNombre: conv?.nombre || '',
                respuesta,
                fecha: new Date().toLocaleString(),
            }, 'respuestas_convocatorias');

            setConvocatorias(prev => prev.filter(c => c.id !== id));
        } catch (e) {
            console.error('Error al responder:', e);
        }
    };

    const navLinks = [
        { to: '/principal',       label: 'Inicio' },
        { to: '/todos-proyectos', label: 'Proyectos' },
        { to: '/pagina-contacto', label: 'Contactos' },
        { to: '/sobre-nosotros',  label: 'Sobre Nosotros' },
        { to: '/Funcionalidad',   label: 'Cómo Funciona' },
    ];

    return (
        <header className="pn-header">
            <nav className="pn-nav">

                {/* Logo */}
                <Link to="/principal" className="pn-brand">Krea</Link>

                {/* Links centro */}
                <ul className={`pn-links ${menuOpen ? 'pn-links--open' : ''}`}>
                    {navLinks.map(link => (
                        <li key={link.to}>
                            <Link
                                to={link.to}
                                className={`pn-link ${location.pathname === link.to ? 'pn-link--active' : ''}`}
                                onClick={() => setMenuOpen(false)}
                            >
                                {link.label}
                            </Link>
                        </li>
                    ))}
                </ul>

                {/* Derecha */}
                <div className="pn-right">
                    <button className="pn-btn-crear" onClick={() => navigate('/portafolio')}>
                        <span>+</span> Crear proyecto
                    </button>

                    {/* Campana con panel */}
                    <div className="pn-bell-wrapper" ref={bellRef}>
                        <button
                            className="pn-bell"
                            aria-label="Notificaciones"
                            onClick={() => setBellOpen(o => !o)}
                        >
                            <i className="fa-regular fa-bell" />
                            {convocatorias.length > 0 && (
                                <span className="pn-bell-badge">{convocatorias.length}</span>
                            )}
                        </button>

                        {bellOpen && (
                            <div className="pn-notif-panel">
                                <div className="pn-notif-header">
                                    <span>Notificaciones</span>
                                    <button className="pn-notif-close" onClick={() => setBellOpen(false)}>
                                        <i className="fa-solid fa-xmark" />
                                    </button>
                                </div>
                                <div className="pn-notif-body">
                                    {convocatorias.length === 0 ? (
                                        <p className="pn-notif-empty">No hay notificaciones nuevas.</p>
                                    ) : (
                                        convocatorias.map(conv => (
                                            <div key={conv.id} className="pn-notif-item">
                                                <p className="pn-notif-nombre">{conv.nombre}</p>
                                                <p className="pn-notif-desc">{conv.descripcion}</p>
                                                <div className="pn-notif-actions">
                                                    <button
                                                        className="pn-notif-accept"
                                                        onClick={() => responder(conv.id, 'Participar')}
                                                    >
                                                        Participar
                                                    </button>
                                                    <button
                                                        className="pn-notif-decline"
                                                        onClick={() => responder(conv.id, 'No participar')}
                                                    >
                                                        No
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Avatar */}
                    <Link to="/perfil-usuario" className="pn-avatar">
                        {userImg
                            ? <img src={userImg} alt="Perfil" />
                            : <i className="fa-solid fa-user" />
                        }
                    </Link>
                </div>

                {/* Toggle móvil */}
                <button
                    className={`pn-toggle ${menuOpen ? 'pn-toggle--open' : ''}`}
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Menú"
                >
                    <span /><span /><span />
                </button>

            </nav>
        </header>
    );
}

export default Navbar;
