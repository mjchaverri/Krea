import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/Principales/InicioPagina.css';
import chatImg from '../../imagenes/Gemini_Generated_Image_4eineq4eineq4ein.png';

function SeccionComunidad() {
    const navigate = useNavigate();

    return (
        <section className="ComunidadSection">
            <div className="ComunidadContent">
                <h2 className="ComunidadTitle">
                    Conecta en nuestras<br />Comunidades
                </h2>
                <p className="ComunidadDesc">
                    Conéctate con otros creativos en tiempo real, descubre oportunidades publicadas por empresas y lleva tu carrera al siguiente nivel dentro de nuestra comunidad.
                </p>

                <div className="ComunidadFeatures">
                    <div className="ComunidadFeatureRow">
                        <div className="ComunidadFeatureIcon">
                            <i className="fa-solid fa-users"></i>
                        </div>
                        <div>
                            <p className="ComunidadFeatureTitle">Chats con Creativos</p>
                            <p className="ComunidadFeatureText">Conversa en tiempo real con otros creativos, comparte ideas y construye relaciones profesionales.</p>
                        </div>
                    </div>
                    <div className="ComunidadFeatureRow">
                        <div className="ComunidadFeatureIcon">
                            <i className="fa-regular fa-calendar-check"></i>
                        </div>
                        <div>
                            <p className="ComunidadFeatureTitle">Convocatorias de Empresas</p>
                            <p className="ComunidadFeatureText">Las empresas publican convocatorias abiertas en las que puedes postularte y mostrar tu talento.</p>
                        </div>
                    </div>
                </div>

                <button className="ComunidadBtn" onClick={() => navigate('/Registro')}>
                    Explorar Comunidades
                </button>
            </div>

            <div className="ComunidadImagen">
                <img src={chatImg} alt="Comunidad Krea" />
            </div>
        </section>
    );
}

export default SeccionComunidad;
