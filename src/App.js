import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import ProyectosVista from '../src/components/ProyectosVista'; // Importamos la nueva vista

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/proyectos" element={<ProyectosVista />} /> {/* Nueva ruta */}
      </Routes>
    </Router>
  );
}

export default App;

