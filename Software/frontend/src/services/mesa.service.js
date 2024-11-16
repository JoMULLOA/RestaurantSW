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

// Función para reservar una mesa específica
export async function reservarMesa(numeroMesa) {
  try {
    const response = await axios.put('/mesas/reservar', {
      numeroMesa
    });
    return response.data;
  } catch (error) {
    console.error("Error en reservarMesa:", error);
    return error.response?.data || "Error al reservar la mesa";
  }
}