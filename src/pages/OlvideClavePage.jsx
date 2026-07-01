import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { solicitarRecuperacion } from '../services/authService';

function OlvidePasswordPage() {
  const [correo, setCorreo] = useState('');
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);
    try {
      await solicitarRecuperacion(correo);
      setEnviado(true);
    } catch (err) {
      setError('Ocurrio un error. Intente nuevamente.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#FF33CC' }}>
      <div className="rounded-2xl shadow-xl w-full max-w-md p-8" style={{ background: '#00BFFF', border: '1px solid #0099cc' }}>
        <h1 className="text-xl font-bold mb-2" style={{ color: '#cc00a3' }}>Recuperar contraseña</h1>

        {enviado ? (
          <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-lg">
            ✅ Si el correo existe en nuestro sistema, recibira un enlace para restablecer su contraseña. Revise su bandeja de entrada.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-cyan-700 text-sm">Ingrese su correo registrado y le enviaremos un enlace para restablecer su contraseña.</p>
            <input
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              placeholder="su.correo@ejemplo.com"
              disabled={cargando}
              required
              className="w-full border border-cyan-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none disabled:bg-gray-50 bg-white"
            />
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">⚠️ {error}</div>
            )}
            <button
              type="submit"
              disabled={cargando}
              className="w-full text-white font-semibold py-2.5 rounded-lg disabled:opacity-60"
              style={{ background: '#FF33CC' }}
            >
              {cargando ? 'Enviando...' : 'Enviar enlace de recuperacion'}
            </button>
          </form>
        )}

        <Link to="/" className="block text-center text-sm mt-4" style={{ color: '#cc00a3' }}>
          ← Volver al inicio de sesion
        </Link>
      </div>
    </div>
  );
}

export default OlvidePasswordPage;