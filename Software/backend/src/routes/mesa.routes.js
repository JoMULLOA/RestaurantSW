import express from "express";
import { liberarMesa, obtenerMesas, reservarMesa } from "../controllers/mesa.controller.js"; // Orden alfabético

const router = express.Router();

router.get("/mesas", obtenerMesas); // Obtener todas las mesas
router.post("/mesas/:id/reservar", reservarMesa); // Reservar una mesa
router.post("/mesas/:id/liberar", liberarMesa); // Liberar una mesa

export default router;
