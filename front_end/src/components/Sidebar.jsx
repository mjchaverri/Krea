import React from 'react';

const Sidebar = () => {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 p-4">
      <nav className="space-y-2">
        <a href="/" className="block p-2 rounded hover:bg-primary hover:text-white transition-colors">
          <i className="fas fa-home mr-2"></i>Inicio
        </a>
        <a href="/employees" className="block p-2 rounded hover:bg-primary hover:text-white transition-colors">
          <i className="fas fa-users mr-2"></i>Empleados
        </a>
        <a href="/analytics" className="block p-2 rounded hover:bg-primary hover:text-white transition-colors">
          <i className="fas fa-chart-line mr-2"></i>Analytics
        </a>
        <a href="/settings" className="block p-2 rounded hover:bg-primary hover:text-white transition-colors">
          <i className="fas fa-cog mr-2"></i>Configuración
        </a>
      </nav>
    </aside>
  );
};

export default Sidebar;
