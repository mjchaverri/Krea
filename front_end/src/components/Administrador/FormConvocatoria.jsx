import React, { useState } from 'react'
import '../../styles/EstilosAdmin/Formularioconvo.css'
import Fetch from '../../services/Fetch'
import Swal from 'sweetalert2'

function FormConvocatoria() {
  const [nombre, setNombre]           = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [fechaLimite, setFechaLimite] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!nombre || !descripcion || !fechaLimite) {
      Swal.fire({ icon: 'warning', title: 'Campos incompletos', text: 'Por favor completa todos los campos.', confirmButtonColor: '#0ea5e9' })
      return
    }

    const usuarioActivo = JSON.parse(localStorage.getItem('UsuarioActivo') || '{}')
    if (!usuarioActivo.id) {
      Swal.fire({ icon: 'warning', title: 'Sesión requerida', text: 'Debes iniciar sesión para crear convocatorias.', confirmButtonColor: '#0ea5e9' })
      return
    }

    Swal.fire({ title: 'Creando convocatoria...', allowOutsideClick: false, didOpen: () => Swal.showLoading() })
    try {
      await Fetch.postData('convocatorias', {
        nombre,
        descripcion,
        fecha_cierre: fechaLimite,
        id_usuario:   usuarioActivo.id,
      })
      setNombre('')
      setDescripcion('')
      setFechaLimite('')
      Swal.fire({ icon: 'success', title: '¡Convocatoria creada!', text: 'La convocatoria fue publicada exitosamente.', confirmButtonColor: '#0ea5e9' })
    } catch (error) {
      const msg = error.errors?.length
        ? error.errors.map(e => e.msg).join('\n')
        : (error.message || 'Error al crear la convocatoria')
      Swal.fire({ icon: 'error', title: 'Error', text: msg, confirmButtonColor: '#0ea5e9' })
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
          <button className="submit-button" type="submit">
            Enviar Convocatoria
          </button>
        </div>
      </form>
    </div>
  )
}

export default FormConvocatoria
