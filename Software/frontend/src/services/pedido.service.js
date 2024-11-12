import axios from './root.service.js';

export const addPedido = async (pedido) => {
  try {
    const response = await axios.post('/pedido/addPedido', pedido);
    return response.data;
  } catch (error) {
    console.error("Error al agregar el pedido: ", error);
    throw error;
  }
};

export const getPedidos = async () => {
  try {
    const response = await axios.get('/pedidos/all');
    return response.data;
  } catch (error) {
    console.error("Error al obtener los pedidos: ", error);
    throw error;
  }
};

export const deletePedido = async (id) => {
  try {
    const response = await axios.delete("/pedidos/delete", id);
    return response.data;
  } catch (error) {
    console.error("Error al eliminar el pedido: ", error);
    throw error;
  }
};