import React, { useState } from 'react';
// Importamos React y el hook useState para manejar el estado local del componente
import Clientes from './components/clientes';
import Productos from './components/productos';
import Ventas from './components/ventas';

// Importamos los componentes de las secciones: Clientes, Productos y Ventas

// Componente principal "App":
// Administra la navegación entre las secciones y renderiza el contenido correspondiente.
function App() {
  // Definimos las pestañas disponibles para la navegación
  const tabs = ['Clientes','Productos','Ventas'];
  // Estado "active": determina qué pestaña está seleccionada actualmente
  const [active, setActive] = useState(tabs[0]);

  // Renderizado de la UI:
  // - Barra de navegación de pestañas
  // - Contenido condicional según la pestaña activa
  return (
  <div className="min-h-screen bg-[#f5f0eb] text-gray-900 py-8">
    <div className="max-w-4xl mx-auto p-4 bg-white rounded shadow">
      <nav className="flex space-x-4 mb-4">
        {tabs.map(t => (
          <button
            key={t}
            onClick={() => setActive(t)}
            className={`px-3 py-1 rounded font-medium ${
              active === t
                ? 'bg-[#fddde6] text-black'
                : 'bg-[#d7ccc8] text-[#3e2723]'
            }`}
          >
            {t}
          </button>
        ))}
      </nav>
      <div>
        {active === 'Clientes' && <Clientes />}
        {active === 'Productos' && <Productos />}
        {active === 'Ventas' && <Ventas />}
      </div>
    </div>
  </div>
);

}

export default App;