import { Router } from "express";
import { UserController } from "../controllers/user";
import { UserService } from "../services/user";
import { PrismaClient } from "@prisma/client";

export const userRoutes = (prisma: PrismaClient) => {
    const router = Router();

    const userService = new UserService(prisma);
    const userController = new UserController(userService);

    router.patch("/:id", userController.updateUsername.bind(userController));
    router.delete("/:id", userController.delete.bind(userController));
    router.get("/:id", userController.findById.bind(userController));
    router.get("/:id/classes", userController.listUserClasses.bind(userController));
    router.get("/:id/teams", userController.listUserTeam.bind(userController));

    return router;
};
