import express from "express";
import { agregarMesa, asignarGarzonAMesa, eliminarMesa, getMesas } from "../controllers/mesa.controller.js";
import { liberarMesa, ocuparMesa, reservarMesa } from "../controllers/mesa.controller.js";
import { getGarzones } from "../controllers/user.controller.js";


const router = express.Router();

router.get("/", getMesas);
router.put("/reservar/:numeroMesa", reservarMesa);
router.put("/ocupar/:numeroMesa", ocuparMesa);
router.put("/liberar/:numeroMesa", liberarMesa);
router.post("/agregar", agregarMesa);
router.delete("/eliminar/:numeroMesa", eliminarMesa);
router.put("/asignarGarzon/:numeroMesa", asignarGarzonAMesa);
router.get("/usuarios/garzones", getGarzones); // Ruta para obtener los garzones



export default router;
