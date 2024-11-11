import { AppDataSource } from "../config/configDb.js";
import { getPedidos } from "./pedido.service.js";
import { getIngredientes } from "./ingrediente.service.js";
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

export const preparapedido = async (datapedido,datamenu) => {
    try{
        const { plato, bebestible, postre } = datapedido
        const { nombre, ingredientesmenu } = datamenu

        const pedido = await getPedidos.findOne({ where: { plato: plato , bebestible: bebestible , postre: postre } })
        const menu = await getMenus.findOne({ where: { nombre: nombre , ingredientes: ingredientesmenu  } })
        
        if(pedido.plato.includes(menu.nombre)){
            menu.ingredientes.forEach(ingrediente => {
                prepararin(ingrediente)
            })
        }
        if(pedido.bebestible.includes(menu.nombre)){
            menu.ingredientes.forEach(ingrediente => {
                prepararin(ingrediente)
            })
        }
        if(pedido.postre.includes(menu.nombre)){
            menu.ingredientes.forEach(ingrediente => {
                prepararin(ingrediente)
            })  
        }

    }catch(error){
        console.log("Error en service de preparapedido");
    }
};





