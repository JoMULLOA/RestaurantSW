import { AppDataSource } from "../config/configDb.js";
import { getPedidos } from "./pedido.service.js";
import { removePedido } from "./pedido.service.js";
import { getIngredientes } from "./ingrediente.service.js";
import { getMenus } from "./menu.service.js";
import ingrediente from "../entity/ingrediente.entity.js";
import { getMesaConN, liberarMesa } from "../controllers/mesa.controller.js";
import Pedido from "../entity/pedido.entity.js";
import PedidoHistory from "../entity/pedidoHistory.entity.js";


export const preparapedido = async (pedidoId) => {
    try {
        //para la suma del precio
        let total = 0;
        const menus = await getMenus();
        //console.log("menus recibidos:", menus);
        const pedidoHistoryRepository = AppDataSource.getRepository(PedidoHistory);
        const pedidos = await getPedidos();
        //console.log("pedidos recibidos:", pedidos);
        //console.log("pedidoId recibido:", pedidoId);
        // Obtener el repositorio de la entidad Pedido
        const estadito = AppDataSource.getRepository(Pedido);
        // Buscar el pedido en los datos obtenidos
        const pedidoo = pedidos.find(p => p.id === pedidoId);
        //console.log("pedido encontrado:", pedidoo);

        if (!pedidoo) {
            throw new Error(`No se encontró un pedido con el id ${pedidoId}`);
        }

        
        if (pedidoo.Estado === 0) {
            console.log("El pedido está pendiente. Cambiando a preparación...");
            pedidoo.Estado = 1; 
            await estadito.save(pedidoo);
        }  
        else if (pedidoo.Estado === 1) {
            for (const plato of pedidoo.plato) {
                const menu = menus.find(a => a.nombre === plato);
                if (!menu) {
                console.error(`Menú no encontrado para el plato: ${plato}`);
                continue;
                }
                //console.log("Menú encontrado:", menu);
                total += menu.precio;
            }
            for (const bebestible of pedidoo.bebestible) {
                const menu = menus.find(a => a.nombre === bebestible);
                if (!menu) {
                console.error(`Menú no encontrado para el plato: ${plato}`);
                continue;
                }
                //console.log("Menú encontrado:", menu);
                total += menu.precio;
            }
            for (const postre of pedidoo.postre) {
                const menu = menus.find(a => a.nombre === postre);
                if (!menu) {
                console.error(`Menú no encontrado para el plato: ${plato}`);
                continue;
                }
                //console.log("Menú encontrado:", menu);
                total += menu.precio;
            }
            console.log("Total calculado:", total);
            console.log("id del pedido", pedidoo.id);
            await pedidoHistoryRepository.save({
                idPedido: pedidoo.id, // Guarda el ID como entero
                total,
            });
            console.log("El pedido está en preparación. Cambiando a listo...");
            pedidoo.Estado = 2;
            await liberarMesa(pedidoo.mesa);
            await estadito.save(pedidoo);
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

    
    const pedido = pedidos.find(p => p.id === prepararpedido.id);

    for (const plato of pedido.plato) { 
        const menu = menus.find(a => a.nombre === plato);
        for (const ingrediente of menu.ingredientes) {
            const ingre = ingredientesEs.find(ing => ing.nombre === ingrediente.nombre);
            if (!ingre) {
                console.log(`No se encontró el ingrediente: ${ingrediente.nombre}`);
                continue;
            }
            ingre.cantidad += ingrediente.cantidad; 
            await ingredientRepository.save(ingre); 
        }
    }
        //bebesible
    for (const bebestible of pedido.bebestible) { 
        const menu = menus.find(a => a.nombre === bebestible);
        for (const ingrediente of menu.ingredientes) {
            const ingre = ingredientesEs.find(ing => ing.nombre === ingrediente.nombre);
            if (!ingre) {
                console.log(`No se encontró el ingrediente: ${ingrediente.nombre}`);
                continue;
            }
            ingre.cantidad += ingrediente.cantidad; 
            await ingredientRepository.save(ingre); 
        }
    }
        //postre
    for (const postre of pedido.postre) { 
        const menu = menus.find(a => a.nombre === postre);
        for (const ingrediente of menu.ingredientes) {
            const ingre = ingredientesEs.find(ing => ing.nombre === ingrediente.nombre);
            if (!ingre) {
                console.log(`No se encontró el ingrediente: ${ingrediente.nombre}`);
                continue;
            }
            ingre.cantidad += ingrediente.cantidad; 
            await ingredientRepository.save(ingre); 
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
