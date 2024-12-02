import React, { useEffect, useState } from 'react';
import '../styles/dashboard.css';
import { createProyecto, getProyectos } from '../services/proyectos';

const Dashboard = () => {
  const [proyectos, setProyectos] = useState([]); // Estado para almacenar los proyectos
  const [totalProyectos, setTotalProyectos] = useState(0);
  const [proyectosCompletados, setProyectosCompletados] = useState(0);
  const [proyectosPendientes, setProyectosPendientes] = useState(0);

  // Estados para el formulario
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fechaEstimada, setFechaEstimada] = useState('');
  const [cumplimiento, setCumplimiento] = useState('No');
  const [error, setError] = useState(''); // Estado para manejar errores

  // Cargar los proyectos al montar el componente
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
        setError('No se pudieron cargar los proyectos.');
      }
    };

    fetchProyectos();
  }, []);

  const handleAgregarProyecto = async (e) => {
    e.preventDefault();
    setError(''); // Resetear el estado de error antes de procesar

    const nuevoProyecto = {
      nombre,
      descripcion,
      fecha_estimada: fechaEstimada,
      cumplimiento,
    };

    try {
      const response = await createProyecto(nuevoProyecto);

      // Mostrar nombre del proyecto recién creado
      alert(`Proyecto creado: ${response.nombre || 'Sin nombre'}`);

      // Actualizar la lista de proyectos
      setProyectos([...proyectos, response]);

      // Actualizar métricas
      setTotalProyectos((prev) => prev + 1);
      if (cumplimiento === 'Sí') {
        setProyectosCompletados((prev) => prev + 1);
      } else {
        setProyectosPendientes((prev) => prev + 1);
      }

      // Limpiar el formulario
      setNombre('');
      setDescripcion('');
      setFechaEstimada('');
      setCumplimiento('No');
    } catch (error) {
      console.error('Error al crear el proyecto:', error);
      setError('No se pudo agregar el proyecto. Verifica los datos ingresados.');
    }
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
        </nav>

        <h2 className="text-center mb-4">Dashboard de Proyectos</h2>

        {/* Cards */}
        <div className="row mb-4">
          <div className="col-md-4">
            <div className="card custom-card bg-primary text-white shadow">
              <div className="card-body">
                <h5 className="card-title">Total de Proyectos</h5>
                <p className="card-text display-4">{totalProyectos}</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card custom-card bg-success text-white shadow">
              <div className="card-body">
                <h5 className="card-title">Proyectos Completados</h5>
                <p className="card-text display-4">{proyectosCompletados}</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card custom-card bg-danger text-white shadow">
              <div className="card-body">
                <h5 className="card-title">Proyectos Pendientes</h5>
                <p className="card-text display-4">{proyectosPendientes}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Formulario para agregar proyectos */}
        <div className="mb-4">
          <h3>Agregar Proyecto</h3>
          <form onSubmit={handleAgregarProyecto} className="form">
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
            <button type="submit" className="btn btn-primary mt-3">
              Agregar Proyecto
            </button>
          </form>
        </div>

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
                      <button className="btn btn-primary btn-sm">Editar</button>
                      <button className="btn btn-danger btn-sm ml-2">Eliminar</button>
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
