import ingrediente from "../entity/ingrediente.entity.js";
import User from "../entity/user.entity.js";
import { AppDataSource } from "./configDb.js";
import { encryptPassword } from "../helpers/bcrypt.helper.js";
import pedido from "../entity/pedido.entity.js";
import Mesa from "../entity/mesa.entity.js"; // Importar la entidad de Mesas
import menu from "../entity/menu.entity.js"; 


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
            plato: ["Salchipapas"],
            bebestible: ["Coca Cola"],
            postre: ["Brownie"],
            modificaciones: "+ Salchichas",
            fechaIngreso: new Date("2024-10-01"),
          })
        ),
      ]);
      console.log("* => Pedidos creados exitosamente");
    }

    // Crear Menú
    const menuRepository = AppDataSource.getRepository(menu);
    const menuCount = await menuRepository.count();
    if (menuCount === 0) {
      await Promise.all([
        menuRepository.save(
          menuRepository.create({
            nombre: "Salchipapas",
            ingredientes: ["Papas", "Salchichas", "Sal"],
            precio: 5000,
            tipo: "Plato",
          })
        ),
        menuRepository.save(
          menuRepository.create({
            nombre: "Jugo de Naranja",
            ingredientes: ["Naranjas frescas", "Agua"],
            precio: 1500,
            tipo: "Bebestible",
          })
        ),
        menuRepository.save(
          menuRepository.create({
            nombre: "Coca Cola",
            ingredientes: ["Coca Cola", "Hielos"],
            precio: 1000,
            tipo: "Bebestible",
          })
        ),
        menuRepository.save(
          menuRepository.create({
            nombre: "Brownie",
            ingredientes: ["Chocolate", "Mantequilla", "Azúcar", "Harina", "Huevos"],
            precio: 3000,
            tipo: "Postre",
          })
        ),
        menuRepository.save(
          menuRepository.create({
            nombre: "Ensalada César",
            ingredientes: ["Lechuga romana", "Queso parmesano", "Crutones", "Aderezo César"],
            precio: 7000,
            tipo: "Plato",
          })
        ),
        menuRepository.save(
          menuRepository.create({
            nombre: "Pizza Margarita",
            ingredientes: ["Masa de pizza", "Salsa de tomate", "Queso mozzarella", "Albahaca fresca"],
            precio: 12000,
            tipo: "Plato",
          })
        ),
        menuRepository.save(
          menuRepository.create({
            nombre: "Sopa de Tomate",
            ingredientes: ["Tomates", "Ajo", "Cebolla", "Caldo de verduras", "Aceite de oliva"],
            precio: 5000,
            tipo: "Plato",
          })
        ),
        menuRepository.save(
          menuRepository.create({
            nombre: "Pasta Alfredo",
            ingredientes: ["Pasta fettuccine", "Mantequilla", "Crema", "Queso parmesano"],
            precio: 10000,
            tipo: "Plato",
          })
        ),
        menuRepository.save(
          menuRepository.create({
            nombre: "Limonada",
            ingredientes: ["Limones frescos", "Agua", "Azúcar", "Hielos"],
            precio: 2000,
            tipo: "Bebestible",
          })
        ),
        menuRepository.save(
          menuRepository.create({
            nombre: "Café",
            ingredientes: ["Café molido", "Agua caliente", "Azúcar"],
            precio: 1000,
            tipo: "Bebestible",
          })
        ),
        menuRepository.save(
          menuRepository.create({
            nombre: "Té Verde",
            ingredientes: ["Hojas de té verde", "Agua caliente"],
            precio: 1500,
            tipo: "Bebestible",
          })
        ),
        menuRepository.save(
          menuRepository.create({
            nombre: "Tiramisú",
            ingredientes: ["Queso mascarpone", "Café", "Huevos", "Azúcar", "Cacao en polvo"],
            precio: 8000,
            tipo: "Postre",
          })
        ),
        menuRepository.save(
          menuRepository.create({
            nombre: "Helado de Vainilla",
            ingredientes: ["Leche", "Azúcar", "Extracto de vainilla", "Crema"],
            precio: 5000,
            tipo: "Postre",
          })
        ),
        menuRepository.save(
          menuRepository.create({
            nombre: "Cheesecake",
            ingredientes: ["Queso crema", "Galletas", "Mantequilla", "Azúcar"],
            precio: 9000,
            tipo: "Postre",
          })
        ),
      ]);
      console.log("* => Menú creado exitosamente");
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
