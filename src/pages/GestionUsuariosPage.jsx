import React, { useState } from 'react';

import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { crearUsuario } from '../services/usuarioService';

const VACIO = { usuario: '', correo: '', password: '', rol: 'visor' };

function GestionUsuariosPage() {
  
  const [form, setForm] = useState(VACIO);
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setExito('');

    if (!form.usuario || !form.correo || !form.password || !form.rol) {
      setError('Todos los campos son obligatorios');
      return;
    }
    if (form.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setCargando(true);
    try {
      await crearUsuario(form);
      setExito(`Usuario "${form.usuario}" creado correctamente. Debera cambiar su contraseña al iniciar sesion por primera vez.`);
      setForm(VACIO);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al crear el usuario');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 pl-14">
          <div className="mb-8 text-center">
  <h1 className="text-3xl font-bold text-gray-800">
    Gestión de usuarios
  </h1>
  <p className="mt-2 text-gray-500">
    Crear nuevas cuentas de acceso al sistema
  </p>
</div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 max-w-lg mx-auto">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Usuario</label>
                <input
                  type="text"
                  name="usuario"
                  value={form.usuario}
                  onChange={handleChange}
                  disabled={cargando}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Correo</label>
                <input
                  type="email"
                  name="correo"
                  value={form.correo}
                  onChange={handleChange}
                  disabled={cargando}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña inicial</label>
                <input
                  type="text"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  disabled={cargando}
                  placeholder="Minimo 6 caracteres"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-400 mt-1">El usuario debera cambiarla en su primer ingreso.</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
                <select
                  name="rol"
                  value={form.rol}
                  onChange={handleChange}
                  disabled={cargando}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="visor">Visor (solo lectura)</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
                  ⚠️ {error}
                </div>
              )}
              {exito && (
                <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-lg">
                  ✅ {exito}
                </div>
              )}

              <button
  type="submit"
  disabled={cargando}
  style={{ backgroundColor: '#00BFFF' }}
  className="w-full text-white font-semibold py-2.5 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-60"
>
  {cargando ? 'Creando usuario...' : 'Crear usuario'}
</button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}

export default GestionUsuariosPage;