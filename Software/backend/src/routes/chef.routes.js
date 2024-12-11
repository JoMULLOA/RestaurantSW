import { Router } from "express";
import { prepararPedido } from "../controllers/chef.controller.js";
import { cancelarelpedido } from "../controllers/chef.controller.js";

const router = Router();

router.post("/prepararpedido", prepararPedido);
router.post("/cancelarpedido", cancelarelpedido);

export default router;

