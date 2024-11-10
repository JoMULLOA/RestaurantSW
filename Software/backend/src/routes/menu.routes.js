// pedido.routes.js
import { Router } from "express";
import { createMenu, getAllMenus } from "../controllers/menu.controller.js";
import { deleteMenu } from "../controllers/menu.controller.js";

const router = Router();

router.get("/all", getAllMenus);
router.post("/addMenu", createMenu);
router.delete("/delete", deleteMenu);

export default router;
