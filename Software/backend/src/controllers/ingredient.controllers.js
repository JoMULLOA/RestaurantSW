"use strict";
import {
  deleteIngredientService,
  getIngredientService,
  getIngredientsService,
  updateIngredientService,
} from "../services/ingredient.service.js";
import {
  handleErrorClient,
  handleErrorServer,
  handleSuccess,
} from "../handlers/responseHandlers.js";

export async function getIngredient(req, res) {
  try {
    const { id } = req.query;

    if (!id) return handleErrorClient(res, 400, "El ID del ingrediente es requerido");

    const [ingredient, errorIngredient] = await getIngredientService({ id });

    if (errorIngredient) return handleErrorClient(res, 404, errorIngredient);

    handleSuccess(res, 200, "Ingrediente encontrado", ingredient);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function getIngredients(req, res) {
  try {
    const [ingredients, errorIngredients] = await getIngredientsService();

    if (errorIngredients) return handleErrorClient(res, 404, errorIngredients);

    ingredients.length === 0
      ? handleSuccess(res, 204)
      : handleSuccess(res, 200, "Ingredientes encontrados", ingredients);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function updateIngredient(req, res) {
  try {
    const { id } = req.query;
    const { body } = req;

    if (!id) return handleErrorClient(res, 400, "El ID del ingrediente es requerido");

    const [ingredient, ingredientError] = await updateIngredientService({ id }, body);

    if (ingredientError) return handleErrorClient(res, 400, "Error modificando el ingrediente", ingredientError);

    handleSuccess(res, 200, "Ingrediente modificado correctamente", ingredient);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function deleteIngredient(req, res) {
  try {
    const { id } = req.query;

    if (!id) return handleErrorClient(res, 400, "El ID del ingrediente es requerido");

    const [ingredientDelete, errorIngredientDelete] = await deleteIngredientService({ id });

    if (errorIngredientDelete){
      return handleErrorClient(res, 404, "Error eliminando el ingrediente", errorIngredientDelete);
    }
    handleSuccess(res, 200, "Ingrediente eliminado correctamente", ingredientDelete);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}
