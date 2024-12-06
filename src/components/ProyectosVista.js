import React, { useEffect, useState } from 'react';
import '../styles/dashboard.css'; // Reutilizamos estilos
import { getProyectos } from '../services/proyectos';

const ProyectosVista = () => {
  const [proyectos, setProyectos] = useState([]);
  const [filtro, setFiltro] = useState(''); // Para filtrar proyectos por estado

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

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Vista de Proyectos</h2>

      {/* Filtros */}
      <div className="d-flex justify-content-center mb-4">
        <button
          className="btn btn-secondary mx-2"
          onClick={() => filtrarProyectos('')}
        >
          Todos
        </button>
        <button
          className="btn btn-primary mx-2"
          onClick={() => filtrarProyectos('No')}
        >
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

      {/* Lista de Proyectos */}
      <div className="row">
        {proyectosFiltrados.map((proyecto) => (
          <div className="col-md-4 mb-4" key={proyecto.id}>
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title">{proyecto.nombre}</h5>
                <p className="card-text">{proyecto.descripcion}</p>
                <p>
                  <strong>Estado:</strong>{' '}
                  {proyecto.cumplimiento === 'Sí' ? 'Completado' : proyecto.cumplimiento === 'En progreso' ? 'En Progreso' : 'Por Hacer'}
                </p>
                <p>
                  <strong>Fecha Estimada:</strong> {proyecto.fecha_estimada}
                </p>

                {/* Barra de progreso */}
                <div className="progress mb-2">
                  <div
                    className={`progress-bar ${
                      proyecto.cumplimiento === 'Sí'
                        ? 'bg-success'
                        : proyecto.cumplimiento === 'En progreso'
                        ? 'bg-warning'
                        : 'bg-secondary'
                    }`}
                    role="progressbar"
                    style={{ width: `${
                      proyecto.cumplimiento === 'Sí'
                        ? 100
                        : proyecto.cumplimiento === 'En progreso'
                        ? 50
                        : 0
                    }%` }}
                    aria-valuenow={
                      proyecto.cumplimiento === 'Sí'
                        ? 100
                        : proyecto.cumplimiento === 'En progreso'
                        ? 50
                        : 0
                    }
                    aria-valuemin="0"
                    aria-valuemax="100"
                  ></div>
                </div>

                <button className="btn btn-primary btn-sm me-2">Ver Más</button>
                <button className="btn btn-danger btn-sm">Eliminar</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {proyectosFiltrados.length === 0 && (
        <p className="text-center">No hay proyectos que coincidan con este filtro.</p>
      )}
    </div>
  );
};

export default ProyectosVista;
