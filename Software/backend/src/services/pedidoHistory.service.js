import { AppDataSource } from "../config/configDb.js";
import pedidoHistory from "../entity/pedidoHistory.entity.js";

export const getPedidosHistory = async () => {
    const pedidoHistoryRepository = AppDataSource.getRepository(pedidoHistory);
    return await pedidoHistoryRepository.find();
    };

