import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import VisorPDF from '../components/VisorPDF';
import { getEmpleadoPorId } from '../services/empleadoService';
import { obtenerArchivo, subirArchivo, descargarArchivo } from '../services/expedienteService';
import { useAuth } from '../context/AuthContext';

const DOCUMENTOS = [
  { tipo: 'contrato', label: 'Contrato laboral', icono: '📋' },
  { tipo: 'entrevista', label: 'Entrevista', icono: '🗣️' },
  { tipo: 'cv', label: 'Curriculum vitae (CV)', icono: '📄' },
];

function ExpedientesPage() {
  const { id } = useParams();
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const [empleado, setEmpleado] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [pdfActivo, setPdfActivo] = useState(null);
  const [subiendo, setSubiendo] = useState({});

  const empleadoId = usuario?.rol === 'admin' ? id : usuario?.empleadoId;

  const estiloImpresion = `
    @media print {
      body * { visibility: hidden; }
      #expediente-imprimible, #expediente-imprimible * { visibility: visible; }
      #expediente-imprimible { position: absolute; top: 0; left: 0; width: 100%; padding: 20px; }
      .no-imprimir { display: none !important; }
    }
    @media screen {
      .print-only { display: none !important; }
    }
  `;

  useEffect(() => {
    const cargar = async () => {
      try {
        const datos = await getEmpleadoPorId(empleadoId);
        setEmpleado(datos);
      } catch (err) {
        alert('No se pudo cargar el expediente.');
        navigate(usuario?.rol === 'admin' ? '/empleados' : '/dashboard');
      } finally {
        setCargando(false);
      }
    };
    if (empleadoId) cargar();
  }, [empleadoId, navigate, usuario?.rol]);

  const handleVer = (tipo) => {
    const archivo = obtenerArchivo(empleadoId, tipo);
    if (!archivo) {
      alert('No hay archivo disponible para este documento.');
      return;
    }
    setPdfActivo({ base64: archivo.base64, nombre: archivo.nombre });
  };

  const handleDescargar = (tipo, label) => {
    descargarArchivo(empleadoId, tipo, `${label}_${empleado?.nombre}_${empleado?.apellido}.pdf`);
  };

  const handleSubir = async (e, tipo) => {
    const archivo = e.target.files[0];
    if (!archivo) return;
    if (archivo.type !== 'application/pdf') {
      alert('Solo se permiten archivos PDF');
      e.target.value = '';
      return;
    }
    setSubiendo((prev) => ({ ...prev, [tipo]: true }));
    try {
      await subirArchivo(empleadoId, tipo, archivo);
      alert('Archivo subido correctamente');
    } catch (err) {
      alert('Error al subir el archivo.');
    } finally {
      setSubiendo((prev) => ({ ...prev, [tipo]: false }));
      e.target.value = '';
    }
  };

  if (cargando) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 flex items-center justify-center">
            <p className="text-gray-400 animate-pulse text-lg">Cargando expediente...</p>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <style>{estiloImpresion}</style>
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 pl-14">

          {/* Encabezado pantalla — oculto al imprimir */}
          <div className="flex items-center gap-3 mb-6 no-imprimir">
            <button
              onClick={() => navigate(usuario?.rol === 'admin' ? '/empleados' : '/dashboard')}
              className="text-gray-500 hover:text-gray-800 hover:bg-gray-100 p-2 rounded-lg transition-colors"
            >
              ← Volver
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Expediente digital</h1>
              <p className="text-gray-500 text-sm mt-0.5">
                {empleado?.nombre} {empleado?.apellido} - {empleado?.puesto}
              </p>
            </div>
          </div>

          {/* Tarjeta de datos — solo esto se imprime */}
          <div id="expediente-imprimible" className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 mb-6">

            {/* Solo visible al imprimir */}
            <div className="print-only text-center mb-4">
              <h2 className="text-lg font-bold text-gray-800">Deco Pastel Costa Rica</h2>
              <p className="text-sm text-gray-500">Expediente digital</p>
              <p className="text-xs text-gray-400 mt-1">
                {empleado?.nombre} {empleado?.apellido} — {empleado?.puesto}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xl font-bold flex-shrink-0">
                {empleado?.nombre?.[0]}{empleado?.apellido?.[0]}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1">
                <div>
                  <p className="text-xs text-gray-400">Cedula</p>
                  <p className="text-sm font-medium text-gray-700">{empleado?.cedula || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Telefono</p>
                  <p className="text-sm font-medium text-gray-700">{empleado?.telefono || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Correo</p>
                  <p className="text-sm font-medium text-gray-700">{empleado?.correo || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Fecha de ingreso</p>
                  <p className="text-sm font-medium text-gray-700">
                    {empleado?.fechaIngreso ? new Date(empleado.fechaIngreso).toLocaleDateString('es-CR') : '-'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Lugar de trabajo</p>
                  <p className="text-sm font-medium text-gray-700">{empleado?.lugarTrabajo || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Nacionalidad</p>
                  <p className="text-sm font-medium text-gray-700">{empleado?.nacionalidad || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Género</p>
                  <p className="text-sm font-medium text-gray-700">{empleado?.genero || '-'}</p>
                </div>

                {/* Solo visibles si tienen valor */}
                {empleado?.edad && (
                  <div>
                    <p className="text-xs text-gray-400">Edad</p>
                    <p className="text-sm font-medium text-gray-700">{empleado.edad}</p>
                  </div>
                )}
                {empleado?.estadoCivil && (
                  <div>
                    <p className="text-xs text-gray-400">Estado civil</p>
                    <p className="text-sm font-medium text-gray-700">{empleado.estadoCivil}</p>
                  </div>
                )}
                {empleado?.iban && (
                  <div className="col-span-2">
                    <p className="text-xs text-gray-400">IBAN</p>
                    <p className="text-sm font-medium text-gray-700">{empleado.iban}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Documentos — ocultos al imprimir */}
          <div className="no-imprimir">
            <h2 className="font-semibold text-gray-700 mb-4">Documentos del expediente</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {DOCUMENTOS.map(({ tipo, label, icono }) => {
                const archivo = obtenerArchivo(empleadoId, tipo);
                const tieneArchivo = Boolean(archivo);
                return (
                  <div key={tipo} className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{icono}</span>
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">{label}</p>
                        <p className={`text-xs mt-0.5 ${tieneArchivo ? 'text-green-600' : 'text-gray-400'}`}>
                          {tieneArchivo ? archivo.nombre : 'Sin archivo cargado'}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => handleVer(tipo)}
                        disabled={!tieneArchivo}
                        className="w-full text-sm bg-blue-50 text-blue-700 hover:bg-blue-100 py-2 rounded-lg border border-blue-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed font-medium"
                      >
                        👁️ Visualizar
                      </button>
                      <button
                        onClick={() => handleDescargar(tipo, label)}
                        disabled={!tieneArchivo}
                        className="w-full text-sm bg-green-50 text-green-700 hover:bg-green-100 py-2 rounded-lg border border-green-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed font-medium"
                      >
                        ⬇️ Descargar
                      </button>
                      <label className={`w-full text-sm text-center cursor-pointer py-2 rounded-lg transition-colors font-medium ${subiendo[tipo] ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100 border border-yellow-200'}`}>
                        {subiendo[tipo] ? 'Subiendo...' : tieneArchivo ? '🔄 Reemplazar' : '⬆️ Cargar archivo'}
                        <input
                          type="file"
                          accept="application/pdf"
                          className="hidden"
                          disabled={subiendo[tipo]}
                          onChange={(e) => handleSubir(e, tipo)}
                        />
                      </label>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </main>
      </div>
      {pdfActivo && (
        <VisorPDF
          base64={pdfActivo.base64}
          nombre={pdfActivo.nombre}
          onCerrar={() => setPdfActivo(null)}
        />
      )}
    </div>
  );
}

export default ExpedientesPage;