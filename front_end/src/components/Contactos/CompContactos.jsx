import { useState } from "react";
import emailjs from "@emailjs/browser";
import '../../styles/Principales/Contactos.css'

const FormularioQuejas = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "infokreacr@gmail.com",
    telefono: "",
    ubicacion: "",
    tipo: "",
    mensaje: "",
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");

    try {
      await emailjs.send(
        "service_t3vpdvo",        // Service ID
        "template_stvj6cd",       // Template ID
        {
          nombre: formData.nombre,
          email: formData.email,
          telefono: formData.telefono,
          ubicacion: formData.ubicacion,
          tipo: formData.tipo,
          mensaje: formData.mensaje,
        },
        "YSCzzK0-G-HDbtBsR"        // Public Key
      );

      setStatus("Mensaje enviado correctamente ✅");
      setFormData({
        nombre: "",
        email: "infokreacr@gmail.com",
        telefono: "",
        ubicacion: "",
        tipo: "",
        mensaje: "",
      });
    } catch (error) {
      console.error(error);
      setStatus("Error al enviar el mensaje ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contactos-page-wrapper">
      <div className="contactos-container">
        
        {/* Panel lateral de información */}
        <div className="contactos-info-panel">
          <h2>Ponte en contacto</h2>
          <p>¿Tienes alguna duda, sugerencia o consulta? Queremos escucharte. Completa el formulario y nuestro equipo te responderá lo más pronto posible.</p>
          
          <div className="contactos-info-items">
            <div className="info-item">
              <span className="info-icon">📍</span>
              <span>SAN JOSE, COSTA RICA</span>
            </div>
            <div className="info-item">
              <span className="info-icon">✉️</span>
              <span>infokreacr@gmail.com</span>
            </div>
            <div className="info-item">
              <span className="info-icon">📞</span>
              <span>+506 8888 8888</span>
            </div>
          </div>
        </div>

        {/* Columna del formulario */}
        <div className="contactos-form-col">
          <form onSubmit={handleSubmit} className="contactos-form">
            <h2 className="contactos-title">Envíanos un mensaje</h2>

            <div className="input-row">
              <input
                type="text"
                name="nombre"
                placeholder="Nombre completo"
                value={formData.nombre}
                onChange={handleChange}
                required
                className="contactos-input"
              />

              <input
                type="tel"
                name="telefono"
                placeholder="Teléfono"
                value={formData.telefono}
                onChange={handleChange}
                className="contactos-input"
              />
            </div>

            <input
              type="email"
              name="email"
              placeholder="Correo electrónico"
              value={formData.email}
              readOnly
              required
              className="contactos-input"
            />

            <div className="input-row">
              <input
                type="text"
                name="ubicacion"
                placeholder="Ubicación"
                value={formData.ubicacion}
                onChange={handleChange}
                className="contactos-input"
              />

              <select
                name="tipo"
                value={formData.tipo}
                onChange={handleChange}
                required
                className="contactos-input"
              >
                <option value="">Tipo de mensaje</option>
                <option value="Queja">Queja</option>
                <option value="Sugerencia">Sugerencia</option>
                <option value="Consulta">Consulta</option>
              </select>
            </div>

            <textarea
              name="mensaje"
              placeholder="Escribe tu mensaje..."
              value={formData.mensaje}
              onChange={handleChange}
              required
              rows={5}
              className="contactos-textarea"
            />

            <button type="submit" disabled={loading} className="contactos-button">
              {loading ? "Enviando..." : "Enviar mensaje"}
            </button>

            {status && <p className="contactos-status">{status}</p>}
          </form>
        </div>
        
      </div>
    </div>
  );
};


export default FormularioQuejas;