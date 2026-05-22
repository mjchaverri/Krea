import React from 'react';

function Header() {
  return (
    <header className="bg-primary text-white p-4 flex justify-between items-center shadow-md">
      <h1 className="text-2xl font-bold">HR Dashboard</h1>
      <div className="flex items-center space-x-4">
        <button className="bg-white text-primary px-4 py-2 rounded hover:bg-gray-100 transition">
          Perfil
        </button>
        <button className="bg-white text-primary px-4 py-2 rounded hover:bg-gray-100 transition">
          Cerrar sesión
        </button>
      </div>
    </header>
  );
}

export default Header;
