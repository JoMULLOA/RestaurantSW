import express from "express";
import { agregarMesa, asignarGarzonAMesa, eliminarMesa, getMesas, getMesaConN } from "../controllers/mesa.controller.js";
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
router.get("/", getMesas); // Ruta para obtener todas las mesas
router.put("/reservar/:numeroMesa", reservarMesa); // Ruta para reservar una mesa
router.put("/ocupar/:numeroMesa", ocuparMesa); // Ruta para ocupar una mesa
router.put("/liberar/:numeroMesa", liberarMesa); // Ruta para liberar una mesa
router.post("/agregar", agregarMesa); // Ruta para agregar una mesa
router.delete("/eliminar/:numeroMesa", eliminarMesa); // Ruta para eliminar una mesa
router.get("/getMesaCN/:numeroMesa", getMesaConN); // Ruta para obtener una mesa por número



export default router;
