import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/Principales/InicioPagina.css';
import foto1 from '../../imagenes/foto1.png';
import ProjectShowcase from './ProjectShowcase';
import SeccionComunidad from '../PaginaPrincipal/SeccionComunidad';

function Main() {
  const navigate = useNavigate();
  const showcaseRef = useRef(null);

  const ircuenta = () => {
    navigate("Registro");
  };

  const scrollToShowcase = () => {
    showcaseRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main>
      <div className='HeroWrapper'>
        
        {/* Div de presentacion de la pagina */}
        <div className='DivPresentacion'>
          <div className='Descripcion'>
            <div className='EliteBadge'>ÚNETE A LA COMUNIDAD CREATIVA</div>
            <h1 className='HeroTitle'>
              Destaca tu talento <br />
              <span className='HeroAccent'>ante el mundo</span>
            </h1>
            <p className='HeroDescription'>
              Sube tus proyectos, conecta con clientes potenciales y construye un portafolio profesional en minutos. La plataforma definitiva para que los creativos sean descubiertos.
            </p>
            <div className='HeroButtons'>
              <button className='BtnPrimary' onClick={ircuenta}>
                Empieza ahora <span className='ArrowIcon'>→</span>
              </button>
              <button className='BtnSecondary' onClick={scrollToShowcase}>
                Ver ejemplos
              </button>
            </div>
          </div>
          <div className='DivImagen'>
            <div className='ImageContainer'>
              <img className='ImagenPrincipal' src={foto1} alt="Portfolio grid mockup" />
            </div>
          </div>
        </div>
      </div>

      {/* New Project Showcase Section */}
      <ProjectShowcase showcaseRef={showcaseRef} />

      {/* Div para descripcion + cards */}
      <div className='DivDescrip'>
        <span className='DescripEyebrow'>✦ Por qué Krea</span>
        <h2 className='SubTituloDescrip'>Impulsa tu talento</h2>
        <p className='ParrafoDescrip'>Da el primer paso para destacar tu talento.
          Crea tu perfil en minutos, muestra lo que sabes hacer y conecta con personas que están buscando exactamente habilidades como las tuyas.
          Nuestra plataforma está diseñada para ayudarte a crecer, ganar visibilidad y convertir tu talento en nuevas oportunidades profesionales desde el primer día.</p>

        <div className='FeaturesContainer'>
          <div className='FeatureCard'>
            <div className='FeatureIcon'>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
            </div>
            <h3 className='FeatureTitle'>Muestra tu trabajo</h3>
            <p className='FeatureText'>Exhibe tus proyectos con una calidad visual impresionante. Sube tu portafolio de talentos y demuestra tus habilidades al mundo.</p>
          </div>
          <div className='FeatureCard'>
            <div className='FeatureIcon'>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            </div>
            <h3 className='FeatureTitle'>Conecta con expertos</h3>
            <p className='FeatureText'>Entra en contacto directo con líderes de la industria y clientes potenciales que buscan talento como el tuyo.</p>
          </div>
          <div className='FeatureCard'>
            <div className='FeatureIcon'>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72Z"></path><path d="m14 7 3 3"></path><path d="M5 6v4"></path><path d="M19 14v4"></path><path d="M10 2v2"></path><path d="M7 8H3"></path><path d="M21 16h-4"></path><path d="M11 3H9"></path></svg>
            </div>
            <h3 className='FeatureTitle'>Portafolios Inteligentes</h3>
            <p className='FeatureText'>Crea una presencia online profesional de forma rápida con nuestro constructor intuitivo. Personalización total en clics.</p>
          </div>
        </div>
      </div>

      {/* Sección Comunidades */}
      <SeccionComunidad />
    </main>
  );
}

export default Main;
