import ingrediente from "../entity/ingrediente.entity.js"; // Importar la entidad de Ingredientes
import User from "../entity/user.entity.js";
import { AppDataSource } from "./configDb.js";
import { encryptPassword } from "../helpers/bcrypt.helper.js";

async function createInitialData() {
  try {
    // Crear Usuarios
    const userRepository = AppDataSource.getRepository(User);
    const userCount = await userRepository.count();
    if (userCount === 0) {
      await Promise.all([
        userRepository.save(
          userRepository.create({
            nombreCompleto: "Diego Alexis Salazar Jara",
            rut: "21.308.770-3",
            email: "administrador2024@gmail.cl",
            password: await encryptPassword("admin1234"),
            rol: "administrador",
          })
        ),
        userRepository.save(
          userRepository.create({
            nombreCompleto: "Diego Sebastián Ampuero Belmar",
            rut: "21.151.897-9",
            email: "usuario1.2024@gmail.cl",
            password: await encryptPassword("user1234"),
            rol: "usuario",
          })
        ),
        userRepository.save(
          userRepository.create({
            nombreCompleto: "Alexander Benjamín Marcelo Carrasco Fuentes",
            rut: "20.630.735-8",
            email: "usuario2.2024@gmail.cl",
            password: await encryptPassword("user1234"),
            rol: "usuario",
          })
        ),
        userRepository.save(
          userRepository.create({
            nombreCompleto: "Pablo Andrés Castillo Fernández",
            rut: "20.738.450-K",
            email: "usuario3.2024@gmail.cl",
            password: await encryptPassword("user1234"),
            rol: "usuario",
          })
        ),
        userRepository.save(
          userRepository.create({
            nombreCompleto: "Felipe Andrés Henríquez Zapata",
            rut: "20.976.635-3",
            email: "usuario4.2024@gmail.cl",
            password: await encryptPassword("user1234"),
            rol: "usuario",
          })
        ),
        userRepository.save(
          userRepository.create({
            nombreCompleto: "Diego Alexis Meza Ortega",
            rut: "21.172.447-1",
            email: "usuario5.2024@gmail.cl",
            password: await encryptPassword("user1234"),
            rol: "usuario",
          })
        ),
        userRepository.save(
          userRepository.create({
            nombreCompleto: "Juan Pablo Rosas Martin",
            rut: "20.738.415-1",
            email: "usuario6.2024@gmail.cl",
            password: await encryptPassword("user1234"),
            rol: "usuario",
          })
        ),
      ]);
      console.log("* => Usuarios creados exitosamente");
    }

    // Crear Ingredientes
    const ingredientRepository = AppDataSource.getRepository(ingrediente);
    const ingredientCount = await ingredientRepository.count();
    if (ingredientCount === 0) {
      await Promise.all([
        ingredientRepository.save(
          ingredientRepository.create({
            nombre: "Harina",
            fechaIngreso: new Date("2024-10-01"),
            cantidad: 50,
          })
        ),
        ingredientRepository.save(
          ingredientRepository.create({
            nombre: "Azúcar",
            fechaIngreso: new Date("2024-10-05"),
            cantidad: 20,
          })
        ),
        // Puedes agregar más ingredientes aquí...
      ]);
      console.log("* => Ingredientes creados exitosamente");
    }
  } catch (error) {
    console.error("Error al crear datos iniciales:", error);
  }
}

export { createInitialData };
