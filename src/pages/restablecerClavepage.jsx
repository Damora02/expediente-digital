import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { restablecerPassword } from '../services/authService';

function RestablecerClavepage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [passwordNueva, setPasswordNueva] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');
  const [error, setError] = useState('');
  const [exito, setExito] = useState(false);
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!token) {
      setError('El enlace no es valido. Solicite uno nuevo.');
      return;
    }
    if (passwordNueva.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    if (passwordNueva !== confirmarPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setCargando(true);
    try {
      await restablecerPassword(token, passwordNueva);
      setExito(true);
      setTimeout(() => navigate('/'), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'El enlace es invalido o ya expiro');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#FF33CC' }}>
      <div className="rounded-2xl shadow-xl w-full max-w-md p-8" style={{ background: '#00BFFF', border: '1px solid #0099cc' }}>
        <h1 className="text-xl font-bold mb-4" style={{ color: '#cc00a3' }}>Restablecer contraseña</h1>

        {!token ? (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
            ⚠️ Enlace invalido. Por favor solicite uno nuevo desde la pantalla de inicio de sesion.
          </div>
        ) : exito ? (
          <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-lg">
            ✅ Contraseña actualizada correctamente. Sera redirigido al inicio de sesion...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: '#FF33CC' }}>Nueva contraseña</label>
              <input
                type="password"
                value={passwordNueva}
                onChange={(e) => setPasswordNueva(e.target.value)}
                disabled={cargando}
                required
                className="w-full border border-cyan-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none disabled:bg-gray-50 bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: '#FF33CC' }}>Confirmar contraseña</label>
              <input
                type="password"
                value={confirmarPassword}
                onChange={(e) => setConfirmarPassword(e.target.value)}
                disabled={cargando}
                required
                className="w-full border border-cyan-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none disabled:bg-gray-50 bg-white"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">⚠️ {error}</div>
            )}

            <button
              type="submit"
              disabled={cargando}
              className="w-full text-white font-semibold py-2.5 rounded-lg disabled:opacity-60"
              style={{ background: '#FF33CC' }}
            >
              {cargando ? 'Guardando...' : 'Restablecer contraseña'}
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

export default RestablecerClavepage;