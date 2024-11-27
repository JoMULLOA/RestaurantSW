import { AppDataSource } from "../config/configDb.js";
import { getPedidos } from "./pedido.service.js";
import { getIngredientes } from "./ingrediente.service.js";
import { getMenus } from "./menu.service.js";
import ingrediente from "../entity/ingrediente.entity.js";

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
        const pedidos = await getPedidos();
        const menus = await getMenus();
        const ingredientesEs = await getIngredientes();
        // Encontrar el pedido específico basado en las propiedades del `prepararpedido`
        const pedido = pedidos.find(p => p.id === prepararpedido.id);
        const menu = menus.find(a => a.nombre == pedido.plato);
        const ingredientRepository = AppDataSource.getRepository(ingrediente);
        //console.log(typeof pedido.plato); // Esto mostrará el tipo de dato de pedido.plato
        //console.log("plato",pedido.plato);
        
        if(pedido.plato == menu.nombre){



            for(const ingrediente of menu.ingredientes){
                const ingre = ingredientesEs.find(ing => ing.nombre === ingrediente.nombre);
                
                if (!ingre) {
                    console.log(`No se encontró el ingredienteS: ${ingrediente.nombre}`);
                    continue;
                }
                /*
                console.log("ingrediente->", ingrediente.nombre);
                console.log("Cantidad->", ingrediente.cantidad);
                console.log("IngredienteEs",ingre.nombre);
                */
                if(ingre.nombre == ingrediente.nombre){
                    if ( ingre.cantidad >= ingrediente.cantidad){
                        console.log("Ingrediente=",ingre.nombre);
                        console.log("cantidad Inicial",ingre.cantidad);
                        ingre.cantidad = ingre.cantidad - ingrediente.cantidad
                        console.log("cantidad Final",ingre.cantidad);
                        await ingredientRepository.save(ingre)
                    }else{
                        console.log(`No se encontró el ingredientE: ${ingrediente.nombre}`);
                    }
                }else{
                    console.log("Nosoniguales");
                }
            }
        }else{
            console.log("No se encontro el plato"); 
        }

        
    } catch (error) {
        console.log("No esta el plato en el menu");
    }
};