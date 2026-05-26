import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Fetch from '../../services/Fetch';
import Swal from 'sweetalert2';
import '../../styles/Principales/NavBar.css';

function Navbar() {
    const [menuOpen, setMenuOpen]           = useState(false);
    const [userImg, setUserImg]             = useState(null);
    const [userName, setUserName]           = useState(null);
    const [isAdmin, setIsAdmin]             = useState(false);
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
                setUserName(user.Nombre || user.nombre_usuario || null);
                setIsAdmin(user.id_rol === 1);
            }
        } catch {}
    }, []);

    /* ── Helpers para IDs descartados/participados (persistidos por usuario) ── */
    const getDescartados = (userId) => {
        try { return new Set(JSON.parse(localStorage.getItem(`convo_vistas_${userId}`) || '[]')); }
        catch { return new Set(); }
    };
    const addDescartado = (userId, id) => {
        const set = getDescartados(userId);
        set.add(id);
        localStorage.setItem(`convo_vistas_${userId}`, JSON.stringify([...set]));
    };

    /* ── Convocatorias — solo de comunidades en las que el usuario está ── */
    useEffect(() => {
        const cargar = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('UsuarioActivo') || 'null');
                if (!user?.id) { setConvocatorias([]); return; }

                const descartados = getDescartados(user.id);

                const [convos, memberships] = await Promise.all([
                    Fetch.getData('convocatorias?limit=50'),
                    Fetch.getData(`miembros/usuario/${user.id}`),
                ]);

                const comunidadIds = new Set((memberships || []).map(m => m.id_comunidad));
                const filtradas = (convos || []).filter(c =>
                    !descartados.has(c.id_convocatoria) &&
                    (!c.id_comunidad || comunidadIds.has(c.id_comunidad))
                );
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

    const descartarConvocatoria = (id) => {
        const user = JSON.parse(localStorage.getItem('UsuarioActivo') || 'null');
        if (user?.id) addDescartado(user.id, id);
        setConvocatorias(prev => prev.filter(c => c.id_convocatoria !== id));
    };

    const handleVerDetalles = (conv) => {
        const fecha = conv.fecha_cierre
            ? new Date(conv.fecha_cierre + 'T12:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
            : null;
        Swal.fire({
            title: conv.nombre,
            html: `
                ${conv.descripcion ? `<p style="text-align:left;font-size:14px;color:#374151;line-height:1.6;margin:0 0 14px">${conv.descripcion}</p>` : ''}
                ${fecha ? `<div style="display:flex;align-items:center;gap:6px;font-size:13px;color:#64748b">📅 Cierre: <strong>${fecha}</strong></div>` : ''}
            `,
            confirmButtonText: 'Cerrar',
            confirmButtonColor: '#0ea5e9',
        });
    };

    const handleParticipar = async (conv) => {
        if (!localStorage.getItem('token')) {
            Swal.fire({ icon: 'info', title: 'Inicia sesión', text: 'Debes iniciar sesión para participar.', confirmButtonColor: '#0ea5e9' });
            return;
        }
        try {
            await Fetch.postData(`convocatorias/${conv.id_convocatoria}/participar`, {});
            Swal.fire({ icon: 'success', title: '¡Inscripción exitosa!', text: `Te inscribiste en: ${conv.nombre}`, confirmButtonColor: '#0ea5e9', timer: 2000, showConfirmButton: false });
        } catch (err) {
            const msg = err.message || '';
            if (!(msg.toLowerCase().includes('ya estás') || err.status === 409)) {
                Swal.fire({ icon: 'error', title: 'Error', text: msg, confirmButtonColor: '#0ea5e9' });
                return;
            }
        }
        // éxito o ya estaba inscrito → descartar la notificación y notificar tarjetas abiertas
        descartarConvocatoria(conv.id_convocatoria);
        window.dispatchEvent(new CustomEvent('convo-participada', { detail: { convoId: conv.id_convocatoria } }));
    };

    const handleIrAlChat = (conv) => {
        setBellOpen(false);
        navigate('/comunidades', { state: { abrirComunidadId: conv.id_comunidad } });
    };

    const navLinks = [
        { to: '/principal',       label: 'Inicio' },
        { to: '/todos-proyectos', label: 'Proyectos' },
        { to: '/comunidades',     label: 'Comunidades' },
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
                    {isAdmin && (
                        <button
                            className="pn-btn-crear"
                            onClick={() => navigate('/Admin')}
                            style={{ background: '#7c3aed', borderColor: '#7c3aed' }}
                        >
                            <span className="material-symbols-outlined" style={{ fontSize: '15px', verticalAlign: 'middle' }}>shield_person</span> Panel Admin
                        </button>
                    )}
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
                                    <span>Convocatorias</span>
                                    <button className="pn-notif-close" onClick={() => setBellOpen(false)}>
                                        <i className="fa-solid fa-xmark" />
                                    </button>
                                </div>
                                <div className="pn-notif-body">
                                    {convocatorias.length === 0 ? (
                                        <p className="pn-notif-empty">No hay convocatorias nuevas.</p>
                                    ) : (
                                        convocatorias.map(conv => (
                                            <div key={conv.id_convocatoria} className="pn-notif-item">
                                                <div className="pn-notif-item__head">
                                                    <span className="pn-notif-badge">📢 Convocatoria</span>
                                                    <button className="pn-notif-item__dismiss" title="Descartar" onClick={() => descartarConvocatoria(conv.id_convocatoria)}>
                                                        <i className="fa-solid fa-xmark" />
                                                    </button>
                                                </div>
                                                <p className="pn-notif-nombre">{conv.nombre}</p>
                                                {conv.descripcion && (
                                                    <p className="pn-notif-desc">
                                                        {conv.descripcion.length > 80 ? conv.descripcion.slice(0, 80) + '…' : conv.descripcion}
                                                    </p>
                                                )}
                                                {conv.fecha_cierre && (
                                                    <p className="pn-notif-meta">
                                                        📅 Cierre: {new Date(conv.fecha_cierre + 'T12:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                    </p>
                                                )}
                                                <div className="pn-notif-actions">
                                                    <button className="pn-notif-btn pn-notif-btn--ver" onClick={() => handleVerDetalles(conv)}>
                                                        Ver detalles
                                                    </button>
                                                    <button className="pn-notif-btn pn-notif-btn--participar" onClick={() => handleParticipar(conv)}>
                                                        Participar
                                                    </button>
                                                    {conv.id_comunidad && (
                                                        <button className="pn-notif-btn pn-notif-btn--chat" onClick={() => handleIrAlChat(conv)}>
                                                            Ir al chat
                                                        </button>
                                                    )}
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
