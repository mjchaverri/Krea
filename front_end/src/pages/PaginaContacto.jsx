import React from 'react'
import Navbar from '../components/navbar/Navbar'
import FormularioQuejas from '../components/Contactos/CompContactos'
import Footer from '../components/ApartadoPaginaPrincipal/Footer'


function PaginaContacto() {
  return (
    <div>
      <Navbar/>
      <FormularioQuejas/>
      <Footer/>
    </div>
  )
}

export default PaginaContacto
