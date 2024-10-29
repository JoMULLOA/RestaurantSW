import { Router } from "express";
import { checkDishPreparation } from "../controllers/Ingrechef.controller.js";

const router = Router();

router.post("/check-dish", checkDishPreparation);

export default router;