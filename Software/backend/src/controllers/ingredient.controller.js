// src/controllers/ingredient.controller.js
import { getIngredientsService } from "../services/ingredient.service.js";
import {
  handleErrorClient,
  handleErrorServer,
  handleSuccess,
} from "../handlers/responseHandlers.js";

export async function getIngredients(req, res) {
  const [ingredients, error] = await getIngredientsService();

  if (error) {
    return handleErrorClient(res, 404, error);
  }

  return handleSuccess(res, 200, "Ingredientes encontrados", ingredients);
}
