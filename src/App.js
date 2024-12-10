import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import ProyectosVista from './components/ProyectosVista';
import Login from './components/Login';

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta inicial del login */}
        <Route path="/" element={<Login />} />
        {/* Ruta al dashboard principal */}
        <Route path="/dashboard" element={<Dashboard />} />
        {/* Ruta para la vista de proyectos */}
        <Route path="/proyectos" element={<ProyectosVista />} />
      </Routes>
    </Router>
  );
}

export default App;




