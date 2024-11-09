import { ingredientRepository } from "../services/ingrediente.service.js";

export const prepararin = async (requiredIngredients) => {
  try {
      const { nombre, cantidad } = requiredIngredients;
      console.log("Nombre recibido:", nombre);

      const ingredientF = await ingredientRepository.findOne({
          where: { nombre: nombre }
      });
      console.log("Ingrediente:", ingredientF);
      if (ingredientF) {
          console.log("Ingredientes cantidad:", ingredientF.cantidad);

          if (ingredientF.cantidad > 0) {
              ingredientF.cantidad -= cantidad;
              await ingredientRepository.save(ingredientF);
              return [ingredientF, null];
          }
          return [null, "No queda stock"];
      } else {
          console.log("Ingrediente no encontrado en la base de datos.");
          return [null, "Ingrediente no encontrado"];
      }
  } catch (error) {
      console.error("Error en service de preparin:", error);
      return [null, error.message];
  }
};
