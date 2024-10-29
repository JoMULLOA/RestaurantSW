// Ingrechef.controllers.js
import { canPrepareDish } from "../services/Ingrechef.service.js";

export const checkDishPreparation = async (req, res) => {
  try {
    const ingredientes = await canPrepareDish(req.body.requiredIngredients);
    res.status(200).json({ status: "Success", data: ingredientes });
  } catch (error) {
    res.status(500).json({ status: "Error", message: error.message });
  }
};