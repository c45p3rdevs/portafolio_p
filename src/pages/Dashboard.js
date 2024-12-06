import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Asegúrate de importar Link
import '../styles/dashboard.css';
import {
  createProyecto,
  getProyectos,
  updateProyecto,
  deleteProyecto,
} from '../services/proyectos';

const Dashboard = () => {
  const [proyectos, setProyectos] = useState([]);
  const [totalProyectos, setTotalProyectos] = useState(0);
  const [proyectosCompletados, setProyectosCompletados] = useState(0);
  const [proyectosPendientes, setProyectosPendientes] = useState(0);

  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fechaEstimada, setFechaEstimada] = useState('');
  const [cumplimiento, setCumplimiento] = useState('No');
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando] = useState(null);

  useEffect(() => {
    const fetchProyectos = async () => {
      try {
        const data = await getProyectos();
        setProyectos(data);

        setTotalProyectos(data.length);
        setProyectosCompletados(data.filter((p) => p.cumplimiento === 'Sí').length);
        setProyectosPendientes(data.filter((p) => p.cumplimiento === 'No').length);
      } catch (error) {
        console.error('Error al obtener los proyectos:', error);
        setError('No se pudieron cargar los proyectos.');
      }
    };

    fetchProyectos();
  }, []);

  const handleAgregarProyecto = async (e) => {
    e.preventDefault();
    setError('');

    const nuevoProyecto = {
      nombre,
      descripcion,
      fecha_estimada: fechaEstimada,
      cumplimiento,
    };

    try {
      if (editando) {
        const actualizado = await updateProyecto(editando.id, nuevoProyecto);
        setProyectos((prevProyectos) =>
          prevProyectos.map((p) =>
            p.id === editando.id ? { ...p, ...actualizado } : p
          )
        );
        setEditando(null);
      } else {
        const response = await createProyecto(nuevoProyecto);
        const proyectoConId = { ...nuevoProyecto, id: response.id || Date.now() };
        setProyectos((prevProyectos) => [...prevProyectos, proyectoConId]);

        setTotalProyectos((prev) => prev + 1);
        if (cumplimiento === 'Sí') {
          setProyectosCompletados((prev) => prev + 1);
        } else {
          setProyectosPendientes((prev) => prev + 1);
        }
      }

      setNombre('');
      setDescripcion('');
      setFechaEstimada('');
      setCumplimiento('No');
      handleCloseModal();
    } catch (error) {
      console.error('Error al procesar el proyecto:', error);
      setError('No se pudo procesar el proyecto. Verifica los datos ingresados.');
    }
  };

  const handleEliminarProyecto = async (id) => {
    try {
      await deleteProyecto(id);
      setProyectos((prevProyectos) =>
        prevProyectos.filter((proyecto) => proyecto.id !== id)
      );
      setTotalProyectos((prev) => prev - 1);
    } catch (error) {
      console.error('Error al eliminar el proyecto:', error);
      setError('No se pudo eliminar el proyecto.');
    }
  };

  const handleEditarProyecto = (proyecto) => {
    setEditando(proyecto);
    setNombre(proyecto.nombre);
    setDescripcion(proyecto.descripcion);
    setFechaEstimada(proyecto.fecha_estimada);
    setCumplimiento(proyecto.cumplimiento);
    handleOpenModal();
  };

  const handleOpenModal = () => {
    document.body.classList.add('modal-open');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    document.body.classList.remove('modal-open');
    setShowModal(false);
    setEditando(null);
    setNombre('');
    setDescripcion('');
    setFechaEstimada('');
    setCumplimiento('No');
  };

  return (
    <div className="d-flex" style={{ height: '100vh' }}>
      {/* Sidebar */}
      <aside className="sidebar bg-light">
        <nav>
          <ul className="list-group list-group-flush">
            <li className="list-group-item">
              <Link to="/">
                <i className="bi bi-house-door-fill"></i> Inicio
              </Link>
            </li>
            <li className="list-group-item">
              <Link to="/proyectos">
                <i className="bi bi-card-list"></i> Proyectos
              </Link>
            </li>
            <li className="list-group-item">
              <Link to="/proyectos/vista">
                <i className="bi bi-eye-fill"></i> Vista Proyectos
              </Link>
            </li>
            <li className="list-group-item">
              <a href="#">
                <i className="bi bi-gear-fill"></i> Ajustes
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <div className="main-content p-4">
        <nav className="navbar navbar-expand-lg mb-4 bg-white shadow">
          <a className="navbar-brand" href="#">
            <i className="bi bi-layout-text-sidebar-reverse"></i> Portafolio Admin
          </a>
        </nav>

        <h2 className="text-center mb-4">Dashboard de Proyectos</h2>

        {/* Cards */}
        <div className="row mb-4">
          <div className="col-md-4">
            <div className="card modern-card bg-gradient-primary shadow">
              <div className="card-body">
                <h5 className="card-title">Total de Proyectos</h5>
                <p className="card-text display-4">{totalProyectos}</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card modern-card bg-gradient-success shadow">
              <div className="card-body">
                <h5 className="card-title">Proyectos Completados</h5>
                <p className="card-text display-4">{proyectosCompletados}</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card modern-card bg-gradient-danger shadow">
              <div className="card-body">
                <h5 className="card-title">Proyectos Pendientes</h5>
                <p className="card-text display-4">{proyectosPendientes}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Button */}
        <button
          className="floating-button"
          onClick={handleOpenModal}
          title={editando ? 'Editar Proyecto' : 'Agregar Proyecto'}
        >
          <i className="bi bi-plus-circle"></i>
        </button>

        {/* Modal */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3 className="modal-title">
                  {editando ? 'Editar Proyecto' : 'Agregar Proyecto'}
                </h3>
                <button
                  type="button"
                  className="close-button"
                  onClick={handleCloseModal}
                >
                  &times;
                </button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleAgregarProyecto}>
                  <div className="form-group">
                    <label>Nombre del Proyecto:</label>
                    <input
                      type="text"
                      className="form-control"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Descripción:</label>
                    <textarea
                      className="form-control"
                      value={descripcion}
                      onChange={(e) => setDescripcion(e.target.value)}
                      required
                    ></textarea>
                  </div>
                  <div className="form-group">
                    <label>Fecha Estimada:</label>
                    <input
                      type="date"
                      className="form-control"
                      value={fechaEstimada}
                      onChange={(e) => setFechaEstimada(e.target.value)}
                      required
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
                  {error && <div className="alert alert-danger">{error}</div>}
                  <div className="modal-footer">
                    <button type="submit" className="btn btn-primary">
                      {editando ? 'Guardar Cambios' : 'Guardar Proyecto'}
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={handleCloseModal}
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Tabla de proyectos */}
        <div className="table-responsive">
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
              {proyectos.length > 0 ? (
                proyectos.map((proyecto, index) => (
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
                        onClick={() => handleEditarProyecto(proyecto)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn btn-danger btn-sm ml-2"
                        onClick={() => handleEliminarProyecto(proyecto.id)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">
                    No hay proyectos disponibles.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

