// ingrediente.routes.js
import { Router } from "express";
import { createIngrediente, getAllIngredientes } from "../controllers/ingrediente.controller.js";

const router = Router();

router.get("/ingredientes", getAllIngredientes);
router.post("/ingredientes", createIngrediente);

export default router;
