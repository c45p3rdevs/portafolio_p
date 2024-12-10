import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/dashboard.css';
import {
  createProyecto,
  getProyectos,
  updateProyecto,
} from '../services/proyectos';
import { Pie, Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const Dashboard = () => {
  const [proyectos, setProyectos] = useState([]);
  const [totalProyectos, setTotalProyectos] = useState(0);
  const [proyectosCompletados, setProyectosCompletados] = useState(0);
  const [proyectosPendientes, setProyectosPendientes] = useState(0);

  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fechaEstimada, setFechaEstimada] = useState('');
  const [cumplimiento, setCumplimiento] = useState(0); // Cumplimiento como número
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando] = useState(null);

  const location = useLocation();

  // Cargar proyectos al montar el componente o cambiar de vista
  useEffect(() => {
    const fetchProyectos = async () => {
      try {
        const data = await getProyectos();

        // Aseguramos que el cumplimiento sea un número
        const proyectosConCumplimiento = data.map((proyecto) => ({
          ...proyecto,
          cumplimiento: parseInt(proyecto.cumplimiento) || 0,
        }));

        setProyectos(proyectosConCumplimiento);

        // Calculamos totales para gráficos
        setTotalProyectos(proyectosConCumplimiento.length);
        setProyectosCompletados(
          proyectosConCumplimiento.filter((p) => p.cumplimiento === 100).length
        );
        setProyectosPendientes(
          proyectosConCumplimiento.filter((p) => p.cumplimiento < 100).length
        );
      } catch (error) {
        console.error('Error al obtener los proyectos:', error);
      }
    };

    fetchProyectos();
  }, [location]); // Dependencia en la ubicación para recargar los datos

  const handleAgregarProyecto = async (e) => {
    e.preventDefault();
    setError('');

    const nuevoProyecto = {
      nombre,
      descripcion,
      fecha_estimada: fechaEstimada,
      cumplimiento: parseInt(cumplimiento),
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
        if (parseInt(cumplimiento) === 100) {
          setProyectosCompletados((prev) => prev + 1);
        } else {
          setProyectosPendientes((prev) => prev + 1);
        }
      }

      setNombre('');
      setDescripcion('');
      setFechaEstimada('');
      setCumplimiento(0);
      handleCloseModal();
    } catch (error) {
      console.error('Error al procesar el proyecto:', error);
      setError('No se pudo procesar el proyecto. Verifica los datos ingresados.');
    }
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
    setCumplimiento(0);
  };

  // Datos para gráficos
  const pieData = {
    labels: ['Completados', 'Pendientes'],
    datasets: [
      {
        data: [proyectosCompletados, proyectosPendientes],
        backgroundColor: ['#4CAF50', '#FF5722'],
      },
    ],
  };

  const barData = {
    labels: proyectos.map((proyecto) => proyecto.nombre),
    datasets: [
      {
        label: 'Progreso (%)',
        data: proyectos.map((proyecto) => parseInt(proyecto.cumplimiento) || 0),
        backgroundColor: '#03A9F4',
      },
    ],
  };

  return (
    <div className="d-flex" style={{ height: '100vh' }}>
      {/* Sidebar */}
      <aside className="sidebar bg-light">
        <div className="text-center py-4">
          <img
            src="https://i.ibb.co/Brtwrvn/logo202-DGSP.png"
            alt="logo202-DGSP"
            className="img-fluid"
            style={{ maxHeight: '80px' }}
          />
        </div>
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

        {/* Gráficos */}
        <div className="row">
          <div className="col-md-6">
            <div className="card shadow-sm p-3">
              <h5 className="text-center">Distribución de Proyectos</h5>
              <div style={{ height: '250px', width: '100%' }}>
                <Pie data={pieData} options={{ maintainAspectRatio: false }} />
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card shadow-sm p-3">
              <h5 className="text-center">Progreso de Proyectos</h5>
              <div style={{ height: '250px', width: '100%' }}>
                <Bar data={barData} options={{ maintainAspectRatio: false }} />
              </div>
            </div>
          </div>
        </div>

        {/* Botón flotante */}
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
              <div className="modal-header" style={{ color: 'white' }}>
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
              <div className="modal-body" style={{ color: 'white' }}>
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
                    <label>Cumplimiento (%):</label>
                    <input
                      type="number"
                      className="form-control"
                      value={cumplimiento}
                      onChange={(e) => setCumplimiento(e.target.value)}
                      required
                      min="0"
                      max="100"
                    />
                  </div>
                  {error && (
                    <div className="alert alert-danger" style={{ color: 'white' }}>
                      {error}
                    </div>
                  )}
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
      </div>
    </div>
  );
};

export default Dashboard;




