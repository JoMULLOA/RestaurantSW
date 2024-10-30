"use strict";
import { Router } from "express";
import userRoutes from "./user.routes.js";
import authRoutes from "./auth.routes.js";
<<<<<<< Updated upstream
=======
import ingredienteRoutes from "./ingrediente.routes.js"
import pedidoRoutes from "./pedido.routes.js"
>>>>>>> Stashed changes

const router = Router();

router
    .use("/auth", authRoutes)
    .use("/user", userRoutes)
    .use("/pedidos", pedidoRoutes);

export default router;
