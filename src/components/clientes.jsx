import React, { useState, useEffect } from 'react';
// Importamos React y los hooks useState (para manejar estado local) 
// y useEffect (para ejecutar efectos al montar o actualizar el componente)

// Componente "Clientes":
// Permite listar, crear, editar y desactivar clientes usando la API REST.
// Presenta una tabla con filtros y un formulario para registrar o editar.
export default function Clientes() {
  // URL base de la API para clientes.
  // En desarrollo, CRA reenviará '/api/cliente' a 'http://localhost:3000/api/cliente'
  const API = '/api/clientes';

  // Estado local del componente:
  // - clientes: arreglo con los datos de clientes obtenidos del servidor
  // - filter: tipo de cliente a mostrar ('all' | '1' = normal | '2' = premium)
  // - form: objeto con campos para crear/editar un cliente
  // - error: mensaje de error en caso de fallo en peticiones
  const [clientes, setClientes] = useState([]);
  const [filter, setFilter]     = useState('all');
  const [form, setForm]         = useState({ id: '', nombre: '', ciudad: '', tipo: '1' });
  const [error, setError]       = useState('');

  // Función para obtener clientes del backend según el filtro seleccionado.
  // Realiza fetch a la ruta '/api/cliente' con query string opcional '?type=1' o '?type=2'.
  const loadClients = async () => {
    try {
      setError('');
      let url = API;
      if (filter !== 'all') url += `?type=${filter}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(res.statusText);
      const data = await res.json();
      setClientes(data);
    } catch (err) {
      console.error(err);
      setError('No se pudieron cargar los clientes.');
      setClientes([]);
    }
  };

  // Hook que se ejecuta al montar el componente y cada vez que 'filter' cambie,
  // para recargar la lista de clientes.
  useEffect(() => {
  const loadClients = async () => {
    try {
      setError('');
      let url = API;
      if (filter === '1' || filter === '2') url += `?type=${filter}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(res.statusText);
      const data = await res.json();
      setClientes(data);
    } catch (err) {
      console.error(err);
      setError('No se pudieron cargar los clientes.');
      setClientes([]);
    }
  };

  loadClients();
}, [filter]);


  // Función que maneja el envío del formulario.
  // Decide si crea (POST) o actualiza (PUT) en base a la presencia de form.id.
  // Envía nombre, ciudad y tipo al backend.
  const handleSubmit = async e => {
    e.preventDefault();
    try {
      setError('');
      const method = form.id ? 'PUT' : 'POST';
      const url    = form.id ? `${API}/${form.id}` : API;
      const payload = {
        nombre: form.nombre,
        ciudad: form.ciudad,
        tipo: form.tipo
      };
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error(res.statusText);
      setForm({ id: '', nombre: '', ciudad: '', tipo: '1' });
      await loadClients();
    } catch (err) {
      console.error(err);
      setError('Error al guardar el cliente.');
    }
  };

  // Función para desactivar (eliminar) un cliente en el servidor.
  // Llama a DELETE /api/cliente/:id y recarga la lista.
  const handleDelete = async id => {
    try {
      setError('');
      console.log("Desactivando cliente con ID:", id);
      const res = await fetch(`${API}/desactivar/${id}`, { method: 'PUT' });
      if (!res.ok) throw new Error(res.statusText);
      await loadClients();
    } catch (err) {
      console.error(err);
      setError('Error al desactivar el cliente.');
    }
  };

  // Renderizado de la UI:
  // - Muestra mensaje de error si existe.
  // - Select para filtrar por tipo de cliente.
  // - Tabla con datos de clientes y botones de acción.
  // - Formulario para registrar o editar un cliente.
 return (
  <div className="min-h-screen bg-pink-50 text-[#4e342e]">
    <header className="bg-pink-200 px-6 py-4 shadow-md flex justify-between items-center">
      <h1 className="text-2xl font-bold">Vitoko's Coffee</h1>
      <span className="text-3xl">☕️</span>
    </header>

    <div className="p-6">
      {error && <div className="mb-4 text-red-600">{error}</div>}

      <div className="mb-4 flex items-center space-x-2">
        <label className="font-medium">Filtro:</label>
        <select
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="border border-pink-300 rounded p-1 bg-pink-100"
        >
          <option value="all">Todos</option>
          <option value="normal">Normales</option>
          <option value="premium">Premium</option>
        </select>
        <button
          onClick={loadClients}
          className="bg-pink-400 hover:bg-pink-600 text-white px-3 py-1 rounded"
        >
          Cargar
        </button>
      </div>

      <table className="w-full table-auto mb-4 bg-white shadow rounded">
        <thead className="bg-pink-100">
          <tr>
            {['ID', 'Nombre', 'Ciudad', 'Tipo', 'Acciones'].map(h => (
              <th key={h} className="p-2">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {clientes.map((c, index) => (
            <tr key={c.id_cliente || `cliente-${index}`} className="border-t border-pink-200">
              <td className="p-2">{c.id_cliente}</td>
              <td className="p-2">{c.nombre}</td>
              <td className="p-2">{c.ciudad}</td>
              <td className="p-2">
                {c.tipo === 'normal' ? 'Normal' : c.tipo === 'premium' ? 'Premium' : 'Inactivo'}
              </td>
              <td className="p-2 space-x-1">
                <button
                  onClick={() =>
                    setForm({ id: c.id_cliente, nombre: c.nombre, ciudad: c.ciudad, tipo: c.tipo.toString() })
                  }
                  className="px-2 py-1 bg-pink-300 text-white rounded hover:bg-pink-400"
                >✎</button>
                <button
                  onClick={() => handleDelete(c.id_cliente)}
                  className="px-2 py-1 bg-red-400 text-white rounded hover:bg-red-500"
                >🗑</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 className="text-lg font-semibold mb-2">
        {form.id ? 'Editar Cliente' : 'Registrar Cliente'}
      </h3>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <input type="hidden" value={form.id} />
        <input
          placeholder="Nombre"
          value={form.nombre}
          onChange={e => setForm({ ...form, nombre: e.target.value })}
          className="border border-pink-300 rounded p-2 bg-white"
          required
        />
        <input
          type="text"
          placeholder="Ciudad"
          value={form.ciudad}
          onChange={e => setForm({ ...form, ciudad: e.target.value })}
          className="border border-pink-300 rounded p-2 bg-white"
          required
        />
        <select
          value={form.tipo}
          onChange={e => setForm({ ...form, tipo: e.target.value })}
          className="border border-pink-300 rounded p-2 bg-white"
          required
        >
          <option value="normal">Normal</option>
          <option value="premium">Premium</option>
        </select>
        <button className="bg-pink-500 text-white py-2 rounded sm:col-span-4 hover:bg-pink-600">
          {form.id ? 'Actualizar Cliente' : 'Registrar Cliente'}
        </button>
      </form>
    </div>
  </div>
);


}