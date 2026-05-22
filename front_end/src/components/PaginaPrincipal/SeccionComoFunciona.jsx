import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/Principales/PaginaPrincipal.css';

const pasos = [
    {
        num: '01',
        icon: 'fa-solid fa-table-cells-large',
        titulo: 'Elige una estructura',
        desc: 'Selecciona entre múltiples plantillas de layout prediseñadas: bloques de imagen, grillas dobles, secciones de texto y más. Tu lienzo en blanco se transforma en segundos.',
    },
    {
        num: '02',
        icon: 'fa-solid fa-pen-to-square',
        titulo: 'Personaliza tu contenido',
        desc: 'Sube tus imágenes, escribe tus textos y ajusta cada elemento con total libertad. El editor en línea te permite ver los cambios en tiempo real sin necesidad de exportar nada.',
    },
    {
        num: '03',
        icon: 'fa-solid fa-share-nodes',
        titulo: 'Publica y llega a clientes',
        desc: 'Con un clic tu portafolio queda visible en Krea. Recibe reseñas, acumula valoraciones y aparece en las búsquedas de quienes buscan exactamente tu talento.',
    },
];

function EditorMockup() {
    return (
        <div className="cf-mockup">
            <div className="cf-mockup-bar">
                <span className="cf-dot cf-dot--red" />
                <span className="cf-dot cf-dot--yellow" />
                <span className="cf-dot cf-dot--green" />
               
            </div>

            <div className="cf-mockup-canvas">
                <div className="cf-mockup-toolbar">
                    <div className="cf-toolbar-block cf-toolbar-block--img">
                        <i className="fa-regular fa-image" />
                    </div>
                    <div className="cf-toolbar-block">
                        <i className="fa-solid fa-heading" />
                    </div>
                    <div className="cf-toolbar-block">
                        <i className="fa-solid fa-table-columns" />
                    </div>
                    <div className="cf-toolbar-block">
                        <i className="fa-solid fa-grip" />
                    </div>
                </div>

                <div className="cf-mockup-lienzo">
                    <div className="cf-lienzo-hero">
                        <div className="cf-lienzo-img-placeholder">
                            <i className="fa-regular fa-image" />
                        </div>
                        <div className="cf-lienzo-text-col">
                            <div className="cf-lienzo-line cf-lienzo-line--title" />
                            <div className="cf-lienzo-line cf-lienzo-line--sub" />
                            <div className="cf-lienzo-line cf-lienzo-line--sub cf-lienzo-line--short" />
                            <div className="cf-lienzo-btn" />
                        </div>
                    </div>
                    <div className="cf-lienzo-grid">
                        <div className="cf-lienzo-card">
                            <div className="cf-lienzo-card-img" />
                            <div className="cf-lienzo-line cf-lienzo-line--card-title" />
                            <div className="cf-lienzo-line cf-lienzo-line--card-sub" />
                        </div>
                        <div className="cf-lienzo-card">
                            <div className="cf-lienzo-card-img" style={{ background: '#bae6fd' }} />
                            <div className="cf-lienzo-line cf-lienzo-line--card-title" />
                            <div className="cf-lienzo-line cf-lienzo-line--card-sub" />
                        </div>
                        <div className="cf-lienzo-card">
                            <div className="cf-lienzo-card-img" style={{ background: '#c7d2fe' }} />
                            <div className="cf-lienzo-line cf-lienzo-line--card-title" />
                            <div className="cf-lienzo-line cf-lienzo-line--card-sub" />
                        </div>
                    </div>
                </div>

                <div className="cf-mockup-add">
                    <i className="fa-solid fa-plus" /> Añade una plantilla
                </div>
            </div>
        </div>
    );
}

function SeccionComoFunciona() {
    const navigate = useNavigate();

    return (
        <section className="cf-section">
            <div className="cf-inner">
                <div className="cf-left">
                    <span className="cf-eyebrow">✦ Editor de portafolios</span>
                    <h2 className="cf-title">Cómo funciona<br />el Editor</h2>
                    <p className="cf-subtitle">
                        Crea tu portafolio profesional en minutos con nuestro editor
                        visual intuitivo. Sin código, sin complicaciones.
                    </p>

                    <ol className="cf-steps">
                        {pasos.map(paso => (
                            <li key={paso.num} className="cf-step">
                                <div className="cf-step-icon">
                                    <i className={paso.icon} />
                                </div>
                                <div className="cf-step-body">
                                    <h3 className="cf-step-titulo">
                                        <span className="cf-step-num">{paso.num}</span>
                                        {paso.titulo}
                                    </h3>
                                    <p className="cf-step-desc">{paso.desc}</p>
                                </div>
                            </li>
                        ))}
                    </ol>

                    <button
                        className="cf-btn"
                        onClick={() => navigate('/portafolio')}
                    >
                        Comenzar a Editar
                    </button>
                </div>

                <div className="cf-right">
                    <EditorMockup />
                </div>
            </div>
        </section>
    );
}

export default SeccionComoFunciona;
