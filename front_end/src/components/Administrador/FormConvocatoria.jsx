import React, { useState, useEffect } from 'react'
import '../../styles/EstilosAdmin/Formularioconvo.css'
import Fetch from '../../services/Fetch'

function FormConvocatoria() {
  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [comunidadId, setComunidadId] = useState('')
  const [comunidades, setComunidades] = useState([])
  const [fechaLimite, setFechaLimite] = useState('')

  useEffect(() => {
    const cargarComunidades = async () => {
      try {
        const coms = await Fetch.getData('comunidades')
        setComunidades(coms || [])
      } catch (error) {
        console.error("Error al cargar comunidades:", error)
      }
    }
    cargarComunidades()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if(!nombre || !descripcion || !comunidadId || !fechaLimite) {
      alert("Por favor completa todos los campos")
      return
    }

    const comunidadSeleccionada = comunidades.find(c => c.id === comunidadId)
    const usuarioActivo = JSON.parse(localStorage.getItem('UsuarioActivo') || '{}')

    const nuevaConvocatoria = {
      nombre,
      descripcion,
      comunidadId: comunidadId,
      comunidadNombre: comunidadSeleccionada ? comunidadSeleccionada.nombre : '',
      fecha: new Date().toISOString(),
      fechaLimite
    }

    try {
      // 1. Crear la convocatoria y obtener la respuesta con el ID
      const convocatoriaCreada = await Fetch.postData(nuevaConvocatoria, "convocatorias")

      // 2. Crear un mensaje automático en la comunidad seleccionada
      const mensajeConvocatoria = {
        comunidadId: comunidadId,
        usuarioId: usuarioActivo.id || "admin",
        usuarioNombre: "📢 Sistema KREA",
        texto: `¡Nueva convocatoria disponible!\n\n**${nombre}**\n${descripcion}\n\n**Fecha límite:** ${fechaLimite}`,
        fecha: new Date().toISOString(),
        esConvocatoria: true,
        convocatoriaId: convocatoriaCreada.id, // Referencia para el botón
        convocatoriaNombre: nombre
      }
      await Fetch.postData(mensajeConvocatoria, "mensajes_comunidad")

      alert("Convocatoria enviada al buzón con éxito y notificada en la comunidad")
      setNombre('')
      setDescripcion('')
      setComunidadId('')
      setFechaLimite('')
    } catch (error) {
      console.error(error)
      alert("Error al enviar la convocatoria")
    }
  }

  return (
    <div className="convocatoria-container">
      <form className="convocatoria-form" onSubmit={handleSubmit}>
        <h2 className="convocatoria-title">Crear Convocatoria</h2>
        <p className="convocatoria-subtitle">Completa los detalles para tu nueva convocatoria.</p>

        <div className="form-group">
          <label className="form-label">Nombre de la convocatoria</label>
          <input className="form-input" type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ej. Búsqueda de talentos 2026" />
        </div>
        
        <div className="form-group">
          <label className="form-label">Descripción</label>
          <textarea className="form-textarea" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} rows="4" placeholder="Describe los detalles y requisitos de la convocatoria..."></textarea>
        </div>
        
        <div className="form-group">
          <label className="form-label">Comunidad</label>
          <select className="form-select" value={comunidadId} onChange={(e) => setComunidadId(e.target.value)}>
            <option value="">Seleccionar comunidad...</option>
            {comunidades.map((com) => (
              <option key={com.id} value={com.id}>
                {com.nombre} - {com.categoria}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Fecha límite de inscripción</label>
          <input className="form-input" type="date" value={fechaLimite} onChange={(e) => setFechaLimite(e.target.value)} min={new Date().toISOString().split('T')[0]} />
        </div>

        <div className="form-actions">
          <button className="submit-button" type="submit">Enviar Convocatoria</button>
        </div>
      </form>
    </div>
  )
}

export default FormConvocatoria