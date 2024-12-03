import { Router } from "express";
import { UserController } from "../controllers/user";
import { UserService } from "../services/user";
import { PrismaClient } from "../database/generated-prisma-client";
import { validate } from "@libs/shared";
import { updateUsernameValidator } from "../validators/user";

export const userRoutes = (prisma: PrismaClient) => {
    const router = Router();

    const userService = new UserService(prisma);
    const userController = new UserController(userService);

    router.patch("/current", validate(updateUsernameValidator), userController.updateUsername.bind(userController));
    router.get("/current", userController.get.bind(userController));
    router.get("/current/classes", userController.listUserClasses.bind(userController));
    router.get("/current/teams", userController.listUserTeam.bind(userController));

    return router;
};
