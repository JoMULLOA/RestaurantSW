import { AppDataSource } from "../config/configDb.js";
import { getPedidos } from "./pedido.service.js";
import { removePedido } from "./pedido.service.js";
import { getIngredientes } from "./ingrediente.service.js";
import { getMenus } from "./menu.service.js";
import ingrediente from "../entity/ingrediente.entity.js";
import { getMesaConN, liberarMesa } from "../controllers/mesa.controller.js";
import Pedido from "../entity/pedido.entity.js";


export const preparapedido = async (pedidoId) => {
    try {
        const pedidos = await getPedidos();
        console.log("pedidoId recibido:", pedidoId);
        // Obtener el repositorio de la entidad Pedido
        const estadito = AppDataSource.getRepository(Pedido);
        // Buscar el pedido en los datos obtenidos
        const pedidoo = pedidos.find(p => p.id === pedidoId);
        if (!pedidoo) {
            throw new Error(`No se encontró un pedido con el id ${pedidoId}`);
        }

        // Pasar de pendiente a preparación
        if (pedidoo.Estado === 0) {
            console.log("El pedido está pendiente. Cambiando a preparación...");
            pedidoo.Estado = 1; // Actualiza el estado en el objeto
            await estadito.save(pedidoo); // Guarda la entidad completa
        } 
        // Pasar de preparación a listo
        else if (pedidoo.Estado === 1) {
            console.log("El pedido está en preparación. Cambiando a listo...");
            pedidoo.Estado = 2; // Suponiendo que 2 representa "listo"
            await estadito.save(pedidoo); // Guarda la entidad completa
        } 
        else {
            console.log("El pedido ya está listo o en un estado no modificable.");
        }

        console.log("Estado del pedido actualizado:", pedidoo.Estado);
    } catch (error) {
        console.error("Error al preparar el pedido:", error);
    }
};

export const CancelarPedido = async (prepararpedido) => {
    const pedidos = await getPedidos();
    const menus = await getMenus();
    const ingredientesEs = await getIngredientes();
    const ingredientRepository = AppDataSource.getRepository(ingrediente);
    console.log("prepararpedido=", prepararpedido);

    // Encontrar el pedido específico basado en las propiedades del `prepararpedido`
    const pedido = pedidos.find(p => p.id === prepararpedido.id);

    for (const plato of pedido.plato) { // Itera sobre los platos del pedido
        const menu = menus.find(a => a.nombre === plato);
        for (const ingrediente of menu.ingredientes) {
            const ingre = ingredientesEs.find(ing => ing.nombre === ingrediente.nombre);
            if (!ingre) {
                console.log(`No se encontró el ingrediente: ${ingrediente.nombre}`);
                continue;
            }
            ingre.cantidad += ingrediente.cantidad; // Actualiza la cantidad
            await ingredientRepository.save(ingre); // Guarda el cambio en la base de datos
        }
    }
        //bebesible
    for (const bebestible of pedido.bebestible) { // Itera sobre los platos del pedido
        const menu = menus.find(a => a.nombre === bebestible);
        for (const ingrediente of menu.ingredientes) {
            const ingre = ingredientesEs.find(ing => ing.nombre === ingrediente.nombre);
            if (!ingre) {
                console.log(`No se encontró el ingrediente: ${ingrediente.nombre}`);
                continue;
            }
            ingre.cantidad += ingrediente.cantidad; // Actualiza la cantidad
            await ingredientRepository.save(ingre); // Guarda el cambio en la base de datos
        }
    }
        //postre
    for (const postre of pedido.postre) { // Itera sobre los platos del pedido
        const menu = menus.find(a => a.nombre === postre);
        for (const ingrediente of menu.ingredientes) {
            const ingre = ingredientesEs.find(ing => ing.nombre === ingrediente.nombre);
            if (!ingre) {
                console.log(`No se encontró el ingrediente: ${ingrediente.nombre}`);
                continue;
            }
            ingre.cantidad += ingrediente.cantidad; // Actualiza la cantidad
            await ingredientRepository.save(ingre); // Guarda el cambio en la base de datos
        }
    }
    await removePedido(pedido.id);
    console.log(pedido.mesa);
    const mesa = await getMesaConN(pedido.mesa);
    console.log(mesa);
    const cancelacion = await liberarMesa(pedido.mesa);
    console.log(`Pedido con ID ${pedido.id} eliminado con éxito.`);
    return cancelacion;
};
