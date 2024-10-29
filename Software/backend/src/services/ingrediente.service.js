// ingrediente.service.js
import { AppDataSource } from "../config/configDb.js";
import ingrediente from "../entity/ingrediente.entity.js";

export const getIngredientes = async () => {
  const ingredientRepository = AppDataSource.getRepository(ingrediente);
  return await ingredientRepository.find();
};

export const addIngrediente = async (data) => {
    const ingredientRepository = AppDataSource.getRepository(ingrediente);
    const newIngrediente = ingredientRepository.create(data);
    return await ingredientRepository.save(newIngrediente);
};

export const prepararin = async (requiredIngredients) => {
  // Obtener todos los ingredientes de la base de datos
  const ingredientes = await getIngredientes();

  for (const reqIngredient of requiredIngredients) {
    const { nombre, cantidadNecesaria } = reqIngredient;

    // Buscar el ingrediente en la lista obtenida
    const ingredient = ingredientes.find((ing) => ing.nombre === nombre);

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