// ingrediente.service.js
import { AppDataSource } from "../config/configDb.js";
import ingrediente from "../entity/ingrediente.entity.js";

export const getIngredientes = async () => {
  const ingredientRepository = AppDataSource.getRepository(ingrediente);
  return await ingredientRepository.find();
};

export const addIngrediente = async (data) => {
  const ingredientRepository = AppDataSource.getRepository(ingrediente);
  // Verificar si ya existe un ingrediente con el mismo nombre
  const existingIngrediente = await ingredientRepository.findOneBy({ nombre: data.nombre });
  if (existingIngrediente) {
    throw new Error("El ingrediente ya existe");
  }

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
  //transformar a entero
  const q = parseInt(ingredienteToUpdate.cantidad);
  if (q < 0) {
    console.log("La cantidad no puede ser negativa");
    return null;
  }else{
    await ingredientRepository.save(ingredienteToUpdate);
    return ingredienteToUpdate;
  }
};
