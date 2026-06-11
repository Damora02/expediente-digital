import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { getEmpleados } from '../services/empleadoService';

function DashboardPage() {
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const esAdmin = usuario?.rol === 'admin';

  const [empleados, setEmpleados] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const lista = await getEmpleados();
        setEmpleados(lista);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setCargando(false);
      }
    };
    cargarDatos();
  }, [esAdmin, usuario?.empleadoId]);

  const formatearFecha = (fecha) => {
    if (!fecha) return '—';
    return new Date(fecha).toLocaleDateString('es-CR');
  };

  const empleadosFiltrados = empleados.filter((emp) => {
  const texto = busqueda.toLowerCase();
  return (
    emp.nombre?.toLowerCase().includes(texto) ||
    emp.apellido?.toLowerCase().includes(texto) ||
    emp.cedula?.toLowerCase().includes(texto) ||
    emp.puesto?.toLowerCase().includes(texto) ||
    emp.lugarTrabajo?.toLowerCase().includes(texto) ||
    emp.telefono?.toLowerCase().includes(texto) ||
    emp.correo?.toLowerCase().includes(texto) ||
    emp.nacionalidad?.toLowerCase().includes(texto) ||
    emp.genero?.toLowerCase().includes(texto) ||
    emp.estadoCivil?.toLowerCase().includes(texto)
  );
});

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 pl-14">

          {/* Bienvenida */}
          <div className="flex flex-col items-center text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              Bienvenido, {usuario?.usuario}!
            </h1>
            <p className="text-gray-400 text-sm mt-2">
              {new Date().toLocaleDateString('es-CR')}
            </p>
            <span className="mt-3 text-xs font-medium px-3 py-1.5 rounded-full border"
              style={{ color: '#FF33CC', background: '#FF33CC15', borderColor: '#FF33CC44' }}>
              Sesión activa
            </span>
          </div>

          {/* ADMIN: estadísticas */}
          {esAdmin && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white rounded-xl p-5 border border-gray-200 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total empleados</p>
                  <p className="text-3xl font-bold mt-1" style={{ color: '#FF33CC' }}>
                    {cargando ? '...' : empleados.length}
                  </p>
                </div>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: '#FF33CC15' }}>
                  <span className="text-2xl">👥</span>
                </div>
              </div>
              <div className="bg-white rounded-xl p-5 border border-gray-200 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Módulos activos</p>
                  <p className="text-3xl font-bold mt-1" style={{ color: '#00BFFF' }}>3</p>
                </div>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: '#00BFFF15' }}>
                  <span className="text-2xl">⚙️</span>
                </div>
              </div>
              <div className="bg-white rounded-xl p-5 border border-gray-200 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Rol actual</p>
                  <p className="text-xl font-bold mt-1 capitalize" style={{ color: '#7c3aed' }}>{usuario?.rol}</p>
                </div>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: '#f5f3ff' }}>
                  <span className="text-2xl">🔐</span>
                </div>
              </div>
            </div>
          )}

          {/* LISTA DE EMPLEADOS */}
          <div className="bg-white rounded-xl border border-gray-200 mb-6 overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between gap-4">
              <div>
                <h2 className="font-semibold text-gray-700">
                  {esAdmin ? 'Empleados registrados' : 'Directorio de empleados'}
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  Haga clic en "Ver expediente" para consultar la información
                </p>
              </div>
              <input
                type="text"
                placeholder="Buscar..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-52 focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            </div>

            {cargando ? (
              <div className="p-8 text-center text-gray-400 text-sm animate-pulse">Cargando empleados...</div>
            ) : empleadosFiltrados.length === 0 ? (
              <div className="p-8 text-center text-gray-400 text-sm">No se encontraron empleados</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Nombre</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Cédula</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Puesto</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Lugar de trabajo</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Ingreso</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {empleadosFiltrados.map((emp) => (
                      <tr key={emp.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                              {emp.nombre?.[0]}{emp.apellido?.[0]}
                            </div>
                            <p className="font-medium text-gray-800">{emp.nombre} {emp.apellido}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-600">{emp.cedula}</td>
                        <td className="px-4 py-3 text-gray-600">{emp.puesto}</td>
                          
                        <td className="px-4 py-3 text-gray-600">{emp.lugarTrabajo || '—'}</td>
                        <td className="px-4 py-3 text-gray-600">{formatearFecha(emp.fechaIngreso)}</td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => navigate(`/expedientes/${emp.id}`)}
                            className="text-xs bg-green-50 text-green-700 hover:bg-green-100 px-3 py-1.5 rounded-lg border border-green-200 transition-colors font-medium"
                          >
                            📁 Ver expediente
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </main>
      </div>
    </div>
  );
}

export default DashboardPage;