import { Router } from "express";
import { AuthController } from "../controllers/auth";
import { AuthService } from "../services/auth";
import { PrismaClient } from "../database/generated-prisma-client";
import { validate } from "@libs/shared";
import {
    signupValidator,
    loginValidator,
    logoutValidator,
    refreshTokenValidator,
    emailSentValidator, resetPasswordValidator
} from '../validators/auth';

export const authRoutes = (prisma: PrismaClient) => {
    const router = Router();

    const authService = new AuthService(prisma);
    const authController = new AuthController(authService);

    router.post("/signup", validate(signupValidator), authController.signup.bind(authController));
    router.post("/login", validate(loginValidator), authController.login.bind(authController));
    router.post("/refresh-token", validate(refreshTokenValidator), authController.refreshToken.bind(authController));
    router.delete("/logout", validate(logoutValidator), authController.logout.bind(authController));
    router.post("/request-reset-password", validate(emailSentValidator), authController.requestResetPassword.bind(authController));
    router.post("/reset-password", validate(resetPasswordValidator), authController.resetPassword.bind(authController));

    return router;
};
