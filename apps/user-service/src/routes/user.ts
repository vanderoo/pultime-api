import { Router } from "express";
import { UserController } from "../controllers/user";
import { UserService } from "../services/user";
import { PrismaClient } from "@prisma/client";
import { validateUpdateUsername, validateUserId } from "../middlewares/validationMiddleware";

export const userRoutes = (prisma: PrismaClient) => {
    const router = Router();

    const userService = new UserService(prisma);
    const userController = new UserController(userService);

    router.patch("/:id", validateUpdateUsername, userController.updateUsername.bind(userController));
    router.delete("/:id", validateUserId, userController.delete.bind(userController));
    router.get("/:id", validateUserId, userController.findById.bind(userController));
    router.get("/:id/classes", validateUserId, userController.listUserClasses.bind(userController));
    router.get("/:id/teams", validateUserId, userController.listUserTeam.bind(userController));

    return router;
};
