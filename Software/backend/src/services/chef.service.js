
import { getPedidos } from "./pedido.service.js";
import { getIngredientes, prepararin } from "./ingrediente.service.js";
import { getMenus } from "./menu.service.js";

export const getchefpedidos = async () => {
    const pedidos = await getPedidos();
    return pedidos;
    
};

export const getchefingredientes = async () => {
    const ingredientes = await getIngredientes();
    return ingredientes;
};

export const getchefmenus = async () => {
    const menus = await getMenus();
    return menus;
};  

export const preparapedido = async (prepararpedido) => {
    try {

        // Obtener todos los pedidos y menús
        const pedidos = await getPedidos();
        const menus = await getMenus();

        // Encontrar el pedido específico basado en las propiedades del `prepararpedido`
        const pedido = pedidos.find(p => p.id === prepararpedido.id);

        if (pedido) {
            // Verificar si el plato, bebestible o postre del pedido coincide con algún menú
            pedido.plato.forEach(plato => {
                const menu = menus.find(m => m.nombre === plato);
                if (menu) {
                    menu.ingredientes.forEach(ingrediente => {
                        prepararin(ingrediente);
                    });
                }
            });

            pedido.bebestible.forEach(bebida => {
                const menu = menus.find(m => m.nombre === bebida);
                if (menu) {
                    menu.ingredientes.forEach(ingrediente => {
                        prepararin(ingrediente);
                    });
                }
            });

            pedido.postre.forEach(postre => {
                const menu = menus.find(m => m.nombre === postre);
                if (menu) {
                    menu.ingredientes.forEach(ingrediente => {
                        prepararin(ingrediente);
                    });
                }
            });
        } else {
            console.log("Pedido no encontrado");
        }

    } catch (error) {
        console.log("Error en service de preparapedido:", error);
    }
};





