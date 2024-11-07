import ingrediente from "../entity/ingrediente.entity.js";
import User from "../entity/user.entity.js";
import { AppDataSource } from "./configDb.js";
import { encryptPassword } from "../helpers/bcrypt.helper.js";
import pedido from "../entity/pedido.entity.js";
import Mesa from "../entity/mesa.entity.js"; // Importar la entidad de Mesas

async function createInitialData() {
  try {
    // Crear Usuarios
    const userRepository = AppDataSource.getRepository(User);
    const userCount = await userRepository.count();
    if (userCount === 0) {
      const users = await Promise.all([
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
            nombreCompleto: "Juan Pérez",
            rut: "21.172.447-1",
            email: "garzon1@gmail.cl",
            password: await encryptPassword("garzon123"),
            rol: "garzon",
          })
        ),
        userRepository.save(
          userRepository.create({
            nombreCompleto: "Ana Sánchez",
            rut: "20.738.415-1",
            email: "garzon2@gmail.cl",
            password: await encryptPassword("garzon123"),
            rol: "garzon",
          })
        )
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
        // Más ingredientes si es necesario...
      ]);
      console.log("* => Ingredientes creados exitosamente");
    }

    // Crear Pedidos
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
      console.log("* => Pedidos creados exitosamente");
    }

    // Crear Mesas
    const mesaRepository = AppDataSource.getRepository(Mesa);
    const mesaCount = await mesaRepository.count();
    if (mesaCount === 0) {
      const [garzon1, garzon2] = await userRepository.find({
        where: { rol: "garzon" },
      });

      await Promise.all([
        mesaRepository.save(
          mesaRepository.create({
            numeroMesa: 1,
            estado: "Ocupada",
            garzonAsignado: garzon1,
          })
        ),
        mesaRepository.save(
          mesaRepository.create({
            numeroMesa: 2,
            estado: "Disponible",
            garzonAsignado: null,
          })
        ),
        mesaRepository.save(
          mesaRepository.create({
            numeroMesa: 3,
            estado: "Ocupada",
            garzonAsignado: garzon2,
          })
        ),
        mesaRepository.save(
          mesaRepository.create({
            numeroMesa: 4,
            estado: "Disponible",
            garzonAsignado: null,
          })
        ),
      ]);
      console.log("* => Mesas creadas exitosamente");
    }
  } catch (error) {
    console.error("Error al crear datos iniciales:", error);
  }
}

export { createInitialData };
