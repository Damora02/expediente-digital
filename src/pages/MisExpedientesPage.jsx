import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { getEmpleados } from '../services/empleadoService';
import { obtenerArchivo, descargarArchivo } from '../services/expedienteService';

const DOCUMENTOS = [
  { tipo: 'contrato', label: 'Contrato laboral', icono: '📋' },
  { tipo: 'entrevista', label: 'Entrevista', icono: '🗣️' },
  { tipo: 'cv', label: 'Curriculum vitae (CV)', icono: '📄' },
];

function MisExpedientesPage() {
  const navigate = useNavigate();
  const [empleados, setEmpleados] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [pdfActivo, setPdfActivo] = useState(null);

  useEffect(() => {
    const cargar = async () => {
      try {
        const datos = await getEmpleados();
        setEmpleados(datos);
      } catch (err) {
        alert('No se pudieron cargar los expedientes.');
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, []);

  const empleadosFiltrados = empleados.filter((emp) => {
    const texto = busqueda.toLowerCase();
    return (
      emp.nombre?.toLowerCase().includes(texto) ||
      emp.apellido?.toLowerCase().includes(texto) ||
      emp.puesto?.toLowerCase().includes(texto)
    );
  });

  const handleVer = (empleadoId, tipo) => {
    const archivo = obtenerArchivo(empleadoId, tipo);
    if (!archivo) {
      alert('No hay archivo disponible para este documento.');
      return;
    }
    setPdfActivo({ base64: archivo.base64, nombre: archivo.nombre });
  };

  const handleDescargar = (empleadoId, tipo, label, empleado) => {
    descargarArchivo(empleadoId, tipo, `${label}_${empleado.nombre}_${empleado.apellido}.pdf`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Expedientes</h1>
            <p className="text-gray-500 text-sm mt-1">Consulte los expedientes del personal</p>
          </div>

          <div className="mb-4">
            <input
              type="text"
              placeholder="Buscar por nombre o puesto..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-72 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {cargando ? (
            <div className="text-center py-12">
              <p className="text-gray-400 animate-pulse">Cargando expedientes...</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {empleadosFiltrados.length === 0 ? (
                <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-200">
                  <p className="text-gray-400">No se encontraron empleados</p>
                </div>
              ) : (
                empleadosFiltrados.map((emp) => (
                  <div key={emp.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm flex-shrink-0">
                        {emp.nombre?.[0]}{emp.apellido?.[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{emp.nombre} {emp.apellido}</p>
                        <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">{emp.puesto}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {DOCUMENTOS.map(({ tipo, label, icono }) => {
                        const archivo = obtenerArchivo(emp.id, tipo);
                        const tieneArchivo = Boolean(archivo);
                        return (
                          <div key={tipo} className="border border-gray-100 rounded-lg p-3 bg-gray-50 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                              <span className="text-xl">{icono}</span>
                              <div>
                                <p className="text-xs font-medium text-gray-700">{label}</p>
                                <p className={`text-xs ${tieneArchivo ? 'text-green-600' : 'text-gray-400'}`}>
                                  {tieneArchivo ? archivo.nombre : 'Sin archivo'}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-1">
                              <button
                                onClick={() => handleVer(emp.id, tipo)}
                                disabled={!tieneArchivo}
                                className="text-xs bg-blue-50 text-blue-700 hover:bg-blue-100 px-2 py-1 rounded border border-blue-200 disabled:opacity-40 disabled:cursor-not-allowed"
                              >
                                👁️
                              </button>
                              <button
                                onClick={() => handleDescargar(emp.id, tipo, label, emp)}
                                disabled={!tieneArchivo}
                                className="text-xs bg-green-50 text-green-700 hover:bg-green-100 px-2 py-1 rounded border border-green-200 disabled:opacity-40 disabled:cursor-not-allowed"
                              >
                                ⬇️
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </main>
      </div>

      {pdfActivo && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-4xl h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <p className="font-medium text-gray-800 text-sm">{pdfActivo.nombre}</p>
              <button onClick={() => setPdfActivo(null)} className="text-gray-500 hover:text-gray-800 text-lg">✕</button>
            </div>
            <iframe src={pdfActivo.base64} className="flex-1 rounded-b-xl" title={pdfActivo.nombre} />
          </div>
        </div>
      )}
    </div>
  );
}

export default MisExpedientesPage;