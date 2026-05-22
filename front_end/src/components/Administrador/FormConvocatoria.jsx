import React, { useState, useEffect } from 'react'
import '../../styles/EstilosAdmin/Formularioconvo.css'
import Fetch from '../../services/Fetch'

function FormConvocatoria() {
  const [nombre, setNombre]           = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [fechaLimite, setFechaLimite] = useState('')
  const [cargando, setCargando]       = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!nombre || !descripcion || !fechaLimite) {
      alert("Por favor completa todos los campos")
      return
    }

    const usuarioActivo = JSON.parse(localStorage.getItem('UsuarioActivo') || '{}')
    if (!usuarioActivo.id) {
      alert("Debes iniciar sesión para crear convocatorias")
      return
    }

    setCargando(true)
    try {
      await Fetch.postData('convocatorias', {
        nombre,
        descripcion,
        fecha_cierre: fechaLimite,
        id_usuario:   usuarioActivo.id,
      })
      alert("Convocatoria creada exitosamente")
      setNombre('')
      setDescripcion('')
      setFechaLimite('')
    } catch (error) {
      if (error.errors && Array.isArray(error.errors)) {
        alert(error.errors.map(e => e.msg).join('\n'))
      } else {
        alert(error.message || "Error al crear la convocatoria")
      }
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="convocatoria-container">
      <form className="convocatoria-form" onSubmit={handleSubmit}>
        <h2 className="convocatoria-title">Crear Convocatoria</h2>
        <p className="convocatoria-subtitle">Completa los detalles para tu nueva convocatoria.</p>

        <div className="form-group">
          <label className="form-label">Nombre de la convocatoria</label>
          <input
            className="form-input"
            type="text"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            placeholder="Ej. Búsqueda de talentos 2026"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Descripción</label>
          <textarea
            className="form-textarea"
            value={descripcion}
            onChange={e => setDescripcion(e.target.value)}
            rows="4"
            placeholder="Describe los detalles y requisitos de la convocatoria..."
          ></textarea>
        </div>

        <div className="form-group">
          <label className="form-label">Fecha límite de inscripción</label>
          <input
            className="form-input"
            type="date"
            value={fechaLimite}
            onChange={e => setFechaLimite(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
          />
        </div>

        <div className="form-actions">
          <button className="submit-button" type="submit" disabled={cargando}>
            {cargando ? 'Enviando...' : 'Enviar Convocatoria'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default FormConvocatoria
