// pedido.service.js
import { AppDataSource } from "../config/configDb.js";
import pedido from "../entity/pedido.entity.js";

export const getPedidos = async () => {
  const pedidoRepository = AppDataSource.getRepository(pedido);
  return await pedidoRepository.find();
};

export const addPedido = async (data) => {
    const pedidoRepository = AppDataSource.getRepository(pedido);
    const newPedido = pedidoRepository.create(data);
    return await pedidoRepository.save(newPedido);
};
