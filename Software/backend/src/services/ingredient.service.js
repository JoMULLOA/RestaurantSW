"use strict";
import Ingredient from "../entity/ingredient.entity.js";
import { AppDataSource } from "../config/configDb.js";

export async function getIngredientService(query) {
  try {
    const { id } = query;

    const ingredientRepository = AppDataSource.getRepository(Ingredient);

    const ingredientFound = await ingredientRepository.findOne({
      where: { id: id },
    });

    if (!ingredientFound) return [null, "Ingrediente no encontrado"];

    return [ingredientFound, null];
  } catch (error) {
    console.error("Error al obtener el ingrediente:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function getIngredientsService() {
  try {
    const ingredientRepository = AppDataSource.getRepository(Ingredient);

    const ingredients = await ingredientRepository.find();

    if (!ingredients || ingredients.length === 0) return [null, "No hay ingredientes"];

    return [ingredients, null];
  } catch (error) {
    console.error("Error al obtener los ingredientes:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function updateIngredientService(query, body) {
  try {
    const { id } = query;

    const ingredientRepository = AppDataSource.getRepository(Ingredient);

    const ingredientFound = await ingredientRepository.findOne({
      where: { id: id },
    });

    if (!ingredientFound) return [null, "Ingrediente no encontrado"];

    const dataIngredientUpdate = {
      nombre: body.nombre,
      cantidad: body.cantidad,
      precio: body.precio,
    };

    await ingredientRepository.update({ id: ingredientFound.id }, dataIngredientUpdate);

    const ingredientData = await ingredientRepository.findOne({
      where: { id: ingredientFound.id },
    });

    if (!ingredientData) {
      return [null, "Ingrediente no encontrado después de actualizar"];
    }

    return [ingredientData, null];
  } catch (error) {
    console.error("Error al modificar un ingrediente:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function deleteIngredientService(query) {
    try{
        const { id }= query

        const ingredientRepository = AppDataSource.getRepository(Ingredient);

        const ingredientFound = await ingredientRepository.findOne({
            where: [{ id: id }],
          });
        if (!ingredientFound) return [null, "ingrediente no encontrado"];

        const ingredientDelete = await ingredientRepository.remove(ingredientFound);

        const { password, ...ingredientData } = ingredientDelete;

        return [ingredientData, null];


    }catch (error){
        console.error("Error al eliminar un ingrediente:", error);
        return [null, "Error interno del servidor"];
    }
}
