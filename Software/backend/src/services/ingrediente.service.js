// ingrediente.service.js
import { AppDataSource } from "../config/configDb.js";
import ingrediente from "../entity/ingrediente.entity.js";

export const getIngredientes = async () => {
  const ingredientRepository = AppDataSource.getRepository(ingrediente);
  return await ingredientRepository.find();
};

export const addIngrediente = async (data) => {
    const ingredientRepository = AppDataSource.getRepository(ingrediente);
    /*saber si existe el nombre para agregar*/

    const newIngrediente = ingredientRepository.create(data);
    return await ingredientRepository.save(newIngrediente);
};

export const removeIngrediente = async (id) => {
  const ingredientRepository = AppDataSource.getRepository(ingrediente);
  const ingredienteToDelete = await ingredientRepository.findOneBy({ id });

  if (!ingredienteToDelete) {
      return null; 
  }

  await ingredientRepository.remove(ingredienteToDelete);
  return ingredienteToDelete; // 
};

export const updateIngredienteService = async (id, cantidad) => {
  const ingredientRepository = AppDataSource.getRepository(ingrediente);
  const ingredienteToUpdate = await ingredientRepository.findOneBy({ id });

  if (!ingredienteToUpdate) {
    return null;
  }

  ingredienteToUpdate.cantidad = cantidad;
  await ingredientRepository.save(ingredienteToUpdate);
  return ingredienteToUpdate;
};

