import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import ProyectosVista from './components/ProyectosVista';
import Login from './components/Login';

function App() {
  const [authData, setAuthData] = useState(() => {
    // Recuperar datos del localStorage si existen
    const storedAuth = localStorage.getItem('authData');
    return storedAuth ? JSON.parse(storedAuth) : null;
  });

  // Efecto para guardar `authData` en localStorage
  useEffect(() => {
    if (authData) {
      localStorage.setItem('authData', JSON.stringify(authData));
    } else {
      localStorage.removeItem('authData');
    }
  }, [authData]);

  return (
    <Router>
      <Routes>
        {/* Ruta inicial del login */}
        <Route
          path="/"
          element={authData ? <Navigate to="/dashboard" /> : <Login setAuthData={setAuthData} />}
        />
        {/* Ruta al dashboard principal */}
        <Route
          path="/dashboard"
          element={authData ? <Dashboard /> : <Navigate to="/" />}
        />
        {/* Ruta para la vista de proyectos */}
        <Route
          path="/proyectos"
          element={authData ? <ProyectosVista /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
}

export default App;





