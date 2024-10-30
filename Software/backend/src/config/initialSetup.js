<<<<<<< Updated upstream
"use strict";
=======
import Ingrediente from "../entity/ingrediente.entity.js";
>>>>>>> Stashed changes
import User from "../entity/user.entity.js";
import Mesa from "../entity/mesa.entity.js";
import Pedido from "../entity/pedido.entity.js";
import Garzon from "../entity/garzon.entity.js"; // Importa la entidad Garzon
import { AppDataSource } from "./configDb.js";
import { encryptPassword } from "../helpers/bcrypt.helper.js";

async function createUsers() {
  try {
    const userRepository = AppDataSource.getRepository(User);
<<<<<<< Updated upstream

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
        // Puedes agregar más usuarios aquí
      ]);
      console.log("* => Usuarios creados exitosamente");
    }

    // Crear Garzones
    const garzonRepository = AppDataSource.getRepository(Garzon);
    const garzonCount = await garzonRepository.count();
    let garzones = [];
    if (garzonCount === 0) {
      garzones = await Promise.all([
        garzonRepository.save(
          garzonRepository.create({
            nombre: "Carlos Martínez",
            email: "carlos.martinez@restaurante.cl",
          })
        ),
        garzonRepository.save(
          garzonRepository.create({
            nombre: "Ana González",
            email: "ana.gonzalez@restaurante.cl",
          })
        ),
        garzonRepository.save(
          garzonRepository.create({
            nombre: "Luis Rodríguez",
            email: "luis.rodriguez@restaurante.cl",
          })
        ),
      ]);
      console.log("* => Garzones creados exitosamente");
    } else {
      garzones = await garzonRepository.find(); // Obtén los garzones existentes
    }

    // Crear Ingredientes
    const ingredientRepository = AppDataSource.getRepository(Ingrediente);
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
      ]);
      console.log("* => Ingredientes creados exitosamente");
    }

    // Crear Mesas
    const mesaRepository = AppDataSource.getRepository(Mesa);
    const mesaCount = await mesaRepository.count();
    if (mesaCount === 0) {
      const estados = ["Disponible", "Ocupada", "Reservada"];
      const mesas = [];

      // Crea 10 mesas con un estado aleatorio y asigna un garzón de forma cíclica
      for (let i = 1; i <= 10; i++) {
        const garzonAsignado = garzones[(i - 1) % garzones.length]; // Asigna un garzón de forma cíclica
        const mesa = mesaRepository.create({
          numero: `${i}`,
          estado: estados[Math.floor(Math.random() * estados.length)], // Estado aleatorio
          garzon: garzonAsignado, // Asigna el garzón
        });
        mesas.push(mesa);
      }

      await mesaRepository.save(mesas);
      console.log("* => Mesas creadas exitosamente");
    }

    // Crear Pedidos
    const pedidoRepository = AppDataSource.getRepository(Pedido);
    const pedidoCount = await pedidoRepository.count();
    if (pedidoCount === 0) {
      const mesas = await mesaRepository.find(); // Obtén mesas para asociarlas a los pedidos
      const pedidos = [
        pedidoRepository.create({
          descripcion: "Pizza y refresco",
          estado: "Pendiente",
          mesa: mesas[0], // Asociado a la mesa 1
        }),
        pedidoRepository.create({
          descripcion: "Ensalada y agua",
          estado: "Entregado",
          mesa: mesas[1], // Asociado a la mesa 2
        }),
        // Agrega más pedidos aquí si lo necesitas
      ];

      await pedidoRepository.save(pedidos);
      console.log("* => Pedidos creados exitosamente");
    }
>>>>>>> Stashed changes
  } catch (error) {
    console.error("Error al crear usuarios:", error);
  }
}

export { createUsers };