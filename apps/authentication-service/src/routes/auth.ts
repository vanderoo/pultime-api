import { Router } from "express";
import { AuthController } from "../controllers/auth";
import { AuthService } from "../services/auth";
import { PrismaClient } from "@prisma/client";
import { validateSignup, validateLogin, validateLogout, validateRefreshToken } from "../middlewares/validationMiddleware";

export const authRoutes = (prisma: PrismaClient) => {
    const router = Router();

    const authService = new AuthService(prisma);
    const authController = new AuthController(authService);

    router.post("/login", validateLogin, authController.login.bind(authController));
    router.post("/signup", validateSignup, authController.signup.bind(authController));
    router.post("/refresh-token", validateRefreshToken, authController.refreshToken.bind(authController));
    router.delete("/logout", validateLogout, authController.logout.bind(authController));

    return router;
};
