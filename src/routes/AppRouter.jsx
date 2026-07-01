import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from '../components/PrivateRoute';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import EmpleadosPage from '../pages/EmpleadosPage';
import NuevoEmpleadoPage from '../pages/NuevoEmpleadoPage';
import ExpedientesPage from '../pages/ExpedientesPage';
import MisExpedientesPage from '../pages/MisExpedientesPage';
import GestionUsuariosPage from '../pages/GestionUsuariosPage';
import OlvideClavePage from '../pages/OlvideClavePage';
import RestablecerClavepage from '../pages/restablecerClavepage';

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<LoginPage />} />
        <Route path="/olvide-clave" element={<OlvideClavePage />} />
        <Route path="/restablecer-password" element={<RestablecerClavepage />} /> 

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/expedientes/:id"
          element={
            <PrivateRoute>
              <ExpedientesPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/mis-expedientes"
          element={
            <PrivateRoute>
              <MisExpedientesPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/empleados"
          element={
            <PrivateRoute soloAdmin>
              <EmpleadosPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/empleados/nuevo"
          element={
            <PrivateRoute soloAdmin>
              <NuevoEmpleadoPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/empleados/:id/editar"
          element={
            <PrivateRoute soloAdmin>
              <NuevoEmpleadoPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/empleados/:id/editar"
          element={
            <PrivateRoute soloAdmin>
              <NuevoEmpleadoPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/usuarios"
          element={
            <PrivateRoute soloAdmin>
              <GestionUsuariosPage />
            </PrivateRoute>
          }
        />

        

        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;