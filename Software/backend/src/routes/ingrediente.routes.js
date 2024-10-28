"use strict";
import { Router } from "express";
import { isAdmin } from "../middlewares/authorization.middleware.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import {
  deleteIngrediente,
  getIngrediente,
  getIngredientes,
  updateIngrediente,
} from "../controllers/ingrediente.controller.js";

const router = Router();

router
  .use(authenticateJwt)
  .use(isAdmin);

router
  .get("/", getIngredientes)
  .get("/detail/", getIngrediente)
  .patch("/detail/", updateIngrediente)
  .delete("/detail/", deleteIngrediente);

export default router;