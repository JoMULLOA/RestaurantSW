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

export const reservarMesaConHorario = async ({ numeroMesa, garzonAsignado, nombreReservante, fechaInicioReserva, fechaFinReserva  }) => {
  try {
    const response = await axios.post("/reservas/", {
      numeroMesa,
      garzonAsignado,
      nombreReservante,
      fechaInicioReserva,
      fechaFinReserva,
    });
    return response.data;
  } catch (error) {
    console.error("Error al reservar la mesa con horario:", error);
    throw error.response?.data || "Error al realizar la reserva";
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
