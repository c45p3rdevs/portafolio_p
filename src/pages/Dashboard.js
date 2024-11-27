import React from 'react';
import '../styles/dashboard.css';

const Dashboard = () => {
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
      <div className="main-content">
        {/* Navbar */}
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
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

        {/* Sección de Cards */}
        <div className="row mb-4">
          <div className="col-md-4">
            <div className="card custom-card bg-primary text-white">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="card-title">Total de Proyectos</h5>
                    <p className="card-text display-4">10</p>
                  </div>
                  <i className="bi bi-folder-fill icon-large"></i>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card custom-card bg-success text-white">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="card-title">Proyectos Completados</h5>
                    <p className="card-text display-4">7</p>
                  </div>
                  <i className="bi bi-check-circle-fill icon-large"></i>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card custom-card bg-danger text-white">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="card-title">Proyectos Pendientes</h5>
                    <p className="card-text display-4">3</p>
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
              <tr>
                <td>1</td>
                <td>Proyecto Ejemplo</td>
                <td>Descripción del proyecto</td>
                <td>2024-12-15</td>
                <td>2024-12-20</td>
                <td>No</td>
                <td>
                  <button className="btn btn-primary btn-sm">Editar</button>
                  <button className="btn btn-danger btn-sm ml-2">Eliminar</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
