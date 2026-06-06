import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import FormularioEmpleado from '../components/FormularioEmpleado';
import { getEmpleadoPorId, crearEmpleado, editarEmpleado } from '../services/empleadoService';
import { subirArchivo } from '../services/expedienteService';

function NuevoEmpleadoPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const modoEdicion = Boolean(id);

  const [empleadoActual, setEmpleadoActual] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [cargandoDatos, setCargandoDatos] = useState(modoEdicion);
  const [error, setError] = useState('');

  useEffect(() => {
    if (modoEdicion) {
      const cargar = async () => {
        try {
          const datos = await getEmpleadoPorId(id);
          setEmpleadoActual(datos);
        } catch (err) {
          setError('No se pudo cargar el empleado.');
        } finally {
          setCargandoDatos(false);
        }
      };
      cargar();
    }
  }, [id, modoEdicion]);

  const handleGuardar = async (datosForm, archivos) => {
    setCargando(true);
    setError('');
    try {
      let empleadoGuardado;
      if (modoEdicion) {
        empleadoGuardado = await editarEmpleado(id, datosForm);
      } else {
        empleadoGuardado = await crearEmpleado(datosForm);
      }
      const tiposArchivo = ['contrato', 'entrevista', 'cv'];
      for (const tipo of tiposArchivo) {
        if (archivos[tipo]) {
          await subirArchivo(empleadoGuardado.id, tipo, archivos[tipo]);
        }
      }
      navigate('/empleados');
    } catch (err) {
      setError('Error al guardar el empleado. Intente nuevamente.');
      setCargando(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 pl-14">
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => navigate('/empleados')}
              className="text-gray-500 hover:text-gray-800 hover:bg-gray-100 p-2 rounded-lg transition-colors"
            >
              ← Volver
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {modoEdicion ? 'Editar empleado' : 'Nuevo empleado'}
              </h1>
              <p className="text-gray-500 text-sm mt-0.5">
                {modoEdicion ? 'Modifique los datos del empleado' : 'Complete el formulario para registrar un nuevo empleado'}
              </p>
            </div>
          </div>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
              ⚠️ {error}
            </div>
          )}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            {cargandoDatos ? (
              <div className="text-center py-12">
                <p className="text-gray-400 animate-pulse">Cargando datos del empleado...</p>
              </div>
            ) : (
              <FormularioEmpleado
                datosIniciales={empleadoActual}
                onGuardar={handleGuardar}
                cargando={cargando}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default NuevoEmpleadoPage;