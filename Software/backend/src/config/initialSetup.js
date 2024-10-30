"use strict";
import User from "../entity/user.entity.js";
import pedido from "../entity/pedido.entity.js";
import { AppDataSource } from "./configDb.js";
import { encryptPassword } from "../helpers/bcrypt.helper.js";

async function createUsers() {
  try {
    const userRepository = AppDataSource.getRepository(User);

    const count = await userRepository.count();
    if (count > 0) return;

    await Promise.all([
      userRepository.save(
        userRepository.create({
          nombreCompleto: "Diego Alexis Salazar Jara",
          rut: "21.308.770-3",
          email: "administrador2024@gmail.cl",
          password: await encryptPassword("admin1234"),
          rol: "administrador",
        }),
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
<<<<<<< Updated upstream
          }),
      ),
      userRepository.save(
        userRepository.create({
          nombreCompleto: "Pablo Andrés Castillo Fernández",
          rut: "20.738.450-K",
          email: "usuario3.2024@gmail.cl",
          password: await encryptPassword("user1234"),
          rol: "usuario",
        }),
      ),
      userRepository.save(
        userRepository.create({
          nombreCompleto: "Felipe Andrés Henríquez Zapata",
          rut: "20.976.635-3",
          email: "usuario4.2024@gmail.cl",
          password: await encryptPassword("user1234"),
          rol: "usuario",
        }),
      ),
      userRepository.save(
        userRepository.create({
          nombreCompleto: "Diego Alexis Meza Ortega",
          rut: "21.172.447-1",
          email: "usuario5.2024@gmail.cl",
          password: await encryptPassword("user1234"),
          rol: "usuario",
        }),
      ),
      userRepository.save(
        userRepository.create({
          nombreCompleto: "Juan Pablo Rosas Martin",
          rut: "20.738.415-1",
          email: "usuario6.2024@gmail.cl",
          password: await encryptPassword("user1234"),
          rol: "usuario",
        }),
      ),
    ]);
    console.log("* => Usuarios creados exitosamente");
=======
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
        // Agregar más ingredientes aquí...
      ]);
      console.log("* => Ingredientes creados exitosamente");
    }
    const pedidoRepository = AppDataSource.getRepository(pedido);
    const pedidoCount = await pedidoRepository.count();
    if (pedidoCount === 0) {
      await Promise.all([
        pedidoRepository.save(
          pedidoRepository.create({
            mesa: 1,
            plato: "Salchipapas",
            bebestible: "Coca Cola",
            postre: "Brownie",
            modificaciones: "+ Salchichas",
            fechaIngreso: new Date("2024-10-01"),
          })
        ),
      ]);
      console.log("* => Ingredientes creados exitosamente");
    }
>>>>>>> Stashed changes
  } catch (error) {
    console.error("Error al crear usuarios:", error);
  }
}

export { createUsers };