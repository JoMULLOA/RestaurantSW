import { Router } from "express";
import { prepararPedido } from "../controllers/chef.controller.js";

const router = Router();

router.post("/prepararpedido", prepararPedido);

export default router;

