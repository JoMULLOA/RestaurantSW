// src/routes/ingredient.routes.js
import { Router } from "express";
import { getIngredients } from "../controllers/ingredient.controller.js";

const router = Router();

router.get("/ingredientes", getIngredients); // Ruta para obtener todos los ingredientes

export default router;
