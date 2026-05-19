import React from 'react'
import { useState } from 'react'
import '../../styles/EstilosAdmin/AgregarUsuario.css'
import Fetch from '../../services/Fetch'

function AgregarUsuario() {
const [Nombre , setNombre] = useState("")
const [Correo , setCorreo] = useState("")
const [Telefono, setTelefono] = useState("")
const [Provincias , setProvincia] =useState("")
const [Canton,setCanton] = useState("")
const [Distrito,setDistrito] = useState("")
const [Roles , setRol] = useState("")
const [Contrasena , setContraseña] = useState("")
async function RegistroUsuarios () {
    if ( Nombre === "" || Correo === "" || Telefono === "" || Provincias === "" || Canton === "" || Distrito === "" || Roles =="" || Contrasena ==="" ){
     alert("Debe de llenar todo los campos");
     return;
    }
  const nombre_usuario = Nombre.toLowerCase().replace(/\s+/g, '_')
  const id_rol = Roles === 'Admin' ? 1 : Roles === 'Empresa' ? 3 : 2
  try {
    await Fetch.postData('usuarios/register', {
      nombre_usuario,
      nombre_completo: Nombre,
      correo:          Correo,
      contrasena:      Contrasena,
      telefono:        Telefono,
      provincia:       Provincias,
      canton:          Canton,
      distrito:        Distrito,
      id_rol,
    })
    alert("Registro exitoso")
  } catch (err) {
    console.error('Error al registrar usuario:', err)
    alert(err.message || 'Error al registrar usuario')
  }
  
   
        
}





  return (
    <div className="agregar-usuario-container">
        <h2 className="agregar-usuario-title">Crea tu cuenta</h2>
        <p className="agregar-usuario-subtitle">Completa tus datos para empezar tu viaje en ProShowcase.</p>
        
        <h4 className="agregar-usuario-label">Nombre completo</h4>
        <input className="agregar-usuario-input icon-user" type="text" placeholder="Ej. Juan Pérez" value={Nombre} onChange={(e) => setNombre(e.target.value)} />
        
        <h4 className="agregar-usuario-label">Correo electrónico</h4> 
        <input className="agregar-usuario-input icon-mail" type="email" placeholder="nombre@ejemplo.com" value={Correo} onChange={(e) => setCorreo(e.target.value)} />
        
        <h4 className="agregar-usuario-label">Provincia</h4>
        <select className="agregar-usuario-input icon-map select-icon" value={Provincias} onChange={(e) => setProvincia(e.target.value)}>
            <option value=" ">Selecciona una provincia</option>
            <option value="San José">San José</option>
            <option value="Alajuela">Alajuela</option>
            <option value="Heredia">Heredia</option>
            <option value="Limón">Limón</option>
            <option value="Guanacaste">Guanacaste</option>
            <option value="Puntarenas">Puntarenas</option>
            <option value="Cartago">Cartago</option>
        </select>
        
        <h4 className="agregar-usuario-label">Cantón</h4>
        <input className="agregar-usuario-input icon-building" type="text" placeholder="Selecciona un cantón" value={Canton} onChange={(e) => setCanton(e.target.value)} />
        
        <h4 className="agregar-usuario-label">Distrito</h4>
        <input className="agregar-usuario-input icon-pin" type="text" placeholder="Selecciona un distrito" value={Distrito} onChange={(e) => setDistrito(e.target.value)} />
        
        <h4 className="agregar-usuario-label">Rol</h4>
        <select className="agregar-usuario-input icon-users select-icon" value={Roles} onChange={(e) => setRol(e.target.value)}>
            <option value=" ">Seleccionar un rol</option>
            <option value="Admin">Admin</option>
            <option value="Personal">Personal</option>
            <option value="Empresa">Empresa</option>
        </select>
        
        <h4 className="agregar-usuario-label">Contraseña</h4>
        <input className="agregar-usuario-input icon-lock" type="password" placeholder="Crea una contraseña segura" value={Contrasena} onChange={(e) => setContraseña(e.target.value)} />
        
        <p className="agregar-usuario-hint">Mínimo 8 caracteres, incluyendo números y símbolos.</p>
        
        <div className="agregar-usuario-terms">
            <input type="checkbox" id="terms" className="checkbox-input" />
            <label htmlFor="terms">Acepto los <span className="text-blue">términos de servicio</span> y la <span className="text-blue">política de privacidad</span>.</label>
        </div>

        <button className="agregar-usuario-button" onClick={RegistroUsuarios}>Agregar Usuario</button>
    </div>
  )
}

export default AgregarUsuario