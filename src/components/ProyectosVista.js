import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/dashboard.css';
import {
  getProyectos,
  updateProyecto,
  deleteProyecto,
} from '../services/proyectos';
import ProgressBar from 'react-bootstrap/ProgressBar';

const ProyectosVista = () => {
  const [proyectos, setProyectos] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [editando, setEditando] = useState(null);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fechaEstimada, setFechaEstimada] = useState('');
  const [cumplimiento, setCumplimiento] = useState(0);

  useEffect(() => {
    const fetchProyectos = async () => {
      try {
        const data = await getProyectos();
        const proyectosConCumplimiento = data.map((proyecto) => ({
          ...proyecto,
          cumplimiento: parseInt(proyecto.cumplimiento) || 0,
        }));
        setProyectos(proyectosConCumplimiento);
      } catch (error) {
        console.error('Error al cargar proyectos:', error);
      }
    };
    fetchProyectos();
  }, []);

  const filtrarProyectos = (estado) => {
    setFiltro(estado);
  };

  const proyectosFiltrados = proyectos.filter((proyecto) => {
    if (!filtro) return true;
    return parseInt(proyecto.cumplimiento) === parseInt(filtro);
  });

  const handleEditar = (proyecto) => {
    setEditando(proyecto);
    setNombre(proyecto.nombre);
    setDescripcion(proyecto.descripcion);
    setFechaEstimada(proyecto.fecha_estimada);
    setCumplimiento(proyecto.cumplimiento);
  };

  const handleGuardarEdicion = async (e) => {
    e.preventDefault();
    try {
      const actualizado = {
        nombre,
        descripcion,
        fecha_estimada: fechaEstimada,
        cumplimiento: parseInt(cumplimiento),
      };

      const respuesta = await updateProyecto(editando.id, actualizado);

      const proyectosActualizados = proyectos.map((p) =>
        p.id === editando.id ? { ...p, ...respuesta } : p
      );
      setProyectos(proyectosActualizados);
      setEditando(null);
      setNombre('');
      setDescripcion('');
      setFechaEstimada('');
      setCumplimiento(0);
    } catch (error) {
      console.error('Error al guardar los cambios:', error);
    }
  };

  const handleEliminar = async (id) => {
    try {
      await deleteProyecto(id);
      setProyectos((prev) => prev.filter((proyecto) => proyecto.id !== id));
    } catch (error) {
      console.error('Error al eliminar el proyecto:', error);
    }
  };

  return (
    <div className="d-flex" style={{ height: '100vh' }}>
      {/* Sidebar */}
      <aside
        className="sidebar"
        style={{
          background: 'linear-gradient(135deg, #0083b0, #00b4db)',
          color: 'white',
        }}
      >
        <div className="text-center py-4"></div>
        <nav>
          <ul className="list-group list-group-flush">
            <li className="list-group-item" style={{ background: 'transparent' }}>
              <Link to="/" style={{ color: 'white' }}>
                <i className="bi bi-house-door-fill"></i> Inicio
              </Link>
            </li>
            <li className="list-group-item" style={{ background: 'transparent' }}>
              <Link to="/proyectos" style={{ color: 'white' }}>
                <i className="bi bi-card-list"></i> Proyectos
              </Link>
            </li>
            <li className="list-group-item" style={{ background: 'transparent' }}>
              <Link to="/proyectos/vista" style={{ color: 'white' }}>
                <i className="bi bi-eye-fill"></i> Vista Proyectos
              </Link>
            </li>
            <li className="list-group-item" style={{ background: 'transparent' }}>
              <a href="#" style={{ color: 'white' }}>
                <i className="bi bi-gear-fill"></i> Ajustes
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <div className="main-content p-4">
        <div className="text-center mb-4">
          <img
            src="https://i.ibb.co/Brtwrvn/logo202-DGSP.png"
            alt="logo202-DGSP"
            className="img-fluid"
            style={{ maxHeight: '100px' }}
          />
        </div>

        <h2 className="text-center mb-4">Panel de Proyectos</h2>

        {/* Filtros */}
        <div className="d-flex justify-content-center mb-4">
          <button className="btn btn-secondary mx-2" onClick={() => filtrarProyectos('')}>
            Todos
          </button>
          <button className="btn btn-primary mx-2" onClick={() => filtrarProyectos('No')}>
            Por Hacer
          </button>
          <button
            className="btn btn-warning mx-2"
            onClick={() => filtrarProyectos('En progreso')}
          >
            En Progreso
          </button>
          <button
            className="btn btn-success mx-2"
            onClick={() => filtrarProyectos('Sí')}
          >
            Completados
          </button>
        </div>

        {/* Lista de Proyectos (Cards) */}
        <div className="row">
          {proyectosFiltrados.map((proyecto) => (
            <div className="col-md-4 mb-4" key={proyecto.id}>
              <div
                className="card shadow-sm"
                style={{
                  borderRadius: '15px',
                  overflow: 'hidden',
                  background: 'linear-gradient(135deg, #0083b0, #00b4db)',
                  color: 'white',
                }}
              >
                <div className="card-body">
                  <h5 className="card-title">{proyecto.nombre}</h5>
                  <p className="card-text">{proyecto.descripcion}</p>
                  <p>
                    <strong>Estado:</strong> {proyecto.cumplimiento}%
                  </p>
                  <p>
                    <strong>Fecha Estimada:</strong> {proyecto.fecha_estimada}
                  </p>
                  <ProgressBar
                    now={proyecto.cumplimiento}
                    label={`${proyecto.cumplimiento}%`}
                    striped
                    variant="success"
                  />
                  <button
                    className="btn btn-primary btn-sm me-2 mt-2"
                    onClick={() => handleEditar(proyecto)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-danger btn-sm mt-2"
                    onClick={() => handleEliminar(proyecto.id)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabla de Proyectos */}
        <div className="table-responsive mt-4">
          <table className="table table-striped table-bordered">
            <thead className="thead-dark">
              <tr>
                <th>#</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Fecha Estimada</th>
                <th>Fecha Real</th>
                <th>Cumplimiento</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {proyectos.map((proyecto, index) => (
                <tr key={proyecto.id}>
                  <td>{index + 1}</td>
                  <td>{proyecto.nombre}</td>
                  <td>{proyecto.descripcion}</td>
                  <td>{proyecto.fecha_estimada}</td>
                  <td>{proyecto.fecha_real || 'No definida'}</td>
                  <td>
                    <ProgressBar
                      now={proyecto.cumplimiento}
                      label={`${proyecto.cumplimiento}%`}
                      striped
                      variant="info"
                    />
                  </td>
                  <td>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleEditar(proyecto)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-danger btn-sm ml-2"
                      onClick={() => handleEliminar(proyecto.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProyectosVista;

