import axios from "axios";

export const reservarMesaConHorario = async ({ numeroMesa, garzonAsignado, nombreReservante,
   fechaInicioReserva, fechaFinReserva }) => {
  try {
    const response = await axios.post("/api/reservas", {
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
    const reservaRepo = AppDataSource.getRepository(Reserva);
    const reservas = await reservaRepo.find({ relations: ["mesa", "garzonAsignado"] });
    return reservas;
  } catch (error) {
    console.error("Error al obtener reservas desde el servicio:", error);
    throw error;
  }
};
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

export const actualizarEstadoMesas = async () => {
    try {
      const response = await axios.post("/api/reservas/actualizar-estados");
      return response.data;
    } catch (error) {
      console.error("Error al actualizar los estados de las mesas:", error);
      throw error.response?.data || "Error al actualizar los estados";
    }
  };
