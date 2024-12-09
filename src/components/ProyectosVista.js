import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/dashboard.css';
import {
  getProyectos,
  updateProyecto,
  deleteProyecto,
} from '../services/proyectos';

const ProyectosVista = () => {
  const [proyectos, setProyectos] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [editando, setEditando] = useState(null); // Proyecto en edición
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fechaEstimada, setFechaEstimada] = useState('');
  const [cumplimiento, setCumplimiento] = useState('');

  useEffect(() => {
    const fetchProyectos = async () => {
      try {
        const data = await getProyectos();
        setProyectos(data);
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
    return proyecto.cumplimiento === filtro;
  });

  const handleEditar = (proyecto) => {
    setEditando(proyecto);
    setNombre(proyecto.nombre);
    setDescripcion(proyecto.descripcion);
    setFechaEstimada(proyecto.fecha_estimada);
    setCumplimiento(proyecto.cumplimiento);
  };

  const handleGuardarEdicion = async () => {
    try {
      const actualizado = await updateProyecto(editando.id, {
        nombre,
        descripcion,
        fecha_estimada: fechaEstimada,
        cumplimiento,
      });
      setProyectos((prev) =>
        prev.map((p) => (p.id === editando.id ? actualizado : p))
      );
      setEditando(null);
      setNombre('');
      setDescripcion('');
      setFechaEstimada('');
      setCumplimiento('');
    } catch (error) {
      console.error('Error al editar el proyecto:', error);
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
        <div className="text-center py-4">
        
        
        </div>
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

        <h2 className="text-center mb-4">Vista de Proyectos</h2>

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
          <button className="btn btn-success mx-2" onClick={() => filtrarProyectos('Sí')}>
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
                    <strong>Estado:</strong>{' '}
                    {proyecto.cumplimiento === 'Sí'
                      ? 'Completado'
                      : proyecto.cumplimiento === 'En progreso'
                      ? 'En Progreso'
                      : 'Por Hacer'}
                  </p>
                  <p>
                    <strong>Fecha Estimada:</strong> {proyecto.fecha_estimada}
                  </p>

                  <button
                    className="btn btn-primary btn-sm me-2"
                    onClick={() => handleEditar(proyecto)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleEliminar(proyecto.id)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {proyectosFiltrados.length === 0 && (
          <p className="text-center">No hay proyectos que coincidan con este filtro.</p>
        )}

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
                  <td>{proyecto.cumplimiento}</td>
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

        {/* Modal para edición */}
        {editando && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3 className="modal-title">Editar Proyecto</h3>
                <button
                  type="button"
                  className="close-button"
                  onClick={() => setEditando(null)}
                >
                  &times;
                </button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleGuardarEdicion}>
                  <div className="form-group">
                    <label>Nombre del Proyecto:</label>
                    <input
                      type="text"
                      className="form-control"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Descripción:</label>
                    <textarea
                      className="form-control"
                      value={descripcion}
                      onChange={(e) => setDescripcion(e.target.value)}
                    ></textarea>
                  </div>
                  <div className="form-group">
                    <label>Fecha Estimada:</label>
                    <input
                      type="date"
                      className="form-control"
                      value={fechaEstimada}
                      onChange={(e) => setFechaEstimada(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Cumplimiento:</label>
                    <select
                      className="form-control"
                      value={cumplimiento}
                      onChange={(e) => setCumplimiento(e.target.value)}
                    >
                      <option value="No">No</option>
                      <option value="Sí">Sí</option>
                    </select>
                  </div>
                  <div className="modal-footer">
                    <button type="submit" className="btn btn-primary">
                      Guardar
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setEditando(null)}
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProyectosVista;





