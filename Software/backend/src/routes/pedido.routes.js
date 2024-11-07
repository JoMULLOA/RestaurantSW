// pedido.routes.js
import { Router } from "express";
import { createPedido, getAllPedidos } from "../controllers/pedido.controller.js";
import { deletePedido } from "../controllers/pedido.controller.js";

const router = Router();

router.get("/all", getAllPedidos);
router.post("/addPedido", createPedido);
router.delete("/delete", deletePedido);

export default router;
