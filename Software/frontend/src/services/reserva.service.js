import axios from "/src/services/root.service.js"; // Asegúrate de que la configuración de axios tenga la URL base configurada


// Servicio para cancelar una reserva
export const cancelarReserva = async (id) => {
  try {
    const response = await axios.patch(`/reservas/${id}/cancelar`);
    return response.data;
  } catch (error) {
    console.error("Error al cancelar la reserva:", error);
    throw error.response?.data || "Error al cancelar la reserva";
  }
};


export const obtenerEstadisticasReservas = async () => {
  const response = await axios.get("/api/reservas/estadisticas");
  return response.data;
};

export const reservarMesa = async (datosReserva) => {
  try {
    const response = await axios.post("/reservas", datosReserva, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 400) {
      const errores = error.response.data.errores;
      if (errores && Array.isArray(errores)) {
        throw new Error(errores.join("\n")); // Une los mensajes en una sola cadena
      } else {
        throw new Error("Error desconocido en la validación.");
      }
    }

    throw new Error("Error al conectar con el servidor.");
  }
};

export const obtenerReservas = async () => {
  try {
    const response = await axios.get("/reservas"); // Endpoint que devuelve las reservas con las mesas
    return response.data;
  } catch (error) {
    console.error("Error al obtener las reservas:", error);
    throw error;
  }
};
