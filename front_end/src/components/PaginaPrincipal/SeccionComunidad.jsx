import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/Principales/PaginaPrincipal.css';

const features = [
    {
        icon: 'fa-solid fa-comments',
        titulo: 'Chats con Creativos',
        desc: 'Conversa en tiempo real con diseñadores, desarrolladores y artistas. Comparte ideas, pide feedback y construye relaciones profesionales duraderas.',
    },
    {
        icon: 'fa-regular fa-calendar-check',
        titulo: 'Convocatorias de Empresas',
        desc: 'Las empresas publican oportunidades abiertas directamente en la plataforma. Postúlate con tu portafolio y lleva tu carrera al siguiente nivel.',
    },
];

function ComunidadMockup() {
    return (
        <div className="com-mockup">
            <div className="com-mockup-bar">
                <div className="com-mockup-avatar-row">
                    <div className="com-avatar com-avatar--blue" />
                    <span className="com-room-name">Diseñadores Krea</span>
                    <span className="com-room-count">142 miembros</span>
                </div>
            </div>

            <div className="com-mockup-body">
                {/* Mensajes */}
                <div className="com-msg">
                    <div className="com-avatar com-avatar--purple" />
                    <div className="com-msg-bubble">
                        <span className="com-msg-name">Ana Rivera</span>
                        <p>¿Alguien usó Grilla Doble para un portafolio de fotografía?</p>
                    </div>
                </div>

                <div className="com-msg com-msg--right">
                    <div className="com-msg-bubble com-msg-bubble--me">
                        <p>Sí, queda perfecto para galerías. Te comparto mi portafolio.</p>
                    </div>
                    <div className="com-avatar com-avatar--green" />
                </div>

                <div className="com-msg">
                    <div className="com-avatar com-avatar--orange" />
                    <div className="com-msg-bubble">
                        <span className="com-msg-name">Carlos M.</span>
                        <p>Hay un webinar esta semana sobre branding. ¡No se lo pierdan!</p>
                    </div>
                </div>

                {/* Card evento */}
                <div className="com-event-card">
                    <div className="com-event-badge">NUEVA CONVOCATORIA</div>
                    <p className="com-event-title">!Atención! Nueva convocatoria abierta:</p>
                    <div className="com-event-meta">
                        <i className="fa-regular fa-calendar" /> Hasta el 25 de Mayo
                    </div>
                    <button className="com-event-btn">Participar</button>
                </div>

                <div className="com-msg">
                    <div className="com-avatar com-avatar--blue" />
                    <div className="com-msg-bubble">
                        <span className="com-msg-name">Laura G.</span>
                        <p>Community Hackathon este sábado 🚀</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function SeccionComunidad() {
    const navigate = useNavigate();

    return (
        <section className="com-section">
            <div className="com-inner">
                <div className="com-right">
                    <ComunidadMockup />
                </div>
                <div className="com-left">
                    <span className="com-eyebrow">✦ Comunidad</span>
                    <h2 className="com-title">Conecta en nuestras<br />Comunidades</h2>
                    <p className="com-subtitle">
                        Únete a grupos de creativos, participa en chats en vivo y
                        accede a convocatorias exclusivas para potenciar tu carrera profesional.
                    </p>

                    <ul className="com-features">
                        {features.map(f => (
                            <li key={f.titulo} className="com-feature">
                                <div className="com-feature-icon">
                                    <i className={f.icon} />
                                </div>
                                <div className="com-feature-body">
                                    <h3 className="com-feature-titulo">{f.titulo}</h3>
                                    <p className="com-feature-desc">{f.desc}</p>
                                </div>
                            </li>
                        ))}
                    </ul>

                    <button className="com-btn" onClick={() => navigate('/Registro')}>
                        Explorar Comunidades
                    </button>
                </div>
            </div>
        </section>
    );
}

export default SeccionComunidad;
