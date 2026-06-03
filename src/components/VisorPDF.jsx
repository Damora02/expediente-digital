import React from 'react';

function VisorPDF({ base64, nombre, onCerrar }) {
  if (!base64) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col">

        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📄</span>
            <div>
              <h3 className="font-semibold text-gray-800 text-sm">
                Visualizando documento
              </h3>
              {nombre && (
                <p className="text-xs text-gray-500">{nombre}</p>
              )}
            </div>
          </div>
          <button
            onClick={onCerrar}
            className="text-gray-400 hover:text-gray-700 hover:bg-gray-100
                       w-8 h-8 rounded-full flex items-center justify-center
                       transition-colors text-lg"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 p-1 overflow-hidden rounded-b-xl">
          <iframe
            src={base64}
            title={nombre || 'Documento PDF'}
            className="w-full h-full rounded-lg border-0"
          />
        </div>

      </div>
    </div>
  );
}

export default VisorPDF;