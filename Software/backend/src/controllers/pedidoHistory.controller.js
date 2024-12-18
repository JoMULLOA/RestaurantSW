import { getPedidosHistory } from "../services/pedidoHistory.service.js";

export const getAllPedidoHistory = async (req, res) => {
    try {
        const pedidosHistory = await getPedidosHistory();
        res.status(200).json({ status: "Success", data: pedidosHistory });
    } catch (error) {
        res.status(500).json({ status: "Error", message: error.message });
    }
    };

