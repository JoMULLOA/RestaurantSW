import { useState, useEffect } from "react";
import "@styles/mesas.css";
import { obtenerMesas, liberarMesa, reservarMesa, agregarMesa, eliminarMesa } from "@services/mesa.service.js";

function Mesas() {
  const [mesas, setMesas] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [mensaje, setMensaje] = useState(""); // Para mostrar mensajes de éxito o error
  const [mensajeError, setMensajeError] = useState(false); // Para cambiar el color del mensaje
  const [numeroMesaEliminar, setNumeroMesaEliminar] = useState("");

  useEffect(() => {
    fetchMesas();
  }, []);

  const fetchMesas = async () => {
    try {
      const data = await obtenerMesas();
      setMesas(data);
    } catch (error) {
      console.error("Error al obtener las mesas:", error);
    }
  };

  const filtrarMesas = (estado) => {
    setFiltro(estado);
  };

  const mesasFiltradas = filtro ? mesas.filter((mesa) => mesa.estado === filtro) : mesas;

  const handleLiberarMesa = async (numeroMesa) => {
    try {
      await liberarMesa(numeroMesa);
      fetchMesas();
      setMensaje(`Mesa ${numeroMesa} liberada correctamente.`);
      setMensajeError(false); // Mensaje de éxito en verde
    } catch (error) {
      console.error("Error al liberar la mesa:", error);
      setMensaje("Error al liberar la mesa.");
      setMensajeError(true); // Mensaje de error en rojo
    }
  };

  const handleReservarMesa = async (numeroMesa) => {
    try {
      await reservarMesa(numeroMesa);
      fetchMesas();
      setMensaje(`Mesa ${numeroMesa} reservada correctamente.`);
      setMensajeError(false); // Mensaje de éxito en verde
    } catch (error) {
      console.error("Error al reservar la mesa:", error);
      setMensaje("Error al reservar la mesa.");
      setMensajeError(true); // Mensaje de error en rojo
    }
  };

  const handleAgregarMesa = async () => {
    try {
      await agregarMesa();
      fetchMesas();
      setMensaje("Mesa agregada correctamente.");
      setMensajeError(false); // Mensaje de éxito en verde
    } catch (error) {
      console.error("Error al agregar la mesa:", error);
      setMensaje("Error al agregar la mesa.");
      setMensajeError(true); // Mensaje de error en rojo
    }
  };

 const handleEliminarMesa = async () => {
  try {
    await eliminarMesa(numeroMesaEliminar);
    fetchMesas(); // Refresca la lista de mesas
    setMensaje(`Mesa ${numeroMesaEliminar} eliminada correctamente.`);
    setMensajeError(false); // Mensaje de éxito en verde
    setNumeroMesaEliminar(""); // Limpia el campo de entrada
  } catch (error) {
    if (error.message === "Mesa no encontrada") {
      setMensaje("Mesa no encontrada.");
      setMensajeError(true); // Mensaje de error en rojo
    } else {
      console.error("Error al eliminar la mesa:", error);
      setMensaje("Error al eliminar la mesa.");
      setMensajeError(true); // Mensaje de error en rojo
    }
  }
};

  return (
    <div className="mesas-container">
      <h2>Gestión de Mesas</h2>

      {/* Mensaje de confirmación o error */}
      {mensaje && <p className={`mensaje ${mensajeError ? "error" : "success"}`}>{mensaje}</p>}

      {/* Sección de botones de acción */}
      <div className="acciones">
        <button className="agregar-button" onClick={handleAgregarMesa}>Agregar Mesa</button>
        <button className="eliminar-button" onClick={handleEliminarMesa}>Eliminar Mesa</button>
        <input
          type="text"
          placeholder="Número de mesa a eliminar"
          value={numeroMesaEliminar}
          onChange={(e) => setNumeroMesaEliminar(e.target.value)}
        />
      </div>

      {/* Sección de filtros */}
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
