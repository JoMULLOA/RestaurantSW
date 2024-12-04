import express from "express";
import { agregarMesa, eliminarMesa, getMesaConN, getMesas } from "../controllers/mesa.controller.js";
import { liberarMesa, ocuparMesa, reservarMesa } from "../controllers/mesa.controller.js";

const router = express.Router();

router.get("/", getMesas); // Ruta para obtener todas las mesas
router.put("/reservar/:numeroMesa", reservarMesa); // Ruta para reservar una mesa
router.put("/ocupar/:numeroMesa", ocuparMesa); // Ruta para ocupar una mesa
router.put("/liberar/:numeroMesa", liberarMesa); // Ruta para liberar una mesa
router.post("/agregar", agregarMesa); // Ruta para agregar una mesa
router.delete("/eliminar/:numeroMesa", eliminarMesa); // Ruta para eliminar una mesa
router.get("/getMesaCN/:numeroMesa", getMesaConN); // Ruta para obtener una mesa por número

export default router; // Exportar como `default`
