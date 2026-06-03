import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import TablaEmpleados from '../components/TablaEmpleados';
import { getEmpleados, eliminarEmpleado } from '../services/empleadoService';

function EmpleadosPage() {
  const navigate = useNavigate();
  const [empleados, setEmpleados] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const cargarEmpleados = async () => {
    setCargando(true);
    try {
      const datos = await getEmpleados();
      setEmpleados(datos);
    } catch (err) {
      setError('No se pudieron cargar los empleados. Verifique que json-server este corriendo.');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarEmpleados();
  }, []);

  const handleEditar = (id) => {
    navigate(`/empleados/${id}/editar`);
  };

  const handleEliminar = async (id) => {
    const empleado = empleados.find((e) => e.id === id);
    const confirmar = window.confirm(`Desea eliminar a ${empleado?.nombre} ${empleado?.apellido}?`);
    if (!confirmar) return;
    try {
      await eliminarEmpleado(id);
      setEmpleados((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      alert('Error al eliminar el empleado. Intente nuevamente.');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Gestion de empleados</h1>
              <p className="text-gray-500 text-sm mt-1">Administre el personal de la empresa</p>
            </div>
            <button
              onClick={() => navigate('/empleados/nuevo')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium text-sm transition-colors flex items-center gap-2 shadow-sm"
            >
              ➕ Nuevo empleado
            </button>
          </div>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
              ⚠️ {error}
            </div>
          )}
          {cargando ? (
            <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-200">
              <p className="text-gray-400 text-lg animate-pulse">Cargando empleados...</p>
            </div>
          ) : (
            <TablaEmpleados
              empleados={empleados}
              onEditar={handleEditar}
              onEliminar={handleEliminar}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default EmpleadosPage;