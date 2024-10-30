"use strict";
import { Router } from "express";
import userRoutes from "./user.routes.js";
import authRoutes from "./auth.routes.js";
import ingredienteRoutes from "./ingrediente.routes.js"
import pedidoRoutes from "./pedido.routes.js"

const router = Router();

router
    .use("/auth", authRoutes)
    .use("/ingredientes", ingredienteRoutes)
    .use("/user", userRoutes)
    .use("/pedido", pedidoRoutes)

export default router;
