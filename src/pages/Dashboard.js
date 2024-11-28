import React, { useEffect, useState } from 'react';
import '../styles/dashboard.css';
import { getProyectos } from '../services/proyectos'; // Importar el servicio para obtener proyectos
import api from '../services/api'; // Importar el servicio de API

const Dashboard = () => {
  const [proyectos, setProyectos] = useState([]); // Estado para almacenar los proyectos
  const [totalProyectos, setTotalProyectos] = useState(0); // Estado para el total de proyectos
  const [proyectosCompletados, setProyectosCompletados] = useState(0); // Estado para proyectos completados
  const [proyectosPendientes, setProyectosPendientes] = useState(0); // Estado para proyectos pendientes

  // Función para cargar los proyectos al montar el componente
  useEffect(() => {
    const fetchProyectos = async () => {
      try {
        const data = await getProyectos();
        setProyectos(data);

        // Actualizar métricas
        setTotalProyectos(data.length);
        setProyectosCompletados(data.filter((p) => p.cumplimiento === 'Sí').length);
        setProyectosPendientes(data.filter((p) => p.cumplimiento === 'No').length);
      } catch (error) {
        console.error('Error al obtener los proyectos:', error);
      }
    };

    fetchProyectos();
  }, []);

  const handleAgregarProyecto = () => {
    alert('Función para agregar un nuevo proyecto aún no implementada.');
  };

  return (
    <div className="d-flex" style={{ height: '100vh' }}>
      {/* Sidebar */}
      <aside className="sidebar bg-light">
        <nav>
          <ul className="list-group list-group-flush">
            <li className="list-group-item">
              <a href="#">
                <i className="bi bi-house-door-fill"></i> Inicio
              </a>
            </li>
            <li className="list-group-item">
              <a href="#">
                <i className="bi bi-card-list"></i> Proyectos
              </a>
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
        {/* Navbar */}
        <nav className="navbar navbar-expand-lg mb-4 bg-white shadow">
          <a className="navbar-brand" href="#">
            <i className="bi bi-layout-text-sidebar-reverse"></i> Portafolio Admin
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ml-auto">
              <li className="nav-item active">
                <a className="nav-link" href="#">Dashboard</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">Configuración</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">Cerrar Sesión</a>
              </li>
            </ul>
          </div>
        </nav>

        <h2 className="text-center mb-4">Dashboard de Proyectos</h2>

        {/* Botón de Agregar Proyecto */}
        <div className="mb-4 text-right">
          <button
            className="btn btn-primary"
            onClick={handleAgregarProyecto}
          >
            <i className="bi bi-plus-circle"></i> Agregar Proyecto
          </button>
        </div>

        {/* Sección de Cards */}
        <div className="row mb-4">
          <div className="col-md-4">
            <div className="card custom-card bg-primary text-white shadow">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="card-title">Total de Proyectos</h5>
                    <p className="card-text display-4">{totalProyectos}</p>
                  </div>
                  <i className="bi bi-folder-fill icon-large"></i>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card custom-card bg-success text-white shadow">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="card-title">Proyectos Completados</h5>
                    <p className="card-text display-4">{proyectosCompletados}</p>
                  </div>
                  <i className="bi bi-check-circle-fill icon-large"></i>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card custom-card bg-danger text-white shadow">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="card-title">Proyectos Pendientes</h5>
                    <p className="card-text display-4">{proyectosPendientes}</p>
                  </div>
                  <i className="bi bi-exclamation-triangle-fill icon-large"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sección de Tabla */}
        <div className="table-responsive">
          <table className="table table-striped table-bordered">
            <thead className="thead-dark">
              <tr>
                <th>#</th>
                <th>Nombre del Proyecto</th>
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
                  <td>{proyecto.fechaEstimada}</td>
                  <td>{proyecto.fechaReal}</td>
                  <td>{proyecto.cumplimiento}</td>
                  <td>
                    <button className="btn btn-primary btn-sm">Editar</button>
                    <button className="btn btn-danger btn-sm ml-2">Eliminar</button>
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

export default Dashboard;
