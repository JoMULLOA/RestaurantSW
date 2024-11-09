import { Router } from "express";
import { prepararinall } from "../controllers/chef.controller.js";

const router = Router();

router.post("/preparar", prepararinall);

export default router;