import { Router } from "express";
import { AuthController } from "../controllers/auth";
import { AuthService } from "../services/auth";
import { PrismaClient } from "@prisma/client";

export const authRoutes = (prisma: PrismaClient) => {
    const router = Router();

    const authService = new AuthService(prisma);
    const authController = new AuthController(authService);

    router.post("/login", authController.login.bind(authController));
    router.post("/register", authController.register.bind(authController));
    router.post("/refresh-token", authController.refreshToken.bind(authController));
    router.delete("/logout", authController.logout.bind(authController));

    return router;
};
