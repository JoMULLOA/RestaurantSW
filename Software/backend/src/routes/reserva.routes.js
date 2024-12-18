import { Router } from "express";
import { actualizarEstadoMesas, obtenerEstadisticasReservas, 
    obtenerReservas,  reservarMesa } from "../controllers/reserva.controller.js";
import { cancelarReserva } from "../controllers/reserva.controller.js";
import { validateReserva } from "../middlewares/validateReserva.middleware.js";


const router = Router();

// Ruta para reservar una mesa
router.post("/reservas", validateReserva, reservarMesa);

// Ruta para actualizar estados de reservas y mesas
router.get("/reservas", obtenerReservas);
router.post("/reservas/actualizar-estados", actualizarEstadoMesas);
router.patch("/reservas/:id/cancelar", cancelarReserva); // Cambiar a "Cancelada"
router.get("/estadisticas", obtenerEstadisticasReservas);
export default router;
