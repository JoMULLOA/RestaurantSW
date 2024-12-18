// pedido.controller.js
import { addPedido, eliminarPedido, getPedidos, removePedido } from "../services/pedido.service.js";
import { validatePedido } from "../validations/pedido.validation.js";

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
    const { error } = validatePedido(req.body);
    if (error) {
      return res.status(400).json({ 
        message: "No superó la validación", 
        details: error.details.map(err => err.message) 
      });
    }
    const pedido = await addPedido(req.body);
    if (pedido.status === 400) {
      return res.status(400).json({ 
        status: "Error",
        message: pedido.errors
      });
    }
    res.status(201).json({ status: "Success", data: pedido });
  } catch (err) {
    res.status(500).json({ status: "Error", message: err.message });
  }
};

export const deletePedido = async (req, res) => {
  try {
    const { id } = req.params; 

    const deletedPedido = await eliminarPedido(id); 
    console.log("Pedido eliminado: ", deletedPedido);
    if (!deletedPedido) {
      return res.status(404).json({ status: "Error", message: "Pedido no encontrado" });
    }
    res.status(200).json({ status: "Success", message: "Pedido eliminado correctamente" });
  } catch (error) {
    console.error("Errol: ", error);
    res.status(500).json({ status: "Error", message: error.message });
  }
};

export const RemovePedido = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedPedido = await removePedido(id);
    if (!deletedPedido) {
      return res.status(404).json({ status: "Error", message: "Pedido no encontrado" });
    }
    res.status(200).json({ status: "Success", message: "Pedido eliminado correctamente" });
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({ status: "Error", message: error.message });
  }
}
