import express from "express";
import { getMesas, liberarMesa, reservarMesa } from "../controllers/mesa.controller.js";

const router = express.Router();

router.get("/", getMesas); // Ruta para obtener todas las mesas
router.put("/reservar", reservarMesa); // Ruta para reservar una mesa
router.put("/liberar/:numeroMesa", liberarMesa); // Ruta para liberar una mesa

export default router; // Exportar como `default`
