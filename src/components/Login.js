import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = ({ setAuthData }) => {
  const [correo, setCorreo] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [nombre, setNombre] = useState(''); // Campo adicional para el registro
  const [modoRegistro, setModoRegistro] = useState(false); // Alternar entre login y registro
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    console.log('Datos enviados para login:', { correo, contraseña }); // Debug

    try {
      const response = await axios.post('http://localhost:3000/api/usuarios/login', {
        correo,
        contraseña,
      });

      const { token, usuario } = response.data;

      // Guardar datos de autenticación
      setAuthData({ token, role: usuario.rol });

      // Redirigir según el rol
      if (usuario.rol === 'admin') {
        navigate('/dashboard');
      } else {
        navigate('/proyectos');
      }
    } catch (err) {
      console.error('Error en el login:', err.response?.data || err.message); // Debug del error
      setError(err.response?.data?.error || 'Error en el inicio de sesión.');
    }
  };

  const handleRegistro = async (e) => {
    e.preventDefault();
    setError('');
    console.log('Datos enviados para registro:', { nombre, correo, contraseña }); // Debug

    try {
      await axios.post('http://localhost:3000/api/usuarios/registro', {
        nombre,
        correo,
        contraseña,
      });

      alert('Usuario registrado exitosamente.');
      setModoRegistro(false); // Volver al modo login
    } catch (err) {
      console.error('Error en el registro:', err.response?.data || err.message); // Debug del error
      setError(err.response?.data?.error || 'Error al registrar usuario.');
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow" style={{ width: '25rem', padding: '2rem' }}>
        <h3 className="text-center mb-4">{modoRegistro ? 'Registrarse' : 'Iniciar Sesión'}</h3>
        <form onSubmit={modoRegistro ? handleRegistro : handleLogin}>
          {modoRegistro && (
            <div className="mb-3">
              <label htmlFor="nombre" className="form-label">
                Nombre
              </label>
              <input
                type="text"
                id="nombre"
                className="form-control"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </div>
          )}
          <div className="mb-3">
            <label htmlFor="correo" className="form-label">
              Correo Electrónico
            </label>
            <input
              type="email"
              id="correo"
              className="form-control"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="contraseña" className="form-label">
              Contraseña
            </label>
            <input
              type="password"
              id="contraseña"
              className="form-control"
              value={contraseña}
              onChange={(e) => setContraseña(e.target.value)}
              required
            />
          </div>
          {error && <div className="alert alert-danger text-center">{error}</div>}
          <button type="submit" className="btn btn-primary w-100">
            {modoRegistro ? 'Registrarse' : 'Iniciar Sesión'}
          </button>
        </form>
        <button
          className="btn btn-link w-100 mt-3"
          onClick={() => setModoRegistro(!modoRegistro)}
        >
          {modoRegistro ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
        </button>
      </div>
    </div>
  );
};

export default Login;
