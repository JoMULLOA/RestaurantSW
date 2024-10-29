// ingrediente.controller.js
import { addIngrediente, getIngredientes, prepararin } from "../services/ingrediente.service.js";

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

export const prepararinall = async (req, res) => {
  try {
    // Obtener los ingredientes requeridos desde el cuerpo de la solicitud
    const requiredIngredients = req.body.requiredIngredients;

    // Llamar a la función 'prepararin' para verificar si se puede preparar el plato
    const result = await prepararin(requiredIngredients);

    // Enviar la respuesta en formato JSON con el resultado
    res.status(200).json({ status: "Success", data: result });
  } catch (error) {
    // Enviar mensaje de error en caso de falla
    res.status(500).json({ status: "Error", message: error.message });
  }
};


