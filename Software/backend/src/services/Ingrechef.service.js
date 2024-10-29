// Ingrechef.service.js
import { AppDataSource } from "../config/configDb.js";
import ingrediente from "../entity/ingrediente.entity.js";

export const canPrepareDish = async (requiredIngredients) => {
  const ingredientRepository = AppDataSource.getRepository(ingrediente);

  for (const reqIngredient of requiredIngredients) {
    const { nombre, cantidadNecesaria } = reqIngredient;

    // Buscar el ingrediente en la base de datos
    const ingredient = await ingredientRepository.findOneBy({ nombre });

    if (!ingredient || ingredient.cantidad < cantidadNecesaria) {
      // Si falta o no hay suficiente cantidad, retornar que no se puede preparar
      return {
        success: false,
      };
    }
  }

  // Todos los ingredientes están disponibles en cantidad suficiente
  return {
    success: true,
  };
};
