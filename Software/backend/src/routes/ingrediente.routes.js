// ingrediente.routes.js
import { Router } from "express";
import { createIngrediente, getAllIngredientes } from "../controllers/ingrediente.controller.js";
import { deleteIngrediente } from "../controllers/ingrediente.controller.js";

const router = Router();

router.get("/all", getAllIngredientes);
router.post("/get", createIngrediente);
router.delete("/delete", deleteIngrediente)


export default router;


