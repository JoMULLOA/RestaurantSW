// ingrediente.controller.js
import { addIngrediente, getIngredientes } from "../services/ingrediente.service.js";

export const getAllIngredientes = async (req, res) => {
  try {
    const ingredientes = await getIngredientes();
    res.status(200).json({ status: "Success", data: ingredientes });
  } catch (error) {
    res.status(500).json({ status: "Error", message: error.message });
  }
};

export const createIngrediente = async (req, res) => {
  try {
    const ingrediente = await addIngrediente(req.body);
    res.status(201).json({ status: "Success", data: ingrediente });
  } catch (error) {
    res.status(500).json({ status: "Error", message: error.message });
  }
};
