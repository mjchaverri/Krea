import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/Principales/InicioPagina.css';

function Navbar() {
  const navigate = useNavigate();
  const irsesion = () => {
    navigate("/Iniciar");
  };
  const ircuenta = () => {
    navigate("Registro");
  };

  return (
    <div className='DivNavbar'>
      <nav className='navbar'>
        <div className='Brand' onClick={() => navigate("/")}>
          <h3 className='BrandName'>Krea</h3>
        </div>
        <div className='nav-session-btns'>
          <button className='BtnLogin' onClick={irsesion}>Iniciar Sesión</button>
          <button className='BtnRegister' onClick={ircuenta}>Registrarse</button>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
