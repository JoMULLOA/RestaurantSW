// pedido.service.js
import { AppDataSource } from "../config/configDb.js";
import pedido from "../entity/pedido.entity.js";

//j
import { getMenus } from "./menu.service.js";
import ingrediente from "../entity/ingrediente.entity.js";
import { getIngredientes } from "./ingrediente.service.js";

export const getPedidos = async () => {
  const pedidoRepository = AppDataSource.getRepository(pedido);
  return await pedidoRepository.find();
};

// export const addPedido = async (data) => {
//     const pedidoRepository = AppDataSource.getRepository(pedido);
//     const newPedido = pedidoRepository.create(data);
//     return await pedidoRepository.save(newPedido);
// };

//ADD de joaquin con resta de ingredientes
export const addPedido = async (data) => {
  const pedidoRepository = AppDataSource.getRepository(pedido);
  const newPedido = pedidoRepository.create(data);
  const menus = await getMenus();
  const ingredientesEs = await getIngredientes();
  const ingredientRepository = AppDataSource.getRepository(ingrediente);
  console.log("Pedido creado:", newPedido);
  let pedidoValido = true;

  for(const plato of newPedido.plato){
    const menu = menus.find(a => a.nombre === plato);
    if (!menu) {
        console.log(`No se encontró el menú para el plato: ${plato}`);
        pedidoValido = false;
    }
    for(const ingrediente of menu.ingredientes){
      const ingre = ingredientesEs.find(ing => ing.nombre === ingrediente.nombre);
      console.log("Ingrediente:", ingrediente);
      if (!ingre) {
          console.log(`No se encontró el ingrediente: ${ingrediente.nombre}`);
          pedidoValido = false;
      }
      if (ingre.cantidad >= ingrediente.cantidad) {
          ingre.cantidad -= ingrediente.cantidad; // Actualiza la cantidad
          await ingredientRepository.save(ingre); // Guarda el cambio en la base de datos
      } else { 
          console.log(`No hay suficiente cantidad para el ingrediente: ${ingrediente.nombre}`);
          pedidoValido = false;
      }
    }
  }
  //bebesible
  for (const bebestible of newPedido.bebestible) { // Itera sobre los platos del pedido
    const menu = menus.find(a => a.nombre === bebestible);
    if (!menu) {
      console.log(`No se encontró el menú para el bebestible: ${bebestible}`);
      pedidoValido = false;
    }
    for(const ingrediente of menu.ingredientes) {
      const ingre = ingredientesEs.find(ing => ing.nombre === ingrediente.nombre);
      if (!ingre) {
        console.log(`No se encontró el ingrediente: ${ingrediente.nombre}`);
        pedidoValido = false;
      }
      if (ingre.cantidad >= ingrediente.cantidad) {
        ingre.cantidad -= ingrediente.cantidad; // Actualiza la cantidad
        await ingredientRepository.save(ingre); // Guarda el cambio en la base de datos
        } else {
          console.log(`No hay suficiente cantidad para el ingrediente: ${ingrediente.nombre}`);
          pedidoValido = false;
        }
      }
  } 

  //bebesible

  for (const postre of newPedido.postre) { // Itera sobre los platos del pedido
    const menu = menus.find(a => a.nombre === postre);
    if (!menu) {
      console.log(`No se encontró el menú para el postre: ${postre}`);
      pedidoValido = false;
    }
    for(const ingrediente of menu.ingredientes) {
      const ingre = ingredientesEs.find(ing => ing.nombre === ingrediente.nombre);
      if (!ingre) {
        console.log(`No se encontró el ingrediente: ${ingrediente.nombre}`);
        pedidoValido = false;
      }
      if (ingre.cantidad >= ingrediente.cantidad) {
        ingre.cantidad -= ingrediente.cantidad; // Actualiza la cantidad
        await ingredientRepository.save(ingre); // Guarda el cambio en la base de datos
        } else {
          console.log(`No hay suficiente cantidad para el ingrediente: ${ingrediente.nombre}`);
          pedidoValido = false;
        }
      }
  } 



  if (!pedidoValido) {
      console.log("Pedido inválido");
      return null;
  }else{
      console.log("Pedido válido");
      return await pedidoRepository.save(newPedido);
  }
}

export const removePedido = async (id) => {
  const pedidoRepository = AppDataSource.getRepository(pedido);
  const pedidoToDelete = await pedidoRepository.findOneBy({ id });

  if (!pedidoToDelete) {
      return null; 
  }

  await pedidoRepository.remove(pedidoToDelete);
  return pedidoToDelete;
};
