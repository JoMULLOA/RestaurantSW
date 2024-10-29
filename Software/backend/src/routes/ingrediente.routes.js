// ingrediente.routes.js
import { Router } from "express";
import { createIngrediente, getAllIngredientes, prepararinall } from "../controllers/ingrediente.controller.js";

const router = Router();

router.get("/ingredientes", getAllIngredientes);
router.post("/ingredientes", createIngrediente);
router.get("/ingredientes", prepararinall);

export default router;
