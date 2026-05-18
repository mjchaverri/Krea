import React from 'react'
import Navbar from '../components/Navbar/Navbar'
import MainSobreNosotros from '../components/SobreNosotros/MainSobreNosotros'
import Footer from '../components/ApartadoPaginaPrincipal/Footer'

function SobreNosotros() {
    return (
        <div>
            <div>
                <Navbar />
            </div>
            <div>
                <MainSobreNosotros />
            </div>
            <div>
                <Footer />
            </div>
        </div>
    )
}

export default SobreNosotros