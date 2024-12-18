import axios from "/src/services/root.service.js"; // Asegúrate de que la configuración de axios tenga la URL base configurada

// Función para obtener todas las mesas
export async function obtenerMesas() {
  try {
    const response = await axios.get('/mesas');
    return response.data;
  } catch (error) {
    console.error("Error en obtenerMesas:", error);
    return error.response?.data || "Error al obtener las mesas";
  }
}

// Función para liberar una mesa específica
export async function liberarMesa(numeroMesa) {
  try {
    const response = await axios.put(`/mesas/liberar/${numeroMesa}`);
    return response.data;
  } catch (error) {
    console.error("Error en liberarMesa:", error);
    return error.response?.data || "Error al liberar la mesa";
  }
}

// Función para crear una reserva
export const crearReserva = async ({ mesaId, nombreReservante, horaReserva }) => {
  return await axios.post("/api/mesas/reservas", {
    mesaId,
    nombreReservante,
    horaReserva,
  });
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


export const obtenerReservas = async () => {
  try {
    const response = await axios.get("/reservas"); // Endpoint que devuelve las reservas con las mesas
    return response.data;
  } catch (error) {
    console.error("Error al obtener las reservas:", error);
    throw error;
  }
};

export const actualizarEstadosMesas = async () => {
  try {
    const response = await axios.post(`/reservas/actualizar-estados`);
    return response.data;
  } catch (error) {
    console.error("Error al actualizar los estados de las mesas:", error);
    throw error.response?.data || "Error al actualizar los estados";
  }
};

export async function ocuparMesa(numeroMesa) {
  try {
    const response = await axios.put(`/mesas/ocupar/${numeroMesa}`);
    return response.data;
  } catch (error) {
    console.error("Error en ocuparMesa:", error);
    return error.response?.data || "Error al ocupar la mesa";
  }
}

export async function eliminarMesa(numeroMesa) {
  try {
    const response = await axios.delete(`/mesas/eliminar/${numeroMesa}`);
    return response.data;
  } catch (error) {
    // Verifica si el error es 404 y lanza un mensaje personalizado
    if (error.response && error.response.status === 404) {
      throw new Error("Mesa no encontrada");
    }
    // Lanza cualquier otro error que ocurra
    throw error;
  }
}

// Función para agregar una nueva mesa
export async function agregarMesa() {
  try {
    const response = await axios.post('/mesas/agregar');
    return response.data;
  } catch (error) {
    console.error("Error en agregarMesa:", error);
    return error.response?.data || "Error al agregar la mesa";
  }
}

export async function obtenerGarzones() {
  try {
    const response = await axios.get("/usuarios/garzones");
    return response.data;
  } catch (error) {
    console.error("Error al obtener garzones:", error);
    throw error;
  }
}
export async function actualizarGarzonMesa(numeroMesa, garzonName) {
  try {
    console.log("Actualizando garzón de la mesa", numeroMesa, "con el garzón", garzonName);
    const response = await axios.put(`/mesas/asignarGarzon/${numeroMesa}`, {
      nombreCompleto: garzonName
    });
    console.log("Garzón de la mesa actualizado:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error al actualizar el garzón de la mesa:", error);
    throw error;
  }
}
