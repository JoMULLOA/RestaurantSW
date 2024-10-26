// src/services/ingredient.service.js
import Ingredient from "../entity/ingredient.entity.js";
import { AppDataSource } from "../config/configDb.js";

export async function getIngredientsService() {
  try {
    const ingredientRepository = AppDataSource.getRepository(Ingredient);

    const ingredients = await ingredientRepository.find();

    if (!ingredients || ingredients.length === 0) {
      return [null, "No hay ingredientes"];
    }

    return [ingredients, null];
  } catch (error) {
    console.error("Error al obtener los ingredientes:", error);
    return [null, "Error interno del servidor"];
  }
}
