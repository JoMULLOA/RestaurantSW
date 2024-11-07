import { Router } from "express";
import { 
  createIngrediente,
  deleteIngrediente,
  getAllIngredientes, 
  prepararinall, 
  updateIngrediente 
} from "../controllers/ingrediente.controller.js";

const router = Router();

router.get("/all", getAllIngredientes);
router.post("/get", createIngrediente);
router.delete("/delete", deleteIngrediente);
router.post("/preparar", prepararinall);
router.put("/update/:id", updateIngrediente); // Nueva ruta para actualizar cantidad

export default router;
