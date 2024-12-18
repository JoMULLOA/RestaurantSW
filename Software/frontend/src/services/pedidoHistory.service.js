import axios from './root.service.js';

export const getPedidosHistory = async () => {
  try {
    const response = await axios.get('/pedidoHistory/getPedidos');
    return response.data;
  } catch (error) {
    console.error("Error al obtener los pedidos: ", error);
    throw error;
  }
}