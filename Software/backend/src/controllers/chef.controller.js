import { preparapedido } from "../services/chef.service.js";

export const prepararPedido = async (req, res) => {
    const { datapedido, datamenu } = req.body;
    const pedido = await preparapedido(datapedido, datamenu);
    res.status(200).json(pedido);
};
