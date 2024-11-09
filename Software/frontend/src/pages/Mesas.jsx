import { useState, useEffect } from "react";
import "@styles/mesas.css";
import { obtenerMesas, liberarMesa, reservarMesa } from "@services/mesa.service.js";

function Mesas() {
  const [mesas, setMesas] = useState([]);
  const [filtro, setFiltro] = useState("");

  // useEffect para obtener los datos de las mesas desde la API cuando se carga el componente
  useEffect(() => {
    fetchMesas();
  }, []);

  // Función para obtener las mesas usando el servicio
  const fetchMesas = async () => {
    try {
      const data = await obtenerMesas();
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

  // Función para liberar una mesa usando el servicio
  const handleLiberarMesa = async (numeroMesa) => {
    try {
      await liberarMesa(numeroMesa);
      fetchMesas(); // Refresca la lista de mesas después de liberar
    } catch (error) {
      console.error("Error al liberar la mesa:", error);
    }
  };

  // Función para reservar una mesa usando el servicio
  const handleReservarMesa = async (numeroMesa) => {
    try {
      await reservarMesa(numeroMesa, 9); // Cambia `9` por el ID dinámico si es necesario
      fetchMesas(); // Refresca la lista de mesas después de reservar
      console.log(`Mesa ${numeroMesa} reservada correctamente.`);
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
                  <button className="reservar-button" onClick={() => handleReservarMesa(mesa.numeroMesa)}>
                    Reservar
                  </button>
                ) : (
                  <button className="liberar-button" onClick={() => handleLiberarMesa(mesa.numeroMesa)}>
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