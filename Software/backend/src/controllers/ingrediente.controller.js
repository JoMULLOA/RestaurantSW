import { 
  addIngrediente, 
  getIngredientes, 
  removeIngrediente, 
  updateIngredienteService 
} from "../services/ingrediente.service.js";
// ingrediente.controller.js

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

export const deleteIngrediente = async (req, res) => {
  try {
    const { id } = req.params; 

    const deletedIngrediente = await removeIngrediente(id); 

    if (!deletedIngrediente) {
      return res.status(404).json({ status: "Error", message: "Ingrediente no encontrado" });
    }

    res.status(200).json({ status: "Success", message: "Ingrediente eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ status: "Error", message: error.message });
  }
};

export const updateIngrediente = async (req, res) => {
  try {
    const { id } = req.params;
    const { cantidad } = req.body;
    const updatedIngrediente = await updateIngredienteService(id, cantidad);

    if (!updatedIngrediente) {
      return res.status(404).json({ status: "Error", message: "Ingrediente no encontrado" });
    }

    res.status(200).json({ status: "Success", data: updatedIngrediente });
  } catch (error) {
    res.status(500).json({ status: "Error", message: error.message });
  }
};


