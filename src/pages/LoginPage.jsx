import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login as loginService } from '../services/authService';

function LoginPage() {
  const { login } = useAuth();
  const navigate  = useNavigate();

  const [form, setForm]         = useState({ usuario: '', password: '' });
  const [error, setError]       = useState('');
  const [cargando, setCargando] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.usuario || !form.password) {
      setError('Por favor ingrese usuario y contrasena');
      return;
    }
    setCargando(true);
    try {
      const resultado = await loginService(form.usuario, form.password);
      if (resultado) {
        login(resultado);
        if (resultado.rol === 'admin') {
          navigate('/empleados');
        } else {
          navigate('/dashboard');
        }
      } else {
        setError('Usuario o contrasena incorrectos');
      }
    } catch (err) {
      setError('Error de conexion. Verifique que json-server este corriendo en el puerto 3001.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen bg-pink-200 flex items-center justify-center p-4">
      <div className="bg-cyan-100 border border-cyan-200 rounded-2xl shadow-xl w-full max-w-md p-8">

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-pink-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-white text-2xl font-bold">DP</span>
          </div>
          <h1 className="text-2xl font-bold text-pink-800">Deco Pastel Costa Rica</h1>
          <p className="text-cyan-700 text-sm mt-1">Ingrese sus credenciales para continuar</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-pink-700 mb-1">
              Usuario
            </label>
            <input
              type="text"
              name="usuario"
              value={form.usuario}
              onChange={handleChange}
              placeholder="Ingrese su usuario"
              autoComplete="username"
              disabled={cargando}
              className="w-full border border-cyan-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 disabled:bg-gray-50 transition bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-pink-700 mb-1">
              Contrasena
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Ingrese su contrasena"
              autoComplete="current-password"
              disabled={cargando}
              className="w-full border border-cyan-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 disabled:bg-gray-50 transition bg-white"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg flex items-center gap-2">
              <span>⚠️</span>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={cargando}
            className="w-full bg-pink-400 hover:bg-pink-500 text-white font-semibold py-2.5 rounded-lg transition-colors duration-200 text-sm disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm mt-2"
          >
            {cargando ? (
              <>
                <span className="animate-spin">⏳</span>
                Verificando...
              </>
            ) : (
              'Ingresar al sistema'
            )}
          </button>
        </form>

        <div className="mt-6 p-4 bg-pink-50 rounded-lg border border-pink-200">
          <p className="text-xs font-semibold text-pink-500 mb-2">
            Credenciales de prueba:
          </p>
          <div className="space-y-1">
            <p className="text-xs text-pink-600">
              <span className="font-medium">Admin:</span> admin / 1234
            </p>
            <p className="text-xs text-pink-600">
              <span className="font-medium">Usuario:</span> empleado1 / 1234
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default LoginPage;