// ingrediente.routes.js
import { Router } from "express";
import { createIngrediente, getAllIngredientes, prepararinall } from "../controllers/ingrediente.controller.js";

const router = Router();

router.get("/all", getAllIngredientes);
router.post("/get", createIngrediente);
router.post("/preparar", prepararinall);

export default router;
