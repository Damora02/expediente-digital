import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { crearUsuario, listarUsuarios, cambiarRol, eliminarUsuario } from '../services/usuarioService';
import { useAuth } from '../context/AuthContext';
import { UserCog, Trash2 } from 'lucide-react';

const VACIO = { usuario: '', correo: '', password: '', rol: 'visor' };

function GestionUsuariosPage() {
  const { usuario: usuarioActual } = useAuth();
  const [form, setForm] = useState(VACIO);
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');
  const [cargando, setCargando] = useState(false);
  const [usuarios, setUsuarios] = useState([]);
  const [cargandoUsuarios, setCargandoUsuarios] = useState(true);

  const cargarUsuarios = async () => {
    try {
      const lista = await listarUsuarios();
      setUsuarios(lista);
    } catch (err) {
      console.error('Error al cargar usuarios:', err);
    } finally {
      setCargandoUsuarios(false);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

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
      setExito(`Usuario "${form.usuario}" creado correctamente.`);
      setForm(VACIO);
      cargarUsuarios();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al crear el usuario');
    } finally {
      setCargando(false);
    }
  };

  const handleCambiarRol = async (id, rolActual, nombreUsuario) => {
  const nuevoRol = rolActual === 'admin' ? 'visor' : 'admin';
  const confirmar = window.confirm(
    `¿Seguro que deseas cambiar a "${nombreUsuario}" de "${rolActual}" a "${nuevoRol}"?`
  );
  if (!confirmar) return;
  try {
    await cambiarRol(id, nuevoRol);
    cargarUsuarios();
  } catch (err) {
    alert(err.response?.data?.error || 'Error al cambiar el rol');
  }
};

  const handleEliminar = async (id, nombreUsuario) => {
    const confirmar = window.confirm(`¿Eliminar permanentemente al usuario "${nombreUsuario}"? Esta accion no se puede deshacer.`);
    if (!confirmar) return;
    try {
      await eliminarUsuario(id);
      cargarUsuarios();
    } catch (err) {
      alert(err.response?.data?.error || 'Error al eliminar el usuario');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 pl-14">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Gestión de usuarios</h1>
            <p className="text-gray-500 text-sm mt-0.5">Administre las cuentas de acceso al sistema</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Formulario de crear usuario */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="font-semibold text-gray-700 mb-4">Crear nuevo usuario</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Usuario</label>
                  <input type="text" name="usuario" value={form.usuario} onChange={handleChange}
                    disabled={cargando}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00BFFF] focus:border-[#00BFFF]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Correo</label>
                  <input type="email" name="correo" value={form.correo} onChange={handleChange}
                    disabled={cargando}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00BFFF] focus:border-[#00BFFF]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña inicial</label>
                  <input type="text" name="password" value={form.password} onChange={handleChange}
                    disabled={cargando} placeholder="Mínimo 6 caracteres"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00BFFF] focus:border-[#00BFFF]" />
                  <p className="text-xs text-gray-400 mt-1">El usuario debe cambiarla en su primer ingreso.</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
                  <select name="rol" value={form.rol} onChange={handleChange} disabled={cargando}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00BFFF] focus:border-[#00BFFF] bg-white" >
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
                  className="w-full text-white font-semibold py-2.5 rounded-lg transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{ background: '#00BFFF' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#0099cc'}
                  onMouseLeave={e => e.currentTarget.style.background = '#00BFFF'}
                >
                  {cargando ? 'Creando...' : 'Crear usuario'}
                </button>
              </form>
            </div>

            {/* Tabla de usuarios existentes */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="font-semibold text-gray-700 mb-4">Usuarios registrados</h2>
              {cargandoUsuarios ? (
                <p className="text-gray-400 text-sm animate-pulse">Cargando usuarios...</p>
              ) : usuarios.length === 0 ? (
                <p className="text-gray-400 text-sm">No hay usuarios registrados</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {usuarios.map((u) => (
                    <div key={u.id} className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 bg-gray-50 hover:bg-white hover:shadow-md hover:border-[#00BFFF]/30 transition-all duration-200">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#00BFFF] to-[#0090c0] text-white flex items-center justify-center text-xs font-bold flex-shrink-0 shadow-sm">
                        {u.usuario?.[0]?.toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800">{u.usuario}</p>
                        <p className="text-xs text-gray-500 truncate">{u.correo}</p>
                      </div>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${u.rol === 'admin' ? 'bg-[#00BFFF] text-white' : 'bg-[#00BFFF]/10 text-[#00BFFF]'}`}>
                        {u.rol}
                      </span>
                      <div className="flex gap-1">
                        {u.id !== usuarioActual?.id ? (
                          <>
                            <button
   onClick={() => handleCambiarRol(u.id, u.rol, u.usuario)}
  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-[#00BFFF] text-white hover:bg-[#0099cc] transition-colors font-medium shadow-sm"
  title="Cambiar rol"
>
  <UserCog size={14} />
  Cambiar rol
</button>
<button
  onClick={() => handleEliminar(u.id, u.usuario)}
  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors font-medium shadow-sm"
  title="Eliminar usuario"
>
  <Trash2 size={14} />
  Eliminar
</button>
                          </>
                        ) : (
                          <span className="text-xs text-gray-400 italic">Tu cuenta</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}

export default GestionUsuariosPage;