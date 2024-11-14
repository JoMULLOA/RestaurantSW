// ingrediente.routes.js
import { Router } from "express";
import { createIngrediente, getAllIngredientes, prepararinall } from "../controllers/ingrediente.controller.js";
import { deleteIngrediente } from "../controllers/ingrediente.controller.js";

const router = Router();

router.get("/all", getAllIngredientes);
router.post("/get", createIngrediente);
router.delete("/deleteIng/:id", deleteIngrediente)
router.post("/preparar", prepararinall);

export default router;
