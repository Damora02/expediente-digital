import React, { useState, useEffect } from 'react';

const VACIO = {
  nombre: '',
  apellido: '',
  cedula: '',
  telefono: '',
  correo: '',
  puesto: '',
  fechaIngreso: '',
};

const Campo = ({ label, name, type = 'text', requerido = true, value, onChange, disabled, error }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {requerido && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed transition ${error ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white hover:border-gray-400'}`}
    />
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

const CampoPDF = ({ label, tipo, nombreActual, archivo, onChange, disabled }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} <span className="text-gray-400 font-normal">(PDF)</span>
    </label>
    <div className="border border-dashed border-gray-300 rounded-lg p-3 bg-gray-50 hover:bg-gray-100 transition-colors">
      <input
        type="file"
        accept="application/pdf"
        onChange={onChange}
        disabled={disabled}
        className="w-full text-sm text-gray-600 file:mr-3 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
      />
      {archivo && (
        <p className="text-xs text-green-600 mt-1.5 font-medium">✅ {archivo.name}</p>
      )}
      {!archivo && nombreActual && (
        <p className="text-xs text-blue-600 mt-1.5">📎 Archivo actual: {nombreActual}</p>
      )}
    </div>
  </div>
);

function FormularioEmpleado({ datosIniciales, onGuardar, cargando }) {
  const [form, setForm] = useState(VACIO);
  const [archivos, setArchivos] = useState({
    contrato: null,
    entrevista: null,
    cv: null,
  });
  const [errores, setErrores] = useState({});

  useEffect(() => {
    if (datosIniciales) {
      setForm({
        nombre:       datosIniciales.nombre       || '',
        apellido:     datosIniciales.apellido     || '',
        cedula:       datosIniciales.cedula       || '',
        telefono:     datosIniciales.telefono     || '',
        correo:       datosIniciales.correo       || '',
        puesto:       datosIniciales.puesto       || '',
        fechaIngreso: datosIniciales.fechaIngreso || '',
      });
    }
  }, [datosIniciales]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errores[name]) {
      setErrores((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleArchivo = (e, tipo) => {
    const archivo = e.target.files[0];
    if (!archivo) return;
    if (archivo.type !== 'application/pdf') {
      alert('Solo se permiten archivos PDF');
      e.target.value = '';
      return;
    }
    setArchivos((prev) => ({ ...prev, [tipo]: archivo }));
  };

  const validar = () => {
    const nuevosErrores = {};
    if (!form.nombre.trim())      nuevosErrores.nombre       = 'El nombre es requerido';
    if (!form.apellido.trim())    nuevosErrores.apellido     = 'El apellido es requerido';
    if (!form.cedula.trim())      nuevosErrores.cedula       = 'La cedula es requerida';
    if (!form.telefono.trim())    nuevosErrores.telefono     = 'El telefono es requerido';
    if (!form.correo.trim())      nuevosErrores.correo       = 'El correo es requerido';
    if (!form.puesto.trim())      nuevosErrores.puesto       = 'El puesto es requerido';
    if (!form.fechaIngreso)       nuevosErrores.fechaIngreso = 'La fecha de ingreso es requerida';
    if (form.correo && !/\S+@\S+\.\S+/.test(form.correo)) {
      nuevosErrores.correo = 'Formato de correo invalido';
    }
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validar()) return;
    onGuardar(form, archivos);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 pb-2 border-b">
          Datos personales
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Campo label="Nombre"             name="nombre"       value={form.nombre}       onChange={handleChange} disabled={cargando} error={errores.nombre} />
          <Campo label="Apellido"           name="apellido"     value={form.apellido}     onChange={handleChange} disabled={cargando} error={errores.apellido} />
          <Campo label="Cedula"             name="cedula"       value={form.cedula}       onChange={handleChange} disabled={cargando} error={errores.cedula} />
          <Campo label="Telefono"           name="telefono"     value={form.telefono}     onChange={handleChange} disabled={cargando} error={errores.telefono} />
          <Campo label="Correo electronico" name="correo"       value={form.correo}       onChange={handleChange} disabled={cargando} error={errores.correo} type="email" />
          <Campo label="Puesto"             name="puesto"       value={form.puesto}       onChange={handleChange} disabled={cargando} error={errores.puesto} />
          <Campo label="Fecha de ingreso"   name="fechaIngreso" value={form.fechaIngreso} onChange={handleChange} disabled={cargando} error={errores.fechaIngreso} type="date" />
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 pb-2 border-b">
          Documentos adjuntos
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <CampoPDF label="Contrato laboral"      tipo="contrato"   nombreActual={datosIniciales?.contrato}   archivo={archivos.contrato}   onChange={(e) => handleArchivo(e, 'contrato')}   disabled={cargando} />
          <CampoPDF label="Entrevista"             tipo="entrevista" nombreActual={datosIniciales?.entrevista} archivo={archivos.entrevista} onChange={(e) => handleArchivo(e, 'entrevista')} disabled={cargando} />
          <CampoPDF label="Curriculum vitae (CV)"  tipo="cv"         nombreActual={datosIniciales?.cv}         archivo={archivos.cv}         onChange={(e) => handleArchivo(e, 'cv')}         disabled={cargando} />
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={cargando}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium text-sm transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm"
        >
          {cargando ? <><span className="animate-spin">⏳</span> Guardando...</> : <>💾 Guardar empleado</>}
        </button>
      </div>
    </form>
  );
}

export default FormularioEmpleado;
   