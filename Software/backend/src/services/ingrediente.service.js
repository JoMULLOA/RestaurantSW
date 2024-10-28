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
