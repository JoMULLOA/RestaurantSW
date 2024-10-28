"use strict";
import { Router } from "express";
import { isAdmin } from "../middlewares/authorization.middleware.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import {
  deleteIngredient,
  getIngredient,
  getIngredients,
  updateIngredient,
} from "../controllers/ingredient.controllers.js";

const router = Router();

router
  .use(authenticateJwt)
  .use(isAdmin);

router
  .get("/", getIngredients)        // Obtener todos los ingredientes
  .get("/detail/", getIngredient)   // Obtener un ingrediente específico
  .patch("/detail/", updateIngredient) // Actualizar un ingrediente
  .delete("/detail/", deleteIngredient); // Eliminar un ingrediente

export default router;
