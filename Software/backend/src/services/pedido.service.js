// pedido.service.js
import { AppDataSource } from "../config/configDb.js";
import pedido from "../entity/pedido.entity.js";

//j
import { getMenus } from "./menu.service.js";
import ingrediente from "../entity/ingrediente.entity.js";
import { getIngredientes } from "./ingrediente.service.js";
import { CancelarPedido } from "./chef.service.js";
import { getMesaConN, ocuparMesa } from "../controllers/mesa.controller.js";

export const getPedidos = async () => {
  const pedidoRepository = AppDataSource.getRepository(pedido);
  return await pedidoRepository.find();
};

//ADD de joaquin con resta de ingredientes
export const addPedido = async (data) => {
  const pedidoRepository = AppDataSource.getRepository(pedido);
  const newPedido = pedidoRepository.create(data);
  const menus = await getMenus();
  const ingredientesEs = await getIngredientes();
  const ingredientRepository = AppDataSource.getRepository(ingrediente);
  
  // Fase 1: Validación
  const validateIngredients = () => {
    let validation = { isValid: true, errors: [] };
    
    // Verificar platos
    for (const plato of newPedido.plato) {
      const menu = menus.find(a => a.nombre === plato);
      if (!menu) {
        validation.errors.push(`No se encontró el menú para el plato: ${plato}`);
        validation.isValid = false;
        continue;
      }
      
      for (const ingrediente of menu.ingredientes) {
        const ingre = ingredientesEs.find(ing => ing.nombre === ingrediente.nombre);
        if (!ingre) {
          validation.errors.push(`No se encontró el ingrediente: ${ingrediente.nombre}`);
          validation.isValid = false;
          continue;
        }
        if (ingre.cantidad < ingrediente.cantidad) {
          validation.errors.push(`No hay suficiente cantidad para el ingrediente: ${ingrediente.nombre}`);
          validation.isValid = false;
        }
      }
    }

    // Verificar bebestibles
    for (const bebestible of newPedido.bebestible) {
      const menu = menus.find(a => a.nombre === bebestible);
      if (!menu) {
        validation.errors.push(`No se encontró el menú para el bebestible: ${bebestible}`);
        validation.isValid = false;
        continue;
      }
      
      for (const ingrediente of menu.ingredientes) {
        const ingre = ingredientesEs.find(ing => ing.nombre === ingrediente.nombre);
        if (!ingre) {
          validation.errors.push(`No se encontró el ingrediente: ${ingrediente.nombre}`);
          validation.isValid = false;
          continue;
        }
        if (ingre.cantidad < ingrediente.cantidad) {
          validation.errors.push(`No hay suficiente cantidad para el ingrediente: ${ingrediente.nombre}`);
          validation.isValid = false;
        }
      }
    }

    // Verificar postres
    for (const postre of newPedido.postre) {
      const menu = menus.find(a => a.nombre === postre);
      if (!menu) {
        validation.errors.push(`No se encontró el menú para el postre: ${postre}`);
        validation.isValid = false;
        continue;
      }
      
      for (const ingrediente of menu.ingredientes) {
        const ingre = ingredientesEs.find(ing => ing.nombre === ingrediente.nombre);
        if (!ingre) {
          validation.errors.push(`No se encontró el ingrediente: ${ingrediente.nombre}`);
          validation.isValid = false;
          continue;
        }
        if (ingre.cantidad < ingrediente.cantidad) {
          validation.errors.push(`No hay suficiente cantidad para el ingrediente: ${ingrediente.nombre}`);
          validation.isValid = false;
        }
      }
    }

    return validation;
  };
  // Fase 2: Deducción
  // Deducir platos
  const deductIngredients = async () => {
    // Deduct platos
    for (const plato of newPedido.plato) {
      const menu = menus.find(a => a.nombre === plato);
      for (const ingrediente of menu.ingredientes) {
        const ingre = ingredientesEs.find(ing => ing.nombre === ingrediente.nombre);
        ingre.cantidad -= ingrediente.cantidad;
        await ingredientRepository.save(ingre);
      }
    }

    // Deducir bebestibles
    for (const bebestible of newPedido.bebestible) {
      const menu = menus.find(a => a.nombre === bebestible);
      for (const ingrediente of menu.ingredientes) {
        const ingre = ingredientesEs.find(ing => ing.nombre === ingrediente.nombre);
        ingre.cantidad -= ingrediente.cantidad;
        await ingredientRepository.save(ingre);
      }
    }

    // Deducir postres
    for (const postre of newPedido.postre) {
      const menu = menus.find(a => a.nombre === postre);
      for (const ingrediente of menu.ingredientes) {
        const ingre = ingredientesEs.find(ing => ing.nombre === ingrediente.nombre);
        ingre.cantidad -= ingrediente.cantidad;
        await ingredientRepository.save(ingre);
      }
    }
  };

  // Ejecutar validación
  const validationResult = validateIngredients();
  
  if (!validationResult.isValid) {
    console.log("Pedido inválido:");
    validationResult.errors.forEach(error => console.log(error));
    return null;
  }
  console.log(validationResult);
  console.log(data);
   // Si la validación pasó, proceder a ocupar mesa y luego la deducción
  // const { mesa } = req.body;
  const bodyMesa = await getMesaConN(data.mesa);
  if(bodyMesa.estado === "Disponible"){
    await ocuparMesa(bodyMesa);
    await deductIngredients();
    console.log("Pedido válido");
    return await pedidoRepository.save(newPedido);
  } else{
    console.log("La mesa no está disponible para ocupar y se invalida el pedido");
    return null;
  }
};

export const eliminarPedido = async (id) => {
  const pedidoRepository = AppDataSource.getRepository(pedido);
  const pedidoToDelete = await pedidoRepository.findOneBy({ id });
  if (!pedidoToDelete) {
      return null; 
  }
  await CancelarPedido(pedidoToDelete);
  return pedidoToDelete;
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
