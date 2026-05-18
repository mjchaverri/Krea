import React from 'react';
import { Link } from 'react-router-dom';
import "../../styles/Principales/Footer.css"

function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-main">

        {/* Columna 1: Marca */}
        <div className="footer-col footer-col--brand">
          <span className="footer-brand-name">Krea</span>
          <p className="footer-brand-desc">
            La plataforma para que los creativos muestren su talento, conecten con clientes y construyan su carrera profesional.
          </p>
          <div className="footer-socials">
            <a href="#" className="social-icon" aria-label="Facebook">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
            </a>
            <a href="#" className="social-icon" aria-label="Twitter">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
            </a>
            <a href="#" className="social-icon" aria-label="Instagram">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
            </a>
            <a href="#" className="social-icon" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect width="4" height="12" x="2" y="9"></rect><circle cx="4" cy="4" r="2"></circle></svg>
            </a>
          </div>
        </div>

        {/* Columna 2: Plataforma */}
        <div className="footer-col">
          <span className="footer-col-title">Plataforma</span>
          <ul className="footer-links">
            <li><Link to="/" className="footer-link">Inicio</Link></li>
            <li><Link to="/Registro" className="footer-link">Crear cuenta</Link></li>
            <li><Link to="/Login" className="footer-link">Iniciar sesión</Link></li>
            <li><a href="#" className="footer-link">Explorar portafolios</a></li>
            <li><a href="#" className="footer-link">Comunidades</a></li>
          </ul>
        </div>

        {/* Columna 3: Categorías */}
        <div className="footer-col">
          <span className="footer-col-title">Categorías</span>
          <ul className="footer-links">
            <li><a href="#" className="footer-link">Diseño y creatividad</a></li>
            <li><a href="#" className="footer-link">Fotografía y arte visual</a></li>
            <li><a href="#" className="footer-link">Desarrollo y tecnología</a></li>
            <li><a href="#" className="footer-link">Música y producción</a></li>
            <li><a href="#" className="footer-link">Ilustración</a></li>
          </ul>
        </div>

        {/* Columna 4: Contacto */}
        <div className="footer-col">
          <span className="footer-col-title">Contacto</span>
          <ul className="footer-links">
            <li><a href="mailto:hola@krea.com" className="footer-link">hola@krea.com</a></li>
            <li><a href="#" className="footer-link">Centro de ayuda</a></li>
            <li><a href="#" className="footer-link">Términos de uso</a></li>
            <li><a href="#" className="footer-link">Privacidad</a></li>
          </ul>
          <div className="footer-schedule-inline">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <span>Atención: 8:00 AM – 5:00 PM</span>
          </div>
        </div>

      </div>

      {/* Barra inferior */}
      <div className="footer-bottom">
        <span>© 2026 Krea. Todos los derechos reservados.</span>
      </div>
    </footer>
  );
}

export default Footer;
