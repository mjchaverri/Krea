import React from 'react'
import { Link } from 'react-router-dom'
import '../../styles/Explicacion/Explicacion.css'

function CompExplicacion() {
  return (
    <div className="explicacion-container">
      {/* Hero Section */}
      <section className="explicacion-hero">
        <div className="hero-content">
          <h1>Descubre y conecta con los mejores talentos</h1>
          <div className="hero-buttons">
            <button className="btn-primary">Crear mi portafolio</button>
            <button className="btn-secondary">Explorar Talentos &rsaquo;</button>
          </div>
        </div>
        <div className="hero-placeholder-img"></div>
      </section>

      <div className="explicacion-main-grid">
        {/* Left Column */}
        <div className="explicacion-left-col">
          {/* Portafolios Destacados */}
          <section className="section-card portafolios-destacados">
            <h2>Portafolios Destacados</h2>
            <div className="portafolios-grid-placeholder">
              <img src="https://www.arteescuela.com/wp-content/uploads/2022/05/cuadros-famosos-de-paisajes-1200x720.jpg" alt="" width={400} />
              <div className="img-placeholder" style={{ width: '100%', height: '200px', background: '#f0f0f0', borderRadius: '12px' }}></div>
            </div >
            <button className="btn-outline">Ver más &rsaquo;</button>
          </section >

          {/* Para Empresas & Reclutadores */}
          <section className="section-card empresas-reclutadores">
            <div className="section-flex">
              <div className="section-info">
                <h2>Para Empresas & Reclutadores</h2>
                <ul className="info-list">
                  <li><span className="icon">🔍</span> Encuentra el talento ideal</li>
                  <li><span className="icon">📞</span> Contacta con los talentos de inmediato</li>
                </ul>
              </div>
              <div className="section-img-placeholder">
                Imagen Empresas
              </div>
            </div>
          </section>

          {/* Blog & Recursos */}
          <section className="section-card blog-recursos">
            <div className="section-flex">
              <div className="section-info">
                <h2>¿Vas a crear tu portafolio?</h2>
                <ul className="link-list">
                  <li>
                    <Link to="/Consejos" style={{ textDecoration: 'none', color: 'inherit' }}>
                      &rsaquo; Consejos para tu portafolio
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="section-img-placeholder">
                Imagen Blog
              </div>
            </div>
          </section>
        </div>

        {/* Right Column / Sidebar */}
        < aside className="explicacion-sidebar" >
          {/* Categorías de Talento */}
          < section className="sidebar-section categories" >
            <h3>Categorías de Talento</h3>
            <ul className="category-list">
              <li><span className="cat-icon tech">💻</span> Tecnologías</li>
              <li><span className="cat-icon performance">💃</span> Bailes y Canto</li>
              <li><span className="cat-icon entertainment">🎭</span> Arte y entretenimiento</li>
              <li><span className="cat-icon education">📚</span> Educación</li>
            </ul>
          </section >

          {/* Reseñas & Valoraciones */}
          < section className="sidebar-section reviews" >
            <h3>Reseñas & Valoraciones</h3>
            <div className="review-card">
              <div className="review-header">
                <div className="avatar-placeholder">Avatar</div>
                <div>
                  <strong>Sofía Ramírez</strong>
                  <div className="stars">★★★★★</div>
                </div>
              </div>
              <p>Excelente profesional. Muy recomendable!</p>
              <div className="stars-mini">★★★★★</div>
            </div>
          </section >

          {/* Cómo Funciona */}
          < section className="sidebar-section how-it-works" >
            <h3>Cómo Funciona</h3>
            <div className="steps-container">
              <div className="step">
                <span className="step-num">1</span>
                <p>Crea tu perfil</p>
              </div>
              <span className="step-arrow">&rsaquo;</span>
              <div className="step">
                <span className="step-num">2</span>
                <p>Sube tu portafolio</p>
              </div>
              <span className="step-arrow">&rsaquo;</span>
              <div className="step">
                <span className="step-num">3</span>
                <p>Conecta con oportunidades!</p>
              </div>
            </div>
          </section>


          {/* Únete a la Plataforma */}
          < section className="sidebar-section join-platform" >
            <h3>Únete a la Plataforma</h3>
            <div className="join-buttons">
              <Link to="/perfil-usuario">
                <button className="btn-blue-dark">Registro Talentos &rsaquo;</button>
              </Link>
            </div>
          </section >

          {/* Contacto & Soporte */}
          < section className="sidebar-section contact-support" >
            <h3>Contacto & Soporte</h3>
            <div className="contact-links">
              <p><span className="icon">💬</span> Preguntas Frecuentes</p>
              <Link to="/pagina-contacto" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                <p style={{ margin: 0 }}><span className="icon">✉️</span> Escríbenos</p>
              </Link>
            </div>
            <div className="social-row">
              <div className="social-icons-left">
                <span className="soc-icon">T</span>
                <span className="soc-icon">A</span>
                <span className="soc-icon">L</span>
                <span className="soc-icon">E</span>
                <span className="soc-icon">N</span>
                <span className="soc-icon">T</span>
                <span className="soc-icon">O</span>
                <span className="soc-icon">S</span>
              </div>
            </div>
          </section >
        </aside >
      </div >
    </div >
  )
}

export default CompExplicacion
