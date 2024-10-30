import { useState, useEffect } from "react";
import "@styles/mesas.css"; // Asegúrate de tener este archivo de estilos

function Mesas() {
  const [mesas, setMesas] = useState([]);
  const [filtro, setFiltro] = useState("");

  // useEffect para obtener los datos de las mesas desde la API cuando se carga el componente
  useEffect(() => {
    obtenerMesas();
  }, []);

  // Función para obtener las mesas desde el backend
  const obtenerMesas = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/mesas");
      const data = await response.json();
      setMesas(data);
    } catch (error) {
      console.error("Error al obtener las mesas:", error);
    }
  };

  // Función para filtrar las mesas según el estado seleccionado
  const filtrarMesas = (estado) => {
    setFiltro(estado);
  };

  // Filtrar las mesas según el estado seleccionado en el filtro
  const mesasFiltradas = filtro ? mesas.filter((mesa) => mesa.estado === filtro) : mesas;

  // Función para reservar una mesa mediante una solicitud al backend
  const reservarMesa = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/mesas/${id}/reservar`, {
        method: "POST",
      });
      if (response.ok) {
        obtenerMesas(); // Actualiza las mesas después de reservar
      } else {
        console.error("No se pudo reservar la mesa");
      }
    } catch (error) {
      console.error("Error al reservar la mesa:", error);
    }
  };

  // Función para liberar una mesa mediante una solicitud al backend
  const liberarMesa = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/mesas/${id}/liberar`, {
        method: "POST",
      });
      if (response.ok) {
        obtenerMesas(); // Actualiza las mesas después de liberar
      } else {
        console.error("No se pudo liberar la mesa");
      }
    } catch (error) {
      console.error("Error al liberar la mesa:", error);
    }
  };

  return (
    <div className="mesas-container">
      <h2>Gestión de Mesas</h2>
      <div className="filtros">
        <button onClick={() => filtrarMesas("")}>Todas</button>
        <button onClick={() => filtrarMesas("Disponible")}>Disponibles</button>
        <button onClick={() => filtrarMesas("Ocupada")}>Ocupadas</button>
        <button onClick={() => filtrarMesas("Reservada")}>Reservadas</button>
      </div>
      <table className="mesas-table">
        <thead>
          <tr>
            <th>Número de Mesa</th>
            <th>Estado</th>
            <th>Garzón Asignado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {mesasFiltradas.map((mesa) => (
            <tr key={mesa.id}>
              <td>{mesa.numero}</td>
              <td>{mesa.estado}</td>
              <td>{mesa.garzon ? mesa.garzon.nombre : "N/A"}</td>
              <td>
                {mesa.estado === "Disponible" ? (
                  <button className="reservar-button" onClick={() => reservarMesa(mesa.id)}>
                    Reservar
                  </button>
                ) : (
                  <button className="liberar-button" onClick={() => liberarMesa(mesa.id)}>
                    Liberar
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Mesas;
