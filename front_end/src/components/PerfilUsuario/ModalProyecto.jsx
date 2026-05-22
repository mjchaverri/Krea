import "../../styles/EstilosPerfilUsuario/ModalProyecto.css";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Lienzo from "../PlantillaTalentos/Lienzo";
import Estructura1 from "../PlantillaTalentos/Estructura1";
import Estructura1_1 from "../PlantillaTalentos/Estructura1_1";
import Estructura1_2 from "../PlantillaTalentos/Estructura1_2";
import Estructura1_3 from "../PlantillaTalentos/Estructura1_3";
import Estructura1_4 from "../PlantillaTalentos/Estructura1_4";
import GrillaDoble from "../PlantillaTalentos/GrillaDoble";
import GrillaTriple from "../PlantillaTalentos/GrillaTriple";
import Grilla1_2_Izda from "../PlantillaTalentos/Grilla1_2_Izda";
import Grilla1_2_Derecha from "../PlantillaTalentos/Grilla1_2_Derecha";
import Fetch from "../../services/Fetch";
import { normalizarUsuario } from "../../utils/normalizers";
import { calcularPromedio } from "../../utils/calcularPromedio";

const CONTENEDORES = {
    Estructura1, Estructura1_1, Estructura1_2, Estructura1_3, Estructura1_4,
    GrillaDoble, GrillaTriple, Grilla1_2_Izda, Grilla1_2_Derecha,
};

function StarPicker({ value, onChange }) {
    const [hover, setHover] = useState(0);
    return (
        <div className="resena-star-picker">
            {[1, 2, 3, 4, 5].map(n => (
                <button
                    key={n}
                    type="button"
                    className={n <= (hover || value) ? 'filled' : ''}
                    onMouseEnter={() => setHover(n)}
                    onMouseLeave={() => setHover(0)}
                    onClick={() => onChange(n)}
                >
                    <i className="fa-solid fa-star" />
                </button>
            ))}
        </div>
    );
}

function RatingStars({ rating, size = '0.85rem' }) {
    return (
        <div className="modal-rating-stars">
            {[1, 2, 3, 4, 5].map(n => (
                <i
                    key={n}
                    className={`fa-${n <= Math.round(rating) ? 'solid' : 'regular'} fa-star${n > Math.round(rating) ? ' empty' : ''}`}
                    style={{ fontSize: size }}
                />
            ))}
        </div>
    );
}

function ModalProyecto({ proyecto, resenas = [], onClose, onReviewAdded }) {
    const [nuevaResena, setNuevaResena]         = useState({ comentario: '', rating: 5 });
    const [loading, setLoading]                 = useState(false);
    const [usuarioContacto, setUsuarioContacto] = useState(null);
    const [contactarVisible, setContactarVisible] = useState(false);
    const [usuarios, setUsuarios]               = useState([]);
    const navigate = useNavigate();
    const modalLeftRef = useRef(null);

    let usuarioActivo = {};
    try { usuarioActivo = JSON.parse(localStorage.getItem('UsuarioActivo')) || {}; } catch {}

    useEffect(() => {
        const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    useEffect(() => {
        if (modalLeftRef.current) modalLeftRef.current.scrollTop = 0;
    }, [proyecto]);

    useEffect(() => {
        Fetch.getData('usuarios?limit=100').then(data => {
            const lista = (data || []).map(normalizarUsuario);
            setUsuarios(lista);
            if (proyecto?.usuarioId) {
                const u = lista.find(u => String(u.id) === String(proyecto.usuarioId));
                setUsuarioContacto(u || null);
            }
        }).catch(console.error);
    }, [proyecto?.usuarioId]);

    const getUserInfo = (usuarioId) => {
        const u = usuarios.find(u => String(u.id) === String(usuarioId));
        return { nombre: u?.Nombre || 'Usuario', img: u?.img || null };
    };

    if (!proyecto) return null;

    const resenasFiltradas = (proyecto?.id && resenas)
        ? resenas.filter(r => String(r.portafolioId) === String(proyecto.id))
        : [];

    const promedio = calcularPromedio(resenasFiltradas);
    const isOwner  = String(usuarioActivo.id) === String(proyecto.usuarioId);
    const yaReseno = usuarioActivo.id
        ? resenasFiltradas.some(r => String(r.usuarioId) === String(usuarioActivo.id))
        : false;

    const handleEnviarResena = async () => {
        if (!nuevaResena.comentario.trim()) return;
        if (yaReseno) { alert('Ya dejaste una reseña en este proyecto.'); return; }
        setLoading(true);
        try {
            await Fetch.postData('resenas', {
                id_usuario:    usuarioActivo.id,
                id_portafolio: proyecto.id,
                comentarios:   nuevaResena.comentario,
                calificacion:  nuevaResena.rating,
            });
            if (onReviewAdded) await onReviewAdded();
            setNuevaResena({ comentario: '', rating: 5 });
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    const renderComponentes = () => {
        if (!proyecto.componentes) return null;
        return proyecto.componentes.map((comp, i) => {
            const type = typeof comp === 'string' ? comp : comp.type;
            const data = typeof comp === 'object' ? comp.data : null;
            const Comp = CONTENEDORES[type];
            return Comp ? <Comp key={i} initialData={data} /> : null;
        });
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>

                <button className="modal-close" onClick={onClose}>×</button>

                <div className="modal-split">

                    {/* ── Izquierda: portafolio ── */}
                    <div className="modal-left" ref={modalLeftRef}>
                        {isOwner && (
                            <div className="modal-edit-bar">
                                <button
                                    className="modal-btn-edit"
                                    onClick={() => { onClose(); navigate('/portafolio', { state: { proyectoEditando: proyecto } }); }}
                                >
                                    <i className="fa-solid fa-pen" /> Editar proyecto
                                </button>
                            </div>
                        )}
                        <div className="lienzo-modal-container">
                            {proyecto.imgPortada && (!proyecto.componentes || proyecto.componentes.length === 0) ? (
                                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', borderRadius: 8, overflow: 'hidden' }}>
                                    <img
                                        src={proyecto.imgPortada}
                                        alt={proyecto.titulo}
                                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                    />
                                </div>
                            ) : (
                                <div style={{ pointerEvents: 'none' }} inert="">
                                    <Lienzo
                                        tituloProyecto={proyecto.titulo}
                                        descripcionProyecto={proyecto.descripcion}
                                        childrenEstructura={<>{renderComponentes()}</>}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ── Derecha: reseñas ── */}
                    <div className="modal-right">

                        <div className="modal-right-header">
                            <h3 className="modal-right-title">Reseñas</h3>
                            <div className="modal-right-rating">
                                <RatingStars rating={Number(promedio)} />
                                <span className="modal-rating-num">{promedio}</span>
                                <span className="modal-rating-count">
                                    ({resenasFiltradas.length} reseña{resenasFiltradas.length !== 1 ? 's' : ''})
                                </span>
                            </div>
                        </div>

                        <div className="resenas-lista">
                            {resenasFiltradas.length === 0 ? (
                                <p className="resenas-vacio">Este proyecto aún no tiene reseñas. ¡Sé el primero!</p>
                            ) : (
                                resenasFiltradas.map((r, i) => {
                                    const { nombre, img } = getUserInfo(r.usuarioId);
                                    return (
                                        <div key={i} className="resena-item">
                                            <div className="resena-autor">
                                                <div className="resena-avatar">
                                                    {img
                                                        ? <img src={img} alt={nombre} />
                                                        : <i className="fa-solid fa-user" />
                                                    }
                                                </div>
                                                <div>
                                                    <span className="resena-nombre">{nombre}</span>
                                                    <span className="resena-fecha">{new Date(r.fecha).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                            <div className="resena-stars">
                                                {[1,2,3,4,5].map(n => (
                                                    <i key={n} className={`fa-${n <= r.rating ? 'solid' : 'regular'} fa-star${n > r.rating ? ' empty' : ''}`} />
                                                ))}
                                            </div>
                                            <p className="resena-comentario">{r.comentario}</p>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        <div className="resena-form">
                            <p className="resena-form-title">Dejar una reseña</p>
                            {yaReseno ? (
                                <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '8px 0' }}>Ya dejaste una reseña en este proyecto.</p>
                            ) : (
                                <>
                                    <StarPicker
                                        value={nuevaResena.rating}
                                        onChange={rating => setNuevaResena(prev => ({ ...prev, rating }))}
                                    />
                                    <textarea
                                        placeholder="Escribe tu opinión sobre este proyecto..."
                                        value={nuevaResena.comentario}
                                        onChange={e => setNuevaResena(prev => ({ ...prev, comentario: e.target.value }))}
                                        disabled={loading}
                                    />
                                    <button
                                        className="resena-form-btn"
                                        disabled={loading || !nuevaResena.comentario.trim()}
                                        onClick={handleEnviarResena}
                                    >
                                        {loading ? 'Enviando...' : 'Publicar reseña'}
                                    </button>
                                </>
                            )}
                        </div>

                        <div className="modal-contacto">
                            <button
                                className="modal-btn-contactar"
                                onClick={() => setContactarVisible(v => !v)}
                            >
                                {contactarVisible ? 'Ocultar contacto' : 'Contactar al autor'}
                            </button>
                            {contactarVisible && (
                                <div className="modal-contacto-info">
                                    <p><strong>Correo:</strong> {usuarioContacto?.email || usuarioContacto?.Correo || 'No disponible'}</p>
                                    <p><strong>Teléfono:</strong> {usuarioContacto?.telefono || usuarioContacto?.Telefono || 'No disponible'}</p>
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default ModalProyecto;
