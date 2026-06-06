import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { getEmpleados } from '../services/empleadoService';

function MisExpedientesPage() {
  const { usuario } = useAuth();
  const [expediente, setExpediente] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarExpediente = async () => {
      try {
        const empleados = await getEmpleados();
        const miExpediente = empleados.find(
          (e) => String(e.id) === String(usuario?.empleadoId)
        );
        setExpediente(miExpediente);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setCargando(false);
      }
    };
    cargarExpediente();
  }, [usuario]);

  const formatearFecha = (fecha) => {
    if (!fecha) return 'No registrada';
    return new Date(fecha).toLocaleDateString('es-CR');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 pl-14">

          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Mi expediente</h1>
            <p className="text-gray-400 text-sm mt-1">
              {new Date().toLocaleDateString('es-CR')}
            </p>
          </div>

          {cargando ? (
            <div className="flex items-center justify-center h-40">
              <p className="text-gray-400 text-sm">Cargando expediente...</p>
            </div>
          ) : expediente ? (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden max-w-xl">

              <div className="p-5 flex items-center gap-4"
                style={{ background: '#FF33CC' }}>
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-white flex-shrink-0"
                  style={{ background: 'rgba(255,255,255,0.25)' }}>
                  {expediente.nombre?.charAt(0)}{expediente.apellido?.charAt(0)}
                </div>
                <div>
                  <p className="text-white font-semibold text-base">
                    {expediente.nombre} {expediente.apellido}
                  </p>
                  <p className="text-white text-xs opacity-80 capitalize">
                    {expediente.puesto}
                  </p>
                </div>
              </div>

              <div className="p-5 border-b border-gray-100">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  Datos personales
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-400">Cédula</p>
                    <p className="text-sm font-medium text-gray-700">{expediente.cedula || 'No registrada'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Teléfono</p>
                    <p className="text-sm font-medium text-gray-700">{expediente.telefono || 'No registrado'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Correo</p>
                    <p className="text-sm font-medium text-gray-700">{expediente.correo || 'No registrado'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Fecha de ingreso</p>
                    <p className="text-sm font-medium text-gray-700">{formatearFecha(expediente.fechaIngreso)}</p>
                  </div>
                  {/* ← nuevo */}
                  <div>
                    <p className="text-xs text-gray-400">Lugar de trabajo</p>
                    <p className="text-sm font-medium text-gray-700">{expediente.lugarTrabajo || 'No registrado'}</p>
                  </div>
                </div>
              </div>

              <div className="p-5 border-b border-gray-100">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  Documentos adjuntos
                </p>
                <div className="flex flex-col gap-2">
                  {[
                    { label: 'Contrato', valor: expediente.contrato },
                    { label: 'Entrevista', valor: expediente.entrevista },
                    { label: 'Curriculum (CV)', valor: expediente.cv },
                  ].map((doc) => (
                    <div key={doc.label}
                      className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 bg-gray-50">
                      <span className="text-lg">📄</span>
                      <span className="flex-1 text-sm text-gray-700 font-medium">{doc.label}</span>
                      {doc.valor ? (
                        <a href={doc.valor} target="_blank" rel="noopener noreferrer"
                          className="text-xs px-3 py-1 rounded-full font-medium border"
                          style={{ background: '#FF33CC11', color: '#cc00a3', borderColor: '#FF33CC33' }}>
                          Ver
                        </a>
                      ) : (
                        <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-400 border border-gray-200">
                          No adjunto
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 flex gap-3">
                <button
                  onClick={() => setModalAbierto(true)}
                  className="flex-1 py-2.5 rounded-lg text-white text-sm font-medium border-none cursor-pointer"
                  style={{ background: '#FF33CC' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#cc00a3'}
                  onMouseLeave={e => e.currentTarget.style.background = '#FF33CC'}
                >
                  📥 Descargar PDF
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
          ) : (
            <div className="flex items-center justify-center h-40 bg-white rounded-xl border border-gray-200">
              <p className="text-gray-400 text-sm">No se encontró tu expediente.</p>
            </div>
          )}

        </main>
      </div>

      {modalAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.4)' }}
          onClick={() => setModalAbierto(false)}>
          <div className="bg-white rounded-xl overflow-hidden w-full max-w-sm mx-4"
            onClick={e => e.stopPropagation()}>

            <div className="p-4 flex items-center justify-between"
              style={{ background: '#FF33CC' }}>
              <span className="text-white font-medium text-sm">📄 Descargar expediente</span>
              <button onClick={() => setModalAbierto(false)}
                className="text-white text-lg border-none bg-transparent cursor-pointer">✕</button>
            </div>

            <div className="p-5 flex flex-col items-center gap-3 text-center">
              <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl"
                style={{ background: '#FF33CC15' }}>📄</div>
              <p className="text-sm font-medium text-gray-700">
                Expediente_{expediente?.nombre}_{expediente?.apellido}.pdf
              </p>
              <p className="text-xs text-gray-400">
                Incluye datos personales y documentos adjuntos
              </p>
            </div>

            <div className="p-4 flex gap-3 border-t border-gray-100">
              <button
                className="flex-1 py-2.5 rounded-lg text-white text-sm font-medium border-none cursor-pointer"
                style={{ background: '#FF33CC' }}
                onClick={() => setModalAbierto(false)}
              >
                📥 Confirmar descarga
              </button>
              <button
                className="flex-1 py-2.5 rounded-lg text-sm font-medium border border-gray-200 bg-white text-gray-600 cursor-pointer"
                onClick={() => setModalAbierto(false)}
              >
                Cancelar
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default MisExpedientesPage;