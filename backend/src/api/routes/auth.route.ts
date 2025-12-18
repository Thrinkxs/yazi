import { Router } from "express";
import {
  loginController,
  logoutController,
} from "../controller/auth.controller";
import { authenticateToken } from "../middleware/AuthMiddleware";

const router = Router();

// Public routes
router.post("/login", loginController);

// Protected routes
router.post("/logout", authenticateToken, logoutController);

export default router;
