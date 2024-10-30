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

  const liberarMesa = async (numeroMesa) => {
    try {
      const response = await fetch(`http://localhost:3000/api/mesas/liberar/${numeroMesa}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        obtenerMesas(); // Refresca la lista de mesas después de liberar
      } else {
        const errorData = await response.json();
        console.error("Error al liberar la mesa:", errorData.message);
      }
    } catch (error) {
      console.error("Error al liberar la mesa:", error);
    }
  };

  // Función para reservar una mesa
  const reservarMesa = async (numeroMesa) => {
    try {
      const response = await fetch("http://localhost:3000/api/mesas/reservar", { // URL completa del endpoint
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ numeroMesa, garzonId: 9 }), // Usar el ID del garzón, o pasar un ID dinámico si es necesario
      });
      
      if (!response.ok) { // Verificar si la respuesta no es exitosa
        const errorData = await response.json();
        console.error("Error al reservar la mesa:", errorData.message);
      } else {
        obtenerMesas(); // Refresca las mesas después de reservar solo si la solicitud fue exitosa
        console.log(`Mesa ${numeroMesa} reservada correctamente.`);
      }
    } catch (error) {
      console.error("Error al reservar la mesa:", error);
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
              <td>{mesa.numeroMesa}</td>
              <td>{mesa.estado}</td>
              <td>{mesa.garzonAsignado ? mesa.garzonAsignado.nombreCompleto : "N/A"}</td>
              <td>
                {mesa.estado === "Disponible" ? (
                  <button className="reservar-button" onClick={() => reservarMesa(mesa.numeroMesa)}>
                    Reservar
                  </button>
                ) : (
                  <button className="liberar-button" onClick={() => liberarMesa(mesa.numeroMesa)}>
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
