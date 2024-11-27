
import { Router } from "express";
import { 
  createIngrediente,
  deleteIngrediente,
  getAllIngredientes, 
  updateIngrediente 
} from "../controllers/ingrediente.controller.js";


const router = Router();

router.get("/all", getAllIngredientes);
router.post("/get", createIngrediente);
router.delete("/deleteIng/:id" , deleteIngrediente);
router.put("/update/:id", updateIngrediente); // Nueva ruta para actualizar cantidad


export default router;
