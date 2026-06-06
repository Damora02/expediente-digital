import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { getEmpleados } from '../services/empleadoService';

function DashboardPage() {
  const { usuario } = useAuth();

  const [empleados, setEmpleados] = useState([]);
  const [totalEmpleados, setTotalEmpleados] = useState(0);
  const [cargando, setCargando] = useState(true);

  const esAdmin = usuario?.rol === 'admin';

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const listaEmpleados = await getEmpleados();

        setEmpleados(listaEmpleados);
        setTotalEmpleados(listaEmpleados.length);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, []);

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

            {esAdmin && (
              <span
                className="mt-3 text-xs font-medium px-3 py-1.5 rounded-full border"
                style={{
                  color: '#FF33CC',
                  background: '#FF33CC15',
                  borderColor: '#FF33CC44',
                }}
              >
                Sesión activa
              </span>
            )}
          </div>

          {/* Estadísticas */}
          {esAdmin && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white rounded-xl p-5 border border-gray-200 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total empleados</p>
                  <p
                    className="text-3xl font-bold mt-1"
                    style={{ color: '#FF33CC' }}
                  >
                    {cargando ? '...' : totalEmpleados}
                  </p>
                </div>

                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center"
                  style={{ background: '#FF33CC15' }}
                >
                  <span className="text-2xl">👥</span>
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 border border-gray-200 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Módulos activos</p>
                  <p
                    className="text-3xl font-bold mt-1"
                    style={{ color: '#00BFFF' }}
                  >
                    3
                  </p>
                </div>

                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center"
                  style={{ background: '#00BFFF15' }}
                >
                  <span className="text-2xl">⚙️</span>
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 border border-gray-200 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Rol actual</p>
                  <p
                    className="text-xl font-bold mt-1 capitalize"
                    style={{ color: '#7c3aed' }}
                  >
                    {usuario?.rol}
                  </p>
                </div>

                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center"
                  style={{ background: '#f5f3ff' }}
                >
                  <span className="text-2xl">🔐</span>
                </div>
              </div>
            </div>
          )}

          {/* Lista de empleados */}
          {esAdmin && (
            <div className="bg-white rounded-xl p-6 border border-gray-200 mb-6">
              <h2 className="text-lg font-semibold text-center text-gray-700 mb-5">
                Empleados registrados
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="p-3 text-left">ID</th>
                      <th className="p-3 text-left">Usuario</th>
                      <th className="p-3 text-left">Rol</th>
                    </tr>
                  </thead>

                  <tbody>
                    {empleados.length > 0 ? (
                      empleados.map((emp) => (
                        <tr
                          key={emp.id}
                          className="border-b hover:bg-gray-50"
                        >
                          <td className="p-3">{emp.id}</td>
                          <td className="p-3">
                            {emp.usuario || emp.nombre}
                          </td>
                          <td className="p-3 capitalize">
                            {emp.rol}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="3"
                          className="text-center p-4 text-gray-500"
                        >
                          No hay empleados registrados
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Accesos rápidos */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h2 className="text-sm font-semibold text-gray-700 mb-5 text-center">
              Accesos rápidos
            </h2>

            <div className="flex justify-center">
              <div
                className={`grid gap-4 w-full max-w-2xl ${
                  esAdmin
                    ? 'grid-cols-1 md:grid-cols-3'
                    : 'grid-cols-1 max-w-xs'
                }`}
              >
                {esAdmin && (
                  <a
                    href="/empleados"
                    className="flex flex-col items-center gap-3 p-5 rounded-xl border transition-opacity hover:opacity-75"
                    style={{
                      background: '#FF33CC11',
                      borderColor: '#FF33CC33',
                      color: '#cc00a3',
                    }}
                  >
                    <span className="text-3xl">👥</span>
                    <span className="text-sm font-medium">
                      Gestionar empleados
                    </span>
                  </a>
                )}

                {esAdmin && (
                  <a
                    href="/empleados/nuevo"
                    className="flex flex-col items-center gap-3 p-5 rounded-xl border transition-opacity hover:opacity-75"
                    style={{
                      background: '#00BFFF11',
                      borderColor: '#00BFFF33',
                      color: '#0099cc',
                    }}
                  >
                    <span className="text-3xl">👤</span>
                    <span className="text-sm font-medium">
                      Nuevo empleado
                    </span>
                  </a>
                )}

                <a
                  href={esAdmin ? '/expedientes' : '/mis-expedientes'}
                  className="flex flex-col items-center gap-3 p-5 rounded-xl border transition-opacity hover:opacity-75"
                  style={{
                    background: '#f5f3ff',
                    borderColor: '#ddd6fe',
                    color: '#7c3aed',
                  }}
                >
                  <span className="text-3xl">📁</span>
                  <span className="text-sm font-medium">
                    {esAdmin ? 'Expedientes' : 'Mi expediente'}
                  </span>
                </a>
              </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}

export default DashboardPage;