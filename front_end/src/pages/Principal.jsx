import React from 'react'
import CompPrincipal from '../components/PaginaPrincipal/CompPrincipal'
import Navbar from '../components/navbar/Navbar'
import Footer from '../components/ApartadoPaginaPrincipal/Footer'

function Principal() {
  return (
    <div>
      <Navbar />
      <CompPrincipal />
      <Footer />
    </div>
  )
}

export default Principal
