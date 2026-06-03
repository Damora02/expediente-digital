import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { getEmpleados } from '../services/empleadoService';

function DashboardPage() {
  const { usuario } = useAuth();
  const [totalEmpleados, setTotalEmpleados] = useState(0);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const empleados = await getEmpleados();
        setTotalEmpleados(empleados.length);
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
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Bienvenido, {usuario?.usuario}!</h1>
            <p className="text-gray-500 text-sm mt-1">{new Date().toLocaleDateString('es-CR')}</p>
          </div>
          {usuario?.rol === 'admin' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total empleados</p>
                    <p className="text-3xl font-bold text-blue-600 mt-1">{cargando ? '...' : totalEmpleados}</p>
                  </div>
                  <div className="text-4xl">👥</div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Modulos activos</p>
                    <p className="text-3xl font-bold text-green-600 mt-1">3</p>
                  </div>
                  <div className="text-4xl">⚙️</div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Rol actual</p>
                    <p className="text-xl font-bold text-purple-600 mt-1 capitalize">{usuario?.rol}</p>
                  </div>
                  <div className="text-4xl">🔐</div>
                </div>
              </div>
            </div>
          )}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="font-semibold text-gray-800 mb-4">Accesos rapidos</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {usuario?.rol === 'admin' && (
                <a href="/empleados" className="flex flex-col items-center gap-2 p-4 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 transition-colors border border-blue-200 text-center">
                  <span className="text-3xl">👥</span>
                  <span className="text-sm font-medium">Gestionar empleados</span>
                </a>
              )}
              {usuario?.rol === 'admin' && (
                <a href="/empleados/nuevo" className="flex flex-col items-center gap-2 p-4 rounded-lg bg-green-50 hover:bg-green-100 text-green-700 transition-colors border border-green-200 text-center">
                  <span className="text-3xl">➕</span>
                  <span className="text-sm font-medium">Nuevo empleado</span>
                </a>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default DashboardPage;