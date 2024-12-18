import ingrediente from "../entity/ingrediente.entity.js";
import User from "../entity/user.entity.js";
import { AppDataSource } from "./configDb.js";
import { encryptPassword } from "../helpers/bcrypt.helper.js";
import menu from "../entity/menu.entity.js";

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
      ]);
      console.log("* => Usuarios creados exitosamente");
    }

    // Crear Ingredientes
    const ingredientRepository = AppDataSource.getRepository(ingrediente);
    const ingredientCount = await ingredientRepository.count();
    if (ingredientCount === 0) {
      const ingredientes = [
        { nombre: "Papas", fechaIngreso: new Date(), cantidad: 50 },
        { nombre: "Salchichas", fechaIngreso: new Date(), cantidad: 50 },
        { nombre: "Sal", fechaIngreso: new Date(), cantidad: 50 },
        { nombre: "Naranjas frescas", fechaIngreso: new Date(), cantidad: 50 },
        { nombre: "Agua", fechaIngreso: new Date(), cantidad: 50 },
        { nombre: "Chocolate", fechaIngreso: new Date(), cantidad: 50 },
        { nombre: "Mantequilla", fechaIngreso: new Date(), cantidad: 50 },
        { nombre: "Azúcar", fechaIngreso: new Date(), cantidad: 50 },
        { nombre: "Harina", fechaIngreso: new Date(), cantidad: 50 },
        { nombre: "Huevos", fechaIngreso: new Date(), cantidad: 50 },
        { nombre: "Masa de pizza", fechaIngreso: new Date(), cantidad: 50 },
        { nombre: "Salsa de tomate", fechaIngreso: new Date(), cantidad: 50 },
        { nombre: "Queso mozzarella", fechaIngreso: new Date(), cantidad: 50 },
        { nombre: "Albahaca", fechaIngreso: new Date(), cantidad: 50 },
        { nombre: "Pasta fettuccine", fechaIngreso: new Date(), cantidad: 50 },
        { nombre: "Crema", fechaIngreso: new Date(), cantidad: 50 },
        { nombre: "Queso parmesano", fechaIngreso: new Date(), cantidad: 50 },
        { nombre: "Espinacas", fechaIngreso: new Date(), cantidad: 50 },
        { nombre: "Tomate cherry", fechaIngreso: new Date(), cantidad: 50 },
        { nombre: "Pollo", fechaIngreso: new Date(), cantidad: 50 },
        { nombre: "Champiñones", fechaIngreso: new Date(), cantidad: 50 },
        { nombre: "Cebolla", fechaIngreso: new Date(), cantidad: 50 },
        { nombre: "Ajo", fechaIngreso: new Date(), cantidad: 50 },
        { nombre: "Pimientos", fechaIngreso: new Date(), cantidad: 50 },
        { nombre: "Berenjena", fechaIngreso: new Date(), cantidad: 50 },
      ];

      await Promise.all(
        ingredientes.map((ingrediente) =>
          ingredientRepository.save(ingredientRepository.create(ingrediente))
        )
      );
      console.log("* => Ingredientes creados exitosamente");
    }

    // Crear Menú
    const menuRepository = AppDataSource.getRepository(menu);
    const menuCount = await menuRepository.count();
    if (menuCount === 0) {
      await Promise.all([
        menuRepository.save(
          menuRepository.create({
            nombre: "Salchipapas",
            ingredientes: [
              { nombre: "Papas", cantidad: 2 },
              { nombre: "Salchichas", cantidad: 2 },
              { nombre: "Sal", cantidad: 1 },
            ],
            precio: 5000,
            tipo: "Plato",
          })
        ),
        menuRepository.save(
          menuRepository.create({
            nombre: "Jugo de Naranja",
            ingredientes: [
              { nombre: "Naranjas frescas", cantidad: 3 },
              { nombre: "Agua", cantidad: 1 },
            ],
            precio: 1500,
            tipo: "Bebestible",
          })
        ),
        menuRepository.save(
          menuRepository.create({
            nombre: "Brownie",
            ingredientes: [
              { nombre: "Chocolate", cantidad: 1 },
              { nombre: "Mantequilla", cantidad: 1 },
              { nombre: "Azúcar", cantidad: 1 },
              { nombre: "Harina", cantidad: 1 },
              { nombre: "Huevos", cantidad: 2 },
            ],
            precio: 3000,
            tipo: "Postre",
          })
        ),
        menuRepository.save(
          menuRepository.create({
            nombre: "Pizza Margarita",
            ingredientes: [
              { nombre: "Masa de pizza", cantidad: 1 },
              { nombre: "Salsa de tomate", cantidad: 1 },
              { nombre: "Queso mozzarella", cantidad: 1 },
              { nombre: "Albahaca", cantidad: 1 },
            ],
            precio: 12000,
            tipo: "Plato",
          })
        ),
        menuRepository.save(
          menuRepository.create({
            nombre: "Pasta Alfredo",
            ingredientes: [
              { nombre: "Pasta fettuccine", cantidad: 1 },
              { nombre: "Mantequilla", cantidad: 1 },
              { nombre: "Crema", cantidad: 1 },
              { nombre: "Queso parmesano", cantidad: 1 },
            ],
            precio: 10000,
            tipo: "Plato",
          })
        ),
        menuRepository.save(
          menuRepository.create({
            nombre: "Ensalada Mediterránea",
            ingredientes: [
              { nombre: "Espinacas", cantidad: 1 },
              { nombre: "Tomate cherry", cantidad: 5 },
              { nombre: "Queso mozzarella", cantidad: 1 },
              { nombre: "Aceite de oliva", cantidad: 1 },
            ],
            precio: 8000,
            tipo: "Plato",
          })
        ),
        menuRepository.save(
          menuRepository.create({
            nombre: "Sopa de Pollo",
            ingredientes: [
              { nombre: "Pollo", cantidad: 1 },
              { nombre: "Cebolla", cantidad: 1 },
              { nombre: "Ajo", cantidad: 1 },
              { nombre: "Pimientos", cantidad: 1 },
            ],
            precio: 7000,
            tipo: "Plato",
          })
        ),
        menuRepository.save(
          menuRepository.create({
            nombre: "Ratatouille",
            ingredientes: [
              { nombre: "Berenjena", cantidad: 1 },
              { nombre: "Tomate cherry", cantidad: 5 },
              { nombre: "Pimientos", cantidad: 1 },
              { nombre: "Cebolla", cantidad: 1 },
            ],
            precio: 9000,
            tipo: "Plato",
          })
        ),
      ]);
      console.log("* => Menú creado exitosamente");
    }
  } catch (error) {
    console.error("Error al crear datos iniciales:", error);
  }
}

export { createInitialData };
