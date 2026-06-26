import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { getEmpleados } from '../services/empleadoService';
import { listarDocumentos, descargarArchivo } from '../services/expedienteService';

function MisExpedientesPage() {
  const navigate = useNavigate();
  const [empleados, setEmpleados] = useState([]);
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(null);
  const [documentosSeleccionado, setDocumentosSeleccionado] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(true);

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
    const cargarEmpleados = async () => {
      try {
        const lista = await getEmpleados();
        setEmpleados(lista);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setCargando(false);
      }
    };
    cargarEmpleados();
  }, []);

  const formatearFecha = (fecha) => {
    if (!fecha) return 'No registrada';
    return new Date(fecha).toLocaleDateString('es-CR');
  };

  const enmascararIban = (iban) => {
    if (!iban) return '—';
    const limpio = iban.replace(/\s/g, '').toUpperCase();
    return limpio.match(/.{1,4}/g)?.join(' ') || limpio;
  };

  const seleccionarEmpleado = async (emp) => {
    setEmpleadoSeleccionado(emp);
    const docs = await listarDocumentos(emp.id);
    setDocumentosSeleccionado(docs);
  };

  const empleadosFiltrados = empleados.filter((emp) => {
    if (!busqueda.trim()) return true;
    const texto = busqueda.toLowerCase();
    const textoSinGuiones = texto.replace(/\D/g, '');
    return (
      emp.nombre?.toLowerCase().includes(texto) ||
      emp.apellido?.toLowerCase().includes(texto) ||
      emp.numeroIdentificacion?.toLowerCase().includes(texto) ||
      (textoSinGuiones && emp.numeroIdentificacion?.replace(/\D/g, '').includes(textoSinGuiones)) ||
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

  const handleDescargar = (tipo, label) => {
    descargarArchivo(
      empleadoSeleccionado.id,
      tipo,
      `${label}_${empleadoSeleccionado.nombre}_${empleadoSeleccionado.apellido}.pdf`
    );
  };

  if (empleadoSeleccionado) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <style>{estiloImpresion}</style>
        <Navbar />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 p-6 pl-14">

            <div className="flex items-center gap-3 mb-6 no-imprimir">
              <button
                onClick={() => setEmpleadoSeleccionado(null)}
                className="text-sm font-medium text-gray-700 hover:text-gray-800 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors"
              >
                ← Volver
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Expediente digital</h1>
                <p className="text-gray-500 text-sm mt-0.5">
                  {empleadoSeleccionado.nombre} {empleadoSeleccionado.apellido}
                </p>
              </div>
            </div>

            <div id="expediente-imprimible" className="bg-white rounded-xl border border-gray-200 overflow-hidden max-w-2xl mb-6">

              <div className="print-only text-center py-4 px-5 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-800">Deco Pastel Costa Rica</h2>
                <p className="text-sm text-gray-500">Expediente digital</p>
                <p className="text-xs text-gray-400 mt-1">
                  {empleadoSeleccionado.nombre} {empleadoSeleccionado.apellido}
                </p>
              </div>

              <div className="p-5 flex items-center gap-4 no-imprimir" style={{ background: '#FF33CC' }}>
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-white flex-shrink-0"
                  style={{ background: 'rgba(255,255,255,0.25)' }}>
                  {empleadoSeleccionado.nombre?.charAt(0)}{empleadoSeleccionado.apellido?.charAt(0)}
                </div>
                <div>
                  <p className="text-white font-semibold text-base">
                    {empleadoSeleccionado.nombre} {empleadoSeleccionado.apellido}
                  </p>
                </div>
              </div>

              {/* Datos personales */}
              <div className="p-5 border-b border-gray-100">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Datos personales</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-400">
                      {empleadoSeleccionado.tipoIdentificacion === 'extranjero' ? 'Núm. Extranjero' :
                       empleadoSeleccionado.tipoIdentificacion === 'pasaporte' ? 'Pasaporte' : 'Cédula'}
                    </p>
                    <p className="text-sm font-medium text-gray-700">
                      {empleadoSeleccionado.numeroIdentificacion || empleadoSeleccionado.cedula || '—'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Teléfono</p>
                    <p className="text-sm font-medium text-gray-700">{empleadoSeleccionado.telefono || '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Correo</p>
                    <p className="text-sm font-medium text-gray-700">{empleadoSeleccionado.correo || '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Fecha de ingreso</p>
                    <p className="text-sm font-medium text-gray-700">{formatearFecha(empleadoSeleccionado.fechaIngreso)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Lugar de trabajo</p>
                    <p className="text-sm font-medium text-gray-700">{empleadoSeleccionado.lugarTrabajo || '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Puesto</p>
                    <p className="text-sm font-medium text-gray-700">{empleadoSeleccionado.puesto || '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Nacionalidad</p>
                    <p className="text-sm font-medium text-gray-700">{empleadoSeleccionado.nacionalidad || '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Género</p>
                    <p className="text-sm font-medium text-gray-700">{empleadoSeleccionado.genero || '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Edad</p>
                    <p className="text-sm font-medium text-gray-700">{empleadoSeleccionado.edad || '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Estado civil</p>
                    <p className="text-sm font-medium text-gray-700">{empleadoSeleccionado.estadoCivil || '—'}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-gray-400">IBAN</p>
                    <p className="text-sm font-medium text-gray-700">{enmascararIban(empleadoSeleccionado.iban)}</p>
                  </div>
                </div>
              </div>

              {/* Documentos */}
              <div className="p-5 border-b border-gray-100 no-imprimir">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Documentos adjuntos</p>
                <div className="flex flex-col gap-2">
                  {[
                    { label: 'Contrato laboral', tipo: 'contrato' },
                    { label: 'Entrevista', tipo: 'entrevista' },
                    { label: 'Curriculum (CV)', tipo: 'cv' },
                    { label: 'Cédula', tipo: 'cedula' },
                  ].map((doc) => {
                    const archivo = documentosSeleccionado.find((d) => d.tipo === doc.tipo);
                    return (
                      <div key={doc.tipo}
                        className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 bg-gray-50">
                        <span className="text-lg">📄</span>
                        <span className="flex-1 text-sm text-gray-700 font-medium">{doc.label}</span>
                        {archivo ? (
                          <button
                            onClick={() => handleDescargar(doc.tipo, doc.label)}
                            className="text-xs px-3 py-1 rounded-full font-medium border"
                            style={{ background: '#FF33CC11', color: '#cc00a3', borderColor: '#FF33CC33' }}
                          >
                            ⬇️ Descargar
                          </button>
                        ) : (
                          <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-400 border border-gray-200">
                            No adjunto
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="p-4 flex gap-3 no-imprimir">
                <button
                  onClick={() => navigate(`/expedientes/${empleadoSeleccionado.id}`)}
                  className="flex-1 py-2.5 rounded-lg text-white text-sm font-medium border-none cursor-pointer"
                  style={{ background: '#FF33CC' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#cc00a3'}
                  onMouseLeave={e => e.currentTarget.style.background = '#FF33CC'}
                >
                  👁️ Ver expediente completo
                </button>
                <button
                  onClick={() => window.print()}
                  className="flex-1 py-2.5 rounded-lg text-white text-sm font-medium border-none cursor-pointer"
                  style={{ background: '#00BFFF' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#0099cc'}
                  onMouseLeave={e => e.currentTarget.style.background = '#00BFFF'}
                >
                  🖨️ Imprimir
                </button>
              </div>

            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 pl-14">

          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Expedientes</h1>
            <p className="text-gray-400 text-sm mt-1">Seleccione un empleado para ver su expediente</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between gap-4">
              <h2 className="font-semibold text-gray-700">
                Directorio de empleados
                <span className="ml-2 text-sm font-normal text-gray-400">
                  ({empleadosFiltrados.length} registros)
                </span>
              </h2>
              <input
                type="text"
                placeholder="Buscar..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-pink-400"
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
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {empleadosFiltrados.map((emp) => (
                      <tr key={emp.id} className="hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => seleccionarEmpleado(emp)}>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                              {emp.nombre?.[0]}{emp.apellido?.[0]}
                            </div>
                            <p className="font-medium text-gray-800">{emp.nombre} {emp.apellido}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          {emp.numeroIdentificacion || emp.cedula || '—'}
                        </td>
                        <td className="px-4 py-3 text-gray-600">{emp.puesto}</td>
                        <td className="px-4 py-3 text-gray-600">{emp.lugarTrabajo || '—'}</td>
                        <td className="px-4 py-3 text-gray-600">{formatearFecha(emp.fechaIngreso)}</td>
                        <td className="px-4 py-3">
                          <button
                            onClick={(e) => { e.stopPropagation(); seleccionarEmpleado(emp); }}
                            className="text-xs px-3 py-1.5 rounded-lg font-medium border border-pink-200 transition-colors"
                            style={{ background: '#FF33CC11', color: '#cc00a3' }}
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

export default MisExpedientesPage;
