// src/components/Productos.jsx
import React, { useState, useEffect } from 'react';
// Importamos React y los hooks useState (para manejar estado local) y useEffect (para efectos secundarios)

// Componente "Productos":
// Permite listar, crear, editar, deshabilitar productos y ver estadísticas de ventas recientes y anuales.
export default function Productos() {
  // URL base de la API para productos.
  // Create React App reenviará '/api/producto' a 'http://localhost:3000/api/producto' en desarrollo.
  const API = '/api/producto';

  // Estado local del componente:
  // - productos: lista de productos disponibles
  // - recentSold: lista de productos vendidos en la última semana
  // - yearCount: total vendido en el año actual
  // - form: datos del formulario para crear/editar producto
  // - error: mensaje de error para mostrar al usuario
  const [productos, setProductos]   = useState([]);
  const [recentSold, setRecentSold] = useState([]);
  const [yearCount, setYearCount]   = useState(null);
  const [form, setForm]             = useState({ id: '', name: '', price: '', stock: '' });
  const [error, setError]           = useState('');

  // 12. Función para cargar productos disponibles desde el backend (GET /api/producto?disponible=true)
  const loadAvailable = async () => {
    try {
      setError('');
      const res = await fetch(`${API}?disponible=true`);
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const data = await res.json();
      setProductos(data);
    } catch (err) {
      console.error(err);
      setError('No se pudo cargar productos disponibles.');
      setProductos([]);
    }
  };

  // 13. Función para cargar productos vendidos recientemente en la semana (GET /api/producto/vendidos/estaSemana)
  const loadRecentSold = async () => {
    try {
      setError('');
      const res = await fetch(`${API}/sold/estaSemana`);
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const data = await res.json();
      setRecentSold(data);
    } catch (err) {
      console.error(err);
      setError('No se pudo cargar productos vendidos esta semana.');
      setRecentSold([]);
    }
  };

  // 15. Función para obtener la cantidad de productos vendidos en el año actual (GET /api/producto/vendidos/añoActual)
  const loadYearCount = async () => {
    try {
      setError('');
      const res = await fetch(`${API}/vendidos/añoActual`);
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const { count } = await res.json();
      setYearCount(count);
    } catch (err) {
      console.error(err);
      setError('No se pudo cargar conteo de ventas anual.');
      setYearCount(null);
    }
  };

  // Hook que se ejecuta al montar el componente para cargar la lista de productos disponibles
  useEffect(() => {
    loadAvailable();
  }, []);

  // 1 & 4. Maneja la creación (POST) o edición (PUT) de un producto según form.id.
  // Envía name, price y stock en el cuerpo de la petición.
  const handleSubmit = async e => {
    e.preventDefault();
    try {
      setError('');
      const method = form.id ? 'PUT' : 'POST';
      const url = form.id ? `${API}/${form.id}` : API;
      const payload = {
        name: form.name,
        price: parseFloat(form.price),
        stock: parseInt(form.stock, 10)
      };
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error(`Status ${res.status}`);
      setForm({ id: '', name: '', price: '', stock: '' });
      await loadAvailable();
    } catch (err) {
      console.error(err);
      setError('Error al guardar el producto.');
    }
  };

  // 3. Función para deshabilitar (eliminar) un producto (DELETE /api/producto/:id)
  const handleDelete = async id => {
    try {
      setError('');
      const res = await fetch(`${API}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(`Status ${res.status}`);
      await loadAvailable();
    } catch (err) {
      console.error(err);
      setError('Error al deshabilitar el producto.');
    }
  };

  // 4. Función para actualizar el precio de un producto (PUT /api/producto/:id)
  const handleUpdatePrice = async id => {
    const p = prompt('Nuevo precio:');
    if (!p) return;
    try {
      setError('');
      const res = await fetch(`${API}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ price: parseFloat(p) })
      });
      if (!res.ok) throw new Error(`Status ${res.status}`);
      await loadAvailable();
    } catch (err) {
      console.error(err);
      setError('Error al actualizar precio.');
    }
  };

  // 14. Función para incrementar el stock de un producto (PUT /api/producto/:id/stock)
  const handleIncStock = async id => {
    const s = prompt('Incrementar stock en:');
    if (!s) return;
    try {
      setError('');
      const res = await fetch(`${API}/${id}/stock`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: parseInt(s, 10) })
      });
      if (!res.ok) throw new Error(`Status ${res.status}`);
      await loadAvailable();
    } catch (err) {
      console.error(err);
      setError('Error al incrementar stock.');
    }
  };

  // Renderizado de la interfaz:
  // - Muestra errores si los hay
  // - Botones para filtrar acciones (disponibles, vendidos esta semana, total anual)
  // - Tabla de productos con acciones
  // - Sección de ventas recientes y conteo anual
  // - Formulario para registrar o editar productos
  return (
  <div className="min-h-screen bg-pink-50 text-[#4e342e]">
    <header className="bg-pink-200 px-6 py-4 shadow-md flex justify-between items-center">
      <h1 className="text-2xl font-bold">Vitoko's Coffee</h1>
      <span className="text-3xl">☕️</span>
    </header>

    <div className="p-6">
      {error && <div className="mb-4 text-red-600">{error}</div>}

      <div className="mb-4 space-x-2">
        <button onClick={loadAvailable} className="bg-pink-400 text-white px-3 py-1 rounded hover:bg-pink-600">
          Disponibles
        </button>
        <button onClick={loadRecentSold} className="bg-pink-400 text-white px-3 py-1 rounded hover:bg-pink-600">
          Vendidos esta semana
        </button>
        <button onClick={loadYearCount} className="bg-pink-400 text-white px-3 py-1 rounded hover:bg-pink-600">
          Total año actual
        </button>
      </div>

      {/* Lista de productos disponibles */}
      <table className="w-full table-auto mb-4 bg-white shadow rounded">
        <thead className="bg-pink-100">
          <tr>
            {['ID', 'Nombre', 'Precio', 'Stock', 'Acciones'].map(h => (
              <th key={h} className="p-2">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {productos.map(p => (
            <tr key={p.id} className="border-t border-pink-200">
              <td className="p-2">{p.id}</td>
              <td className="p-2">{p.name}</td>
              <td className="p-2">{p.price}</td>
              <td className="p-2">{p.stock}</td>
              <td className="p-2 space-x-1">
                <button
                  onClick={() => handleUpdatePrice(p.id)}
                  className="px-2 py-1 bg-pink-300 text-white rounded hover:bg-pink-400"
                >💲</button>
                <button
                  onClick={() => handleIncStock(p.id)}
                  className="px-2 py-1 bg-green-400 text-white rounded hover:bg-green-500"
                >➕</button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="px-2 py-1 bg-red-400 text-white rounded hover:bg-red-500"
                >🗑</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Ventas recientes esta semana */}
      {recentSold.length > 0 && (
        <>
          <h3 className="text-lg font-semibold mb-2">Vendidos Esta Semana</h3>
          <ul className="mb-4 list-disc list-inside">
            {recentSold.map(item => (
              <li key={item.productId}>
                {item.productName}: {item.quantitySold} unidades
              </li>
            ))}
          </ul>
        </>
      )}

      {/* Conteo anual */}
      {yearCount !== null && (
        <p className="mb-4">
          <strong>Total vendidos este año:</strong> {yearCount} unidades
        </p>
      )}

      {/* Formulario crear/editar producto */}
      <h3 className="text-lg font-medium mb-2">
        {form.id ? 'Editar Producto' : 'Registrar Producto'}
      </h3>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <input type="hidden" value={form.id} />
        <input
          placeholder="Nombre"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          className="border border-pink-300 rounded p-2 bg-white"
          required
        />
        <input
          placeholder="Precio"
          type="number"
          step="0.01"
          value={form.price}
          onChange={e => setForm({ ...form, price: e.target.value })}
          className="border border-pink-300 rounded p-2 bg-white"
          required
        />
        <input
          placeholder="Stock"
          type="number"
          value={form.stock}
          onChange={e => setForm({ ...form, stock: e.target.value })}
          className="border border-pink-300 rounded p-2 bg-white"
          required
        />
        <button className="bg-pink-500 text-white py-2 rounded sm:col-span-4 hover:bg-pink-600">
          {form.id ? 'Actualizar Producto' : 'Registrar Producto'}
        </button>
      </form>
    </div>
  </div>
);

}