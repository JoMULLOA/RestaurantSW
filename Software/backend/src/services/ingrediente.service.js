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

export const prepararin = async (requiredIngredients) => {
  try {
    const { nombre, cantidad } = requiredIngredients
    const ingredientRepository = AppDataSource.getRepository(ingrediente);
  
    const ingredientF = await ingredientRepository.findOne({
      where: { nombre: nombre }
    })
    if ( ingredientF.cantidad > 0) {
      ingredientF.cantidad = ingredientF.cantidad - cantidad
      await ingredientRepository.save(ingredientF)
      return [ingredientF, null]
    }
    return [null, "No queda stock"]
  } catch (error) {
    console.log("Error en service de preparin");
  }
};