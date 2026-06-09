import React, { useState, useEffect } from 'react';

const VACIO = {
  nombre: '',
  apellido: '',
  cedula: '',
  telefono: '',
  correo: '',
  puesto: '',
  fechaIngreso: '',
  lugarTrabajo: '',
  nacionalidad: '',
  genero: '',
  edad: '',
  estadoCivil: '',
  iban: '',
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

// Opciones de estado civil según género
const opcionesEstadoCivil = (genero) => {
  if (genero === 'Masculino') {
    return ['Soltero', 'Casado', 'Viudo', 'Divorciado'];
  } else if (genero === 'Femenino') {
    return ['Soltera', 'Casada', 'Viuda', 'Divorciada'];
  }
  return ['Soltero/a', 'Casado/a', 'Viudo/a', 'Divorciado/a'];
};

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
        lugarTrabajo: datosIniciales.lugarTrabajo || '',
        nacionalidad: datosIniciales.nacionalidad || '',
        genero:       datosIniciales.genero       || '',
        edad:         datosIniciales.edad         || '',
        estadoCivil:  datosIniciales.estadoCivil  || '',
        iban:         datosIniciales.iban         || '',
      });
    }
  }, [datosIniciales]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Si cambia el género, limpiar estado civil
    if (name === 'genero') {
      setForm((prev) => ({ ...prev, genero: value, estadoCivil: '' }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
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
    if (!form.nombre.trim())       nuevosErrores.nombre       = 'El nombre es requerido';
    if (!form.apellido.trim())     nuevosErrores.apellido     = 'El apellido es requerido';
    if (!form.cedula.trim())       nuevosErrores.cedula       = 'La cedula es requerida';
    if (!form.telefono.trim())     nuevosErrores.telefono     = 'El telefono es requerido';
    if (!form.correo.trim())       nuevosErrores.correo       = 'El correo es requerido';
    if (!form.puesto.trim())       nuevosErrores.puesto       = 'El puesto es requerido';
    if (!form.fechaIngreso)        nuevosErrores.fechaIngreso = 'La fecha de ingreso es requerida';
    if (!form.nacionalidad.trim()) nuevosErrores.nacionalidad = 'La nacionalidad es requerida';
    if (!form.genero)              nuevosErrores.genero       = 'El género es requerido';
    if (form.correo && !/\S+@\S+\.\S+/.test(form.correo)) {
      nuevosErrores.correo = 'Formato de correo invalido';
    }
    // Validar IBAN solo si fue ingresado: CR + 20 dígitos
    if (form.iban && !/^CR\d{20}$/.test(form.iban.replace(/\s/g, ''))) {
      nuevosErrores.iban = 'Formato inválido. Debe ser CR seguido de 20 dígitos';
    }
    // Validar edad solo si fue ingresada
    if (form.edad && (isNaN(form.edad) || form.edad < 18 || form.edad > 99)) {
      nuevosErrores.edad = 'Ingrese una edad válida entre 18 y 99';
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
          <Campo label="Lugar de trabajo"   name="lugarTrabajo" value={form.lugarTrabajo} onChange={handleChange} disabled={cargando} error={errores.lugarTrabajo} />
          <Campo label="Nacionalidad"       name="nacionalidad" value={form.nacionalidad} onChange={handleChange} disabled={cargando} error={errores.nacionalidad} />

          {/* Género */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Género <span className="text-red-500">*</span>
            </label>
            <select
              name="genero"
              value={form.genero}
              onChange={handleChange}
              disabled={cargando}
              className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed transition ${errores.genero ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white hover:border-gray-400'}`}
            >
              <option value="">Seleccione...</option>
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
            </select>
            {errores.genero && <p className="text-red-500 text-xs mt-1">{errores.genero}</p>}
          </div>

          {/* Edad — opcional */}
          <Campo
            label="Edad"
            name="edad"
            value={form.edad}
            onChange={handleChange}
            disabled={cargando}
            error={errores.edad}
            type="number"
            requerido={false}
          />

          {/* Estado civil — opcional, cambia según género */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estado civil
            </label>
            <select
              name="estadoCivil"
              value={form.estadoCivil}
              onChange={handleChange}
              disabled={cargando || !form.genero}
              className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed transition ${errores.estadoCivil ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white hover:border-gray-400'}`}
            >
              <option value="">{form.genero ? 'Seleccione...' : 'Primero seleccione género'}</option>
              {opcionesEstadoCivil(form.genero).map((op) => (
                <option key={op} value={op}>{op}</option>
              ))}
            </select>
            {errores.estadoCivil && <p className="text-red-500 text-xs mt-1">{errores.estadoCivil}</p>}
          </div>

          {/* IBAN — opcional */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Número de cuenta IBAN <span className="text-gray-400 font-normal">(CR + 20 dígitos)</span>
            </label>
            <input
              type="text"
              name="iban"
              value={form.iban}
              onChange={handleChange}
              disabled={cargando}
              placeholder="CR00000000000000000000"
              maxLength={22}
              className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed transition ${errores.iban ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white hover:border-gray-400'}`}
            />
            {errores.iban && <p className="text-red-500 text-xs mt-1">{errores.iban}</p>}
          </div>

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
          className="text-white px-6 py-2.5 rounded-lg font-medium text-sm transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm"
          style={{ background: '#00BFFF' }}
          onMouseEnter={e => e.currentTarget.style.background = '#0099cc'}
          onMouseLeave={e => e.currentTarget.style.background = '#00BFFF'}
        >
          {cargando ? <><span className="animate-spin">⏳</span> Guardando...</> : <>💾 Guardar empleado</>}
        </button>
      </div>
    </form>
  );
}

export default FormularioEmpleado;