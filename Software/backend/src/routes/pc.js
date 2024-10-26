import { Router } from "express";
import { actualizarEstadoPedido, verificarInventario } from "../controllers/pc.js";

const router = Router();

router.post("/verificar-inventario", verificarInventario); // Verificar inventario para un pedido
router.post("/actualizar-estado", actualizarEstadoPedido); // Actualizar el estado del pedido

export default router;
