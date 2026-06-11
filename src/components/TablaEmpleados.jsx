import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function TablaEmpleados({ empleados, onEditar, onEliminar }) {
  const navigate = useNavigate();
  const [busqueda, setBusqueda] = useState('');

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
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">

      <div className="p-4 border-b border-gray-200 flex items-center justify-between gap-4">
        <h2 className="font-semibold text-gray-800">
          Lista de empleados
          <span className="ml-2 text-sm font-normal text-gray-400">
            ({empleadosFiltrados.length} registros)
          </span>
        </h2>
        <input
          type="text"
          placeholder="Buscar"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm
                     w-72 focus:outline-none focus:ring-2 focus:ring-blue-500
                     focus:border-transparent"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Nombre</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Cédula</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Teléfono</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Correo</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Puesto</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Lugar de trabajo</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Ingreso</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {empleadosFiltrados.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-gray-400">
                  No se encontraron empleados
                </td>
              </tr>
            ) : (
              empleadosFiltrados.map((emp) => (
                <tr key={emp.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700
                                      flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {emp.nombre?.[0]}{emp.apellido?.[0]}
                      </div>
                      <p className="font-medium text-gray-800">
                        {emp.nombre} {emp.apellido}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{emp.cedula}</td>
                  <td className="px-4 py-3 text-gray-600">{emp.telefono}</td>
                  <td className="px-4 py-3 text-gray-600">{emp.correo}</td>
                  <td className="px-4 py-3 text-gray-600">{emp.puesto}</td>
                  <td className="px-4 py-3 text-gray-600">{emp.lugarTrabajo || '—'}</td>
                    
                  <td className="px-4 py-3 text-gray-600">
                    {emp.fechaIngreso
                      ? new Date(emp.fechaIngreso).toLocaleDateString('es-CR')
                      : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => navigate(`/expedientes/${emp.id}`)}
                        className="text-xs bg-green-50 text-green-700 hover:bg-green-100
                                   px-2 py-1 rounded-lg border border-green-200 transition-colors"
                      >
                        📁 Exp.
                      </button>
                      <button
                        onClick={() => onEditar(emp.id)}
                        className="text-xs bg-yellow-50 text-yellow-700 hover:bg-yellow-100
                                   px-2 py-1 rounded-lg border border-yellow-200 transition-colors"
                      >
                        ✏️ Editar
                      </button>
                      <button
                        onClick={() => onEliminar(emp.id)}
                        className="text-xs bg-red-50 text-red-700 hover:bg-red-100
                                   px-2 py-1 rounded-lg border border-red-200 transition-colors"
                      >
                        🗑️ Borrar
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TablaEmpleados;