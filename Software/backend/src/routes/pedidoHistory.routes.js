import { Router } from "express";
import { getAllPedidoHistory } from "../controllers/pedidoHistory.controller.js";

const router = Router();

router.get("/getPedidos", getAllPedidoHistory);

export default router;
