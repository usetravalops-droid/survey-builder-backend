import { Router } from "express";
import { responseController } from "./response.controller.js";


const router = Router();

router.post(
  "/",
  responseController.createResponse,
);

export default router;