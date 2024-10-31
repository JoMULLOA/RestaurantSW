// pedido.controller.js
import { addPedido, getPedidos, removePedido } from "../services/pedido.service.js";

export const getAllPedidos = async (req, res) => {
  try {
    const pedidos = await getPedidos();
    res.status(200).json({ status: "Success", data: pedidos });
  } catch (error) {
    res.status(500).json({ status: "Error", message: error.message });
  }
};

export const createPedido = async (req, res) => {
  try {
    const pedido = await addPedido(req.body);
    res.status(201).json({ status: "Success", data: pedido });
  } catch (error) {
    res.status(500).json({ status: "Error", message: error.message });
  }
};


export const deletePedido = async (req, res) => {
  try {
    const { id } = req.params; 

    const deletedPedido = await removePedido(id); 

    if (!deletedPedido) {
      return res.status(404).json({ status: "Error", message: "Pedido no encontrado" });
    }

    res.status(200).json({ status: "Success", message: "Pedido eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ status: "Error", message: error.message });
  }
};
